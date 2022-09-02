interface OptionalEmojiSet {
    // EMOJI
    emoji?: string;
    // POS
    pos?: [number, number];
    // SIZE
    size?: number;
}

export const alt: Record<string, OptionalEmojiSet> = {
    "🪦": { emoji: "⚰️", pos: [0, 4], size: .9},
    "⛓": { emoji: "👖" },
    "🪨": { emoji: "💀" },
    "🪵": { emoji: "🌳" },
    "🦴": { emoji: "💀" }
}


export const win: Record<string, OptionalEmojiSet> = {
    "🔥": { pos: [1, -1], size: 1 },
    "💣": { pos: [-1, -2]},
    "👱": { pos: [-1, 0]},
    "🕶": { size: 1.5, pos: [-1, -1]},
    "⬛️": { pos: [-1, 0]},
    "👖": { pos: [-0.5, 0]},
    "🐷": { pos: [-1, 0]},
    "🦋": { pos: [-1, 0]},
    "🐮": { pos: [-1, 0]},
    "👔": { pos: [-1, 0]},
    "👩": { pos: [-1, 0]},
    "🤖": { pos: [-1, 0]},
    "👚": { pos: [-1, 0]},
    "🐵": { pos: [-1, 0]},
    "☢️":  { pos: [5, 0]},
    "👹": { pos: [-2, 1]}
}

export const tux: Record<string, OptionalEmojiSet> = {
    "🧧": { emoji: "👔" }
}