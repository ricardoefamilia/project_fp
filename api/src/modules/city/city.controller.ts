import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { City } from 'src/database/entities/oracle/city.entity';
import { CitiesService } from './city.service';

@ApiTags('cities')
@Controller('cities')
export class CitiesControllers {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List of citys endpoint' })
  @ApiResponse({ status: 200, description: 'List of citys.', type: [City] })
  @ApiQuery({ name: 'uf', type: String, required: false, description: 'Uf of the city' })
  async getAll(
    @Query('uf') uf?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<City[]> {
    return await this.citiesService.findAll({ uf, page, pageSize, sortOrder });
  }
}
