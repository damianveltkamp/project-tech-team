import express from 'express';
import * as base from '@controllers/default.controller';
import * as database from '@controllers/database.controller';


const router = express.Router();

router.get('/', base.home);

router.get('/yourMatches', database.yourMatchesGet);
router.post('/yourMatches', database.yourMatchesPost);

export default router;
