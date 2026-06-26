/**
 * Simple class name utility — joins truthy class strings.
 * Usage: cn('base-class', condition && 'conditional-class', 'another-class')
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
