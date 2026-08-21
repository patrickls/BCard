import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { PrepositionRequiredUsage } from '../../features/prepositions/models/preposition.model';
import { checkSingleAnswer } from '../../shared/utils/set-answer.util';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrepositionRequiredUsageService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/prepositions/required-usage`;

  getRandomRound(excludeIds: string[] = []): Observable<{ item: PrepositionRequiredUsage; cycleReset: boolean }> {
    let url = `${this.apiUrl}/random?count=1`;
    if (excludeIds.length > 0) {
      url += `&excludeIds=${encodeURIComponent(excludeIds.join(','))}`;
    }

    return this.http
      .get<{ data: PrepositionRequiredUsage[]; error: string | null; cycleReset: boolean }>(url)
      .pipe(
        map((res) => ({ item: res.data[0], cycleReset: res.cycleReset })),
        catchError((err) => {
          console.error('Falha ao buscar uso obrigatório de preposição da API:', err);
          return throwError(() => err);
        })
      );
  }

  checkAnswer(given: string, expected: string): boolean {
    return checkSingleAnswer(given, expected);
  }
}
