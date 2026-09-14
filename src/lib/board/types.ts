export type BoardQuestion = {
  id: string;
  name: string;
  title: string;
  body: string;
  answer: string;
  /** true 면 공개글, false 면 비밀글 */
  published: boolean;
  passwordHash: string;
  views: number;
  createdAt: string;
  answeredAt: string;
};
