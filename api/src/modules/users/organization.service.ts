import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../../database/entities/postgres/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization, 'postgres')
    private organizationsRepository: Repository<Organization>,
  ) {}

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationsRepository.findOneBy(
      { id: id },
    );

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization;
  }

}
