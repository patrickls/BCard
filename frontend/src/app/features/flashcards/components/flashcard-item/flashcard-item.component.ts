import { Component, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
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

    const nextFlipped = !this.state.isFlipped;
    let result: FieldResult | undefined = this.state.result;

    if (nextFlipped) {
      // Ao virar para o verso, calcula o resultado da correção automática
      result = {
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
    }

    const updatedState: FlashcardState = {
      ...this.state,
      isFlipped: nextFlipped,
      result,
    };

    this.stateChange.emit(updatedState);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const isInput = (event.target as HTMLElement).tagName === 'INPUT';
    if (!isInput && event.key === 'Enter') {
      event.preventDefault();
      this.toggleFlip();
    }
  }

  onInputChange(): void {
    // Se o usuário altera a resposta enquanto o estado é atualizado
    this.stateChange.emit({
      ...this.state,
      answers: { ...this.state.answers },
    });
  }
}
