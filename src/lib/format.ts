export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts
    }).format(new Date(date));
  } catch (_err) {
    return '';
  }
}

export function formatViewCount(viewCount: string | undefined | null): string {
  if (!viewCount) return '0';

  // Remove any commas and convert to number
  const cleanCount = viewCount.replace(/,/g, '');
  const num = parseInt(cleanCount);

  if (isNaN(num)) return viewCount;

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  return num.toLocaleString();
}
