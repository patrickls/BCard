import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { PrepositionInOnAt } from '../../features/prepositions/models/preposition.model';
import { checkSingleAnswer } from '../../shared/utils/set-answer.util';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrepositionInOnAtService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/prepositions/in-on-at`;

  getRandomRound(excludeIds: string[] = []): Observable<{ item: PrepositionInOnAt; cycleReset: boolean }> {
    let url = `${this.apiUrl}/random?count=1`;
    if (excludeIds.length > 0) {
      url += `&excludeIds=${encodeURIComponent(excludeIds.join(','))}`;
    }

    return this.http.get<{ data: PrepositionInOnAt[]; error: string | null; cycleReset: boolean }>(url).pipe(
      map((res) => ({ item: res.data[0], cycleReset: res.cycleReset })),
      catchError((err) => {
        console.error("Falha ao buscar item de 'in'/'on'/'at' da API:", err);
        return throwError(() => err);
      })
    );
  }

  checkAnswer(given: string, expected: string): boolean {
    return checkSingleAnswer(given, expected);
  }
}
