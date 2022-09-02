// Helper to have .setValueAtTime only once in the code.
export const sV = (p: AudioParam, v: number, t: number) => p.setValueAtTime(v, t);
export const sR = (p: AudioParam, v: number, t: number) => p.linearRampToValueAtTime(v, t);