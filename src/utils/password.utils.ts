import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// ⬇️ 비밀번호를 평문으로 저장하지 않기 위한 해싱 유틸.
//    Node 내장 crypto의 scrypt(솔트+키 스트레칭)를 사용해 별도 의존성 설치 없이 동작한다.
//    저장 형식: "base64(salt):base64(hash)" (varchar(100) 안에 들어가도록 base64 사용)

const SALT_BYTES = 16;
const KEY_BYTES = 32;

export const hashPassword = (plain: string): string => {
    const salt = randomBytes(SALT_BYTES);
    const derived = scryptSync(plain, salt, KEY_BYTES);
    return `${salt.toString('base64')}:${derived.toString('base64')}`;
};

export const verifyPassword = (plain: string, stored: string): boolean => {
    const [saltB64, hashB64] = stored.split(':');
    if (!saltB64 || !hashB64) {
        return false;
    }
    const salt = Buffer.from(saltB64, 'base64');
    const expected = Buffer.from(hashB64, 'base64');
    const derived = scryptSync(plain, salt, expected.length);
    // ⬇️ 타이밍 공격을 막기 위해 timingSafeEqual로 상수 시간 비교한다.
    return expected.length === derived.length && timingSafeEqual(expected, derived);
};
