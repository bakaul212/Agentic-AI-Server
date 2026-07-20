import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Agent from '../models/Agent';

const router = Router();

// 1. ADD NEW ITEM / AGENT (POST /api/items/add & POST /api/items)
router.post(['/', '/add'], async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, shortDesc, fullDesc, price, category, imageUrl, userId } = req.body;

    // 🎯 userId না থাকলে বা আনঅথরাইজড হলে নতুন একটি Valid ObjectId বানিয়ে নেবে
    const validUserId = userId && mongoose.Types.ObjectId.isValid(userId)
      ? userId
      : new mongoose.Types.ObjectId();

    const newAgent = new Agent({
      title,
      shortDesc,
      fullDesc,
      price,
      category,
      imageUrl: imageUrl || '',
      userId: validUserId
    });

    const savedAgent = await newAgent.save();
    console.log('✅ Agent Saved to MongoDB:', savedAgent._id);

    res.status(201).json({ 
      message: 'Agent registered successfully inside MongoDB', 
      agent: savedAgent 
    });
  } catch (error: any) {
    console.error('❌ Save Error:', error);
    res.status(500).json({ message: error.message || 'Failed to deploy module.' });
  }
});

// 2. GET ALL ITEMS (GET /api/items & GET /api/items/all)
router.get(['/', '/all', '/my-agents'], async (req: Request, res: Response): Promise<void> => {
  try {
    const allAgents = await Agent.find({}).sort({ createdAt: -1 });
    res.status(200).json(allAgents);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving directory from MongoDB.' });
  }
});

// 3. DELETE ITEM (DELETE /api/items/:id)
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) {
      res.status(404).json({ message: 'Module not found in MongoDB.' });
      return;
    }
    res.status(200).json({ message: 'Module decommissioned successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Decommissioning execution error.' });
  }
});

export default router;