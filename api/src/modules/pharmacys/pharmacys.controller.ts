import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PharmacysService } from './pharmacys.service';
import { PharmacyDto } from './dto/pharmacy.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TelemetryService } from 'src/common/telemetry/telemetry.service';

@ApiTags('Pharmacys')
@Controller('pharmacys')
@UseGuards(AuthGuard)
export class PharmacysController {
  constructor(
    private readonly pharmacysService: PharmacysService,
    private readonly logger: TelemetryService,
  ) {}

  @Post()
  @Roles('masterFp', 'analistaFp')
  @ApiOperation({ summary: 'Create a new pharmacy' })
  create(@Body() pharmacyDto: PharmacyDto) {
    this.logger.logEvent('pharmacy.create');
    return this.pharmacysService.create(pharmacyDto);
  }

  @Get()
  @Roles('masterFp', 'analistaFp', 'consultaFp')
  @ApiOperation({ summary: 'Get all pharmacies with filters, pagination, and sorting' })
  findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query('sortField') sortField: string = 'cnpjNumber',
    @Query('search') search?: string,
  ) {
    this.logger.logEvent(`pharmacy.findAll`);
    return this.pharmacysService.findAll({ page, pageSize, sortOrder, sortField, search });
  }

  @Get(':id')
  @Roles('masterFp', 'analistaFp', 'consultaFp')
  @ApiOperation({ summary: 'Get a pharmacy by ID' })
  findOne(@Param('id') id: string) {
    this.logger.logEvent(`pharmacy.findOne`);
    return this.pharmacysService.findOne(id);
  }

  @Patch(':id')
  @Roles('masterFp', 'analistaFp')
  @ApiOperation({ summary: 'Update a pharmacy by ID' })
  update(@Param('id') id: string, @Body() pharmacyDto: PharmacyDto) {
    this.logger.logEvent(`pharmacy.update`);
    return this.pharmacysService.update(id, pharmacyDto);
  }

  @Delete(':id')
  @Roles('masterFp')
  @ApiOperation({ summary: 'Delete a pharmacy by ID' })
  remove(@Param('id') id: string) {
    this.logger.logEvent(`pharmacy.remove`);
    return this.pharmacysService.remove(id);
  }
}
