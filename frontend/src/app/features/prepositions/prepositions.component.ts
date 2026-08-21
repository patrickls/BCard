import { Component, ElementRef, OnInit, computed, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin, of } from 'rxjs';
import { PrepositionTranslationService } from '../../core/services/preposition-translation.service';
import { PrepositionRequiredUsageService } from '../../core/services/preposition-required-usage.service';
import { PrepositionToForService } from '../../core/services/preposition-to-for.service';
import { PrepositionInOnAtService } from '../../core/services/preposition-in-on-at.service';
import { SessionGamificationService } from '../../core/services/session-gamification.service';
import {
  InOnAtCardState,
  PrepositionInOnAt,
  PrepositionRequiredUsage,
  PrepositionToFor,
  PrepositionTranslation,
  RequiredUsageCardState,
  ToForCardState,
  TranslationCardState,
} from './models/preposition.model';
import { PrepositionTranslationCardComponent } from './components/preposition-translation-card/preposition-translation-card.component';
import { PrepositionRequiredUsageCardComponent } from './components/preposition-required-usage-card/preposition-required-usage-card.component';
import { PrepositionToForCardComponent } from './components/preposition-to-for-card/preposition-to-for-card.component';
import { PrepositionInOnAtCardComponent } from './components/preposition-in-on-at-card/preposition-in-on-at-card.component';

type PrepositionCardType = 'translation' | 'requiredUsage' | 'toFor' | 'inOnAt';

@Component({
  selector: 'app-prepositions',
  standalone: true,
  imports: [
    CommonModule,
    PrepositionTranslationCardComponent,
    PrepositionRequiredUsageCardComponent,
    PrepositionToForCardComponent,
    PrepositionInOnAtCardComponent,
  ],
  templateUrl: './prepositions.component.html',
  styleUrl: './prepositions.component.scss',
  providers: [SessionGamificationService],
})
export class PrepositionsComponent implements OnInit {
  private translationService = inject(PrepositionTranslationService);
  private requiredUsageService = inject(PrepositionRequiredUsageService);
  private toForService = inject(PrepositionToForService);
  private inOnAtService = inject(PrepositionInOnAtService);
  sessionService = inject(SessionGamificationService);

  // Todos os tipos de card disponíveis. A cada rodada, 3 dos 4 são sorteados
  // (aleatório puro, sem repetir tipo dentro da rodada) — o 4º fica de fora.
  private readonly ALL_CARD_TYPES: PrepositionCardType[] = ['translation', 'requiredUsage', 'toFor', 'inOnAt'];

  translationCard = signal<TranslationCardState | null>(null);
  requiredUsageCard = signal<RequiredUsageCardState | null>(null);
  toForCard = signal<ToForCardState | null>(null);
  inOnAtCard = signal<InOnAtCardState | null>(null);

  loading = signal(false);
  error = signal<string | null>(null);

  // Ids já exibidos no ciclo atual, independentes por tipo (sem sub-escopo de lista)
  private shownTranslationIds = new Set<string>();
  private shownRequiredUsageIds = new Set<string>();
  private shownToForIds = new Set<string>();
  private shownInOnAtIds = new Set<string>();

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

    const selectedTypes = this.pickRoundTypes();

    const translation$: Observable<{ item: PrepositionTranslation; cycleReset: boolean } | null> =
      selectedTypes.has('translation')
        ? this.translationService.getRandomRound(Array.from(this.shownTranslationIds))
        : of(null);
    const requiredUsage$: Observable<{ item: PrepositionRequiredUsage; cycleReset: boolean } | null> =
      selectedTypes.has('requiredUsage')
        ? this.requiredUsageService.getRandomRound(Array.from(this.shownRequiredUsageIds))
        : of(null);
    const toFor$: Observable<{ item: PrepositionToFor; cycleReset: boolean } | null> = selectedTypes.has('toFor')
      ? this.toForService.getRandomRound(Array.from(this.shownToForIds))
      : of(null);
    const inOnAt$: Observable<{ item: PrepositionInOnAt; cycleReset: boolean } | null> = selectedTypes.has('inOnAt')
      ? this.inOnAtService.getRandomRound(Array.from(this.shownInOnAtIds))
      : of(null);

    forkJoin({
      translation: translation$,
      requiredUsage: requiredUsage$,
      toFor: toFor$,
      inOnAt: inOnAt$,
    }).subscribe({
      next: (results) => {
        if (results.translation) {
          this.shownTranslationIds = this.updateShownIds(
            this.shownTranslationIds,
            results.translation.cycleReset,
            results.translation.item.id
          );
          this.translationCard.set({ item: results.translation.item, answer: '', isFlipped: false });
        } else {
          this.translationCard.set(null);
        }

        if (results.requiredUsage) {
          this.shownRequiredUsageIds = this.updateShownIds(
            this.shownRequiredUsageIds,
            results.requiredUsage.cycleReset,
            results.requiredUsage.item.id
          );
          this.requiredUsageCard.set({ item: results.requiredUsage.item, answer: '', isFlipped: false });
        } else {
          this.requiredUsageCard.set(null);
        }

        if (results.toFor) {
          this.shownToForIds = this.updateShownIds(this.shownToForIds, results.toFor.cycleReset, results.toFor.item.id);
          this.toForCard.set({ item: results.toFor.item, answer: '', isFlipped: false });
        } else {
          this.toForCard.set(null);
        }

        if (results.inOnAt) {
          this.shownInOnAtIds = this.updateShownIds(
            this.shownInOnAtIds,
            results.inOnAt.cycleReset,
            results.inOnAt.item.id
          );
          this.inOnAtCard.set({ item: results.inOnAt.item, answer: '', isFlipped: false });
        } else {
          this.inOnAtCard.set(null);
        }

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

  /** Sorteia 3 dos 4 tipos de card para a rodada (aleatório puro, sem repetir tipo). */
  private pickRoundTypes(): Set<PrepositionCardType> {
    const shuffled = [...this.ALL_CARD_TYPES].sort(() => 0.5 - Math.random());
    return new Set(shuffled.slice(0, 3));
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

  onInOnAtStateChange(newState: InOnAtCardState): void {
    const previous = this.inOnAtCard();
    this.registerFieldCheck(previous?.isFlipped, newState);
    this.inOnAtCard.set(newState);
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
   * Cards ativos na rodada atual (sempre 3, entre os 4 tipos possíveis).
   */
  roundReady = computed(() => {
    const active = [this.translationCard(), this.requiredUsageCard(), this.toForCard(), this.inOnAtCard()];
    return active.filter(Boolean).length === 3;
  });

  /**
   * Total de acertos acumulados entre os cards já virados nesta rodada (máximo 3).
   */
  roundScore = computed(() => {
    let hits = 0;
    for (const card of [this.translationCard(), this.requiredUsageCard(), this.toForCard(), this.inOnAtCard()]) {
      if (card?.isFlipped && card.result?.correct) hits++;
    }
    return hits;
  });

  /**
   * Quantidade de cards conferidos/virados até o momento.
   */
  flippedCardsCount = computed(() => {
    let count = 0;
    for (const card of [this.translationCard(), this.requiredUsageCard(), this.toForCard(), this.inOnAtCard()]) {
      if (card?.isFlipped) count++;
    }
    return count;
  });
}
