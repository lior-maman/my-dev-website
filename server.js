import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

// הגדרת משתנה סביבה לנתיב קובץ ההגדרות
dotenv.config({ path: './config.env' });

//חיבור למסד נתונים
const DB = process.env.Database_URL;

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${PORT}...`);
});
