import express from 'express';
import * as base from '@controllers/default.controller';

const router = express.Router();

router.get('/', base.home);

export default router;
