import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

// Load environment variables
dotenv.config({ path: './config.env' });

const DB = process.env.Database_URL;

if (!DB) {
  console.error('❌ Database_URL environment variable is missing');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

// Connect to MongoDB first
mongoose
  .connect(DB)
  .then(() => {
    console.log('✅ DB connection successful!');

    app.listen(PORT, () => {
      console.log(`🚀 App running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed');
    console.error(err.message);
    process.exit(1);
  });
