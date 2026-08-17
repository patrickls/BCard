import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Verb } from '../../features/flashcards/models/verb.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VerbService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/verbs`;

  /**
   * Sorteia uma rodada de verbos dentro do escopo (list) informado, evitando repetir
   * um verbo já exibido (excludeIds) até que todos os verbos do escopo tenham aparecido.
   * cycleReset=true indica que o ciclo de "já exibidos" foi reiniciado nesta rodada -
   * o caller deve descartar o histórico de exclusão anterior e recomeçar a partir
   * dos verbos retornados.
   */
  getRandomVerbs(
    count: number = 3,
    list?: string | null,
    excludeIds: string[] = []
  ): Observable<{ verbs: Verb[]; cycleReset: boolean }> {
    let url = `${this.apiUrl}/random?count=${count}`;
    if (list) {
      url += `&list=${encodeURIComponent(list)}`;
    }
    if (excludeIds.length > 0) {
      url += `&excludeIds=${encodeURIComponent(excludeIds.join(','))}`;
    }

    return this.http.get<{ data: Verb[]; error: string | null; cycleReset: boolean }>(url).pipe(
      map((res) => ({ verbs: res.data, cycleReset: res.cycleReset })),
      catchError((err) => {
        console.error('Falha ao buscar verbos da API:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Normaliza o texto digitado pelo estudante:
   * - Converte para minúsculas
   * - Remove espaços extras antes/depois
   * - Caso seja tradução, remove o prefixo "to " se presente (ex: "to run" -> "run")
   */
  normalizeInput(text: string, isTranslation: boolean = false): string {
    if (!text) return '';
    let normalized = text.trim().toLowerCase().replace(/\s+/g, ' ');
    if (isTranslation && normalized.startsWith('to ')) {
      normalized = normalized.slice(3).trim();
    }
    return normalized;
  }

  /**
   * Compara a resposta dada pelo usuário com a resposta esperada.
   * Respostas compostas (ex: "leapt / leaped") aceitam qualquer uma das
   * alternativas separadas por "/".
   */
  checkAnswer(given: string, expected: string, isTranslation: boolean = false): boolean {
    const normGiven = this.normalizeInput(given, isTranslation);
    if (normGiven === '') return false;

    const alternatives = expected.split('/').map((alt) => this.normalizeInput(alt, isTranslation));
    return alternatives.includes(normGiven);
  }
}
