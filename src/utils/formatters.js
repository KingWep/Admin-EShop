/**
 * Format a number as USD currency.
 * @param {number} amount
 * @returns {string} e.g. "$1,234.00"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string or Date object.
 * @param {string|Date} date
 * @returns {string} e.g. "Jun 13, 2026"
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Format a date with time.
 * @param {string|Date} date
 * @returns {string} e.g. "Jun 13, 2026, 10:30 AM"
 */
export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Format a compact number.
 * @param {number} num
 * @returns {string} e.g. "1.2K", "3.4M"
 */
export function formatCompact(num) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

/**
 * Format percentage with sign.
 * @param {number} value
 * @returns {string} e.g. "+12.5%" or "-3.2%"
 */
export function formatPercent(value) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
