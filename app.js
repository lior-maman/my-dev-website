import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import './models/reviewModel.js'; // ייבוא המודל של חוות הדעת כדי שהפונקציה של Populate תעבוד

// ייבוא הראוטר של
import tourRouter from './routes/tourRoutes.js';
// ייבוא הראוטר של התצוגות
import viewRouter from './routes/viewRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// 1) MIDDLEWARES

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public'))); // הגדרת תיקיית פאבליק
//2) MIDDLEWARES

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 3) ROUTES

// כאן אנחנו מחברים את כל הנתיבים שמתחילים ב-tours לראוטר המתאים
app.use('/api/v1/tours', tourRouter);
app.use('/', viewRouter); // כל הנתיבים שמתחילים ב- / ינותבו לראוטר של התצוגות
export default app;
