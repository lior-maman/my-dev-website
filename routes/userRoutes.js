import express from 'express';

import { login, protect, requirePlan } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);

router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
});

router.get('/dashboard', protect, requirePlan('premium'), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Premium access granted',
  });
});

export default router;
