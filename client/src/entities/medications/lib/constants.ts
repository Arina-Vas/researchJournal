// Keep MAX_PAGE_SIZE in sync with server/src/controllers/medicationController.ts
export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [6, 12] as const;
export const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];
export const DEFAULT_PAGE = 1;
