import type { PauseAnswers, PauseScores } from "./compute";

export type PauseRecord = {
  id: string;
  createdAt: string;
  instrument: "pause-check";
  instrumentVersion: string;
  answers: PauseAnswers;
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
  scores: Pick<PauseScores, "total" | "band">;
};

export type PauseListItem = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  band: PauseScores["band"];
  total: number;
  source: string;
  contactConsent: boolean;
};

export type NewPauseInput = {
  answers: PauseAnswers;
  name: string;
  phone: string;
  email: string;
  contactConsent: boolean;
  source: string;
};
