export const LIFT_KIND = "LIFT";
export const LIFT_MESSAGE = "LIFT – Life Architecture";

export function isLiftLead(row: { preferredTime: string; message: string }) {
  return row.preferredTime === LIFT_KIND || row.message.startsWith(LIFT_MESSAGE);
}
