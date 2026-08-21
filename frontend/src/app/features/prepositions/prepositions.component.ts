import { Component, ElementRef, OnInit, computed, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { PrepositionTranslationService } from '../../core/services/preposition-translation.service';
import { PrepositionRequiredUsageService } from '../../core/services/preposition-required-usage.service';
import { PrepositionToForService } from '../../core/services/preposition-to-for.service';
import { SessionGamificationService } from '../../core/services/session-gamification.service';
import { RequiredUsageCardState, ToForCardState, TranslationCardState } from './models/preposition.model';
import { PrepositionTranslationCardComponent } from './components/preposition-translation-card/preposition-translation-card.component';
import { PrepositionRequiredUsageCardComponent } from './components/preposition-required-usage-card/preposition-required-usage-card.component';
import { PrepositionToForCardComponent } from './components/preposition-to-for-card/preposition-to-for-card.component';

@Component({
  selector: 'app-prepositions',
  standalone: true,
  imports: [
    CommonModule,
    PrepositionTranslationCardComponent,
    PrepositionRequiredUsageCardComponent,
    PrepositionToForCardComponent,
  ],
  templateUrl: './prepositions.component.html',
  styleUrl: './prepositions.component.scss',
  providers: [SessionGamificationService],
})
export class PrepositionsComponent implements OnInit {
  private translationService = inject(PrepositionTranslationService);
  private requiredUsageService = inject(PrepositionRequiredUsageService);
  private toForService = inject(PrepositionToForService);
  sessionService = inject(SessionGamificationService);

  translationCard = signal<TranslationCardState | null>(null);
  requiredUsageCard = signal<RequiredUsageCardState | null>(null);
  toForCard = signal<ToForCardState | null>(null);

  loading = signal(false);
  error = signal<string | null>(null);

  // Ids já exibidos no ciclo atual, independentes por tipo (sem sub-escopo de lista)
  private shownTranslationIds = new Set<string>();
  private shownRequiredUsageIds = new Set<string>();
  private shownToForIds = new Set<string>();

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

  startNewRound(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      translation: this.translationService.getRandomRound(Array.from(this.shownTranslationIds)),
      requiredUsage: this.requiredUsageService.getRandomRound(Array.from(this.shownRequiredUsageIds)),
      toFor: this.toForService.getRandomRound(Array.from(this.shownToForIds)),
    }).subscribe({
      next: ({ translation, requiredUsage, toFor }) => {
        this.shownTranslationIds = this.updateShownIds(
          this.shownTranslationIds,
          translation.cycleReset,
          translation.item.id
        );
        this.shownRequiredUsageIds = this.updateShownIds(
          this.shownRequiredUsageIds,
          requiredUsage.cycleReset,
          requiredUsage.item.id
        );
        this.shownToForIds = this.updateShownIds(this.shownToForIds, toFor.cycleReset, toFor.item.id);

        this.translationCard.set({ item: translation.item, answer: '', isFlipped: false });
        this.requiredUsageCard.set({ item: requiredUsage.item, answer: '', isFlipped: false });
        this.toForCard.set({ item: toFor.item, answer: '', isFlipped: false });

        this.sessionService.recordRoundStart();
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar rodada de preposições:', err);
        this.error.set('Não foi possível carregar as preposições. Tente novamente.');
        this.loading.set(false);
      },
    });
  }

  private updateShownIds(current: Set<string>, cycleReset: boolean, newId: string): Set<string> {
    const shownIds = cycleReset ? new Set<string>() : new Set(current);
    shownIds.add(newId);
    return shownIds;
  }

  onTranslationStateChange(newState: TranslationCardState): void {
    const previous = this.translationCard();
    this.registerFieldCheck(previous?.isFlipped, newState);
    this.translationCard.set(newState);
  }

  onRequiredUsageStateChange(newState: RequiredUsageCardState): void {
    const previous = this.requiredUsageCard();
    this.registerFieldCheck(previous?.isFlipped, newState);
    this.requiredUsageCard.set(newState);
  }

  onToForStateChange(newState: ToForCardState): void {
    const previous = this.toForCard();
    this.registerFieldCheck(previous?.isFlipped, newState);
    this.toForCard.set(newState);
  }

  private registerFieldCheck(
    wasFlipped: boolean | undefined,
    newState: { isFlipped: boolean; result?: { correct: boolean } }
  ): void {
    // Card acabou de ser virado (travado) agora — soma na contagem de sessão (1 campo por card)
    if (!wasFlipped && newState.isFlipped && newState.result) {
      this.sessionService.recordFieldsChecked(1, newState.result.correct ? 1 : 0);
    }
  }

  /**
   * Total de acertos acumulados entre os cards já virados nesta rodada (máximo 3).
   */
  roundScore = computed(() => {
    let hits = 0;
    for (const card of [this.translationCard(), this.requiredUsageCard(), this.toForCard()]) {
      if (card?.isFlipped && card.result?.correct) hits++;
    }
    return hits;
  });

  /**
   * Quantidade de cards conferidos/virados até o momento.
   */
  flippedCardsCount = computed(() => {
    let count = 0;
    for (const card of [this.translationCard(), this.requiredUsageCard(), this.toForCard()]) {
      if (card?.isFlipped) count++;
    }
    return count;
  });
}
