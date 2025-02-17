import request from 'supertest';
import express from 'express';
import supplyChainService from './supply-chain.service';
import data from '../test/data.fixture';
import dbConnection from '../persistence/dbConnection';

jest.mock('../persistence/dbConnection', () => {
  return {
    get: jest.fn().mockReturnValue({
      create: jest.fn(),
      insert: jest.fn(),
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([{ modify: jest.fn() }]),
      }),
      findAll: jest.fn(),
    }),
  };
});

const app = express();
app.use(express.json());
app.use('/supply-chain', supplyChainService);

beforeAll(async () => {
  // await dbConnection.initialize();
  const client = dbConnection.get() as jest.Mocked<
    ReturnType<typeof dbConnection.get>
  >;
  client.findAll.mockResolvedValue(data.items);
  client.create('inventory', data.items[0]);
  client.create('inventory', data.items[1]);
});

describe('Supply Chain Service', () => {
  it('should return a list of inventory items', async () => {
    const response = await request(app).get('/supply-chain/inventory');
    expect(response.status).toBe(200);
    expect(response.body).toContainEqual({
      ...data.items[0],
      id: expect.anything(),
    });
    expect(response.body).toContainEqual({
      ...data.items[1],
      id: expect.anything(),
    });
  });
});
