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

router.get('/inventory', async (req: Request, res: Response) => {
  const dbClient = dbConnection.get();
  const inventoryItems = await dbClient.findAll(collection);
  res.json([...inventoryItems]);
});

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

router.put(
  '/inventory/:id',
  validateSchema({ ...itemSchema, additionalProperties: false }),
  async (req: Request, res: Response) => {
    const dbClient = dbConnection.get();
    const item = req.body;
    const { id } = req.params;
    try {
      await dbClient.update(collection, { ...item, id });
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ ...item, id });
  }
);

router.get('/inventory/:id', async (req: Request, res: Response) => {
  const dbClient = dbConnection.get();
  const { id } = req.params;
  const item = await dbClient.findById(collection, id);
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
  } else {
    res.json(item);
  }
});

router.post(
  '/latest-trail',
  validateSchema({
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
    additionalProperties: false,
  }),
  async (req: Request, res: Response) => {
    const dbClient = dbConnection.get();
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }
    const item = (await dbClient.findById(collection, id)) as {
      events: object[];
    };
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json(item.events[item.events.length - 1]);
    }
  }
);

export default router;
