import express, { Router } from 'express';

import { Services } from '../../utils/types';
import {
  createSelectionHandlerFactory,
  deleteSelectionHandlerFactory,
  retrieveSelectionHandlerFactory,
} from './selection';

const router = express.Router();

function setupRouter(services: Services): Router {
  router.use('/v1');

  // @TODO will require 'is authenticated' middleware
  router.post('/selections', createSelectionHandlerFactory(services.selection));
  router.get(
    '/selections/:id',
    retrieveSelectionHandlerFactory(services.selection)
  );
  router.delete(
    '/selections/:id',
    deleteSelectionHandlerFactory(services.selection)
  );

  return router;
}

export { setupRouter };
