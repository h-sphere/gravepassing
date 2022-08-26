import { Bomb, Collected, EnemyKilled, Shot,  } from "./AudioEffect";
import { AudioTrack } from "./AudioTrack";

let tracks = null;

export const getAudio = (x) => {
    if (!tracks) {
        tracks = {
            "shot": new Shot(),
            "bomb": new Bomb(),
            "collected": new Collected(),
            "killed": new EnemyKilled()
        } as const;
    }
    return tracks[x];
}