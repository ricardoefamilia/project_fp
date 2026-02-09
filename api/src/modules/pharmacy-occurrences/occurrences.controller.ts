import { Controller } from '@nestjs/common';
import { OccurrencesService } from './occurrences.service';

@Controller('pharmacys/:cnpj/occurrences')
export class OccurrencesController {
    constructor(private readonly occurrencesService: OccurrencesService) {}
}
