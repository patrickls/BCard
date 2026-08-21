import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToForCardState } from '../../models/preposition.model';
import { PrepositionToForService } from '../../../../core/services/preposition-to-for.service';

@Component({
  selector: 'app-preposition-to-for-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preposition-to-for-card.component.html',
  styleUrl: './preposition-to-for-card.component.scss',
})
export class PrepositionToForCardComponent {
  private service = inject(PrepositionToForService);

  @Input({ required: true }) state!: ToForCardState;
  @Output() stateChange = new EventEmitter<ToForCardState>();

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
    const correct = this.service.checkAnswer(this.state.answer, this.state.item.answerEn);
    this.stateChange.emit({ ...this.state, isFlipped: true, result: { correct } });
  }

  onInputChange(): void {
    if (this.state.isFlipped) {
      return;
    }
    this.stateChange.emit({ ...this.state });
  }
}
