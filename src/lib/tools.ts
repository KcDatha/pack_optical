import demo from '../data/demo-data.json';

export interface QuizOption { label: string; score: number }
export interface QuizQuestion { q: string; options: QuizOption[] }
export const QUIZ: QuizQuestion[] = demo.QUIZ.map((x) => ({ q: x.q, options: x.o.map((o) => ({ label: o[0] as string, score: o[1] as number })) }));
export const QUIZ_MAX = QUIZ.length * 2;

export interface QuizVerdict { level: 'mild' | 'moderate' | 'significant'; verdict: string; detail: string }

/** Score 0-10. 0-2 mild, 3-6 moderate, 7+ significant (thresholds from the demo). */
export function quizVerdict(score: number): QuizVerdict {
  if (score <= 2) return { level: 'mild', verdict: 'Mild — likely screen & environment related', detail: 'Occasional dryness. The 20-20-20 rule, a humidifier and preservative-free drops may be enough. If it persists past a month, come in — early gland problems are far easier to treat.' };
  if (score <= 6) return { level: 'moderate', verdict: 'Moderate — worth a proper evaluation', detail: 'This pattern is what we see when the oil glands start underperforming. Drops mask it; a Dry Eye Consultation finds it. IPL / RF only if it will genuinely help.' };
  return { level: 'significant', verdict: 'Significant — please book a Dry Eye Consultation', detail: 'Daily burning, watering and drop dependence at this level usually means meibomian gland dysfunction. We treat the cause with Lumecca IPL and Forma-I RF after a full evaluation.' };
}

export function scoreAnswers(choices: number[]): number {
  return choices.reduce((sum, c, i) => sum + (QUIZ[i]?.options[c]?.score ?? 0), 0);
}

export type FaceShape = 'round' | 'square' | 'oval' | 'heart';
export const FACE_SHAPES = Object.keys(demo.SHAPES) as FaceShape[];
export function frameAdvice(shape: string): { t: string; d: string } | null {
  return (demo.SHAPES as Record<string, { t: string; d: string }>)[shape] ?? null;
}

export const INSURANCE_OPTIONS: { value: string; label: string }[] = [
  ['vsp', 'VSP Vision Care'], ['eyemed', 'EyeMed'], ['bcbs', 'Blue Cross Blue Shield of Texas'], ['aetna', 'Aetna'], ['cigna', 'Cigna'],
  ['medicare', 'Medicare'], ['cec', 'Community Eye Care'], ['davis', 'Davis Vision'], ['medicaid', 'Medicaid (ages 20 and under)'],
  ['superior', 'Superior Vision'], ['tricare', 'Tricare'], ['uhc', 'United Healthcare'], ['other', 'Another plan / not listed'], ['none', 'No insurance — self-pay'],
].map(([value, label]) => ({ value, label }));
export function insuranceAnswer(plan: string): string | null {
  return (demo.INS as Record<string, string>)[plan] ?? null;
}
