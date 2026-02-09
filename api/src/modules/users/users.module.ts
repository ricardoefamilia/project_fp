import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/postgres/user.entity';
import { Member } from '../../database/entities/postgres/member.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesController } from './roles.controller';
import { Organization } from 'src/database/entities/postgres/organization.entity';
import { OrganizationsService } from './organization.service';
import { PersonRelLegalAssociateService } from './person-rel-legal-associate.service';
import { RlSocioPessoaJuridicaEntity } from '../../database/entities/oracle/person-rel-legal-associate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization,  Member], 'postgres'), TypeOrmModule.forFeature([RlSocioPessoaJuridicaEntity], 'oracle'),], 
  controllers: [UsersController, RolesController],
  providers: [UsersService, OrganizationsService, PersonRelLegalAssociateService],
  exports: [UsersService, OrganizationsService],
})
export class UsersModule {}
