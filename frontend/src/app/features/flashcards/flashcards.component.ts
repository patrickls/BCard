import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbService } from '../../core/services/verb.service';
import { FlashcardState, Verb } from './models/verb.model';
import { FlashcardItemComponent } from './components/flashcard-item/flashcard-item.component';

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [CommonModule, FlashcardItemComponent],
  templateUrl: './flashcards.component.html',
  styleUrl: './flashcards.component.scss',
})
export class FlashcardsComponent implements OnInit {
  private verbService = inject(VerbService);

  cardStates: FlashcardState[] = [];
  loading: boolean = false;
  error: string | null = null;

  ngOnInit(): void {
    this.startNewRound();
  }

  startNewRound(): void {
    this.loading = true;
    this.error = null;

    this.verbService.getRandomVerbs(3).subscribe({
      next: (verbs: Verb[]) => {
        this.cardStates = verbs.map((verb) => ({
          verb,
          answers: { translation: '', pastSimple: '', pastParticiple: '' },
          isFlipped: false,
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar rodada:', err);
        this.error = 'Não foi possível carregar os verbos. Tente novamente.';
        this.loading = false;
      },
    });
  }

  onStateChange(index: number, newState: FlashcardState): void {
    this.cardStates[index] = newState;
  }

  trackByCard(_index: number, card: FlashcardState): string {
    return card.verb.infinitive;
  }

  /**
   * Retorna o total de acertos acumulados entre os cards já virados nesta rodada (máximo 9).
   */
  get roundScore(): number {
    let hits = 0;
    for (const card of this.cardStates) {
      if (card.isFlipped && card.result) {
        if (card.result.translationCorrect) hits++;
        if (card.result.pastSimpleCorrect) hits++;
        if (card.result.pastParticipleCorrect) hits++;
      }
    }
    return hits;
  }

  /**
   * Quantidade de cards conferidos/virados até o momento.
   */
  get flippedCardsCount(): number {
    return this.cardStates.filter((c) => c.isFlipped).length;
  }
}
