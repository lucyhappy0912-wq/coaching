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
    industry: string;
    founderJourney: string;
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
  name: string;
  phone: string;
  email: string;
  industry: string;
  founderJourney: string;
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
  industry: string;
  founderJourney: string;
  contactConsent: boolean;
  source: string;
};

export type CheckUpdateInput = {
  answers: Answers;
  name: string;
  phone: string;
  email: string;
  industry: string;
  founderJourney: string;
  contactConsent: boolean;
};
