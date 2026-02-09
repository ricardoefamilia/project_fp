import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/postgres/user.entity';
import { Member } from '../../database/entities/postgres/member.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'postgres')
    private usersRepository: Repository<User>,
    @InjectRepository(Member, 'postgres')
    private memberRepository: Repository<Member>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'email', 'name', 'image', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'image', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async findByCpf(cpf: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { cpf },
      select: ['id', 'email', 'name', 'cpf', 'image', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with CPF ${cpf} not found`);
    }

    return user;
}

async findUserOrganizationsWithRole(userId: string) {
    const members = await this.memberRepository.find({
      where: { userId },
      relations: ['organization'],
    });

    return members.map((member) => ({
      id: member.organization.id,
      name: member.organization.name,
      slug: member.organization.slug,
      logo: member.organization.logo,
      createdAt: member.organization.createdAt,
      metadata: member.organization.metadata,
      role: member.role,
    }));
  }
}  
