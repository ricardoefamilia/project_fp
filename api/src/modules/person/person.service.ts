import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from 'src/database/entities/oracle/person.entity';
import { FindOptionsOrder, Repository } from 'typeorm';
import { PersonDto } from './dto/person.dto';
import { PersonMapper } from './dto/person.mapper';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) { }

  async findAll({
    documentNumber,
    page = 1,
    pageSize = 10,
    sortOrder = 'ASC',
  }: {
    documentNumber?: string;
    page: number;
    pageSize: number;
    sortOrder: 'ASC' | 'DESC';

  }): Promise<PersonDto[]> {
    const skip = (page - 1) * pageSize;
    const order: FindOptionsOrder<Person> = {};
    order.personDocument = sortOrder;

    if (!documentNumber) {
      const result = await this.personRepository.find({
        order: order,
        skip,
        take: pageSize,
      });  // retorna tudo
      return result.map((person) => PersonMapper.toDto(person));
    }
    const result = await this.personRepository.find({
      where: { personDocument: documentNumber, },
      order: order,
      skip,
      take: pageSize,
    });
    return result.map((person) => PersonMapper.toDto(person));
  }
}
