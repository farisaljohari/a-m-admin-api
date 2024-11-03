export function differenceInSeconds(date1: Date, date2: Date): number {
  const diffInMilliseconds = date1.getTime() - date2.getTime();
  return Math.floor(diffInMilliseconds / 1000);
}
