import * as common from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { auth } from '../auth/auth';
import { OrganizationsService } from './organization.service';

const GFP_SLUG: string = "GFP";

import type { CustomRequest } from './model/custom-request.model';
import { ActiveMemberRole } from './model/active-member-role.enum';

@ApiTags('Roles')
@common.Controller('roles')
export class RolesController {
  constructor(private readonly organizationsService: OrganizationsService){}

  @common.Get()
  @ApiOperation({ summary: 'Get roles based on active member role' })
  async getRolesBasedOnActiveMemberRole(
    @common.Headers() headers: Record<string, string>,
    @common.Request() request: CustomRequest,
  ) {
    const organizationId = request.session.activeOrganizationId;
    const userId = request.user?.id;

    console.log('RolesController - User ID:', userId);
    console.log('RolesController - Organization ID:', organizationId);

    const activeMemberRole = await auth.api.getActiveMemberRole({
      headers,
      query: {
        userId,
        organizationId,
      },
    });

    if (organizationId != null && activeMemberRole.role === ActiveMemberRole.OWNER) {
      const org = await this.organizationsService.findOne(organizationId);
      if (org.slug !== GFP_SLUG) {
        return {
          activeRole: activeMemberRole.role,
          roles: [
            ActiveMemberRole.REPRESENTANTE_LEGAL,
            ActiveMemberRole.GESTOR,
            ActiveMemberRole.VENDEDOR,
          ],
        };
      }
    }

    const roles = (() => {
      switch (activeMemberRole.role) {
        case ActiveMemberRole.MASTER_FP as string:
          return [
            ActiveMemberRole.MASTER_FP,
            ActiveMemberRole.ANALISTA_FP,
            ActiveMemberRole.FINANCEIRO_FP,
          ];
        case ActiveMemberRole.ANALISTA_FP as string:
          return [
            ActiveMemberRole.ANALISTA_FP,
            ActiveMemberRole.FINANCEIRO_FP,
            ActiveMemberRole.CONSULTA_FP,
          ];
        case ActiveMemberRole.FINANCEIRO_FP as string:
          return [
            ActiveMemberRole.FINANCEIRO_FP,
            ActiveMemberRole.CONSULTA_FP,
          ];
        case ActiveMemberRole.CONSULTA_FP as string:
          return [ActiveMemberRole.CONSULTA_FP];
        case ActiveMemberRole.REPRESENTANTE_LEGAL as string:
          return [
            ActiveMemberRole.REPRESENTANTE_LEGAL,
            ActiveMemberRole.GESTOR,
            ActiveMemberRole.VENDEDOR,
          ];
        case ActiveMemberRole.GESTOR as string:
          return [ActiveMemberRole.GESTOR, ActiveMemberRole.VENDEDOR];
        case ActiveMemberRole.VENDEDOR as string:
          return [ActiveMemberRole.VENDEDOR];
        default:
          return [];
      }
    })();

    return {
      activeRole: activeMemberRole.role,
      roles,
    };
  }
}