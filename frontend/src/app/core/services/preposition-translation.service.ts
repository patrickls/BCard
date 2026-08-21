import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { PrepositionTranslation } from '../../features/prepositions/models/preposition.model';
import { checkSetAnswer } from '../../shared/utils/set-answer.util';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrepositionTranslationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/prepositions/translations`;

  getRandomRound(excludeIds: string[] = []): Observable<{ item: PrepositionTranslation; cycleReset: boolean }> {
    let url = `${this.apiUrl}/random?count=1`;
    if (excludeIds.length > 0) {
      url += `&excludeIds=${encodeURIComponent(excludeIds.join(','))}`;
    }

    return this.http
      .get<{ data: PrepositionTranslation[]; error: string | null; cycleReset: boolean }>(url)
      .pipe(
        map((res) => ({ item: res.data[0], cycleReset: res.cycleReset })),
        catchError((err) => {
          console.error('Falha ao buscar tradução de preposição da API:', err);
          return throwError(() => err);
        })
      );
  }

  checkAnswer(given: string, expectedAnswers: string[]): boolean {
    return checkSetAnswer(given, expectedAnswers);
  }
}
