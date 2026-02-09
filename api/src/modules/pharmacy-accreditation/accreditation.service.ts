import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestContext } from 'src/common/storage/request-context.storage';
import { AccreditationReason } from 'src/database/entities/postgres/accreditation-reason.entity';
import { PharmacyAccreditation } from 'src/database/entities/postgres/pharmacy-accreditation.entity';
import { Repository } from 'typeorm';
import { createActor } from 'xstate';
import { accreditationMachine, ReaccreditationGracePeriodResult, rn016RecredenciamentoGracePeriodCheck } from './accreditation.machine';
import { ACCREDITATION_TRANSITIONS } from './accreditation.transitions';
import {
    AccreditationContext,
    ReasonCode,
    Status,
    UpdateStatusEvent,
} from './accreditation.types';

@Injectable()
export class AccreditationService {
  constructor(
    @InjectRepository(PharmacyAccreditation, 'postgres')
    private readonly accreditationRepository: Repository<PharmacyAccreditation>,
    @InjectRepository(AccreditationReason, 'postgres')
    private readonly reasonRepository: Repository<AccreditationReason>,
  ) {}

  /**
   * Busca o credenciamento de uma farmácia pelo ID
   */
  async findByPharmacyId(pharmacyId: number): Promise<PharmacyAccreditation | null> {
    return this.accreditationRepository.findOne({
      where: { pharmacyId },
      relations: ['reason'],
    });
  }

  /**
   * Cria um novo registro de credenciamento para uma farmácia
   */
  async create(pharmacyId: number, initialStatus: Status = 'ATIVA'): Promise<PharmacyAccreditation> {
    const existing = await this.findByPharmacyId(pharmacyId);
    if (existing) {
      throw new BadRequestException(`Accreditation already exists for pharmacy ${pharmacyId}`);
    }

    const context: AccreditationContext = {
      pharmacyId: pharmacyId.toString(),
      status: initialStatus,
      reasonCode: null,
      updatedAt: new Date(),
      userId: RequestContext.getUserIdFromContext(),
    };

    const actor = createActor(accreditationMachine, {
      input: context,
    });

    actor.start();
    const snapshot = actor.getSnapshot();

    const accreditation = this.accreditationRepository.create({
      pharmacyId,
      status: context.status,
      reasonId: null,
      machineVersion: 'CREDENCIAMENTO@1',
      xstateSnapshot: snapshot,
      userId: context.userId,
      updatedAt: context.updatedAt,
      rowVersion: 1,
    });

    return this.accreditationRepository.save(accreditation);
  }

  /**
   * Atualiza o status de credenciamento de uma farmácia
   */
  async updateStatus(
    pharmacyId: number,
    newStatus: Status,
    reasonCode: ReasonCode | null,
  ): Promise<PharmacyAccreditation> {
    const accreditation = await this.findByPharmacyId(pharmacyId);
    if (!accreditation) {
      throw new NotFoundException(`Accreditation not found for pharmacy ${pharmacyId}`);
    }

    // Restaura o contexto do snapshot ou cria um novo
    let context: AccreditationContext;
    if (accreditation.xstateSnapshot) {
      const snapshot = accreditation.xstateSnapshot as any;
      context = snapshot.context as AccreditationContext;
    } else {
      context = {
        pharmacyId: pharmacyId.toString(),
        status: accreditation.status as Status,
        reasonCode: accreditation.reason?.code as ReasonCode | null,
        updatedAt: accreditation.updatedAt,
        userId: accreditation.userId,
      };
    }

    // Busca o motivo se fornecido
    let reasonId: string | null = null;
    if (reasonCode) {
      const reason = await this.reasonRepository.findOne({
        where: { code: reasonCode },
      });
      if (!reason) {
        throw new BadRequestException(`Reason code ${reasonCode} not found`);
      }
      // Usa o code como reasonId (CO_MOTIVO_CRED armazena o código)
      reasonId = reason.code;
    }

    // Cria o evento de atualização
    const event: UpdateStatusEvent = {
      type: 'UPDATE_STATUS',
      status: newStatus,
      reasonCode,
      userId: RequestContext.getUserIdFromContext(),
      updatedAt: new Date(),
    };

    // Cria o actor restaurando do snapshot ou com novo contexto
    const actor = accreditation.xstateSnapshot
      ? createActor(accreditationMachine, {
          snapshot: accreditation.xstateSnapshot as any,
        })
      : createActor(accreditationMachine, {
          input: context,
        });

    actor.start();

    // Envia o evento
    actor.send(event);

    // Obtém o novo snapshot
    const newSnapshot = actor.getSnapshot();

    // Verifica se a transição foi bem-sucedida
    if (newSnapshot.context.status !== newStatus) {
      throw new BadRequestException(
        `Transition from ${context.status} to ${newStatus} with reason ${reasonCode} is not allowed`,
      );
    }

    // Atualiza a entidade
    accreditation.status = newStatus;
    accreditation.reasonId = reasonId;
    accreditation.xstateSnapshot = newSnapshot;
    accreditation.userId = event.userId;
    accreditation.updatedAt = event.updatedAt;
    accreditation.rowVersion += 1;

    return this.accreditationRepository.save(accreditation);
  }

  /**
   * Verifica o prazo de carência para recredenciamento (RN016)
   */
  async checkReaccreditationGracePeriod(
    pharmacyId: number,
  ): Promise<ReaccreditationGracePeriodResult> {
    const accreditation = await this.findByPharmacyId(pharmacyId);
    if (!accreditation) {
      throw new NotFoundException(`Accreditation not found for pharmacy ${pharmacyId}`);
    }

    const reasonCode = accreditation.reason?.code as ReasonCode | null;
    const disaccreditationDate = accreditation.updatedAt;

    return rn016RecredenciamentoGracePeriodCheck(reasonCode, disaccreditationDate);
  }

