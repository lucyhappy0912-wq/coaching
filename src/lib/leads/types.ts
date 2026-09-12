export type LeadStatus = "new" | "contacted" | "closed";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  preferredTime: string;
  message: string;
  status: LeadStatus;
  receivedAt: string;
  closedAt: string;
  purgeAt: string;
  consentVersion: string;
};

export type LeadListItem = {
  id: string;
  name: string;
  phone: string;
  preferredTime: string;
  message: string;
  status: LeadStatus;
  receivedAt: string;
};
