import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // הרשאה: 'admin' רשאי לכתוב ל-DB (create/update/delete).
    // ברירת המחדל 'user' — אף אחד לא הופך לאדמין בטעות.
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },

    dashboardAccess: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    active: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: Date,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
