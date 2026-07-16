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