import { describe, expect, it } from "vitest";
import {
  applyXp,
  calculateReward,
  categoryAttributes,
  shouldDropItem,
} from "./game";

describe("game rules", () => {
  it("levels up when XP passes the next level threshold", () => {
    expect(applyXp({ level: 1, xp: 110 }, 20)).toEqual({ level: 2, xp: 10 });
  });

  it("calculates difficulty and estimate based rewards", () => {
    expect(calculateReward({ difficulty: "hard", estimate: 60 })).toEqual({
      xp: 95,
      coins: 32,
    });
  });

  it("maps quest categories to character attributes", () => {
    expect(categoryAttributes.health).toBe("vitality");
    expect(categoryAttributes.creativity).toBe("craft");
    expect(categoryAttributes.order).toBe("discipline");
  });

  it("uses deterministic item drops for stable rewards", () => {
    expect(shouldDropItem("abc", 0)).toBe(true);
    expect(shouldDropItem("abc", 1)).toBe(false);
  });
});
