import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardAnswers, FieldResult, FlashcardState } from '../../models/verb.model';
import { VerbService } from '../../../../core/services/verb.service';

@Component({
  selector: 'app-flashcard-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flashcard-item.component.html',
  styleUrl: './flashcard-item.component.scss',
})
export class FlashcardItemComponent {
  private verbService = inject(VerbService);

  @Input({ required: true }) state!: FlashcardState;
  @Input() index: number = 0;

  @Output() stateChange = new EventEmitter<FlashcardState>();

  // Cores de card para variação visual agradável entre os cards
  readonly postItColors = ['yellow-postit', 'peach-postit', 'mint-postit'];

  get colorClass(): string {
    return this.postItColors[this.index % this.postItColors.length];
  }

  toggleFlip(event?: Event): void {
    // Evita virar se o evento se originou de um input de texto
    if (event && (event.target as HTMLElement).tagName === 'INPUT') {
      return;
    }

    // Card travado permanentemente após virar — só "Nova rodada" libera edição de novo
    if (this.state.isFlipped) {
      return;
    }

    // Ao virar para o verso, calcula o resultado da correção automática
    const result: FieldResult = {
      translationCorrect: this.verbService.checkAnswer(
        this.state.answers.translation,
        this.state.verb.infinitive,
        true
      ),
      pastSimpleCorrect: this.verbService.checkAnswer(
        this.state.answers.pastSimple,
        this.state.verb.pastSimple,
        false
      ),
      pastParticipleCorrect: this.verbService.checkAnswer(
        this.state.answers.pastParticiple,
        this.state.verb.pastParticiple,
        false
      ),
    };

    const updatedState: FlashcardState = {
      ...this.state,
      isFlipped: true,
      result,
    };

    this.stateChange.emit(updatedState);
  }

  onInputChange(): void {
    // Card travado não aceita mais alterações
    if (this.state.isFlipped) {
      return;
    }

    // Se o usuário altera a resposta enquanto o estado é atualizado
    this.stateChange.emit({
      ...this.state,
      answers: { ...this.state.answers },
    });
  }
}
