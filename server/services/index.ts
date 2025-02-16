import { Router } from 'express';
import supplyChainService from './supply-chain.service';
const router = Router();

router.use('/supply-chain', supplyChainService);

export default router;
