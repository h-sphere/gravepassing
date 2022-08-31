import { alt, tux, win } from "../Assets/EmojiAlternatives";
import { EmojiSet } from "./Sprite";

let emojiCanvas;
let emojiCtx;
export const isEmojiRendering = (emoji: string) => {
    if (!emojiCanvas) {
        emojiCanvas = document.createElement('canvas');
        emojiCanvas.width = emojiCanvas.height = 20;
        emojiCtx = emojiCanvas.getContext('2d')!;
        emojiCtx.font = '20px Arial';
        document.body.appendChild(emojiCanvas);
    }
    console.log("IS REDERING?");
    emojiCtx.clearRect(0, 0, 20, 20);
    emojiCtx.fillText(emoji, 0, 0);
    const data = emojiCtx.getImageData(0, 0, 20, 20);
    console.log(data);
    return data.data.findIndex(e => e > 0) > 0;
}

export const convertEmoji = (e: EmojiSet) => {
    if (e.emoji in alt && !isEmojiRendering(e.emoji)) {
        console.log(`USING ALTERNATIVE FOR ${e.emoji} -> ${alt[e.emoji].emoji}`);
        e = {
            emoji: alt[e.emoji].emoji,
            pos: alt[e.emoji].pos || e.pos,
            size: (alt[e.emoji].size || 1) * e.size
        }
    }
    // FIXME: system overrides here:
    if (navigator.platform.startsWith("Win") && e.emoji in win) {
        console.log(`Using alternative for windows ${e.emoji} -> ${win[e.emoji].emoji}`);
        e = {
            emoji: win[e.emoji].emoji,
            pos: win[e.emoji].pos || e.pos,
            size: (win[e.emoji].size || 1) * e.size,
        }
    }
    if (navigator.platform.indexOf('Linux') >= 0) {
        console.log(`Using alternative for linux ${e.emoji} -> ${tux[e.emoji].emoji}`);
        e = {
            emoji: tux[e.emoji].emoji,
            pos: tux[e.emoji].pos || e.pos,
            size: (tux[e.emoji].size || 1) * e.size,
        }
    }
    return e;
}