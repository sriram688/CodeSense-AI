import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import analysisRoutes from './routes/analysisRoutes.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Security Headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsing with size limiting (1MB max payload)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Global rate limiting
app.use('/api', apiLimiter);

// API Routes
app.use('/api', analysisRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'AI Code Explanation Assistant API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      analyze: 'POST /api/analyze',
      history: 'GET /api/history',
      historyItem: 'GET /api/history/:id'
    }
  });
});

// 404 & Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Database Connection with graceful fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_code_assistant';

export async function connectDB() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    console.log('[Database] Connected to MongoDB successfully.');
  } catch (err) {
    console.warn(`[Database] MongoDB not reachable at ${MONGODB_URI}. Operating in resilient memory/local store mode.`);
  }
}

// Process-level resilience
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]', reason?.message || reason);
});

// Start Server (only if not imported by Jest/tests)
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 AI Code Explanation Assistant Backend Running!`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🛡️  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'gemini'}`);
      console.log(`====================================================`);
    });

    const shutdown = () => {
      console.log('\n[Server] Gracefully shutting down...');
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  });
}

export default app;
