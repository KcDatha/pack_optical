import { describe, it, expect } from 'vitest';
import { QUIZ, QUIZ_MAX, quizVerdict, scoreAnswers, frameAdvice, FACE_SHAPES, insuranceAnswer, INSURANCE_OPTIONS } from '../../src/lib/tools';

describe('dry eye quiz', () => {
  it('has 5 questions with 3 options each, max score 10', () => {
    expect(QUIZ).toHaveLength(5); expect(QUIZ_MAX).toBe(10);
    QUIZ.forEach((q) => expect(q.options.map((o) => o.score)).toEqual([0, 1, 2]));
  });
  it('scores answers by option index', () => {
    expect(scoreAnswers([0, 0, 0, 0, 0])).toBe(0);
    expect(scoreAnswers([2, 2, 2, 2, 2])).toBe(10);
    expect(scoreAnswers([1, 2, 0, 1, 2])).toBe(6);
  });
  it('verdict thresholds: 0-2 mild, 3-6 moderate, 7-10 significant', () => {
    expect(quizVerdict(0).level).toBe('mild'); expect(quizVerdict(2).level).toBe('mild');
    expect(quizVerdict(3).level).toBe('moderate'); expect(quizVerdict(6).level).toBe('moderate');
    expect(quizVerdict(7).level).toBe('significant'); expect(quizVerdict(10).level).toBe('significant');
  });
});

describe('frame guide', () => {
  it('has advice for all four shapes and none for unknown', () => {
    expect(FACE_SHAPES.sort()).toEqual(['heart', 'oval', 'round', 'square']);
    FACE_SHAPES.forEach((s) => expect(frameAdvice(s)?.t).toBeTruthy());
    expect(frameAdvice('triangle')).toBeNull();
  });
});

describe('insurance checker', () => {
  it('every option has an answer', () => {
    expect(INSURANCE_OPTIONS).toHaveLength(14);
    INSURANCE_OPTIONS.forEach((o) => expect(insuranceAnswer(o.value)).toBeTruthy());
  });
  it('unknown plan returns null', () => expect(insuranceAnswer('nope')).toBeNull());
});
