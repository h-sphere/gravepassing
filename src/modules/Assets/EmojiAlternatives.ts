interface OptionalEmojiSet {
    // EMOJI
    e?: string;
    // POS
    pos?: [number, number];
    // SIZE
    size?: number;
}

export const alt: Record<string, OptionalEmojiSet> = {
    "ðŠĶ": { e: "â°ïļ", pos: [0, 4], size: .9},
    "â": { e: "ð" },
    "ðŠĻ": { e: "ð" },
    "ðŠĩ": { e: "ðģ" },
    "ðĶī": { e: "ð" }
}


export const win: Record<string, OptionalEmojiSet> = {
    "ðĨ": { pos: [1, -1], size: 1 },
    "ðĢ": { pos: [-1, -2]},
    "ðą": { pos: [-1, 0]},
    "ðķ": { size: 1.5, pos: [-1, -1]},
    "âŽïļ": { pos: [-1, 0]},
    "ð": { pos: [-0.5, 0]},
    "ð·": { pos: [-1, 0]},
    "ðĶ": { pos: [-1, 0]},
    "ðŪ": { pos: [-1, 0]},
    "ð": { pos: [-1, 0]},
    "ðĐ": { pos: [-1, 0]},
    "ðĪ": { pos: [-1, 0]},
    "ð": { pos: [-1, 0]},
    "ðĩ": { pos: [-1, 0]},
    "âĒïļ":  { pos: [5, 0]},
    "ðđ": { pos: [-2, 1]}
}

export const tux: Record<string, OptionalEmojiSet> = {
    "ð§§": { e: "ð" }
}