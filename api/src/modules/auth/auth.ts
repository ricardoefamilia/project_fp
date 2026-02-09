import { AuthContext, betterAuth, User } from 'better-auth';
import {
  admin,
  genericOAuth,
  Invitation,
  openAPI,
  organization,
  Organization,
  twoFactor,
} from 'better-auth/plugins';

import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc } from 'better-auth/plugins/admin/access';
import { adminAc as organizationAc } from 'better-auth/plugins/organization/access';
import { postgresDataSource } from 'src/config/database.config';
import { typeormAdapter } from './adapters/typeorm';
import { authSchema } from './auth-schema';
import { Member } from 'src/database/entities/postgres/member.entity';

// Mapa de tudo que existe de permissão
export const statement = {
  roles: ['assign', 'revoke', 'read', 'impersonate'],
  pharmacy: ['read', 'create', 'update', 'detail', 'print'],
  organization: ['read', 'create', 'update', 'delete'],
  member: ['read', 'create', 'update', 'delete'],
} as const;

const GFP_SLUG: string = "GFP";

export const ac = createAccessControl(statement);

// ---- Perfis do RN003 ----

// Master FP
export const masterFp = ac.newRole({
  roles: ['assign', 'revoke', 'read', 'impersonate'],
  pharmacy: ['read', 'create', 'update', 'detail', 'print'],
  ...adminAc.statements,
  ...organizationAc.statements,
});

// Analista FP
export const analistaFp = ac.newRole({
  roles: ['assign', 'revoke', 'read', 'impersonate'],
  pharmacy: ['read', 'create', 'update', 'detail', 'print'],
  ...adminAc.statements,
  ...organizationAc.statements,
});

// Financeiro FP
export const financeiroFp = ac.newRole({
  roles: [], // não tem nada em papéis na tabela
  pharmacy: ['read', 'detail', 'print'],
  organization: ['read'],
});

// Consulta FP
export const consultaFp = ac.newRole({
  roles: ['read'], // Consultar Papéis
  pharmacy: ['read', 'detail', 'print'],
  organization: ['read'],
});

// Representante Legal
export const representanteLegal = ac.newRole({
  roles: ['assign', 'revoke', 'read'], // x¹ nas três colunas
  pharmacy: ['read', 'detail', 'print'],
  organization: ['read'],
});

// Gestor
export const gestor = ac.newRole({
  roles: ['assign', 'revoke', 'read'], // x¹ nas três colunas
  pharmacy: ['read', 'detail', 'print'],
  organization: ['read'],
  member: ['read'],
});

// Vendedor
export const vendedor = ac.newRole({
  // x² = pode consultar e revogar papéis atribuídos a ELE
  // Regra de "apenas dele" vamos tratar na camada de negócio (ver seção 4)
  roles: ['read', 'revoke'],
  pharmacy: [], // não tem acesso a Manter Farmácia na tabela
});

/**
 * Better Auth configuration with TypeORM adapter
 *
 * Note: DataSource initialization is handled by DatabaseModule in app.module.ts
 * The shared dataSource instance is used here to ensure Better-Auth and NestJS
 * use the same database connection.
 */
