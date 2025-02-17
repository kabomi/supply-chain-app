import request from 'supertest';
import express from 'express';
import supplyChainService from './supply-chain.service';
import data, { Factory } from '../test/data.fixture';
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

let client = dbConnection.get() as jest.Mocked<
  ReturnType<typeof dbConnection.get>
>;
beforeAll(async () => {
  // await dbConnection.initialize();
  client = dbConnection.get() as jest.Mocked<
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
  it('should create an inventory item', async () => {
    const itemToSave = Factory.createNewItem({
      name: 'harry',
      description: 'potter',
      price: 500,
      color: 'green',
    });
    client.create.mockResolvedValue(itemToSave);

    const response = await request(app)
      .post('/supply-chain/inventory')
      .send(itemToSave);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        ...itemToSave,
        id: expect.any(String),
      })
    );
  });
});
