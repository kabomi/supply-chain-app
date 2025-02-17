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

export default router;
