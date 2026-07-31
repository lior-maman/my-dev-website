import express from 'express';
import {
  getOverview,
  getTour,
  getProject,
  getEditPage,
  updateProject,
  handleContactForm,
} from '../controllers/viewsController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.get('/', getOverview);

router.get('/project/:slug', getProject);
router.get('/tour/:slug', getTour);

router.get('/privacy', (req, res) => {
  res.render('privacy');
});

router.get('/login', (req, res) => {
  res.render('login'); // הקובץ החדש שיצרת
});

// הגשת מסך העריכה — נשאר נגיש. admin.js מסתיר את התוכן ומפנה
// ללוגין אם אין token, וההגנה האמיתית על הנתונים היא על ה-API למטה.
router.get('/edit', getEditPage);

// עדכון פרויקט מ-DB — מוגן: רק אדמין מחובר יכול לכתוב. זה הקו
// האמיתי שסוגר את החור — גם PATCH ישיר (לא מהמסך) ייחסם כאן.
router.patch(
  '/api/v1/projects/:id',
  protect,
  restrictTo('admin'),
  updateProject,
);

// טופס יצירת קשר — נשאר פתוח (ציבורי, כך צריך).
router.post('/api/v1/contact', handleContactForm);

export default router;
