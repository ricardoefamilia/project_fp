import { Person } from 'src/database/entities/oracle/person.entity';
import { PersonDto } from './person.dto';

export class PersonMapper {
  static toDto(person: Person): PersonDto {
    const dto = new PersonDto()
    dto.personDocument = person.personDocument;
    dto.personName = person.personName;
    dto.isActive = person.isActive;
    dto.streetName = person.streetName || undefined;
    dto.streetNumber = person.streetNumber || undefined;
    dto.addressComplement = person.addressComplement || undefined;
    dto.neighborhood = person.neighborhood || undefined;
    dto.postalCode = person.postalCode || undefined;
    dto.cityName = person.cityName || undefined;
    dto.cityIbgeCode = person.cityIbgeCode || undefined;
    dto.stateUf = person.stateUf || undefined;
    dto.phoneNumber = person.phoneNumber || undefined;
    dto.areaCode = person.areaCode || undefined;
    dto.countryCode = person.countryCode || undefined;
    dto.extensionNumber = person.extensionNumber || undefined;
    dto.rfbUpdateDate = person.rfbUpdateDate || undefined;
    dto.processingDate = person.processingDate || undefined;
    dto.registrationDate = person.registrationDate || undefined;
    return dto
  }
  static toEntity(dto: PersonDto): Person {
    const entity = new Person();
    entity.personDocument = dto.personDocument;
    entity.personName = dto.personName;
    entity.isActive = dto.isActive;
    entity.streetName = dto.streetName || null;
    entity.streetNumber = dto.streetNumber || null;
    entity.addressComplement = dto.addressComplement || null;
    entity.neighborhood = dto.neighborhood || null;
    entity.postalCode = dto.postalCode || null;
    entity.cityName = dto.cityName || null;
    entity.cityIbgeCode = dto.cityIbgeCode || null;
    entity.stateUf = dto.stateUf || null;
    entity.phoneNumber = dto.phoneNumber || null;
    entity.areaCode = dto.areaCode || null;
    entity.countryCode = dto.countryCode || null;
    entity.extensionNumber = dto.extensionNumber || null;
    entity.rfbUpdateDate = dto.rfbUpdateDate || null;
    entity.processingDate = dto.processingDate || null;
    entity.registrationDate = dto.registrationDate || null;
    return entity;
  }

}
