import request from 'supertest';
import express from 'express';
import supplyChainService from './supply-chain.service';

const app = express();
app.use(express.json());
app.use('/supply-chain', supplyChainService);

describe('Supply Chain Routes', () => {
  it('should return a list of inventory items', async () => {
    const response = await request(app).get('/supply-chain/inventory');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'List of inventory items' });
  });
});
