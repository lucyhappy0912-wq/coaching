export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/** 입력 중 010-1234-5678 형태로 맞춤. */
export function formatMobileInput(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/** 01X + 7~8자리. 00000000000 처럼 같은 숫자만 반복하면 거절. */
export function isKoreanMobile(value: string) {
  const phone = digitsOnly(value);
  if (!/^01[016789]\d{7,8}$/.test(phone)) return false;
  if (/^(\d)\1+$/.test(phone)) return false;
  return true;
}
