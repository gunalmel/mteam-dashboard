export function findMaxValue(arr:number[]) {
  let maxValue = -Infinity;
  for (const key in arr) {
    if (arr[key] > maxValue) {
      maxValue = arr[key];
    }
  }
  return maxValue;
}
