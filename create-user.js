import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/userModel.js';

dotenv.config({ path: './config.env' });

await mongoose.connect(process.env.Database_URL);

try {
  const user = await User.create({
    name: 'Lior Maman',
    email: 'lior@example.com',
    password: '12345678',
    plan: 'premium',
  });

  console.log('✅ User created');
  console.log(user);
} catch (err) {
  console.error(err);
}

await mongoose.disconnect();
process.exit();
