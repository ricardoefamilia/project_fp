import { Test, TestingModule } from '@nestjs/testing';
import { CitiesControllers } from './city.controller'; // Notei que sua classe está no plural "Controllers"
import { CitiesService } from './city.service';
import { City } from 'src/database/entities/oracle/city.entity';


describe('CitiesControllers', () => {
  let controller: CitiesControllers;
  let service: CitiesService;

  // Mock do Service
  const mockCitiesService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesControllers],
      providers: [
        {
          provide: CitiesService,
          useValue: mockCitiesService,
        },
      ],
    }).compile();

    controller = module.get<CitiesControllers>(CitiesControllers);
    service = module.get<CitiesService>(CitiesService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('deve chamar o service.findAll com os parâmetros fornecidos', async () => {
      // Arrange
      const mockResult = [{ id: 1, name: 'São Paulo', stateAcronym: 'SP' }] as City[];
      mockCitiesService.findAll.mockResolvedValue(mockResult);

      const uf = 'SP';
      const page = 2;
      const pageSize = 20;
      const sortOrder = 'DESC';

      // Act
      // Chamamos passando os argumentos na ordem definida no seu método
      const result = await controller.getAll(uf, page, pageSize, sortOrder);

      // Assert
      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith({
        uf,
        page,
        pageSize,
        sortOrder,
      });
    });

    it('deve usar os valores padrão definidos na assinatura do método quando os parâmetros forem omitidos', async () => {
      // Arrange
      mockCitiesService.findAll.mockResolvedValue([]);

      // Act
      // Chamamos sem passar argumentos (ou passando undefined). 
      // O TypeScript/JavaScript usará os valores default (page=1, pageSize=10, etc)
      await controller.getAll(undefined);

      // Assert
      expect(service.findAll).toHaveBeenCalledWith({
        uf: undefined,
        page: 1,        // Valor default definido no controller
        pageSize: 10,   // Valor default definido no controller
        sortOrder: 'ASC', // Valor default definido no controller
      });
    });
  });
});