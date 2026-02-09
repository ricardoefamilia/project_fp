import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequestContext } from 'src/common/storage/request-context.storage';
import { AccreditationReason } from 'src/database/entities/postgres/accreditation-reason.entity';
import { PharmacyAccreditation } from 'src/database/entities/postgres/pharmacy-accreditation.entity';
import { Repository } from 'typeorm';
import { createActor } from 'xstate';
import { accreditationMachine } from './accreditation.machine';
import { AccreditationService } from './accreditation.service';
import { AccreditationContext, ReasonCode, Status } from './accreditation.types';

jest.mock('xstate', () => ({
  createActor: jest.fn(),
}));

jest.mock('src/common/storage/request-context.storage', () => ({
  RequestContext: {
    getUserIdFromContext: jest.fn(),
  },
}));

describe('AccreditationService', () => {
  let service: AccreditationService;
  let accreditationRepository: jest.Mocked<Repository<PharmacyAccreditation>>;
  let reasonRepository: jest.Mocked<Repository<AccreditationReason>>;
  let mockActor: any;

  const mockUserId = 'user-123';
  const mockPharmacyId = 1;

  // Helper function to create a complete mock accreditation
  const createMockAccreditation = (
    overrides?: Partial<PharmacyAccreditation>,
  ): PharmacyAccreditation => ({
    id: 1,
    pharmacyId: mockPharmacyId,
    status: 'ATIVA',
    reasonId: null,
    reason: undefined,
    nupSipar: 'NUP123456',
    dtPublicacao: new Date('2024-01-01'),
    nuSecao: null,
    nuPaginaInicial: null,
    nuPaginaFinal: null,
    anexos: null,
    machineVersion: 'CREDENCIAMENTO@1',
    xstateSnapshot: null,
    userId: mockUserId,
    updatedAt: new Date(),
    rowVersion: 1,
    ...overrides,
  } as PharmacyAccreditation);

  beforeEach(async () => {
    // Mock actor
    mockActor = {
      start: jest.fn(),
      send: jest.fn(),
      getSnapshot: jest.fn(),
    };

    (createActor as jest.Mock).mockReturnValue(mockActor);
    (RequestContext.getUserIdFromContext as jest.Mock).mockReturnValue(mockUserId);

    // Mock repositories
    const mockAccreditationRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockReasonRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccreditationService,
        {
          provide: getRepositoryToken(PharmacyAccreditation, 'postgres'),
          useValue: mockAccreditationRepo,
        },
        {
          provide: getRepositoryToken(AccreditationReason, 'postgres'),
          useValue: mockReasonRepo,
        },
      ],
    }).compile();

    service = module.get<AccreditationService>(AccreditationService);
    accreditationRepository = module.get(getRepositoryToken(PharmacyAccreditation, 'postgres'));
    reasonRepository = module.get(getRepositoryToken(AccreditationReason, 'postgres'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByPharmacyId', () => {
    it('should return accreditation when found', async () => {
      const mockAccreditation = createMockAccreditation();

      accreditationRepository.findOne.mockResolvedValue(mockAccreditation);

      const result = await service.findByPharmacyId(mockPharmacyId);

      expect(result).toBe(mockAccreditation);
      expect(accreditationRepository.findOne).toHaveBeenCalledWith({
        where: { pharmacyId: mockPharmacyId },
        relations: ['reason'],
      });
    });

    it('should return null when not found', async () => {
      accreditationRepository.findOne.mockResolvedValue(null);

      const result = await service.findByPharmacyId(mockPharmacyId);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new accreditation with default status ATIVA', async () => {
      const mockSnapshot = {
        context: {
          pharmacyId: mockPharmacyId.toString(),
          status: 'ATIVA',
          reasonCode: null,
        },
      };

      accreditationRepository.findOne.mockResolvedValue(null);
      mockActor.getSnapshot.mockReturnValue(mockSnapshot);
      accreditationRepository.create.mockReturnValue(
        createMockAccreditation({ status: 'ATIVA' }),
      );
      accreditationRepository.save.mockResolvedValue(createMockAccreditation({ status: 'ATIVA' }));

      const result = await service.create(mockPharmacyId);

      expect(accreditationRepository.findOne).toHaveBeenCalledWith({
        where: { pharmacyId: mockPharmacyId },
        relations: ['reason'],
      });
      expect(createActor).toHaveBeenCalled();
      expect(mockActor.start).toHaveBeenCalled();
      expect(accreditationRepository.create).toHaveBeenCalled();
      expect(accreditationRepository.save).toHaveBeenCalled();
      expect(result.pharmacyId).toBe(mockPharmacyId);
      expect(result.status).toBe('ATIVA');
    });

    it('should create a new accreditation with specified status', async () => {
      const mockSnapshot = {
        context: {
          pharmacyId: mockPharmacyId.toString(),
          status: 'INATIVA',
          reasonCode: null,
        },
      };

      accreditationRepository.findOne.mockResolvedValue(null);
      mockActor.getSnapshot.mockReturnValue(mockSnapshot);
      accreditationRepository.create.mockReturnValue(
        createMockAccreditation({ status: 'INATIVA' }),
      );
      accreditationRepository.save.mockResolvedValue(
        createMockAccreditation({ status: 'INATIVA' }),
      );

      const result = await service.create(mockPharmacyId, 'INATIVA');

      expect(result.status).toBe('INATIVA');
    });

    it('should throw BadRequestException when accreditation already exists', async () => {
      const existingAccreditation = createMockAccreditation({ status: 'ATIVA' });

      accreditationRepository.findOne.mockResolvedValue(existingAccreditation);

      await expect(service.create(mockPharmacyId)).rejects.toThrow(BadRequestException);
      await expect(service.create(mockPharmacyId)).rejects.toThrow(
        `Accreditation already exists for pharmacy ${mockPharmacyId}`,
      );
    });
  });

  describe('updateStatus', () => {
    const mockAccreditation = createMockAccreditation({ status: 'ATIVA' });

    it('should update status successfully', async () => {
      const newStatus: Status = 'INATIVA';
      const reasonCode: ReasonCode = 'DIVERGENCIA_CADASTRAL';
      const mockReason = {
        id: 1,
        code: reasonCode,
        description: 'Divergência Cadastral',
      } as AccreditationReason;

      const mockContext: AccreditationContext = {
        pharmacyId: mockPharmacyId.toString(),
        status: 'ATIVA',
        reasonCode: null,
        updatedAt: mockAccreditation.updatedAt,
        userId: mockUserId,
      };

      const newSnapshot = {
        context: {
          ...mockContext,
          status: newStatus,
          reasonCode,
        },
      };

      accreditationRepository.findOne.mockResolvedValue(mockAccreditation);
      reasonRepository.findOne.mockResolvedValue(mockReason);
      mockActor.getSnapshot.mockReturnValue(newSnapshot);
      accreditationRepository.save.mockResolvedValue(
        createMockAccreditation({
          ...mockAccreditation,
          status: newStatus,
          reasonId: mockReason.code,
        }),
      );

      const result = await service.updateStatus(mockPharmacyId, newStatus, reasonCode);

      expect(accreditationRepository.findOne).toHaveBeenCalled();
      expect(reasonRepository.findOne).toHaveBeenCalledWith({
        where: { code: reasonCode },
      });
      expect(mockActor.start).toHaveBeenCalled();
      expect(mockActor.send).toHaveBeenCalled();
      expect(accreditationRepository.save).toHaveBeenCalled();
      expect(result.status).toBe(newStatus);
    });

    it('should throw NotFoundException when accreditation not found', async () => {
      accreditationRepository.findOne.mockResolvedValue(null);

      await expect(service.updateStatus(mockPharmacyId, 'INATIVA', null)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.updateStatus(mockPharmacyId, 'INATIVA', null)).rejects.toThrow(
        `Accreditation not found for pharmacy ${mockPharmacyId}`,
      );
    });

    it('should throw BadRequestException when reason code not found', async () => {
      const reasonCode: ReasonCode = 'DIVERGENCIA_CADASTRAL';

      accreditationRepository.findOne.mockResolvedValue(mockAccreditation);
      reasonRepository.findOne.mockResolvedValue(null);

      await expect(service.updateStatus(mockPharmacyId, 'INATIVA', reasonCode)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.updateStatus(mockPharmacyId, 'INATIVA', reasonCode)).rejects.toThrow(
        `Reason code ${reasonCode} not found`,
      );
    });

    it('should restore context from xstateSnapshot when available', async () => {
      const mockSnapshot = {
        context: {
          pharmacyId: mockPharmacyId.toString(),
          status: 'ATIVA',
          reasonCode: null,
          updatedAt: new Date(),
          userId: mockUserId,
        },
      };

      const accreditationWithSnapshot = {
        ...mockAccreditation,
        xstateSnapshot: mockSnapshot,
      };

      const newSnapshot = {
        context: {
          ...mockSnapshot.context,
          status: 'INATIVA',
        },
      };

      accreditationRepository.findOne.mockResolvedValue(accreditationWithSnapshot);
      mockActor.getSnapshot.mockReturnValue(newSnapshot);
      accreditationRepository.save.mockResolvedValue(
        createMockAccreditation({
          ...accreditationWithSnapshot,
          status: 'INATIVA',
        }),
      );

      await service.updateStatus(mockPharmacyId, 'INATIVA', null);

      expect(createActor).toHaveBeenCalledWith(accreditationMachine, {
        snapshot: mockSnapshot,
      });
    });
  });

  describe('getCurrentStatus', () => {
    it('should return current status when accreditation exists', async () => {
      const mockReason = {
        id: 1,
        code: 'DIVERGENCIA_CADASTRAL' as ReasonCode,
        description: 'Divergência Cadastral',
      } as AccreditationReason;

      const mockAccreditation = createMockAccreditation({
        status: 'ATIVA',
        reason: mockReason,
      });

      accreditationRepository.findOne.mockResolvedValue(mockAccreditation);

      const result = await service.getCurrentStatus(mockPharmacyId);

      expect(result).toEqual({
        status: 'ATIVA',
        reasonCode: 'DIVERGENCIA_CADASTRAL',
        reasonDescription: 'Divergência Cadastral',
        updatedAt: mockAccreditation.updatedAt,
      });
    });

    it('should throw NotFoundException when accreditation not found', async () => {
      accreditationRepository.findOne.mockResolvedValue(null);

      await expect(service.getCurrentStatus(mockPharmacyId)).rejects.toThrow(NotFoundException);
    });

    it('should handle accreditation without reason', async () => {
      const mockAccreditation = createMockAccreditation({ status: 'ATIVA', reason: undefined });

      accreditationRepository.findOne.mockResolvedValue(mockAccreditation);

      const result = await service.getCurrentStatus(mockPharmacyId);

      expect(result.reasonCode).toBeNull();
      expect(result.reasonDescription).toBeNull();
    });
  });

  describe('canTransition', () => {
    const mockAccreditation = createMockAccreditation({ status: 'ATIVA' });

    it('should return false when accreditation not found', async () => {
      accreditationRepository.findOne.mockResolvedValue(null);

      const result = await service.canTransition(mockPharmacyId, 'INATIVA', null);

      expect(result).toBe(false);
    });

    it('should return false when status and reasonCode are the same', async () => {
      accreditationRepository.findOne.mockResolvedValue(mockAccreditation);

      const result = await service.canTransition(mockPharmacyId, 'ATIVA', null);

      expect(result).toBe(false);
    });

    it('should return true when transition is allowed', async () => {
      const mockSnapshot = {
        context: {
          pharmacyId: mockPharmacyId.toString(),
          status: 'ATIVA',
          reasonCode: null,
        },
      };

      const newSnapshot = {
        context: {
          ...mockSnapshot.context,
          status: 'INATIVA',
        },
      };

      accreditationRepository.findOne.mockResolvedValue(mockAccreditation);
      mockActor.getSnapshot.mockReturnValue(newSnapshot);

      const result = await service.canTransition(mockPharmacyId, 'INATIVA', null);

      expect(result).toBe(true);
    });

    it('should return false when transition is not allowed', async () => {
      const mockSnapshot = {
        context: {
          pharmacyId: mockPharmacyId.toString(),
          status: 'ATIVA',
          reasonCode: null,
        },
      };

      const newSnapshot = {
        context: {
          ...mockSnapshot.context,
          status: 'ATIVA', // Status não mudou
        },
      };

      accreditationRepository.findOne.mockResolvedValue(mockAccreditation);
      mockActor.getSnapshot.mockReturnValue(newSnapshot);

      const result = await service.canTransition(mockPharmacyId, 'INATIVA', null);

      expect(result).toBe(false);
    });
  });

  describe('checkReaccreditationGracePeriod', () => {
    it('should throw NotFoundException when accreditation not found', async () => {
      accreditationRepository.findOne.mockResolvedValue(null);

      await expect(service.checkReaccreditationGracePeriod(mockPharmacyId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return grace period check result', async () => {
      const disaccreditationDate = new Date();
      disaccreditationDate.setDate(disaccreditationDate.getDate() - 200); // 200 days ago

      const mockAccreditation = createMockAccreditation({
        status: 'INATIVA',
        reason: {
          id: 1,
          code: 'DESCREDENCIAMENTO_PROPRIO' as ReasonCode,
          description: 'Descredenciamento Próprio',
        } as AccreditationReason,
        updatedAt: disaccreditationDate,
      });

      accreditationRepository.findOne.mockResolvedValue(mockAccreditation);

      const result = await service.checkReaccreditationGracePeriod(mockPharmacyId);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('allowed');
      // Should be allowed since 200 days > 180 days required
      expect(result.allowed).toBe(true);
    });

    it('should return not allowed when grace period not met', async () => {
      const disaccreditationDate = new Date();
      disaccreditationDate.setDate(disaccreditationDate.getDate() - 90); // 90 days ago

      const mockAccreditation = createMockAccreditation({
        status: 'INATIVA',
        reason: {
          id: 1,
          code: 'DESCREDENCIAMENTO_PROPRIO' as ReasonCode,
          description: 'Descredenciamento Próprio',
        } as AccreditationReason,
        updatedAt: disaccreditationDate,
      });

      accreditationRepository.findOne.mockResolvedValue(mockAccreditation);

      const result = await service.checkReaccreditationGracePeriod(mockPharmacyId);

      expect(result.allowed).toBe(false);
      expect(result.daysRemaining).toBeDefined();
      expect(result.requiredDays).toBe(180);
    });
  });

  describe('getPossibleTransitions', () => {
    it('should return transitions when pharmacyId is provided', async () => {
      const mockAccreditation = createMockAccreditation({ status: 'ATIVA', reason: undefined });

      accreditationRepository.findOne.mockResolvedValue(mockAccreditation);

      const result = await service.getPossibleTransitions(mockPharmacyId);

      expect(result.currentStatus).toBe('ATIVA');
      expect(result.currentReasonCode).toBeNull();
      expect(result.transitions).toBeDefined();
      expect(Array.isArray(result.transitions)).toBe(true);
    });

    it('should return transitions when status is provided directly', async () => {
      const result = await service.getPossibleTransitions(undefined, 'ATIVA', null);

      expect(result.currentStatus).toBe('ATIVA');
      expect(result.currentReasonCode).toBeNull();
      expect(result.transitions).toBeDefined();
    });

    it('should throw NotFoundException when pharmacyId provided but accreditation not found', async () => {
      accreditationRepository.findOne.mockResolvedValue(null);

      await expect(service.getPossibleTransitions(mockPharmacyId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when neither pharmacyId nor status is provided', async () => {
      await expect(service.getPossibleTransitions()).rejects.toThrow(BadRequestException);
      await expect(service.getPossibleTransitions()).rejects.toThrow(
        'Either pharmacyId or currentStatus must be provided',
      );
    });

    it('should filter transitions based on current reasonCode', async () => {
      const mockReason = {
        code: 'DIVERGENCIA_CADASTRAL' as ReasonCode,
      } as AccreditationReason;

      const mockAccreditation = createMockAccreditation({
        status: 'INATIVA',
        reason: mockReason,
      });

      accreditationRepository.findOne.mockResolvedValue(mockAccreditation);

      const result = await service.getPossibleTransitions(mockPharmacyId);

      expect(result.currentStatus).toBe('INATIVA');
      expect(result.currentReasonCode).toBe('DIVERGENCIA_CADASTRAL');
      expect(result.transitions).toBeDefined();
    });
  });
});

