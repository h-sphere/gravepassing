import { alt, tux, win } from "../Assets/EmojiAlternatives";
import { EmojiSet } from "./Sprite";

let emojiCanvas: HTMLCanvasElement;
let emojiCtx: CanvasRenderingContext2D;

const isKeyOf = <T extends string>(k: string, r: Record<T, any>): k is T => {
    return k in r;
}

export const isEmojiRendering = (emoji: string) => {
    if (!emojiCanvas) {
        emojiCanvas = document.createElement('canvas');
        emojiCanvas.width = emojiCanvas.height = 20;
        emojiCtx = emojiCanvas.getContext('2d')!;
        emojiCtx.font = '20px Arial';
    }
    emojiCtx.clearRect(0, 0, 20, 20);
    emojiCtx.fillText(emoji, 0, 0);
    const data = emojiCtx.getImageData(0, 0, 20, 20);
    return data.data.findIndex(e => e > 0) > 0;
}

export const convertEmoji = (e: EmojiSet) => {
    if (isKeyOf(e.emoji, alt) && !isEmojiRendering(e.emoji)) {
        const pos = alt[e.emoji].pos || [0,0];
        e = {
            ...e,
            emoji: alt[e.emoji].emoji || e.emoji,
            pos: [e.pos[0] + pos[0], e.pos[1]+ pos[1]],
            size: (alt[e.emoji].size || 1) * e.size
        }
    }
    if (navigator.platform.startsWith("Win") && isKeyOf(e.emoji,win)) {
        const pos = win[e.emoji].pos || [0,0];
        e = {
            ...e,
            emoji: win[e.emoji].emoji || e.emoji,
            pos: [e.pos[0] + pos[0], e.pos[1]+ pos[1]],
            size: (win[e.emoji].size || 1) * e.size,
        }
    }
    if (navigator.platform.indexOf('Linux') >= 0 && isKeyOf(e.emoji, tux)) {
        e = {
            ...e,
            emoji: tux[e.emoji].emoji || e.emoji,
            pos: tux[e.emoji].pos || e.pos,
            size: (tux[e.emoji].size || 1) * e.size,
        }
    }
    return e;
}