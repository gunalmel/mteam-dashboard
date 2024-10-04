export function areAllNullOrEmpty(...args: (string | null | undefined)[]): boolean {
  return args.every(arg => arg === null || arg === undefined || arg === '');
}

export function isAnyNotNullOrEmpty(...args: (string | null | undefined)[]): boolean {
  return args.some(arg => arg !== null && arg !== undefined && arg !== '');
}
