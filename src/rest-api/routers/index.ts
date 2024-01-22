import express from 'express';

import {
  createNewHandler,
  deleteSelectionHandler,
  retrieveSelectionHandler,
} from './selection';

const router = express.Router();

router.use('/v1');

// @TODO will require 'is authenticated' middleware
router.post('/selections', createNewHandler);
router.get('/selections/:id', retrieveSelectionHandler);
router.delete('/selections/:id', deleteSelectionHandler);

export { router };
