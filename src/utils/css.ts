export function hexToRgba(hex: string, alpha: number) {
    return `rgba(${Number.parseInt(hex.slice(1, 3), 16)},${Number.parseInt(hex.slice(3, 5), 16)},${Number.parseInt(hex.slice(5, 7), 16)},${alpha})`;
}
