export const generateRange = (start: number, stop: number) => Array.from({ length: stop - start }, (_, i) => start + i);