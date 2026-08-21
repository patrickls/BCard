import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InOnAtCardState } from '../../models/preposition.model';
import { PrepositionInOnAtService } from '../../../../core/services/preposition-in-on-at.service';

@Component({
  selector: 'app-preposition-in-on-at-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preposition-in-on-at-card.component.html',
  styleUrl: './preposition-in-on-at-card.component.scss',
})
export class PrepositionInOnAtCardComponent {
  private service = inject(PrepositionInOnAtService);

  @Input({ required: true }) state!: InOnAtCardState;
  @Output() stateChange = new EventEmitter<InOnAtCardState>();

  get sentenceBefore(): string {
    return this.state.item.sentence.split('___')[0];
  }

  get sentenceAfter(): string {
    return this.state.item.sentence.split('___')[1] ?? '';
  }

  get filledSentence(): string {
    return this.state.item.sentence.replace('___', this.state.item.answer);
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
    const correct = this.service.checkAnswer(this.state.answer, this.state.item.answer);
    this.stateChange.emit({ ...this.state, isFlipped: true, result: { correct } });
  }

  onInputChange(): void {
    if (this.state.isFlipped) {
      return;
    }
    this.stateChange.emit({ ...this.state });
  }
}
