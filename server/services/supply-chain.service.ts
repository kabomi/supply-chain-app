import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /supply-chain/inventory:
 *   get:
 *     summary: List inventory items
 *     responses:
 *       200:
 *         description: A list of inventory items
 */
router.get('/inventory', (req: Request, res: Response) => {
  res.json({ message: 'List of inventory items' });
});

export default router;
