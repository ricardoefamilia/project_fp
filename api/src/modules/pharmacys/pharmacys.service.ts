import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestContext } from 'src/common/storage/request-context.storage';
import { Pharmacy } from 'src/database/entities/postgres/pharmacy.entity';
import { Like, OrderByCondition, Repository } from 'typeorm';
import { PharmacyDto } from './dto/pharmacy.dto';
import { PharmacyMapper } from './dto/pharmacy.mapper';

@Injectable()
export class PharmacysService {
  constructor(
    @InjectRepository(Pharmacy, 'postgres')
    private readonly pharmacyRepository: Repository<Pharmacy>,
  ) { }

  async create(createPharmacyDto: PharmacyDto): Promise<PharmacyDto> {
    const pharmacy = PharmacyMapper.toEntity(createPharmacyDto);
    pharmacy.userInclusionId = RequestContext.getUserIdFromContext() ?? '';
    pharmacy.userUpdateId = RequestContext.getUserIdFromContext() ?? '';
    const savedPharmacy = await this.pharmacyRepository.save(pharmacy);
    return PharmacyMapper.toDto(savedPharmacy);
  }

  async findAll({
    page = 1,
    pageSize = 10,
    sortOrder = 'ASC',
    sortField = 'cnpjNumber',
    search,
  }: {
    page: number;
    pageSize: number;
    sortOrder: 'ASC' | 'DESC';
    sortField: string;
    search?: string;
  }): Promise<PharmacyDto[]> {
    const skip = (page - 1) * pageSize;

    const where = search
      ? [
        { ufCrf: Like(`%${search}%`) },
        { cityCodeIbge: Like(`%${search}%`) },
        { cnpjNumber: Like(`%${search}%`) },
        { companyName: Like(`%${search}%`) },
        { operationalStatus: Like(`%${search}%`) },
      ]
      : {};

    const order: OrderByCondition = {};
    // Security check: ensure sortBy is a valid column name to prevent SQL injection
    const validColumns = [
      'cnpjNumber',
      'ufCrf',
      'cityCodeIbge',
      'companyName',
      'operationalStatus',
    ];
    if (validColumns.includes(sortField)) {
      order[`${sortField}`] = sortOrder;
    } else {
      // Default sort if invalid column provided
      order.cnpjNumber = 'ASC';
    }

    const result = await this.pharmacyRepository.find({
      where,
      order: order,
      skip,
      take: pageSize,
    });

    return result.map((pharmacy) => PharmacyMapper.toDto(pharmacy));
  }

  async findOne(id: string): Promise<PharmacyDto> {
    const pharmacy = await this.pharmacyRepository.findOneBy({ cnpjNumber: id });
    if (!pharmacy) {
      throw new Error(`Pharmacy with id ${id} not found`);
    }
    return PharmacyMapper.toDto(pharmacy);
  }

  async update(id: string, updatePharmacyDto: PharmacyDto): Promise<PharmacyDto> {
    const pharmacy = PharmacyMapper.toEntity(updatePharmacyDto);
    pharmacy.userUpdateId = RequestContext.getUserIdFromContext() ?? '';
    const updatedPharmacy = await this.pharmacyRepository.save(pharmacy);
    return PharmacyMapper.toDto(updatedPharmacy);
  }

  async remove(id: string): Promise<void> {
    const pharmacy = await this.pharmacyRepository.findOneBy({ cnpjNumber: id });
    if (pharmacy) {
      await this.pharmacyRepository.remove(pharmacy);
    } else {
      throw new Error(`Pharmacy with id ${id} not found`);
    }
  }
}
