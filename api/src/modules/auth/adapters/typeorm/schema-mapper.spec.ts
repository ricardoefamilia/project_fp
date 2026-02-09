import {
  getTableName,
  getColumnName,
  getBetterAuthField,
  mapInputFields,
  mapOutputFields,
  mapWhereClause,
  mapSelectFields,
  type SchemaConfig,
} from './schema-mapper';

describe('Schema Mapper', () => {
  const mockSchema: SchemaConfig = {
    user: {
      modelName: 'TB_USUARIO',
      fields: {
        id: 'CO_ID_USUARIO',
        email: 'DS_EMAIL',
        name: 'NO_USUARIO',
        emailVerified: 'ST_EMAIL_VERIFICADO',
        createdAt: 'DT_CRIACAO',
        updatedAt: 'DT_ATUALIZACAO',
      },
    },
    session: {
      modelName: 'TB_SESSAO',
      fields: {
        id: 'CO_ID_SESSAO',
        userId: 'CO_ID_USUARIO',
        token: 'DS_TOKEN',
        expiresAt: 'DT_EXPIRACAO',
      },
    },
  };

  describe('getTableName', () => {
    it('should return table name from schema', () => {
      const result = getTableName('user', mockSchema);
      expect(result).toBe('TB_USUARIO');
    });

    it('should return model name when not in schema', () => {
      const result = getTableName('unknownModel', mockSchema);
      expect(result).toBe('unknownModel');
    });

    it('should handle empty schema', () => {
      const result = getTableName('user', {});
      expect(result).toBe('user');
    });

    it('should return session table name', () => {
      const result = getTableName('session', mockSchema);
      expect(result).toBe('TB_SESSAO');
    });
  });

  describe('getColumnName', () => {
    it('should return column name from schema', () => {
      const result = getColumnName('user', 'email', mockSchema);
      expect(result).toBe('DS_EMAIL');
    });

    it('should return field name when not in schema', () => {
      const result = getColumnName('user', 'unknownField', mockSchema);
      expect(result).toBe('unknownField');
    });

    it('should return field name when model not in schema', () => {
      const result = getColumnName('unknownModel', 'email', mockSchema);
      expect(result).toBe('email');
    });

    it('should handle empty schema', () => {
      const result = getColumnName('user', 'email', {});
      expect(result).toBe('email');
    });

    it('should map id field', () => {
      const result = getColumnName('user', 'id', mockSchema);
      expect(result).toBe('CO_ID_USUARIO');
    });

    it('should map createdAt field', () => {
      const result = getColumnName('user', 'createdAt', mockSchema);
      expect(result).toBe('DT_CRIACAO');
    });

    it('should map session fields', () => {
      const result = getColumnName('session', 'token', mockSchema);
      expect(result).toBe('DS_TOKEN');
    });
  });

  describe('getBetterAuthField', () => {
    it('should return better-auth field name from column name', () => {
      const result = getBetterAuthField('user', 'DS_EMAIL', mockSchema);
      expect(result).toBe('email');
    });

    it('should return column name when not in schema', () => {
      const result = getBetterAuthField('user', 'UNKNOWN_COLUMN', mockSchema);
      expect(result).toBe('UNKNOWN_COLUMN');
    });

    it('should return column name when model not in schema', () => {
      const result = getBetterAuthField('unknownModel', 'DS_EMAIL', mockSchema);
      expect(result).toBe('DS_EMAIL');
    });

    it('should handle empty schema', () => {
      const result = getBetterAuthField('user', 'DS_EMAIL', {});
      expect(result).toBe('DS_EMAIL');
    });

    it('should reverse map id column', () => {
      const result = getBetterAuthField('user', 'CO_ID_USUARIO', mockSchema);
      expect(result).toBe('id');
    });

    it('should reverse map session columns', () => {
      const result = getBetterAuthField('session', 'DS_TOKEN', mockSchema);
      expect(result).toBe('token');
    });

    it('should handle multiple fields in same model', () => {
      expect(getBetterAuthField('user', 'DS_EMAIL', mockSchema)).toBe('email');
      expect(getBetterAuthField('user', 'NO_USUARIO', mockSchema)).toBe('name');
      expect(getBetterAuthField('user', 'DT_CRIACAO', mockSchema)).toBe('createdAt');
    });
  });

  describe('mapInputFields', () => {
    it('should map fields to database columns', () => {
      const input = {
        email: 'test@example.com',
        name: 'John Doe',
      };
      const result = mapInputFields('user', input, mockSchema);

      expect(result).toEqual({
        DS_EMAIL: 'test@example.com',
        NO_USUARIO: 'John Doe',
      });
    });

    it('should handle empty input', () => {
      const result = mapInputFields('user', {}, mockSchema);
      expect(result).toEqual({});
    });

    it('should preserve unmapped fields', () => {
      const input = {
        email: 'test@example.com',
        customField: 'value',
      };
      const result = mapInputFields('user', input, mockSchema);

      expect(result).toEqual({
        DS_EMAIL: 'test@example.com',
        customField: 'value',
      });
    });

    it('should handle model not in schema', () => {
      const input = { email: 'test@example.com' };
      const result = mapInputFields('unknownModel', input, mockSchema);
      expect(result).toEqual({ email: 'test@example.com' });
    });

    it('should handle null values', () => {
      const input = { email: null, name: 'John' };
      const result = mapInputFields('user', input, mockSchema);
      expect(result).toEqual({
        DS_EMAIL: null,
        NO_USUARIO: 'John',
      });
    });

    it('should handle undefined values', () => {
      const input = { email: undefined, name: 'John' };
      const result = mapInputFields('user', input, mockSchema);
      expect(result).toEqual({
        DS_EMAIL: undefined,
        NO_USUARIO: 'John',
      });
    });

    it('should map all user fields', () => {
      const input = {
        id: '123',
        email: 'test@example.com',
        name: 'John',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = mapInputFields('user', input, mockSchema);

      expect(result).toHaveProperty('CO_ID_USUARIO');
      expect(result).toHaveProperty('DS_EMAIL');
      expect(result).toHaveProperty('NO_USUARIO');
      expect(result).toHaveProperty('ST_EMAIL_VERIFICADO');
      expect(result).toHaveProperty('DT_CRIACAO');
      expect(result).toHaveProperty('DT_ATUALIZACAO');
    });
  });

  describe('mapOutputFields', () => {
    it('should map database columns to better-auth fields', () => {
      const dbOutput = {
        DS_EMAIL: 'test@example.com',
        NO_USUARIO: 'John Doe',
      };
      const result = mapOutputFields('user', dbOutput, mockSchema);

      expect(result).toEqual({
        email: 'test@example.com',
        name: 'John Doe',
      });
    });

    it('should handle empty output', () => {
      const result = mapOutputFields('user', {}, mockSchema);
      expect(result).toEqual({});
    });

    it('should preserve unmapped fields', () => {
      const dbOutput = {
        DS_EMAIL: 'test@example.com',
        CUSTOM_FIELD: 'value',
      };
      const result = mapOutputFields('user', dbOutput, mockSchema);

      expect(result).toEqual({
        email: 'test@example.com',
        CUSTOM_FIELD: 'value',
      });
    });

    it('should handle model not in schema', () => {
      const dbOutput = { DS_EMAIL: 'test@example.com' };
      const result = mapOutputFields('unknownModel', dbOutput, mockSchema);
      expect(result).toEqual({ DS_EMAIL: 'test@example.com' });
    });

    it('should handle null values', () => {
      const dbOutput = { DS_EMAIL: null, NO_USUARIO: 'John' };
      const result = mapOutputFields('user', dbOutput, mockSchema);
      expect(result).toEqual({
        email: null,
        name: 'John',
      });
    });

    it('should map all user fields', () => {
      const dbOutput = {
        CO_ID_USUARIO: '123',
        DS_EMAIL: 'test@example.com',
        NO_USUARIO: 'John',
        ST_EMAIL_VERIFICADO: true,
        DT_CRIACAO: new Date(),
        DT_ATUALIZACAO: new Date(),
      };
      const result = mapOutputFields('user', dbOutput, mockSchema);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('emailVerified');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('mapWhereClause', () => {
    it('should map where clause fields to database columns', () => {
      const where = {
        email: 'test@example.com',
        name: 'John',
      };
      const result = mapWhereClause('user', where, mockSchema);

      expect(result).toEqual({
        DS_EMAIL: 'test@example.com',
        NO_USUARIO: 'John',
      });
    });

    it('should handle empty where clause', () => {
      const result = mapWhereClause('user', {}, mockSchema);
      expect(result).toEqual({});
    });

    it('should preserve operators in values', () => {
      const where = {
        email: 'test@example.com',
        createdAt: { $gte: new Date() },
      };
      const result = mapWhereClause('user', where, mockSchema);

      expect(result.DS_EMAIL).toBe('test@example.com');
      expect(result.DT_CRIACAO).toHaveProperty('$gte');
    });

    it('should handle null values', () => {
      const where = { email: null };
      const result = mapWhereClause('user', where, mockSchema);
      expect(result).toEqual({ DS_EMAIL: null });
    });

    it('should preserve complex operator objects', () => {
      const where = {
        email: { $in: ['test1@example.com', 'test2@example.com'] },
      };
      const result = mapWhereClause('user', where, mockSchema);

      expect(result.DS_EMAIL).toEqual({
        $in: ['test1@example.com', 'test2@example.com'],
      });
    });
  });

  describe('mapSelectFields', () => {
    it('should map select fields to database columns', () => {
      const select = ['id', 'email', 'name'];
      const result = mapSelectFields('user', select, mockSchema);

      expect(result).toEqual({
        CO_ID_USUARIO: true,
        DS_EMAIL: true,
        NO_USUARIO: true,
      });
    });

    it('should handle empty select array', () => {
      const result = mapSelectFields('user', [], mockSchema);
      expect(result).toEqual({});
    });

    it('should preserve unmapped fields', () => {
      const select = ['email', 'customField'];
      const result = mapSelectFields('user', select, mockSchema);

      expect(result).toEqual({
        DS_EMAIL: true,
        customField: true,
      });
    });

    it('should handle model not in schema', () => {
      const select = ['email', 'name'];
      const result = mapSelectFields('unknownModel', select, mockSchema);
      expect(result).toEqual({
        email: true,
        name: true,
      });
    });

    it('should map all specified fields', () => {
      const select = ['id', 'email', 'name', 'createdAt'];
      const result = mapSelectFields('user', select, mockSchema);

      expect(result).toEqual({
        CO_ID_USUARIO: true,
        DS_EMAIL: true,
        NO_USUARIO: true,
        DT_CRIACAO: true,
      });
    });
  });

  describe('bidirectional mapping', () => {
    it('should maintain consistency between input and output mapping', () => {
      const input = {
        email: 'test@example.com',
        name: 'John',
      };

      const mapped = mapInputFields('user', input, mockSchema);
      const unmapped = mapOutputFields('user', mapped, mockSchema);

      expect(unmapped).toEqual(input);
    });

    it('should handle round-trip mapping with all fields', () => {
      const input = {
        id: '123',
        email: 'test@example.com',
        name: 'John',
        emailVerified: true,
      };

      const mapped = mapInputFields('user', input, mockSchema);
      const unmapped = mapOutputFields('user', mapped, mockSchema);

      expect(unmapped).toEqual(input);
    });
  });

  describe('edge cases', () => {
    it('should handle empty schema config', () => {
      const input = { email: 'test@example.com' };
      const result = mapInputFields('user', input, {});
      expect(result).toEqual(input);
    });

    it('should handle schema with empty fields', () => {
      const schema: SchemaConfig = {
        user: {
          modelName: 'TB_USUARIO',
          fields: {},
        },
      };
      const input = { email: 'test@example.com' };
      const result = mapInputFields('user', input, schema);
      expect(result).toEqual(input);
    });

    it('should handle numeric values', () => {
      const input = { email: 'test@example.com', age: 25 };
      const result = mapInputFields('user', input, mockSchema);
      expect(result.age).toBe(25);
    });

    it('should handle boolean values', () => {
      const input = { emailVerified: true };
      const result = mapInputFields('user', input, mockSchema);
      expect(result.ST_EMAIL_VERIFICADO).toBe(true);
    });

    it('should handle Date objects', () => {
      const date = new Date();
      const input = { createdAt: date };
      const result = mapInputFields('user', input, mockSchema);
      expect(result.DT_CRIACAO).toBe(date);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete user creation flow', () => {
      const userData = {
        email: 'test@example.com',
        name: 'John Doe',
        emailVerified: false,
        createdAt: new Date(),
      };

      const dbInput = mapInputFields('user', userData, mockSchema);
      expect(dbInput).toHaveProperty('DS_EMAIL');
      expect(dbInput).toHaveProperty('NO_USUARIO');

      const betterAuthOutput = mapOutputFields('user', dbInput, mockSchema);
      expect(betterAuthOutput.email).toBe(userData.email);
      expect(betterAuthOutput.name).toBe(userData.name);
    });

    it('should handle session query flow', () => {
      const where = {
        userId: '123',
        token: 'abc-token',
      };

      const dbWhere = mapWhereClause('session', where, mockSchema);
      expect(dbWhere).toEqual({
        CO_ID_USUARIO: '123',
        DS_TOKEN: 'abc-token',
      });
    });

    it('should handle select fields for query optimization', () => {
      const select = ['id', 'email'];
      const selectMap = mapSelectFields('user', select, mockSchema);

      expect(selectMap).toEqual({
        CO_ID_USUARIO: true,
        DS_EMAIL: true,
      });
      expect(Object.keys(selectMap)).toHaveLength(2);
    });
  });
});
