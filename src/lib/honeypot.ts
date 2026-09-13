/** 브라우저 자동완성이 잘 채우지 않는 허니팟 필드명 */
export const HONEYPOT_FIELD = "hp_leave_blank";

export function honeypotFilled(formData: FormData) {
  return String(formData.get(HONEYPOT_FIELD) ?? "").trim().length > 0;
}
