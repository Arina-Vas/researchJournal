export const getRoomId = (a: string, b: string): string => [a, b].sort().join('_');
