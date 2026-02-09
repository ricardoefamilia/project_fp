import { Controller, Get, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query , Req, Request} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PersonRelLegalAssociateService } from './person-rel-legal-associate.service';
import { OrganizationsService } from './organization.service';
import { User } from 'better-auth';

@ApiTags('users')
@Controller('users')
// @UseGuards(AuthGuard) // Temporarily disabled
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly personRelLegalAssociateService: PersonRelLegalAssociateService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
 async getProfile(@Request() request: Request & {user: User}) {
    const organizations = await this.usersService.findUserOrganizationsWithRole(request.user.id);
    return {...request.user, organizations };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns user by ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }

  // @Public() // Temporarily disabled
  @Get('public/health')
  @ApiOperation({ summary: 'Public health check endpoint' })
  @ApiResponse({ status: 200, description: 'Returns health status' })
  async publicHealth() {
    return {
      status: 'ok',
      message: 'Users module is healthy',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('cpf/:cpf')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by CPF' })
  @ApiResponse({ status: 200, description: 'Returns user by CPF' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByCpf(@Param('cpf') cpf: string) {
    return this.usersService.findByCpf(cpf);
  }

  @Get('validate-user')
  @ApiOperation({ summary: 'Validate user record' })
  @ApiResponse({ status: 200, description: 'Returns validation result' })
  async validateUser(
    @Query('cpf') cpf: string,
    @Query('organizationId') organizationId: string,
  ): Promise<{ isValid: boolean }> {
    const organization = await this.organizationsService.findOne(organizationId);

    if (!organization.slug) {
      return { isValid: false };
    }

    try {
      await this.personRelLegalAssociateService.findByCnpjAndCpf(organization.slug, cpf);
      return { isValid: true };
    } catch {
      return { isValid: false };
    }
  }
}
