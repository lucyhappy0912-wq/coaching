import type { Answers, CheckScores } from "./compute";

export type CheckRecord = {
  id: string;
  createdAt: string;
  instrument: "founder-transition-check";
  instrumentVersion: string;
  answers: Answers;
  identity: {
    name: string;
    phone: string;
    email: string;
    contactConsent: boolean;
    consentAt: string;
    consentVersion: string;
  };
  resultTokenHash: string;
  source: string;
  purgeAt: string;
  scores: Pick<CheckScores, "total" | "band" | "areas">;
};

export type CheckListItem = {
  id: string;
  createdAt: string;
  nameMasked: string;
  phoneMasked: string;
  emailMasked: string;
  band: CheckScores["band"];
  total: number;
  source: string;
  contactConsent: boolean;
};

export type NewCheckInput = {
  answers: Answers;
  name: string;
  phone: string;
  email: string;
  contactConsent: boolean;
  source: string;
};
