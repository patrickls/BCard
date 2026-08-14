import { Component, ElementRef, OnInit, computed, effect, inject, signal, viewChild } from '@angular/core';
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

  cardStates = signal<FlashcardState[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedList = signal<string | null>(null);

  /**
   * Ids já exibidos no ciclo atual, por escopo (chave da lista, ou '__ALL__' para "Todos").
   * Garante que um verbo não repita dentro do escopo até todos já terem sido mostrados.
   */
  private shownVerbIdsByScope = new Map<string, Set<string>>();

  // Contadores de sessão acumulados em memória — sem persistência entre reloads (decisão de produto)
  sessionRounds = signal(0); // X: rodadas iniciadas
  sessionFieldsChecked = signal(0); // Z: campos corrigidos
  sessionFieldsCorrect = signal(0); // Y: campos corretos

  showSummaryModal = signal(false);

  private summaryDialog = viewChild<ElementRef<HTMLElement>>('summaryDialog');

  sessionLevel = computed<'super-sucesso' | 'sucesso' | 'mediana' | 'fracasso' | null>(() => {
    const z = this.sessionFieldsChecked();
    if (z === 0) return null;

    const ratio = this.sessionFieldsCorrect() / z;
    if (ratio >= 0.9) return 'super-sucesso';
    if (ratio >= 0.75) return 'sucesso';
    if (ratio >= 0.5) return 'mediana';
    return 'fracasso';
  });

  sessionMessage = computed(() => {
    const level = this.sessionLevel();
    if (!level) return '';

    const y = this.sessionFieldsCorrect();
    const z = this.sessionFieldsChecked();
    const rounds = this.roundLabel(this.sessionRounds());

    switch (level) {
      case 'super-sucesso':
        return `Uau, ${y} de ${z} acertos em ${rounds} — você está literalmente arrasando! Isso é nível Rock Star. Bora continuar nesse embalo?`;
      case 'sucesso':
        return `Muito bem! ${y} de ${z} acertos em ${rounds} — você está mandando bem de verdade. Continue nesse ritmo!`;
      case 'mediana':
        return `Boa! ${y} de ${z} acertos em ${rounds}. Você está no caminho certo — mais um pouco de prática e o próximo nível é seu.`;
      default:
        return `${y} de ${z} acertos em ${rounds}. Sem problema — todo Rock Star começa desafinado. Bora estudar mais um pouco e voltar mais forte?`;
    }
  });

  constructor() {
    // Foca o modal ao abrir, para leitores de tela e navegação por teclado
    effect(() => {
      if (this.showSummaryModal()) {
        queueMicrotask(() => this.summaryDialog()?.nativeElement.focus());
      }
    });
  }

  private roundLabel(x: number): string {
    return x === 1 ? '1 rodada' : `${x} rodadas`;
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
        this.sessionRounds.update((x) => x + 1);
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

      this.sessionFieldsChecked.update((z) => z + 3);
      this.sessionFieldsCorrect.update((y) => y + correctInCard);
    }

    this.cardStates.update((states) => states.map((s, i) => (i === index ? newState : s)));
  }

  /**
   * Abre o modal de resultado da sessão. Sem efeito se nenhum campo foi corrigido ainda.
   */
  finishStudySession(): void {
    if (this.sessionFieldsChecked() === 0) {
      return;
    }
    this.showSummaryModal.set(true);
  }

  /**
   * Fecha o modal e zera os contadores de sessão para começar do zero.
   */
  continueStudying(): void {
    this.showSummaryModal.set(false);
    this.sessionRounds.set(0);
    this.sessionFieldsChecked.set(0);
    this.sessionFieldsCorrect.set(0);
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
