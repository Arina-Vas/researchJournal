export const MEDICATIONS_COLUMNS = [
  { key: 'name', title: 'Name', isSortable: true },
  { key: 'location', title: 'Location', isSortable: true },
  { key: 'startDate', title: 'Start date', isSortable: true },
  { key: 'endDate', title: 'End date', isSortable: true },
  { key: 'successReaction', title: 'Success reaction', isSortable: true },
  { key: 'process', title: 'Process', isSortable: false },
  { key: 'status', title: 'Status', isSortable: false },
] as const;
