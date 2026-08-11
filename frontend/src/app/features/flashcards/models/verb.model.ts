export interface Verb {
  id: string;
  portuguese: string;
  infinitive: string;
  pastSimple: string;
  pastParticiple: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CardAnswers {
  translation: string;
  pastSimple: string;
  pastParticiple: string;
}

export interface FieldResult {
  translationCorrect: boolean;
  pastSimpleCorrect: boolean;
  pastParticipleCorrect: boolean;
}

export interface FlashcardState {
  verb: Verb;
  answers: CardAnswers;
  isFlipped: boolean;
  result?: FieldResult;
}