  /**
   * Obtém o status atual de credenciamento de uma farmácia
   */
  async getCurrentStatus(pharmacyId: number): Promise<{
    status: Status;
    reasonCode: ReasonCode | null;
    reasonDescription: string | null;
    updatedAt: Date | null;
  }> {
    const accreditation = await this.findByPharmacyId(pharmacyId);
    if (!accreditation) {
      throw new NotFoundException(`Accreditation not found for pharmacy ${pharmacyId}`);
    }

    return {
      status: accreditation.status as Status,
      reasonCode: accreditation.reason?.code as ReasonCode | null,
      reasonDescription: accreditation.reason?.description || null,
      updatedAt: accreditation.updatedAt,
    };
  }

  /**
   * Verifica se uma transição de status é permitida
   */
  async canTransition(
    pharmacyId: number,
    newStatus: Status,
    reasonCode: ReasonCode | null,
  ): Promise<boolean> {
    const accreditation = await this.findByPharmacyId(pharmacyId);
    if (!accreditation) {
      return false;
    }

    const currentStatus = accreditation.status as Status;
    const currentReasonCode = accreditation.reason?.code as ReasonCode | null;

    // Se não há mudança, não é uma transição válida
    if (currentStatus === newStatus && currentReasonCode === reasonCode) {
      return false;
    }

    // Restaura o contexto
    let context: AccreditationContext;
    if (accreditation.xstateSnapshot) {
      const snapshot = accreditation.xstateSnapshot as any;
      context = snapshot.context as AccreditationContext;
    } else {
      context = {
        pharmacyId: pharmacyId.toString(),
        status: currentStatus,
        reasonCode: currentReasonCode,
        updatedAt: accreditation.updatedAt,
        userId: accreditation.userId,
      };
    }

    // Cria o evento
    const event: UpdateStatusEvent = {
      type: 'UPDATE_STATUS',
      status: newStatus,
      reasonCode,
      userId: RequestContext.getUserIdFromContext(),
      updatedAt: new Date(),
    };

    // Cria o actor restaurando do snapshot ou com novo contexto
    const actor = accreditation.xstateSnapshot
      ? createActor(accreditationMachine, {
          snapshot: accreditation.xstateSnapshot as any,
        })
      : createActor(accreditationMachine, {
          input: context,
        });

    actor.start();

    try {
      actor.send(event);
      const newSnapshot = actor.getSnapshot();
      return newSnapshot.context.status === newStatus;
    } catch (error) {
      return false;
    }
  }

  /**
   * Retorna as transições possíveis para um credenciamento baseado no status/motivo atual
   * @param pharmacyId ID da farmácia (opcional, se fornecido busca o status/motivo atual)
   * @param currentStatus Status atual (usado se pharmacyId não for fornecido)
   * @param currentReasonCode Motivo atual (usado se pharmacyId não for fornecido)
   * @returns Array de transições possíveis agrupadas por status de destino
   */
  async getPossibleTransitions(
    pharmacyId?: number,
    currentStatus?: Status,
    currentReasonCode?: ReasonCode | null,
  ): Promise<{
    currentStatus: Status;
    currentReasonCode: ReasonCode | null;
    transitions: {
      toStatus: Status;
      allowedReasonCodes: ReasonCode[];
    }[];
  }> {
    // Se pharmacyId for fornecido, busca o status/motivo atual
    let status: Status;
    let reasonCode: ReasonCode | null = null;

    if (pharmacyId !== undefined) {
      const accreditation = await this.findByPharmacyId(pharmacyId);
      if (!accreditation) {
        throw new NotFoundException(`Accreditation not found for pharmacy ${pharmacyId}`);
      }
      status = accreditation.status as Status;
      reasonCode = accreditation.reason?.code as ReasonCode | null;
    } else if (currentStatus !== undefined) {
      status = currentStatus;
      reasonCode = currentReasonCode ?? null;
    } else {
      throw new BadRequestException('Either pharmacyId or currentStatus must be provided');
    }

    // Filtra as transições que se aplicam ao status/motivo atual
    const applicableTransitions = ACCREDITATION_TRANSITIONS.filter((transition) => {
      const statusMatches = transition.statusActual === status;
      const reasonMatches =
        transition.reasonCodeActual === 'QUALQUER_REASON_CODE' ||
        (reasonCode !== null && transition.reasonCodeActual === reasonCode);

      return statusMatches && reasonMatches;
    });

    // Agrupa por status de destino e consolida os reasonCodes permitidos
    const transitionsMap = new Map<Status, Set<ReasonCode>>();

    for (const transition of applicableTransitions) {
      if (!transitionsMap.has(transition.statusDestination)) {
        transitionsMap.set(transition.statusDestination, new Set<ReasonCode>());
      }

      const reasonCodesSet = transitionsMap.get(transition.statusDestination)!;
      for (const allowedReasonCode of transition.reasonCodesDestinationAllowed) {
        reasonCodesSet.add(allowedReasonCode);
      }
    }

    // Converte o Map para array ordenado
    const transitions = Array.from(transitionsMap.entries()).map(([toStatus, reasonCodesSet]) => ({
      toStatus,
      allowedReasonCodes: Array.from(reasonCodesSet).sort(),
    }));

    // Ordena por status (ATIVA primeiro, depois INATIVA)
    transitions.sort((a, b) => {
      if (a.toStatus === 'ATIVA') return -1;
      if (b.toStatus === 'ATIVA') return 1;
      return 0;
    });

    return {
      currentStatus: status,
      currentReasonCode: reasonCode,
      transitions,
    };
  }
}

