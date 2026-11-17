import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      default: 'anonymous_user',
      index: true
    },
    language: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate'],
      required: true
    },
    analysis_type: {
      type: String,
      required: true
    },
    original_code: {
      type: String,
      required: true
    },
    identified_issue: {
      type: String,
      default: ''
    },
    corrected_code: {
      type: String,
      default: ''
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    collection: 'analysis_history'
  }
);

// Graceful model compilation
let AnalysisModel;
try {
  AnalysisModel = mongoose.model('Analysis', AnalysisSchema);
} catch (e) {
  AnalysisModel = mongoose.models.Analysis;
}

export default AnalysisModel;
