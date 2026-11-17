import mongoose from 'mongoose';
import AnalysisModel from '../models/Analysis.js';
import crypto from 'crypto';

// In-memory / local fallback store
const fallbackStore = [];

export const storageService = {
  /**
   * Save an analysis record
   */
  async saveAnalysis({ userId = 'anonymous_user', language, difficulty, analysisType, originalCode, result }) {
    const isMongoConnected = mongoose.connection.readyState === 1;

    const recordData = {
      user_id: userId,
      language,
      difficulty,
      analysis_type: analysisType,
      original_code: originalCode,
      identified_issue: result?.identified_issue || '',
      corrected_code: result?.corrected_code || '',
      result,
      created_at: new Date()
    };

    if (isMongoConnected) {
      try {
        const saved = await AnalysisModel.create(recordData);
        return saved.toObject();
      } catch (err) {
        console.warn('[Storage] MongoDB save failed, falling back to memory store:', err.message);
      }
    }

    // In-memory fallback
    const mockRecord = {
      _id: crypto.randomUUID(),
      ...recordData
    };
    fallbackStore.unshift(mockRecord);
    if (fallbackStore.length > 100) fallbackStore.pop(); // keep last 100
    return mockRecord;
  },

  /**
   * Get history records
   */
  async getHistory({ limit = 20, language = null, difficulty = null } = {}) {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      try {
        const query = {};
        if (language) query.language = new RegExp(`^${language}$`, 'i');
        if (difficulty) query.difficulty = difficulty.toLowerCase();

        return await AnalysisModel.find(query)
          .sort({ created_at: -1 })
          .limit(Number(limit))
          .lean();
      } catch (err) {
        console.warn('[Storage] MongoDB query failed, falling back to memory store:', err.message);
      }
    }

    let results = [...fallbackStore];
    if (language) {
      results = results.filter(r => r.language.toLowerCase() === language.toLowerCase());
    }
    if (difficulty) {
      results = results.filter(r => r.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    return results.slice(0, Number(limit));
  },

  /**
   * Get single history item by id
   */
  async getById(id) {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      try {
        const record = await AnalysisModel.findById(id).lean();
        if (record) return record;
      } catch (err) {
        // ID may not be an ObjectId if it was created in memory fallback mode
      }
    }

    return fallbackStore.find(r => r._id === id || r._id.toString() === id) || null;
  },

  /**
   * Delete an analysis record
   */
  async deleteById(id) {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      try {
        await AnalysisModel.findByIdAndDelete(id);
      } catch (err) {
        // Fall through to memory
      }
    }

    const idx = fallbackStore.findIndex(r => r._id === id || r._id.toString() === id);
    if (idx !== -1) {
      fallbackStore.splice(idx, 1);
      return true;
    }
    return false;
  }
};
