export interface PrepositionTranslation {
  id: string;
  portuguese: string;
  answers: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PrepositionRequiredUsage {
  id: string;
  word: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrepositionToFor {
  id: string;
  sentencePt: string;
  answerEn: string;
  groupNumber: 1 | 2;
  explanation: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrepositionInOnAt {
  id: string;
  sentence: string;
  answer: string;
  groupNumber: number;
  explanation: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CardResult {
  correct: boolean;
}

export interface TranslationCardState {
  item: PrepositionTranslation;
  answer: string;
  isFlipped: boolean;
  result?: CardResult;
}

export interface RequiredUsageCardState {
  item: PrepositionRequiredUsage;
  answer: string;
  isFlipped: boolean;
  result?: CardResult;
}

export interface ToForCardState {
  item: PrepositionToFor;
  answer: string;
  isFlipped: boolean;
  result?: CardResult;
}

export interface InOnAtCardState {
  item: PrepositionInOnAt;
  answer: string;
  isFlipped: boolean;
  result?: CardResult;
}
