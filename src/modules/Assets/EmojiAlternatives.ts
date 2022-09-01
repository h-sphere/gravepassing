interface OptionalEmojiSet {
    emoji: string;
    pos?: [number, number];
    size?: number;
}

export const alt: Record<string, OptionalEmojiSet> = {
    "🪦": { emoji: "⚰️", pos: [0, 4], size: 0.9},
    "⛓": { emoji: "👖" },
}


export const win: Record<string, OptionalEmojiSet> = {
    "🔥": { emoji: "🔥", pos: [0, 2], size: 1 }
}

export const tux: Record<string, OptionalEmojiSet> = {
}