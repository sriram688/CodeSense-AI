import request from 'supertest';
import app from '../src/server.js';
import mongoose from 'mongoose';

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});

describe('AI Code Explanation Assistant - Academic Test Cases', () => {

  // TEST 1: Python syntax error
  test('TEST 1: Python syntax error - Identifies missing closing parenthesis', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        language: 'Python',
        difficulty: 'beginner',
        analysisType: 'explain-fix',
        code: 'print("Hello"'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result).toBeDefined();
    expect(res.body.result.identified_issue.toLowerCase() + res.body.result.summary.toLowerCase()).toMatch(/parenthesis|\)/);
    expect(res.body.result.corrected_code).toContain('print("Hello")');
  });

  // TEST 2: Python NameError
  test('TEST 2: Python NameError - Explains variable x is not defined', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        language: 'Python',
        difficulty: 'beginner',
        analysisType: 'explain-error',
        code: 'print(x)'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.summary.toLowerCase() + res.body.result.identified_issue.toLowerCase()).toMatch(/nameerror|defined|referenced|assigned/);
    expect(res.body.result.corrected_code).toContain('x =');
  });

  // TEST 3: Correct Python code
  test('TEST 3: Correct Python code - Reports code is correct and explains it', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        language: 'Python',
        difficulty: 'beginner',
        analysisType: 'explain-code',
        code: 'name = "Sri"\nprint(name)'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.summary.toLowerCase()).toContain('correct');
    expect(res.body.result.example_output).toBe('Sri');
  });

  // TEST 4: JavaScript error
  test('TEST 4: JavaScript error - Explains ReferenceError / undeclared variable', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        language: 'JavaScript',
        difficulty: 'intermediate',
        analysisType: 'explain-fix',
        code: 'console.log(name);'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.identified_issue.toLowerCase() + res.body.result.why_it_happens.toLowerCase()).toMatch(/declared|scope|referenceerror|window\.name/);
    expect(res.body.result.corrected_code).toMatch(/const|let|var/);
  });

  // TEST 5: C++ syntax error
  test('TEST 5: C++ syntax error - Identifies missing semicolon', async () => {
    const cppCode = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello"
    return 0;
}`;

    const res = await request(app)
      .post('/api/analyze')
      .send({
        language: 'C++',
        difficulty: 'beginner',
        analysisType: 'fix-code',
        code: cppCode
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.identified_issue.toLowerCase()).toContain('semicolon');
    expect(res.body.result.corrected_code).toContain('cout << "Hello";');
  });

  // TEST 6: Difficulty comparison (Beginner vs Intermediate)
  test('TEST 6: Difficulty comparison - Different explanation depth for identical code', async () => {
    const code = 'print("Hello"';

    const beginnerRes = await request(app)
      .post('/api/analyze')
      .send({
        language: 'Python',
        difficulty: 'beginner',
        analysisType: 'explain-code',
        code
      });

    const intermediateRes = await request(app)
      .post('/api/analyze')
      .send({
        language: 'Python',
        difficulty: 'intermediate',
        analysisType: 'explain-code',
        code
      });

    expect(beginnerRes.status).toBe(200);
    expect(intermediateRes.status).toBe(200);
    expect(beginnerRes.body.result.difficulty).toBe('beginner');
    expect(intermediateRes.body.result.difficulty).toBe('intermediate');
    expect(beginnerRes.body.result.why_it_happens).not.toEqual(intermediateRes.body.result.why_it_happens);
    expect(intermediateRes.body.result.why_it_happens.toLowerCase()).toMatch(/grammar|token|eof|delimiter|syntaxerror/);
  });

  // TEST 7: Optimization
  test('TEST 7: Optimization - Suggests simpler Python iteration (for number in numbers)', async () => {
    const code = `for i in range(len(numbers)):
    print(numbers[i])`;

    const res = await request(app)
      .post('/api/analyze')
      .send({
        language: 'Python',
        difficulty: 'intermediate',
        analysisType: 'optimize-code',
        code
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.corrected_code).toContain('for number in numbers:');
  });

  // TEST 8: Logical error
  test('TEST 8: Logical error - Identifies contradiction between condition and message', async () => {
    const code = `a = 10
b = 20

if a > b:
    print("a is smaller")`;

    const res = await request(app)
      .post('/api/analyze')
      .send({
        language: 'Python',
        difficulty: 'beginner',
        analysisType: 'explain-fix',
        code
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.result.identified_issue.toLowerCase()).toMatch(/contradict|greater|smaller|logic/);
    expect(res.body.result.corrected_code).toContain('if a < b:');
  });

  // API Validation tests
  test('Validation: Rejects unsupported language', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        language: 'Fortran',
        difficulty: 'beginner',
        analysisType: 'explain-code',
        code: 'some code'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('Validation: Rejects empty code input', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        language: 'Python',
        difficulty: 'beginner',
        analysisType: 'explain-code',
        code: '   '
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // History endpoint test
  test('History: Retrieves past analysis records', async () => {
    const res = await request(app).get('/api/history');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.history)).toBe(true);
    expect(res.body.history.length).toBeGreaterThan(0);
  });
});
