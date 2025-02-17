import { Router, Request, Response } from 'express';
import dbConnection from '../persistence/dbConnection';

const router = Router();
const collection = 'inventory';

/**
 * @swagger
 * /supply-chain/inventory:
 *   get:
 *     summary: List inventory items
 *     responses:
 *       200:
 *         description: A list of inventory items
 */
router.get('/inventory', async (req: Request, res: Response) => {
  const dbClient = dbConnection.get();
  const inventoryItems = await dbClient.findAll(collection);
  res.json([...inventoryItems]);
});

/**
 * @swagger
 * /supply-chain/inventory:
 *   post:
 *     summary: Create an inventory item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: The created inventory item
 */
router.post('/inventory', async (req: Request, res: Response) => {
  const dbClient = dbConnection.get();
  const item = req.body;
  const createdItem = await dbClient.create(collection, item);
  res.json(createdItem);
});

export default router;
