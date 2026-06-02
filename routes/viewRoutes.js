import express from 'express';
import {
  getOverview,
  getTour,
  getProject,
  getEditPage,
  updateProject,
} from '../controllers/viewsController.js';

const router = express.Router();

router.get('/', getOverview);

router.get('/tour/:slug', getTour);
router.get('/project/:slug', getProject);
// משאירים אותו נקי כרגע כדי שהדף ייפתח חופשי
router.get('/edit', getEditPage);
router.patch('/api/v1/projects/:id', updateProject);

export default router;
