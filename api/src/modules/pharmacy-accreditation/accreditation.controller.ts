import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PharmacyAccreditation } from 'src/database/entities/postgres/pharmacy-accreditation.entity';
import { AccreditationService } from './accreditation.service';
import { CreateAccreditationDto } from './dto/create-accreditation.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('accreditations')
@Controller('accreditations')
export class AccreditationController {
  constructor(private readonly accreditationService: AccreditationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo registro de credenciamento para uma farmácia' })
  @ApiResponse({ status: 201, description: 'Credenciamento criado com sucesso', type: PharmacyAccreditation })
  @ApiResponse({ status: 400, description: 'Credenciamento já existe para esta farmácia' })
  async create(@Body() createAccreditationDto: CreateAccreditationDto): Promise<PharmacyAccreditation> {
    return this.accreditationService.create(
      createAccreditationDto.pharmacyId,
      createAccreditationDto.initialStatus,
    );
  }

  @Get(':pharmacyId/status')
  @ApiOperation({ summary: 'Obtém o status atual de credenciamento de uma farmácia' })
  @ApiParam({ name: 'pharmacyId', type: Number, description: 'ID da farmácia' })
  @ApiResponse({
    status: 200,
    description: 'Status atual de credenciamento',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['ATIVA', 'INATIVA'] },
        reasonCode: { type: 'string', nullable: true },
        reasonDescription: { type: 'string', nullable: true },
        updatedAt: { type: 'string', format: 'date-time', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Credenciamento não encontrado' })
  async getCurrentStatus(@Param('pharmacyId', ParseIntPipe) pharmacyId: number) {
    return this.accreditationService.getCurrentStatus(pharmacyId);
  }

  @Get(':pharmacyId/transitions')
  @ApiOperation({ summary: 'Retorna as transições possíveis para o credenciamento atual' })
  @ApiParam({ name: 'pharmacyId', type: Number, description: 'ID da farmácia' })
  @ApiResponse({
    status: 200,
    description: 'Transições possíveis',
    schema: {
      type: 'object',
      properties: {
        currentStatus: { type: 'string', enum: ['ATIVA', 'INATIVA'] },
        currentReasonCode: { type: 'string', nullable: true },
        transitions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              toStatus: { type: 'string', enum: ['ATIVA', 'INATIVA'] },
              allowedReasonCodes: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Credenciamento não encontrado' })
  async getPossibleTransitions(@Param('pharmacyId', ParseIntPipe) pharmacyId: number) {
    return this.accreditationService.getPossibleTransitions(pharmacyId);
  }

  @Put(':pharmacyId/status')
  @ApiOperation({ summary: 'Atualiza o status de credenciamento de uma farmácia' })
  @ApiParam({ name: 'pharmacyId', type: Number, description: 'ID da farmácia' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso', type: PharmacyAccreditation })
  @ApiResponse({ status: 400, description: 'Transição não permitida ou motivo inválido' })
  @ApiResponse({ status: 404, description: 'Credenciamento não encontrado' })
  async updateStatus(
    @Param('pharmacyId', ParseIntPipe) pharmacyId: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<PharmacyAccreditation> {
    return this.accreditationService.updateStatus(
      pharmacyId,
      updateStatusDto.status,
      updateStatusDto.reasonCode ?? null,
    );
  }
}

