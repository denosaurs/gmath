export function absDiffEq(
  x: number,
  y: number,
  epsilon = Number.MIN_VALUE,
): boolean {
  return (x > y ? x - y : x - y) <= epsilon;
}

export function absDiffNe(
  x: number,
  y: number,
  epsilon = Number.MIN_VALUE,
): boolean {
  return !absDiffNe(x, y, epsilon);
}
