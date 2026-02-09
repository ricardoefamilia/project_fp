import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from 'src/database/entities/oracle/city.entity';
import { FindOptionsOrder, Repository } from 'typeorm';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City, 'oracle')
    private cityRepository: Repository<City>,
  ) {}

  async findAll({
    uf,
    page = 1,
    pageSize = 10,
    sortOrder = 'ASC',
  }: {
    uf?: string;
    page: number;
    pageSize: number;
    sortOrder: 'ASC' | 'DESC';
  }): Promise<City[]> {
    const skip = (page - 1) * pageSize;
    const order: FindOptionsOrder<City> = {};
    order.stateAcronym = sortOrder;

    if (!uf) {
      return await this.cityRepository.find({
        order: order,
        skip,
        take: pageSize,
      }); // retorna tudo
    }

    return await this.cityRepository.find({
      where: { stateAcronym: uf.toUpperCase() },
      order: order,
      skip,
      take: pageSize,
    });
  }
}
