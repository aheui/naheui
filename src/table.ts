// deno-fmt-ignore-file

export const choTable = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ",
  "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ",
  "ㅋ", "ㅌ", "ㅍ", "ㅎ",
] as const;

export const jungTable = [
  "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ",
  "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ",
  "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ",
  "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ",
  "ㅣ",
] as const;

export const jongTable = [
  "", "ㄱ", "ㄲ", "ㄳ", "ㄴ",
  "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ",
  "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ",
  "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ",
  "ㅌ", "ㅍ", "ㅎ",
] as const;

export const parameterCounts = [
  // ㄱ, ㄲ, ㄴ, ㄷ, ㄸ,
  0, 0, 2, 2, 2,
  // ㄹ, ㅁ, ㅂ, ㅃ, ㅅ,
  2, 1, 0, 1, 0,
  // ㅆ, ㅇ, ㅈ, ㅉ, ㅊ,
  1, 0, 2, 0, 1,
  // ㅋ, ㅌ, ㅍ, ㅎ
  0, 2, 2, 0,
] as const;

export const reflect = 1 << 8;
export const ignore = 2 << 8;

/**
 * 2byte 숫자들의 배열
 * hi 바이트는 타입을 담고, lo 바이트는 속도 정보를 담음
 *
 * hi 바이트는 세가지 타입을 가짐:
 * - 0: 일반적인 속도
 * - 1: 반사(reflect) 속도
 * - 2: 무시(ignore) 속도
 */
export const dxTable = [
  // ㅏ, ㅐ, ㅑ, ㅒ, ㅓ,
  1, ignore, 2, ignore, -1,
  // ㅔ, ㅕ, ㅖ, ㅗ, ㅘ,
  ignore, -2, ignore, 0, ignore,
  // ㅙ, ㅚ, ㅛ, ㅜ, ㅝ,
  ignore, ignore, 0, 0, ignore,
  // ㅞ, ㅟ, ㅠ, ㅡ, ㅢ,
  ignore, ignore, 0, ignore, reflect,
  // ㅣ
  reflect,
] as const;

// dxTable과 동일한 구조를 가짐
export const dyTable = [
  // ㅏ, ㅐ, ㅑ, ㅒ, ㅓ,
  0, ignore, 0, ignore, 0,
  // ㅔ, ㅕ, ㅖ, ㅗ, ㅘ,
  ignore, 0, ignore, -1, ignore,
  // ㅙ, ㅚ, ㅛ, ㅜ, ㅝ,
  ignore, ignore, -2, 1, ignore,
  // ㅞ, ㅟ, ㅠ, ㅡ, ㅢ,
  ignore, ignore, 2, reflect, reflect,
  // ㅣ
  ignore,
] as const;

export const strokeCountTable = [
  // , ㄱ, ㄲ, ㄳ, ㄴ,
  0, 2, 4, 4, 2,
  // ㄵ, ㄶ, ㄷ, ㄹ, ㄺ,
  5, 5, 3, 5, 7,
  // ㄻ, ㄼ, ㄽ, ㄾ, ㄿ,
  9, 9, 7, 9, 9,
  // ㅀ, ㅁ, ㅂ, ㅄ, ㅅ,
  8, 4, 4, 6, 2,
  // ㅆ, ㅇ, ㅈ, ㅊ, ㅋ,
  4, 1, 3, 4, 3,
  // ㅌ, ㅍ, ㅎ
  4, 4, 3,
] as const;
