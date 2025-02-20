import request from 'supertest';
import express from 'express';
import supplyChainService from './supply-chain.service';
import data, { Factory } from '../test/data.fixture';
import dbConnection from '../persistence/dbConnection';

jest.mock('../persistence/dbConnection', () => {
  return {
    get: jest.fn().mockReturnValue({
      create: jest.fn(),
      update: jest.fn(),
      insert: jest.fn(),
      findById: jest.fn().mockReturnValue({
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
  it('should return an inventory item by id', async () => {
    const item = data.items[0];
    client.findById.mockResolvedValue(item);
    const response = await request(app).get(
      `/supply-chain/inventory/${item.id}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(item);
  });
  it('should return a 404 error when item is not found', async () => {
    client.findById.mockResolvedValue(null);
    const response = await request(app).get(
      '/supply-chain/inventory/not-found'
    );
    expect(response.status).toBe(404);
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
  it('should return a validation error for invalid inventory item payload', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemToSave: any = Factory.createNewItem({
      name: 'harry',
      description: 'potter',
      price: 500,
      color: 'green',
    });
    itemToSave.harry = 'potter';
    client.create.mockResolvedValue(itemToSave);

    const response = await request(app)
      .post('/supply-chain/inventory')
      .send(itemToSave);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  it('should update an inventory item', async () => {
    const item = data.items[0];
    const updatedItem = { ...item, name: 'updated' };
    client.findById.mockResolvedValue(item);
    client.update.mockResolvedValue();

    const response = await request(app)
      .put(`/supply-chain/inventory/${item.id}`)
      .send(updatedItem);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedItem);
  });
  describe('Latest Trail', () => {
    it('should return the last event of an item', async () => {
      const item = data.items[0];
      const event = item.events[0];
      client.findById.mockResolvedValue(item);
      const response = await request(app)
        .post('/supply-chain/latest-trail')
        .send({ id: item.id });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...event,
        id: expect.any(String),
      });
    });
    it('should return a 404 error when item is not found', async () => {
      client.findById.mockResolvedValue(null);
      const response = await request(app)
        .post('/supply-chain/latest-trail')
        .send({ id: 'not-found' });
      expect(response.status).toBe(404);
    });
    it('should return a 400 error when item id is not provided', async () => {
      let response = await request(app).post('/supply-chain/latest-trail');
      expect(response.status).toBe(400);
      response = await request(app)
        .post('/supply-chain/latest-trail')
        .send({ id: '' });
      expect(response.status).toBe(400);
    });
  });
});
