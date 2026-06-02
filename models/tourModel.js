import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  duration: Number,
  maxGroupSize: Number,
  difficulty: String,
  guides: [String], // מערך של מזהי מדריכים
  price: Number,
  summary: String,
  description: String,
  imageCover: String,
  ratingsAverage: Number,
  ratingsQuantity: Number,
  images: [String],
  startDates: [Date],
  locations: [
    {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
      description: String,
      day: Number,
    },
  ],
});
//בטעינה ידנית של הדאטה נצטרך לבטל זמנית את הפונקציה הבאה
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// הגדרת הקשר הווירטואלי בין הטיול לביקורות
tourSchema.virtual('reviews', {
  ref: 'Review', // שם המודל של הביקורות
  foreignField: 'tour', // השדה בתוך הביקורת שמכיל את ה-ID של הטיול
  localField: '_id', // השדה בתוך הטיול הנוכחי (ה-ID שלו)
});

// וודא שה-Virtuals יופיעו כשאתה מוציא נתונים (JSON או אובייקט)
tourSchema.set('toJSON', { virtuals: true });
tourSchema.set('toObject', { virtuals: true });

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
