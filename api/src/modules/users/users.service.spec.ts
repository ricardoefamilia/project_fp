import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../../database/entities/postgres/user.entity';
import { Member } from '../../database/entities/postgres/member.entity';

describe('UsersService', () => {
    let service: UsersService;
    let usersRepository: jest.Mocked<Repository<User>>;
    let memberRepository: jest.Mocked<Repository<Member>>;

    // Mock
    const mockUserId = 'user-123-uuid';

    const mockMember = {
        id: 'member-1',
        userId: mockUserId,
        organizatioId: 'org-1',
        role: 'gestor',
        createdAt: new Date(),
        organization: {
            id: 'org-1',
            name: 'Farmacia Popular',
            slug: 'Farmacia Popular Slug',
            logo: null,
            createdAt: new Date(),
            metadata: null,
        },
    };

    beforeEach(async () => {
        const mockUserRepo = {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
        };

        const mockMemberRepo = {
            find: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User, 'postgres'),
                    useValue: mockUserRepo,
                },
                {
                    provide: getRepositoryToken(Member, 'postgres'),
                    useValue: mockMemberRepo,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        usersRepository = module.get(getRepositoryToken(User, 'postgres'));
        memberRepository = module.get(getRepositoryToken(Member, 'postgres'));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findUserOrganizationsWithRole', () => {
        it('should return organizations with role for a user', async () => {
            memberRepository.find.mockResolvedValue([mockMember as any]);

            const result = await service.findUserOrganizationsWithRole(mockUserId);

            expect(memberRepository.find).toHaveBeenCalledWith({
                where: { userId: mockUserId },
                relations: ['organization'],
            });

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                id: 'org-1',
                name: 'Farmacia Popular',
                slug: 'Farmacia Popular Slug',
                logo: null,
                createdAt: expect.any(Date),
                metadata: null,
                role: 'gestor',
            });
        });

        it('should return empty array when user has no organizations', async () => {
            memberRepository.find.mockResolvedValue([]);

            const result = await service.findUserOrganizationsWithRole(mockUserId);

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should return multiple organizations with different roles', async () => {
            const mockMembers = [
                {
                    ...mockMember,
                    role: 'gestor',
                    organization: {...mockMember.organization, id: 'org-1', name: 'Org 1'},
                },
                {
                    ...mockMember,
                    id: 'member-2',
                    organizationId: 'org-2',
                    role: 'vendedor',
                    organization: {...mockMember.organization, id: 'org-2', name: 'Org 2'},
                },
            ];

            memberRepository.find.mockResolvedValue(mockMembers as any);

            const result = await service.findUserOrganizationsWithRole(mockUserId);

            expect(result).toHaveLength(2);
            expect(result[0].role).toBe('gestor');
            expect(result[1].role).toBe('vendedor');
        });
    });
});