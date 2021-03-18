import express from 'express';
import * as base from '@controllers/default.controller';
import * as database from '@controllers/database.controller';


const router = express.Router();

router.get('/', base.home);

router.get('/search', database.resultsPost);

router.get('/results', database.resultsGet);
router.post('/results', database.resultsPost);

export default router;
