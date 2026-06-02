import express from 'express';
import {
  GetAllTours,
  CreateTour,
  GetTour,
  UpdateTour,
  DeleteTour,
} from '../controllers/tourController.js';

const router = express.Router();

// נתיב הבסיס: /api/v1/tours
router.route('/').get(GetAllTours).post(CreateTour);

// נתיב עם פרמטר ID: /api/v1/tours/:id
router.route('/:id').get(GetTour).patch(UpdateTour).delete(DeleteTour);

export default router;
