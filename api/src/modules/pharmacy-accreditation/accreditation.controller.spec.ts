import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AccreditationController } from './accreditation.controller';
import { AccreditationService } from './accreditation.service';
import { CreateAccreditationDto } from './dto/create-accreditation.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PharmacyAccreditation } from 'src/database/entities/postgres/pharmacy-accreditation.entity';
import { Status, ReasonCode } from './accreditation.types';

describe('AccreditationController', () => {
  let controller: AccreditationController;
  let service: jest.Mocked<AccreditationService>;

  const mockPharmacyId = 1;
  const mockAccreditation: PharmacyAccreditation = {
    id: 1,
    pharmacyId: mockPharmacyId,
    status: 'ATIVA',
    reasonId: null,
    reason: null,
    xstateSnapshot: null,
    userId: 'user-123',
    updatedAt: new Date(),
    rowVersion: 1,
  } as PharmacyAccreditation;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      getCurrentStatus: jest.fn(),
      getPossibleTransitions: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccreditationController],
      providers: [
        {
          provide: AccreditationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AccreditationController>(AccreditationController);
    service = module.get(AccreditationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new accreditation', async () => {
      const createDto: CreateAccreditationDto = {
        pharmacyId: mockPharmacyId,
        initialStatus: 'ATIVA',
      };

      service.create.mockResolvedValue(mockAccreditation);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(mockPharmacyId, 'ATIVA');
      expect(result).toBe(mockAccreditation);
    });

    it('should create accreditation with default status when not provided', async () => {
      const createDto: CreateAccreditationDto = {
        pharmacyId: mockPharmacyId,
      };

      service.create.mockResolvedValue(mockAccreditation);

      await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(mockPharmacyId, undefined);
    });

    it('should throw BadRequestException when accreditation already exists', async () => {
      const createDto: CreateAccreditationDto = {
        pharmacyId: mockPharmacyId,
      };

      service.create.mockRejectedValue(
        new BadRequestException(`Accreditation already exists for pharmacy ${mockPharmacyId}`),
      );

      await expect(controller.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getCurrentStatus', () => {
    it('should return current status', async () => {
      const statusResponse = {
        status: 'ATIVA' as Status,
        reasonCode: null as ReasonCode | null,
        reasonDescription: null,
        updatedAt: new Date(),
      };

      service.getCurrentStatus.mockResolvedValue(statusResponse);

      const result = await controller.getCurrentStatus(mockPharmacyId);

      expect(service.getCurrentStatus).toHaveBeenCalledWith(mockPharmacyId);
      expect(result).toEqual(statusResponse);
    });

    it('should return status with reason when available', async () => {
      const statusResponse = {
        status: 'INATIVA' as Status,
        reasonCode: 'DIVERGENCIA_CADASTRAL' as ReasonCode,
        reasonDescription: 'Divergência Cadastral',
        updatedAt: new Date(),
      };

      service.getCurrentStatus.mockResolvedValue(statusResponse);

      const result = await controller.getCurrentStatus(mockPharmacyId);

      expect(result.reasonCode).toBe('DIVERGENCIA_CADASTRAL');
      expect(result.reasonDescription).toBe('Divergência Cadastral');
    });

    it('should throw NotFoundException when accreditation not found', async () => {
      service.getCurrentStatus.mockRejectedValue(
        new NotFoundException(`Accreditation not found for pharmacy ${mockPharmacyId}`),
      );

      await expect(controller.getCurrentStatus(mockPharmacyId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPossibleTransitions', () => {
    it('should return possible transitions', async () => {
      const transitionsResponse = {
        currentStatus: 'ATIVA' as Status,
        currentReasonCode: null as ReasonCode | null,
        transitions: [
          {
            toStatus: 'INATIVA' as Status,
            allowedReasonCodes: ['DIVERGENCIA_CADASTRAL', 'NAO_RENOVOU_RTA'] as ReasonCode[],
          },
        ],
      };

      service.getPossibleTransitions.mockResolvedValue(transitionsResponse);

      const result = await controller.getPossibleTransitions(mockPharmacyId);

      expect(service.getPossibleTransitions).toHaveBeenCalledWith(mockPharmacyId);
      expect(result).toEqual(transitionsResponse);
      expect(result.transitions).toBeDefined();
      expect(Array.isArray(result.transitions)).toBe(true);
    });

    it('should return transitions with multiple destination statuses', async () => {
      const transitionsResponse = {
        currentStatus: 'INATIVA' as Status,
        currentReasonCode: 'DIVERGENCIA_CADASTRAL' as ReasonCode,
        transitions: [
          {
            toStatus: 'ATIVA' as Status,
            allowedReasonCodes: ['REGULARIDADE', 'ATIVACAO_POR_DECISAO_JUDICIAL'] as ReasonCode[],
          },
          {
            toStatus: 'INATIVA' as Status,
            allowedReasonCodes: ['MONITORAMENTO', 'ENVIADO_AO_DENASUS'] as ReasonCode[],
          },
        ],
      };

      service.getPossibleTransitions.mockResolvedValue(transitionsResponse);

      const result = await controller.getPossibleTransitions(mockPharmacyId);

      expect(result.transitions).toHaveLength(2);
    });

    it('should throw NotFoundException when accreditation not found', async () => {
      service.getPossibleTransitions.mockRejectedValue(
        new NotFoundException(`Accreditation not found for pharmacy ${mockPharmacyId}`),
      );

      await expect(controller.getPossibleTransitions(mockPharmacyId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update status successfully', async () => {
      const updateDto: UpdateStatusDto = {
        status: 'INATIVA',
        reasonCode: 'DIVERGENCIA_CADASTRAL',
      };

      const updatedAccreditation = {
        ...mockAccreditation,
        status: 'INATIVA',
        reasonId: 1,
      } as PharmacyAccreditation;

      service.updateStatus.mockResolvedValue(updatedAccreditation);

      const result = await controller.updateStatus(mockPharmacyId, updateDto);

      expect(service.updateStatus).toHaveBeenCalledWith(
        mockPharmacyId,
        'INATIVA',
        'DIVERGENCIA_CADASTRAL',
      );
      expect(result).toBe(updatedAccreditation);
      expect(result.status).toBe('INATIVA');
    });

    it('should update status without reasonCode', async () => {
      const updateDto: UpdateStatusDto = {
        status: 'INATIVA',
      };

      const updatedAccreditation = {
        ...mockAccreditation,
        status: 'INATIVA',
      } as PharmacyAccreditation;

      service.updateStatus.mockResolvedValue(updatedAccreditation);

      const result = await controller.updateStatus(mockPharmacyId, updateDto);

      expect(service.updateStatus).toHaveBeenCalledWith(mockPharmacyId, 'INATIVA', null);
      expect(result.status).toBe('INATIVA');
    });

    it('should throw NotFoundException when accreditation not found', async () => {
      const updateDto: UpdateStatusDto = {
        status: 'INATIVA',
      };

      service.updateStatus.mockRejectedValue(
        new NotFoundException(`Accreditation not found for pharmacy ${mockPharmacyId}`),
      );

      await expect(controller.updateStatus(mockPharmacyId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when transition is not allowed', async () => {
      const updateDto: UpdateStatusDto = {
        status: 'INATIVA',
        reasonCode: 'INVALID_REASON',
      };

      service.updateStatus.mockRejectedValue(
        new BadRequestException('Transition from ATIVA to INATIVA with reason INVALID_REASON is not allowed'),
      );

      await expect(controller.updateStatus(mockPharmacyId, updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle null reasonCode in updateDto', async () => {
      const updateDto: UpdateStatusDto = {
        status: 'INATIVA',
        reasonCode: null,
      };

      const updatedAccreditation = {
        ...mockAccreditation,
        status: 'INATIVA',
        reasonId: null,
      } as PharmacyAccreditation;

      service.updateStatus.mockResolvedValue(updatedAccreditation);

      await controller.updateStatus(mockPharmacyId, updateDto);

      expect(service.updateStatus).toHaveBeenCalledWith(mockPharmacyId, 'INATIVA', null);
    });
  });
});

