import { ChallengeType, Difficulty, Language } from '../types';

export type Challenge = {
  id: string;
  type: ChallengeType;
  difficulty: Difficulty;
  language: Language;
  content: string;
};

// Import your static data
import challenges from './challenges.json';

// Explicitly type the import for safety
const typedChallenges: Challenge[] = challenges.map((c: any) => ({
  ...c,
  type: c.type as ChallengeType,
  difficulty: c.difficulty as Difficulty,
  language: c.language as Language,
}));

type ChallengeOptions = {
  isStealFailure?: boolean;
};

export const getRandomChallenge = (
  type: ChallengeType,
  difficulty: Difficulty,
  language: Language,
  options: ChallengeOptions = {}
): string => {
  const filtered = typedChallenges.filter(c =>
    c.type.toUpperCase() === type.toUpperCase() &&
    c.difficulty.toUpperCase() === difficulty.toUpperCase() &&
    c.language.toUpperCase() === language.toUpperCase()
  );

  if (filtered.length === 0) {
    return '⚠️ No available challenges for this configuration.';
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  let selected = filtered[randomIndex].content;

  if (options.isStealFailure && type === ChallengeType.DARE) {
    selected += ' 💥 This is your punishment for failing to steal!';
  }

  return selected;
};
