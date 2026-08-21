import { Component, ElementRef, OnInit, computed, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbService } from '../../core/services/verb.service';
import { SessionGamificationService } from '../../core/services/session-gamification.service';
import { FlashcardState, Verb } from './models/verb.model';
import { FlashcardItemComponent } from './components/flashcard-item/flashcard-item.component';

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [CommonModule, FlashcardItemComponent],
  templateUrl: './flashcards.component.html',
  styleUrl: './flashcards.component.scss',
  providers: [SessionGamificationService],
})
export class FlashcardsComponent implements OnInit {
  private verbService = inject(VerbService);
  sessionService = inject(SessionGamificationService);

  cardStates = signal<FlashcardState[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedList = signal<string | null>(null);

  /**
   * Ids já exibidos no ciclo atual, por escopo (chave da lista, ou '__ALL__' para "Todos").
   * Garante que um verbo não repita dentro do escopo até todos já terem sido mostrados.
   */
  private shownVerbIdsByScope = new Map<string, Set<string>>();

  private summaryDialog = viewChild<ElementRef<HTMLElement>>('summaryDialog');

  constructor() {
    // Foca o modal ao abrir, para leitores de tela e navegação por teclado
    effect(() => {
      if (this.sessionService.showSummaryModal()) {
        queueMicrotask(() => this.summaryDialog()?.nativeElement.focus());
      }
    });
  }

  ngOnInit(): void {
    this.startNewRound();
  }

  selectList(list: string | null): void {
    if (this.selectedList() !== list) {
      this.selectedList.set(list);
      this.startNewRound();
    }
  }

  private scopeKey(): string {
    return this.selectedList() ?? '__ALL__';
  }

  startNewRound(): void {
    this.loading.set(true);
    this.error.set(null);

    const scopeKey = this.scopeKey();
    const excludeIds = Array.from(this.shownVerbIdsByScope.get(scopeKey) ?? []);

    this.verbService.getRandomVerbs(3, this.selectedList(), excludeIds).subscribe({
      next: ({ verbs, cycleReset }: { verbs: Verb[]; cycleReset: boolean }) => {
        const shownIds = cycleReset ? new Set<string>() : new Set(this.shownVerbIdsByScope.get(scopeKey) ?? []);
        verbs.forEach((verb) => shownIds.add(verb.id));
        this.shownVerbIdsByScope.set(scopeKey, shownIds);

        this.cardStates.set(
          verbs.map((verb) => ({
            verb,
            answers: { translation: '', pastSimple: '', pastParticiple: '' },
            isFlipped: false,
          }))
        );
        this.sessionService.recordRoundStart();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar rodada:', err);
        this.error.set('Não foi possível carregar os verbos. Tente novamente.');
        this.loading.set(false);
      },
    });
  }

  onStateChange(index: number, newState: FlashcardState): void {
    const previous = this.cardStates()[index];

    // Card acabou de ser virado (travado) agora — soma na contagem de sessão
    if (previous && !previous.isFlipped && newState.isFlipped && newState.result) {
      const { translationCorrect, pastSimpleCorrect, pastParticipleCorrect } = newState.result;
      const correctInCard = [translationCorrect, pastSimpleCorrect, pastParticipleCorrect].filter(
        Boolean
      ).length;

      this.sessionService.recordFieldsChecked(3, correctInCard);
    }

    this.cardStates.update((states) => states.map((s, i) => (i === index ? newState : s)));
  }

  trackByCard(_index: number, card: FlashcardState): string {
    return card.verb.infinitive;
  }

  /**
   * Retorna o total de acertos acumulados entre os cards já virados nesta rodada (máximo 9).
   */
  roundScore = computed(() => {
    let hits = 0;
    for (const card of this.cardStates()) {
      if (card.isFlipped && card.result) {
        if (card.result.translationCorrect) hits++;
        if (card.result.pastSimpleCorrect) hits++;
        if (card.result.pastParticipleCorrect) hits++;
      }
    }
    return hits;
  });

  /**
   * Quantidade de cards conferidos/virados até o momento.
   */
  flippedCardsCount = computed(() => this.cardStates().filter((c) => c.isFlipped).length);
}
