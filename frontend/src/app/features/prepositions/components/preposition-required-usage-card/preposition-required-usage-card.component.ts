import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequiredUsageCardState } from '../../models/preposition.model';
import { PrepositionRequiredUsageService } from '../../../../core/services/preposition-required-usage.service';

@Component({
  selector: 'app-preposition-required-usage-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preposition-required-usage-card.component.html',
  styleUrl: './preposition-required-usage-card.component.scss',
})
export class PrepositionRequiredUsageCardComponent {
  private service = inject(PrepositionRequiredUsageService);

  @Input({ required: true }) state!: RequiredUsageCardState;
  @Output() stateChange = new EventEmitter<RequiredUsageCardState>();

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