export const auth = betterAuth({
  // ADICIONE ESTE BLOCO AQUI 👇
  user: {
    additionalFields: {
      cpf: {
        type: "string",
        required: true,
        input: true, // Permite receber via API (sign-up)
        //fieldName: "NU_CPF_USUARIO" // Mapeia 'cpf' do JSON para a coluna do banco
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        after: async (data) => {
          await approveInvitationAfterCreateUser(data);
        },
      },
    },
  },
  database: typeormAdapter(postgresDataSource, {
    provider: 'postgres',
    debugLogs: process.env.DB_LOGGING === 'true',
    schema: authSchema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  plugins: [
    openAPI(),
    organization({
      schema: {
        invitation: {
          additionalFields: {
            // Add a 'name' field to the Member table
            cpf: {
              type: 'string', // Data type (string, number, boolean, date)
              input: true,   // Determines if the field can be provided during creation
              required: true, // Is the field mandatory in the database?
            },
          },
        },
        member: {
          additionalFields: {
            // Add a 'name' field to the Member table
            cpf: {
              type: 'string', // Data type (string, number, boolean, date)
              input: true,   // Determines if the field can be provided during creation
              required: true, // Is the field mandatory in the database?
            }
          },
        },
      },
      allowUserToCreateOrganization: true,
      ac,
      organizationHooks: {
        beforeCreateInvitation: async ({
          invitation,
          inviter,
          organization,
        }) => {
          await checkinvitation({
            invitation: invitation as Invitation & Record<string, any>,
            inviter,
            organization,
          });
        },
        async afterCreateInvitation(data) {
          await approveInvitation(data);
        },
      },
    }),
    admin({
      impersonationSessionDuration: 60 * 60, // 1 hour
      adminRoles: ['masterFp'],
      ac,
      roles: {
        masterFp,
        analistaFp,
        financeiroFp,
        consultaFp,
        representanteLegal,
        gestor,
        vendedor,
      },
    }),
    twoFactor({
      issuer: process.env.APP_NAME,
    }),
    genericOAuth({
      config: [
        {
          providerId: 'FP_PROVIDER_ID',
          clientId: 'FP_CLIENT_ID	',
          clientSecret: 'FP_CLIENT_SECRET',
          discoveryUrl: 'FP_DISCOVERY_URL',
          redirectURI: 'FP_REDIRECT_URI',
          scopes: ['openid', 'email', 'phone', 'profile', 'govbr_confiabilidades'],
        },
      ],
    }),
  ],
  trustedOrigins: [process.env.APP_URL || 'http://localhost:3000'],
});

export type Auth = typeof auth;

const approveInvitationAfterCreateUser = async (data: User & Record<string, any>) => {
  const context = await auth.$context;

  const user: User | null = await context.adapter.findOne({
    model: 'user',
    where: [{ field: 'email', value: data.email }],
  });

  if (!user) {
    throw new Error('User not found');
  }
};

const approveInvitation = async (data: {
  invitation: Invitation & Record<string, any>;

  inviter: User & Record<string, any>;

  organization: Organization & Record<string, any>;
}) => {
  const context = await auth.$context;

  const user: User | null = await context.adapter.findOne({
    model: 'user',
    where: [{ field: 'email', value: data.invitation.email }],
  });

  if (!user) {
    throw new Error('User not found');
  }

  await context.adapter.create({
    model: 'member',

    data: {
      role: data.invitation.role,

      userId: user.id,

      organizationId: data.organization.id,

      createdAt: new Date(),

      updatedAt: new Date(),

      deletedAt: null,
      
      cpf: data.invitation.cpf,
    },
  });

  await context.adapter.update({
    model: 'invitation',

    where: [{ field: 'id', value: data.invitation.id }],

    update: { status: 'accepted', updatedAt: new Date() },
  });
};


const checkinvitation = async (data: {
  invitation: Invitation & Record<string, any>;

  inviter: User & Record<string, any>;

  organization: Organization & Record<string, any>;
}) => {
  const context = await auth.$context;

  const user: User | null = await context.adapter.findOne({
    model: 'user',
    where: [{ field: 'email', value: data.invitation.email }],
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.id == data.inviter.id) {
    throw new Error('User cannot given himself a role');
  }
    
  const organizationGFP: Organization | null = await context.adapter.findOne({
    model: 'organization',
    where: [{ field: 'slug', value: GFP_SLUG}],
  });

  if (organizationGFP && data.organization.id != organizationGFP.id && await checkIfUserIsAssociateToOrgGFP(user.id, context, organizationGFP.id)) {
    throw new Error('User cannot be associated to a pharmacy');
  }

   //validate if user CPF is associated to CNPJ
};

function checkIfUserIsAssociateToOrgGFP(id: string, context: AuthContext, gfpID: string) {
  return context.adapter.findOne({
    model: 'member',
    where: [{ field: 'userId', value:  id },
      { field: 'organizationId', value:  gfpID },
    ],
  }) == null? true:false;
}

