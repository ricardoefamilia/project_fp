import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Uf } from '../../database/entities/oracle/uf.entity';
import { UfsService } from './uf.service';

@ApiTags('ufs')
@Controller('ufs')
export class UfsControllers {
  constructor(private readonly ufsService: UfsService) {}

  @Get()
  @ApiOperation({ summary: 'List of ufs endpoint' })
  @ApiResponse({ status: 200, description: 'List of ufs.', type: [Uf] })
  async getAll(): Promise<Uf[]> {
    return await this.ufsService.findAll();
  }
}
