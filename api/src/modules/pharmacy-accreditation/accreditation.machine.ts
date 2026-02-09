import { and, assign, setup } from 'xstate';
import { accreditationAllowsTransition } from './accreditation.transitions';
import { AccreditationContext, ReasonCode, UpdateStatusEvent, WorkflowEvent } from './accreditation.types';

export interface ReaccreditationGracePeriodResult {
  allowed: boolean;
  daysRemaining?: number;
  isPermanent?: boolean;
  requiredDays?: number;
}

/**
 * RN016 - Prazos de Carência para Recredenciamento
 * Verifica se o prazo de carência foi cumprido antes de permitir o recredenciamento
 * Retorna informações detalhadas sobre o prazo de carência
 */
export function rn016RecredenciamentoGracePeriodCheck(
  disaccreditationReasonCode: ReasonCode | null,
  disaccreditationDate: Date | null,
): ReaccreditationGracePeriodResult {
  // Se não há motivo de descredenciamento ou data, não aplica a regra
  if (!disaccreditationReasonCode || !disaccreditationDate) {
    return { allowed: true };
  }

  const now = new Date();
  const daysElapsed = Math.floor((now.getTime() - disaccreditationDate.getTime()) / (1000 * 60 * 60 * 24));

  // 180 dias (6 meses) para:
  // - Descredenciamento Próprio
  // - Descredenciamento por Não Renovação do RTA
  // - Descredenciamento por não homologação
  const reasons180Days: ReasonCode[] = [
    'DESCREDENCIAMENTO_PROPRIO',
    'NAO_RENOVOU_RTA', // Descredenciamento por Não Renovação do RTA
    'DESCREDENCIAMENTO_POR_NAO_HOMOLOGACAO',
  ];

  if (reasons180Days.includes(disaccreditationReasonCode)) {
    const requiredDays = 180;
    const daysRemaining = requiredDays - daysElapsed;
    return {
      allowed: daysElapsed >= requiredDays,
      daysRemaining: daysRemaining > 0 ? daysRemaining : undefined,
      requiredDays,
    };
  }

  // 730 dias (2 anos) para:
  // - Descredenciamento por Irregularidade
  if (disaccreditationReasonCode === 'DESCREDENCIAMENTO_POR_IRREGULARIDADES') {
    const requiredDays = 730;
    const daysRemaining = requiredDays - daysElapsed;
    return {
      allowed: daysElapsed >= requiredDays,
      daysRemaining: daysRemaining > 0 ? daysRemaining : undefined,
      requiredDays,
    };
  }

  // Permanente (Bloqueado) para:
  // - Descredenciamento por fusão/incorporação
  // - Descredenciamento por baixa de CNPJ
  const permanentReasons: ReasonCode[] = [
    'DESCREDENCIAMENTO_POR_FUSAO_INCORPORACAO',
    'DESCREDENCIAMENTO_POR_BAIXA_CNPJ',
  ];

  if (permanentReasons.includes(disaccreditationReasonCode)) {
    return {
      allowed: false,
      isPermanent: true,
    };
  }

  // Para outros motivos, não aplica restrição de prazo
  return { allowed: true };
}

export const accreditationMachine = setup({
  types: {} as {
    context: AccreditationContext;
    events: WorkflowEvent;
  },

  guards: {
    accreditationTransitionAllowedGuard: ({ context, event }: { context: AccreditationContext; event: UpdateStatusEvent }) => {
      if (event.type !== 'UPDATE_STATUS') return false;

      return accreditationAllowsTransition({
        statusActual: context.status,
        reasonCodeActual: context.reasonCode as ReasonCode,
        statusDestination: event.status,
        reasonCodesDestinationAllowed: Array.isArray(event.reasonCode) ? event.reasonCode : [event.reasonCode as ReasonCode],
      });
    },

    /**
     * RN016 - Verifica se o prazo de carência para recredenciamento foi cumprido
     * Aplica apenas quando há tentativa de recredenciamento (INATIVA -> ATIVA com motivo RECREDENCIAMENTO)
     * 
     * Nota: Para obter informações detalhadas (dias restantes, se é permanente), 
     * use a função rn016RecredenciamentoGracePeriodCheck
     */
    rn016RecredenciamentoOk: ({ context, event }: { context: AccreditationContext; event: UpdateStatusEvent }) => {
      if (event.type !== 'UPDATE_STATUS') return true;

      // Aplica apenas para transições de INATIVA -> ATIVA com motivo RECREDENCIAMENTO
      const isReaccreditation =
        context.status === 'INATIVA' &&
        event.status === 'ATIVA' &&
        event.reasonCode === 'RECREDENCIAMENTO';

      if (!isReaccreditation) {
        return true; // Não é recredenciamento, não aplica a regra
      }

      // Verifica o prazo de carência baseado no motivo de descredenciamento anterior
      const result = rn016RecredenciamentoGracePeriodCheck(context.reasonCode as ReasonCode, context.updatedAt);
      return result.allowed;
    },
  },

  actions: {
    applyTransition: assign(({ context, event }: { context: AccreditationContext; event: UpdateStatusEvent }) => {
      if (event.type !== 'UPDATE_STATUS') return context;

      return {
        ...context,
        status: event.status,
        reasonCode: event.reasonCode,
        updatedAt: event.updatedAt,
        userId: event.userId,
      };
    }),
  },
}).createMachine({
  id: 'accreditation',
  initial: 'routeByStatus',
  context: {
    pharmacyId: '',
    status: 'ATIVA',
    reasonCode: '' as ReasonCode,
    updatedAt: new Date(),
    userId: null,
  },
  states: {
    routeByStatus: {
      always: [
        { guard: ({ context }: { context: AccreditationContext }) => context.status === 'ATIVA', target: 'ativa' },
        { target: 'inativa' },
      ],
    },

    ativa: {
      on: {
        UPDATE_STATUS: {
          guard: 'accreditationTransitionAllowedGuard', // depois use and([...]) para RN006 etc.
          actions: 'applyTransition',
          target: 'inativa', // o destino "de estado" acompanha event.status
        },
      },
    },
    inativa: {
      on: {
        UPDATE_STATUS: [
          {
            guard: and(['accreditationTransitionAllowedGuard', 'rn016RecredenciamentoOk']),
            actions: 'applyTransition',
            target: 'ativa',
          },
          {
            guard: 'accreditationTransitionAllowedGuard',
            actions: 'applyTransition',
            target: 'inativa',
          },
        ],
      },
    },
  },
});
