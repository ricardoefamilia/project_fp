/**
 * Better Auth Schema Mapping
 */
export const authSchema: Record<string, { modelName: string; fields: Record<string, string> }> = {
  user: {
    modelName: 'TB_USUARIO',
    fields: {
      id: 'CO_ID_USUARIO', // Changed: actual column name is 'id', not 'CO_ID_USUARIO'
      name: 'NO_USUARIO',
      email: 'DS_EMAIL',
      emailVerified: 'ST_EMAIL_VERIFICADO',
      image: 'IM_URL_IMAGEM',
      createdAt: 'DT_CRIACAO',
      updatedAt: 'DT_ATUALIZACAO',
      role: 'NO_PERFIL',
      banned: 'ST_BANIDO',
      banReason: 'DS_MOTIVO_BANIMENTO',
      banExpires: 'DT_EXPIRACAO_BANIMENTO',
      twoFactorEnabled: 'ST_2FA_HABILITADO',
      cpf: 'NU_CPF_USUARIO',
    },
  },
  session: {
    modelName: 'TB_SESSAO',
    fields: {
      id: 'CO_ID_SESSAO', // Changed: actual column name is 'id'
      expiresAt: 'DT_EXPIRACAO',
      token: 'DS_TOKEN',
      createdAt: 'DT_CRIACAO',
      updatedAt: 'DT_ATUALIZACAO',
      ipAddress: 'DS_ENDERECO_IP',
      userAgent: 'DS_USER_AGENT',
      userId: 'CO_ID_USUARIO', // FK -> TB_USUARIO.id
      impersonatedBy: 'CO_ID_USUARIO_IMPERSONANTE',
      activeOrganizationId: 'CO_ID_ORGANIZACAO_ATIVA',
    },
  },
  account: {
    modelName: 'TB_CONTA',
    fields: {
      id: 'CO_ID_CONTA', // Changed: actual column name is 'id'
      accountId: 'CO_ID_CONTA_EXTERNA',
      providerId: 'CO_ID_PROVEDOR',
      userId: 'CO_ID_USUARIO', // FK -> TB_USUARIO.id
      accessToken: 'DS_TOKEN_ACESSO',
      refreshToken: 'DS_TOKEN_ATUALIZACAO',
      idToken: 'DS_TOKEN_IDENTIDADE',
      accessTokenExpiresAt: 'DT_EXPIRACAO_TOKEN_ACESSO',
      refreshTokenExpiresAt: 'DT_EXPIRACAO_TOKEN_ATUALIZACAO',
      scope: 'DS_ESCOPO',
      password: 'DS_SENHA',
      createdAt: 'DT_CRIACAO',
      updatedAt: 'DT_ATUALIZACAO',
    },
  },
  verification: {
    modelName: 'TB_VERIFICACAO',
    fields: {
      id: 'CO_ID_VERIFICACAO', // Changed: actual column name is 'id'
      identifier: 'DS_IDENTIFICADOR',
      value: 'DS_VALOR',
      expiresAt: 'DT_EXPIRACAO',
      createdAt: 'DT_CRIACAO',
      updatedAt: 'DT_ATUALIZACAO',
    },
  },
  twoFactor: {
    modelName: 'TB_2FA',
    fields: {
      id: 'CO_ID_2FA', // Changed: actual column name is 'id'
      secret: 'DS_SECRET',
      backupCodes: 'DS_BACKUP_CODES',
      userId: 'CO_ID_USUARIO', // FK -> TB_USUARIO.id
    },
  },
  organization: {
    modelName: 'TB_ORGANIZACAO',
    fields: {
      id: 'CO_ID_ORGANIZACAO', // Changed: actual column name is 'id'
      name: 'NO_ORGANIZACAO',
      slug: 'DS_SLUG',
      logo: 'IM_URL_LOGO',
      createdAt: 'DT_CRIACAO',
      metadata: 'DS_METADADOS',
    },
  },

  member: {
    modelName: 'TB_MEMBRO',
    fields: {
      id: 'CO_ID_MEMBRO', // Changed: actual column name is 'id'
      organizationId: 'CO_ID_ORGANIZACAO', // FK -> TB_ORGANIZACAO.id
      userId: 'CO_ID_USUARIO', // FK -> TB_USUARIO.id
      role: 'TP_PERFIL',
      createdAt: 'DT_CRIACAO',
      cpf: 'NU_CPF_USUARIO',
    },
  },

  invitation: {
    modelName: 'TB_CONVITE',
    fields: {
      id: 'CO_ID_CONVITE', // Changed: actual column name is 'id'
      organizationId: 'CO_ID_ORGANIZACAO', // FK -> TB_ORGANIZACAO.id
      email: 'DS_EMAIL',
      role: 'TP_PERFIL',
      status: 'ST_SITUACAO',
      expiresAt: 'DT_EXPIRACAO',
      inviterId: 'CO_ID_USUARIO', // FK -> TB_USUARIO.id
      cpf: 'NU_CPF_USUARIO',
    },
  },
};
