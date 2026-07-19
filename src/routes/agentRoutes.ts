import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth';
import Agent from '../models/Agent';

const router = Router();

// Create Item (Protected)
router.post('/add', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, shortDesc, fullDesc, price, category, imageUrl } = req.body;
    const newAgent = new Agent({
      title, shortDesc, fullDesc, price, category, imageUrl,
      userId: req.user?.userId
    });
    await newAgent.save();
    res.status(201).json({ message: 'Agent module registered inside MongoDB.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to deploy module.' });
  }
});

// Get User Specific Items for Manage (Protected)
router.get('/my-agents', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const myAgents = await Agent.find({ userId: req.user?.userId });
    res.status(200).json(myAgents);
  } catch (error) {
    res.status(500).json({ message: 'Fetch pipeline failed.' });
  }
});

// Get All Items (Public - For Explore page)
router.get('/all', async (req, res) => {
  try {
    const allAgents = await Agent.find({});
    res.json(allAgents);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving directory.' });
  }
});

// Delete Item (Protected)
router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const agent = await Agent.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
    if (!agent) {
      res.status(404).json({ message: 'Module not found or unauthorized.' });
      return;
    }
    res.status(200).json({ message: 'Module decommissioned successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Decommissioning execution error.' });
  }
});

export default router;