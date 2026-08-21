import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { PrepositionToFor } from '../../features/prepositions/models/preposition.model';
import { checkSingleAnswer } from '../../shared/utils/set-answer.util';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrepositionToForService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/prepositions/to-for`;

  getRandomRound(excludeIds: string[] = []): Observable<{ item: PrepositionToFor; cycleReset: boolean }> {
    let url = `${this.apiUrl}/random?count=1`;
    if (excludeIds.length > 0) {
      url += `&excludeIds=${encodeURIComponent(excludeIds.join(','))}`;
    }

    return this.http.get<{ data: PrepositionToFor[]; error: string | null; cycleReset: boolean }>(url).pipe(
      map((res) => ({ item: res.data[0], cycleReset: res.cycleReset })),
      catchError((err) => {
        console.error("Falha ao buscar item de 'to'/'for' da API:", err);
        return throwError(() => err);
      })
    );
  }

  checkAnswer(given: string, expectedEn: string): boolean {
    return checkSingleAnswer(given, expectedEn);
  }
}
