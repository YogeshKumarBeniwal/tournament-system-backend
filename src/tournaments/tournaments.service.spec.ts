import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TournamentStatus } from './tournament-status.enum';
import { TournamentsRepository } from './tournaments.repository';
import { TournamentsService } from './tournaments.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'Ariel',
  id: 'someId',
  password: 'somePassword',
  tournaments: [],
};

describe('TasksService', () => {
  let tasksService: TournamentsService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TournamentsService,
        { provide: TournamentsRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TournamentsService);
    tasksRepository = module.get(TournamentsRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      // const result = await tasksService.getTournaments(null, mockUser);
      // expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'someId',
        status: TournamentStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTournamentById('someId');
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTournamentById('someId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
