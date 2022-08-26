import { Bomb, Collected, EnemyKilled, Shot,  } from "./AudioEffect";
import { AudioTrack } from "./AudioTrack";

export const Audio = {
    "shot": new Shot(),
    "bomb": new Bomb(),
    "collected": new Collected(),
    "killed": new EnemyKilled()
} as const;