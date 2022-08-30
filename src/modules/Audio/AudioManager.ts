import { Bomb, Collected, EnemyKilled, Shot,  } from "./AudioEffect";

let tracks: any = null;
export const getAudio = (x: string) => {
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