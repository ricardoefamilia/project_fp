import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CitiesService } from './city.service';
import { City } from 'src/database/entities/oracle/city.entity'; // Ajuste o caminho se necessário

// Criamos um tipo para o Mock para facilitar o intellisense
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CitiesService', () => {
  let service: CitiesService;
  let cityRepository: MockRepository<City>;

  // Fábrica do Mock: define apenas os métodos que usamos (find)
  const createMockRepository = (): MockRepository<City> => ({
    find: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          // AQUI ESTÁ O TRUQUE:
          // Como seu service usa @InjectRepository(City, 'oracle'),
          // o token de teste precisa incluir o nome da conexão 'oracle'.
          provide: getRepositoryToken(City, 'oracle'), 
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    cityRepository = module.get(getRepositoryToken(City, 'oracle'));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
    expect(cityRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar todas as cidades com paginação padrão quando UF não é informada', async () => {
      // Arrange
      const mockCities = [{ id: 1, name: 'City A' }] as City[];
      cityRepository.find.mockResolvedValue(mockCities);

      const params = {
        page: 1,
        pageSize: 10,
        sortOrder: 'ASC' as const,
      };

      // Act
      const result = await service.findAll(params);

      // Assert
      expect(result).toEqual(mockCities);
      expect(cityRepository.find).toHaveBeenCalledWith({
        order: { stateAcronym: 'ASC' },
        skip: 0, // (1 - 1) * 10
        take: 10,
        // Garante que NÃO foi chamado com 'where'
        where: undefined, 
      });
    });

    it('deve filtrar por UF e converter para Uppercase quando UF é informada', async () => {
      // Arrange
      const ufInput = 'sp'; // input minúsculo para testar o .toUpperCase()
      const mockCities = [{ id: 1, name: 'São Paulo', stateAcronym: 'SP' }] as City[];
      cityRepository.find.mockResolvedValue(mockCities);

      const params = {
        uf: ufInput,
        page: 1,
        pageSize: 10,
        sortOrder: 'DESC' as const,
      };

      // Act
      const result = await service.findAll(params);

      // Assert
      expect(result).toEqual(mockCities);
      expect(cityRepository.find).toHaveBeenCalledWith({
        where: { stateAcronym: 'SP' }, // Verifica se converteu para maiúsculo
        order: { stateAcronym: 'DESC' },
        skip: 0,
        take: 10,
      });
    });

    it('deve calcular a paginação (skip) corretamente para a página 2', async () => {
      // Arrange
      cityRepository.find.mockResolvedValue([]);
      
      const params = {
        page: 2,
        pageSize: 5,
        sortOrder: 'ASC' as const,
      };

      // Act
      await service.findAll(params);

      // Assert
      expect(cityRepository.find).toHaveBeenCalledWith(expect.objectContaining({
        take: 5,
        skip: 5, // (2 - 1) * 5 = 5
      }));
    });
    
    it('deve lidar com retorno vazio do repositório', async () => {
        // Arrange
        cityRepository.find.mockResolvedValue([]);
  
        const params = {
          page: 1,
          pageSize: 10,
          sortOrder: 'ASC' as const,
        };
  
        // Act
        const result = await service.findAll(params);
  
        // Assert
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });
  });
});