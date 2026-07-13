import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'פרויקט חייב להכיל שם (כותרת)'],
    unique: true,
    trim: true,
  },
  summary: {
    type: String,
    required: [true, 'פרויקט חייב להכיל תיאור/תקציר'],
    trim: true,
  },
  // הוספת שדה התיאור המורחב (השדה שבו כתוב כרגע "eee" בדאטה-בייס)
  description: {
    type: String,
    trim: true,
    default: '',
  },
  // הוספת שדה הלינק הדינמי לכל פרויקט
  link: {
    type: String,
    trim: true,
    required: [true, 'פרויקט חייב להכיל קישור (Link)'],
  },
  tags: {
    type: [String], // מערך של מחרוזות עבור הטכנולוגיות (למשל: ['Node.js', 'Express', 'Pug'])
    required: [true, 'פרויקט חייב להכיל לפחות תגית טכנולוגית אחת'],
  },
  buttonText: {
    type: String,
    default: 'View Project',
  },
  imageCover: {
    type: String,
    default: 'default-project.jpg', // ערך ברירת מחדל אם אין תמונה לכל פרויקט
  },
  slug: String,
  price: {
    type: Number,
    // אם חלק מהפרויקטים הם חינמיים או לא רלוונטיים למחיר, נשאיר את זה אופציונלי בלי required
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
