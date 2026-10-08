export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
