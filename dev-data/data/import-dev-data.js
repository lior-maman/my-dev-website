import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Tour from '../../models/tourModel.js'; // תוודא שהנתיב למודל שלך נכון

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/../../config.env` });

const DB = process.env.Database_URL;

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// קריאת קובץ ה-JSON (זה הקובץ שבו נמצאים הנתונים שלך)
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// פונקציה לייבוא נתונים
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// פונקציה למחיקת נתונים (כדי לנקות אם יש בלאגן)
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// בדיקה מה כתבת בטרמינל
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
