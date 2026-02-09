import { Account } from '../../../../database/entities/postgres/account.entity';
import { Invitation } from '../../../../database/entities/postgres/invitation.entity';
import { Member } from '../../../../database/entities/postgres/member.entity';
import { Organization } from '../../../../database/entities/postgres/organization.entity';
import { Session } from '../../../../database/entities/postgres/session.entity';
import { TwoFactor } from '../../../../database/entities/postgres/two-factor.entity';
import { User } from '../../../../database/entities/postgres/user.entity';
import { Verification } from '../../../../database/entities/postgres/verification.entity';
import { EntityMapper, getEntityClass } from './entity-mapper';
import { EntityNotFoundError } from './errors';

describe('EntityMapper', () => {
  let entityMapper: EntityMapper;

  beforeEach(() => {
    entityMapper = new EntityMapper();
  });

  describe('getEntityClass', () => {
    it('should return User entity for "user" model', () => {
      const result = entityMapper.getEntityClass('user');
      expect(result).toBe(User);
    });

    it('should return Session entity for "session" model', () => {
      const result = entityMapper.getEntityClass('session');
      expect(result).toBe(Session);
    });

    it('should return Account entity for "account" model', () => {
      const result = entityMapper.getEntityClass('account');
      expect(result).toBe(Account);
    });

    it('should return Verification entity for "verification" model', () => {
      const result = entityMapper.getEntityClass('verification');
      expect(result).toBe(Verification);
    });

    it('should return TwoFactor entity for "twoFactor" model', () => {
      const result = entityMapper.getEntityClass('twoFactor');
      expect(result).toBe(TwoFactor);
    });

    it('should return Organization entity for "organization" model', () => {
      const result = entityMapper.getEntityClass('organization');
      expect(result).toBe(Organization);
    });

    it('should return Member entity for "member" model', () => {
      const result = entityMapper.getEntityClass('member');
      expect(result).toBe(Member);
    });

    it('should return Invitation entity for "invitation" model', () => {
      const result = entityMapper.getEntityClass('invitation');
      expect(result).toBe(Invitation);
    });

    it('should throw EntityNotFoundError for unknown model', () => {
      expect(() => entityMapper.getEntityClass('unknownModel')).toThrow(EntityNotFoundError);
      expect(() => entityMapper.getEntityClass('unknownModel')).toThrow(
        'Unknown model: unknownModel. Available models: user, session, account, verification, twoFactor, organization, member, invitation',
      );
    });

    it('should throw EntityNotFoundError with available models in error message', () => {
      try {
        entityMapper.getEntityClass('invalidModel');
      } catch (error) {
        expect(error).toBeInstanceOf(EntityNotFoundError);
        expect((error as Error).message).toContain('Available models:');
        expect((error as Error).message).toContain('user');
        expect((error as Error).message).toContain('session');
      }
    });
  });

  describe('isValidModelName', () => {
    it('should return true for valid model names', () => {
      expect(entityMapper['isValidModelName']('user')).toBe(true);
      expect(entityMapper['isValidModelName']('session')).toBe(true);
      expect(entityMapper['isValidModelName']('account')).toBe(true);
      expect(entityMapper['isValidModelName']('verification')).toBe(true);
    });

    it('should return false for invalid model names', () => {
      expect(entityMapper['isValidModelName']('invalid')).toBe(false);
      expect(entityMapper['isValidModelName']('')).toBe(false);
      expect(entityMapper['isValidModelName']('User')).toBe(false);
    });
  });

  describe('getAvailableModels', () => {
    it('should return all available model names', () => {
      const models = entityMapper['getAvailableModels']();
      expect(models).toEqual([
        'user',
        'session',
        'account',
        'verification',
        'twoFactor',
        'organization',
        'member',
        'invitation',
      ]);
    });

    it('should return array with length 8', () => {
      const models = entityMapper['getAvailableModels']();
      expect(models).toHaveLength(8);
    });
  });
});

describe('getEntityClass (standalone function)', () => {
  it('should return User entity for "user" model', () => {
    const result = getEntityClass('user');
    expect(result).toBe(User);
  });

  it('should return Session entity for "session" model', () => {
    const result = getEntityClass('session');
    expect(result).toBe(Session);
  });

  it('should throw EntityNotFoundError for unknown model', () => {
    expect(() => getEntityClass('unknown')).toThrow(EntityNotFoundError);
  });

  it('should ignore schema parameter (reserved for future use)', () => {
    const schema = { user: { modelName: 'TB_USUARIO' } };
    const result = getEntityClass('user', schema);
    expect(result).toBe(User);
  });

  it('should work with undefined schema', () => {
    const result = getEntityClass('session', undefined);
    expect(result).toBe(Session);
  });
});

describe('EntityNotFoundError', () => {
  it('should create error with correct message', () => {
    const error = new EntityNotFoundError('testModel', ['model1', 'model2']);
    expect(error.message).toBe('Unknown model: testModel. Available models: model1, model2');
  });

  it('should have correct error name', () => {
    const error = new EntityNotFoundError('test', []);
    expect(error.name).toBe('EntityNotFoundError');
  });

  it('should store model name', () => {
    const error = new EntityNotFoundError('myModel', []);
    expect(error.modelName).toBe('myModel');
  });

  it('should store available models', () => {
    const availableModels = ['user', 'session', 'account'];
    const error = new EntityNotFoundError('test', availableModels);
    expect(error.availableModels).toEqual(availableModels);
  });

  it('should be instance of Error', () => {
    const error = new EntityNotFoundError('test', []);
    expect(error).toBeInstanceOf(Error);
  });
});
