import { Injectable, computed, signal } from '@angular/core';

export type SessionLevel = 'super-sucesso' | 'sucesso' | 'mediana' | 'fracasso';

/**
 * Estado de gamificação de uma sessão de estudos (contadores, nível, modal de resumo).
 * Injetável por componente (ver `providers` em cada feature) para que Verbs e
 * Prepositions tenham cada um sua própria instância/sessão independente.
 */
@Injectable()
export class SessionGamificationService {
  // Contadores de sessão acumulados em memória — sem persistência entre reloads (decisão de produto)
  sessionRounds = signal(0); // X: rodadas iniciadas
  sessionFieldsChecked = signal(0); // Z: campos corrigidos
  sessionFieldsCorrect = signal(0); // Y: campos corretos

  showSummaryModal = signal(false);

  sessionLevel = computed<SessionLevel | null>(() => {
    const z = this.sessionFieldsChecked();
    if (z === 0) return null;

    const ratio = this.sessionFieldsCorrect() / z;
    if (ratio >= 0.9) return 'super-sucesso';
    if (ratio >= 0.75) return 'sucesso';
    if (ratio >= 0.5) return 'mediana';
    return 'fracasso';
  });

  private readonly levelImages: Record<SessionLevel, string> = {
    'super-sucesso': 'images/session-levels/trofeu.png',
    sucesso: 'images/session-levels/medalha-ouro.png',
    mediana: 'images/session-levels/medalha-prata.png',
    fracasso: 'images/session-levels/medalha-bronze.png',
  };

  sessionImage = computed(() => {
    const level = this.sessionLevel();
    return level ? this.levelImages[level] : null;
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

  private roundLabel(x: number): string {
    return x === 1 ? '1 rodada' : `${x} rodadas`;
  }

  recordRoundStart(): void {
    this.sessionRounds.update((x) => x + 1);
  }

  recordFieldsChecked(checked: number, correct: number): void {
    this.sessionFieldsChecked.update((z) => z + checked);
    this.sessionFieldsCorrect.update((y) => y + correct);
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
    window.location.reload();
  }
}
