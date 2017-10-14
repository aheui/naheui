const reflect = 'reflect'

module.exports.x = [
    // 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
    1, undefined, 2, undefined, -1,
    // 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
    undefined, -2, undefined, 0, undefined,
    // 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
    undefined, undefined, 0, 0, undefined,
    // 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
    undefined, undefined, 0, undefined, reflect,
    // 'ㅣ'
    reflect
]

module.exports.y = [
    // 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
    0, undefined, 0, undefined, 0,
    // 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
    undefined, 0, undefined, -1, undefined,
    // 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
    undefined, undefined, -2, 1, undefined,
    // 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
    undefined, undefined, 2, reflect, reflect,
    // 'ㅣ'
    undefined
]
