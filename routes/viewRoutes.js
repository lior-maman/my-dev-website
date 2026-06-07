import express from 'express';
import {
  getOverview,
  getTour,
  getProject,
  getEditPage,
  updateProject,
  handleContactForm,
} from '../controllers/viewsController.js';

const router = express.Router();

router.get('/', getOverview);

router.get('/tour/:slug', getTour);
router.get('/project/:slug', getProject);
router.get('/privacy', (req, res) => {
  res.render('privacy-policy');
});
router.get('/edit', getEditPage);
router.patch('/api/v1/projects/:id', updateProject);
router.post('/api/v1/contact', handleContactForm);
export default router;
