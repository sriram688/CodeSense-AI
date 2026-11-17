import { analyzeCodeWithAI } from '../services/aiService.js';
import { storageService } from '../services/storageService.js';

/**
 * Validates and sanitizes the structured AI response to guarantee contract
 */
function sanitizeAIResult(result, reqDifficulty, fallbackCode) {
  if (!result || typeof result !== 'object') {
    throw new Error('AI response is not an object');
  }

  return {
    summary: typeof result.summary === 'string' && result.summary.trim() ? result.summary.trim() : 'Code analysis complete.',
    identified_issue: typeof result.identified_issue === 'string' ? result.identified_issue.trim() : 'No issues found.',
    why_it_happens: typeof result.why_it_happens === 'string' ? result.why_it_happens.trim() : '',
    suggested_solution: typeof result.suggested_solution === 'string' ? result.suggested_solution.trim() : '',
    difficulty: (result.difficulty || reqDifficulty || 'beginner').toLowerCase(),
    line_by_line_explanation: Array.isArray(result.line_by_line_explanation)
      ? result.line_by_line_explanation.map(item => String(item).trim()).filter(Boolean)
      : (typeof result.line_by_line_explanation === 'string' ? [result.line_by_line_explanation] : []),
    corrected_code: typeof result.corrected_code === 'string' ? result.corrected_code : fallbackCode,
    example_output: typeof result.example_output === 'string' ? result.example_output : '',
    best_practices: Array.isArray(result.best_practices)
      ? result.best_practices.map(item => String(item).trim()).filter(Boolean)
      : (typeof result.best_practices === 'string' ? [result.best_practices] : []),
    complexity: typeof result.complexity === 'string' ? result.complexity : ''
  };
}

/**
 * POST /api/analyze
 * Main code analysis controller
 */
export async function analyzeCode(req, res, next) {
  try {
    const { language, difficulty, analysisType, code, userId } = req.body;

    // Call AI Service (Gemini / OpenAI / Anthropic / Fallback)
    const rawResult = await analyzeCodeWithAI({
      language,
      difficulty,
      analysisType,
      code
    });

    // Validate and sanitize AI response structure
    const validatedResult = sanitizeAIResult(rawResult, difficulty, code);

    // Save record to database / storage
    const savedRecord = await storageService.saveAnalysis({
      userId: userId || 'anonymous_user',
      language,
      difficulty,
      analysisType,
      originalCode: code,
      result: validatedResult
    });

    return res.status(200).json({
      success: true,
      analysisId: savedRecord._id,
      result: validatedResult
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/history
 * Retrieve recent analyses
 */
export async function getHistory(req, res, next) {
  try {
    const { limit = 20, language, difficulty } = req.query;
    const history = await storageService.getHistory({ limit, language, difficulty });

    return res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/history/:id
 * Retrieve specific analysis details
 */
export async function getAnalysisById(req, res, next) {
  try {
    const { id } = req.params;
    const record = await storageService.getById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Analysis record not found'
      });
    }

    return res.status(200).json({
      success: true,
      analysis: record
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/history/:id
 * Delete analysis by ID
 */
export async function deleteAnalysis(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await storageService.deleteById(id);

    return res.status(200).json({
      success: true,
      message: deleted ? 'Record deleted successfully' : 'Record not found or already deleted'
    });
  } catch (error) {
    next(error);
  }
}
