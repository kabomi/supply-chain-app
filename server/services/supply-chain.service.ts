import { Router, Request, Response, NextFunction } from 'express';
import dbConnection from '../persistence/dbConnection';
import { getAjv } from 'rxdb/plugins/validate-ajv';

import { itemSchema } from '../schemas';

const router = Router();
const collection = 'inventory';

const ajv = getAjv();

const validateSchema =
  (schema: object) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    if (!valid) {
      res.status(400).json({ errors: validate.errors });
    } else {
      next();
    }
  };

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
router.post(
  '/inventory',
  validateSchema({ ...itemSchema, additionalProperties: false }),
  async (req: Request, res: Response) => {
    const dbClient = dbConnection.get();
    const item = req.body;
    const createdItem = await dbClient.create(collection, item);
    res.json(createdItem);
  }
);

export default router;
