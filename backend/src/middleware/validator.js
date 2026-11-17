import { z } from 'zod';

const allowedLanguages = ['python', 'java', 'c', 'c++', 'javascript', 'html', 'css', 'sql'];
const allowedDifficulties = ['beginner', 'intermediate'];
const allowedAnalysisTypes = [
  'explain-code',
  'explain-error',
  'fix-code',
  'optimize-code',
  'explain-fix',
  'explain code',
  'explain error',
  'fix code',
  'optimize code',
  'explain + fix'
];

export const analysisRequestSchema = z.object({
  language: z
    .string({ required_error: 'Language is required' })
    .trim()
    .refine(val => allowedLanguages.includes(val.toLowerCase()), {
      message: 'Supported languages are: Python, Java, C, C++, JavaScript, HTML, CSS, SQL'
    }),
  difficulty: z
    .string({ required_error: 'Difficulty is required' })
    .trim()
    .refine(val => allowedDifficulties.includes(val.toLowerCase()), {
      message: 'Difficulty must be either "beginner" or "intermediate"'
    }),
  analysisType: z
    .string({ required_error: 'Analysis type is required' })
    .trim()
    .refine(val => allowedAnalysisTypes.includes(val.toLowerCase()), {
      message: 'Analysis type must be one of: explain-code, explain-error, fix-code, optimize-code, explain-fix'
    }),
  code: z
    .string({ required_error: 'Code or error message is required' })
    .trim()
    .min(1, 'Code or error message cannot be empty')
    .max(15000, 'Input exceeds maximum allowed size of 15,000 characters')
});

export function validateAnalysisInput(req, res, next) {
  const result = analysisRequestSchema.safeParse(req.body);
  if (!result.success) {
    const errorDetails = result.error.errors.map(err => err.message).join(', ');
    return res.status(400).json({
      success: false,
      error: errorDetails
    });
  }

  // Normalize parsed fields onto req.body
  req.body.language = result.data.language;
  req.body.difficulty = result.data.difficulty.toLowerCase();
  req.body.analysisType = result.data.analysisType.toLowerCase().replace(/\s+/g, '-').replace('+', '');
  req.body.code = result.data.code;

  next();
}
