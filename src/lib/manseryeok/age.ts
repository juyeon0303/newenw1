/** 만나이(국제 나이) — 생일 기준 */
export function internationalAge(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  atYear: number,
  atMonth: number,
  atDay: number,
): number {
  let age = atYear - birthYear;
  if (atMonth < birthMonth || (atMonth === birthMonth && atDay < birthDay)) {
    age -= 1;
  }
  return Math.max(0, age);
}
