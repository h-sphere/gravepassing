import { rnd } from "../../utils/math";
import { Game } from "../Game";
import { Enemy } from "../GameObjects/Enemy";
import { RectangleObject } from "../GameObjects/Rectangle";
import { Point, Rectangle } from "../Primitives";
import { SceneSettings } from "../Scene/Scene";
import { SIZE } from "./Image";
import { Emoji } from "./Sprite";


const FN = (x: number, y: number, S: number) => (Math.sin(432.432*S + x * y - 3*y+Math.cos(x-y))+1)/2;

export interface EmojiList {
    e: Emoji,
    range: [number, number],
    asGameObject?: boolean,
}


export class Ground {
    private color = "#49A79C";
    constructor(private emojis: EmojiList[] = [], private seed: number) {
    }
    render(ctx: CanvasRenderingContext2D, bb: Rectangle, rawBB: Rectangle, s: SceneSettings, game: Game): void {
        // Check if there are already generated obstacles in the area.
        const areGenerated = !!game.gameObjects.getObjectsInArea(rawBB, "g").length; // we want to generate elements in new area, not the animated one.

        let generatedAnything = false;
        const m = SIZE * game.MULTIPLIER;
        bb.forEachCell((x, y, oX, oY) => {
            const p = FN(x,y, this.seed || 231);
            ctx.fillStyle = s.backgroundColor || this.color;
            ctx.fillRect(oX*m, oY*m, m, m);

            this.emojis.filter(e => !e.asGameObject).forEach(e => {
                if (p > e.range[0] && p < e.range[1]) {
                        e.e.render(ctx, oX *m, oY *m, m, m);
                }
            });
        });

        if (areGenerated) { return }
        rawBB.forEachCell((x,y,oX,oY) => {
            this.emojis.filter(e => e.asGameObject).forEach(e => {
                const p = FN(x,y, this.seed || 231);
                if (p > e.range[0] && p < e.range[1]) {
                    const obj = new RectangleObject(new Point(x, y), e.e, ["g","o"]); // Tag: generated + obstacle
                    game.gameObjects.add(obj);           
                    generatedAnything = true;   
                }
            });
        });

        // GENERATE GAME OBJECTS IF NEEDED.
        if (generatedAnything) { // making sure we don't generate infinitly enemies on empty patches.
            const g = FN(rawBB.p1.x+0.424, rawBB.p1.y+0.2, this.seed+4324);
            const generatingNr = Math.round(g * 5);
            for(let i=0;i<generatingNr;i++) {
                const s = game.settings;
                
                // Base on difficulty
                const value = s.difficulty * 50+50;
                let lifes = s.difficulty + 1;
                if (rnd() < s.difficulty * 0.1) {
                    lifes++;
                }

                let d=game.player.lvl;
                while(d > 0) {
                    if(rnd() < s.difficulty * 0.1) {
                        lifes++;
                    }
                    d-=10;
                }

                const p = rawBB.p1.add(rnd()*rawBB.width, rnd()*rawBB.height);
                const sprite = game.sceneSettings.enemies[Math.floor(rnd()*game.sceneSettings.enemies.length)];
                game.gameObjects.add(new Enemy(
                    sprite,
                    value, p, lifes + (sprite.u.scale > 1 ? 2 : 0), 1500 - game.settings.difficulty * 550));
            }
        }
    }
}