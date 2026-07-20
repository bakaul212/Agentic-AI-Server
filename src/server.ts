import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import agentRoutes from './routes/agentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints Mapping
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/items', agentRoutes); // 🎯 এই লাইনটি যুক্ত করা হয়েছে!

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'InsightAgent AI Server is running smoothly!' });
});

// Database Connection & Server Start
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('📦 MongoDB Connected Successfully.');
    app.listen(PORT, () => {
      console.log(`🚀 Server is flying on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });