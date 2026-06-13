export type Difficulty = "easy" | "normal" | "hard" | "epic";

export type Category =
  | "learning"
  | "work"
  | "health"
  | "creativity"
  | "social"
  | "order";

export type AttributeKey =
  | "focus"
  | "vitality"
  | "craft"
  | "connection"
  | "discipline";

export type CharacterProgress = {
  level: number;
  xp: number;
};

export type RewardInput = {
  difficulty: Difficulty;
  estimate: number;
};

export const difficultyRewards: Record<
  Difficulty,
  { xp: number; coins: number }
> = {
  easy: { xp: 20, coins: 8 },
  normal: { xp: 45, coins: 16 },
  hard: { xp: 80, coins: 28 },
  epic: { xp: 140, coins: 50 },
};

export const categoryAttributes: Record<Category, AttributeKey> = {
  learning: "focus",
  work: "discipline",
  health: "vitality",
  creativity: "craft",
  social: "connection",
  order: "discipline",
};

export function xpForNextLevel(level: number) {
  return 120 + (level - 1) * 80;
}

export function applyXp(character: CharacterProgress, xpGain: number) {
  let level = character.level;
  let xp = character.xp + xpGain;
  while (xp >= xpForNextLevel(level)) {
    xp -= xpForNextLevel(level);
    level += 1;
  }
  return { level, xp };
}

export function calculateReward(input: RewardInput) {
  const baseReward = difficultyRewards[input.difficulty];
  const estimatedBonus = Math.min(Math.floor(input.estimate / 20) * 5, 25);
  return {
    xp: baseReward.xp + estimatedBonus,
    coins: baseReward.coins + Math.floor(input.estimate / 15),
  };
}

export function shouldDropItem(questId: string, priorCompletionCount: number) {
  const idScore = Array.from(questId).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  return (idScore + priorCompletionCount) % 3 === 0;
}
