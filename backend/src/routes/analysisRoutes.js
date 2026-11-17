import express from 'express';
import {
  analyzeCode,
  getHistory,
  getAnalysisById,
  deleteAnalysis
} from '../controllers/analysisController.js';
import { validateAnalysisInput } from '../middleware/validator.js';
import { analysisLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Code Explanation Assistant API',
    timestamp: new Date().toISOString()
  });
});

// Analyze code or error
router.post('/analyze', analysisLimiter, validateAnalysisInput, analyzeCode);

// History operations
router.get('/history', getHistory);
router.get('/history/:id', getAnalysisById);
router.delete('/history/:id', deleteAnalysis);

export default router;
