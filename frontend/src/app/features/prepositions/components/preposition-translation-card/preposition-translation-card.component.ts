import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationCardState } from '../../models/preposition.model';
import { PrepositionTranslationService } from '../../../../core/services/preposition-translation.service';

@Component({
  selector: 'app-preposition-translation-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preposition-translation-card.component.html',
  styleUrl: './preposition-translation-card.component.scss',
})
export class PrepositionTranslationCardComponent {
  private service = inject(PrepositionTranslationService);

  @Input({ required: true }) state!: TranslationCardState;
  @Output() stateChange = new EventEmitter<TranslationCardState>();

  get isComposite(): boolean {
    return this.state.item.answers.length > 1;
  }

  toggleFlip(event?: Event): void {
    if (event && (event.target as HTMLElement).tagName === 'INPUT') {
      return;
    }
    if (this.state.isFlipped) {
      return;
    }
    this.flip();
  }

  flipOnTabOut(event: Event): void {
    if ((event as KeyboardEvent).shiftKey || this.state.isFlipped) {
      return;
    }
    this.flip();
  }

  private flip(): void {
    const correct = this.service.checkAnswer(this.state.answer, this.state.item.answers);
    this.stateChange.emit({ ...this.state, isFlipped: true, result: { correct } });
  }

  onInputChange(): void {
    if (this.state.isFlipped) {
      return;
    }
    this.stateChange.emit({ ...this.state });
  }
}
