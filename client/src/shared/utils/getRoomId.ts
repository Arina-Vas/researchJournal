export const getRoomId = (a: string, b: string): string => [a, b].sort().join('_');

export const getPeerId = (room: string, myId: string): string | undefined => room.split('_').find(id => id !== myId);
