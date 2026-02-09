import { Injectable } from '@nestjs/common';

export type ListOccurrencesFilters = {
    nuOcorrenciaBusca?: string;
    tpOcorrenciaBusca?: string;
    dtIni?: string;
    dtFim?: string;
};

@Injectable()
export class OccurrencesService {}
