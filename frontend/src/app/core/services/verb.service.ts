import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { Verb } from '../../features/flashcards/models/verb.model';

@Injectable({
  providedIn: 'root',
})
export class VerbService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/verbs';

  private fallbackVerbs: Verb[] = [
    { id: '1', portuguese: 'Esconder', infinitive: 'hide', pastSimple: 'hid', pastParticiple: 'hidden', list: 'Lista 2' },
    { id: '2', portuguese: 'Bater', infinitive: 'hit', pastSimple: 'hit', pastParticiple: 'hit', list: 'Lista 2' },
    { id: '3', portuguese: 'Segurar', infinitive: 'hold', pastSimple: 'held', pastParticiple: 'held', list: 'Lista 2' },
    { id: '4', portuguese: 'Machucar', infinitive: 'hurt', pastSimple: 'hurt', pastParticiple: 'hurt', list: 'Lista 2' },
    { id: '5', portuguese: 'Manter', infinitive: 'keep', pastSimple: 'kept', pastParticiple: 'kept', list: 'Lista 2' },
    { id: '6', portuguese: 'Saber', infinitive: 'know', pastSimple: 'knew', pastParticiple: 'known', list: 'Lista 2' },
    { id: '7', portuguese: 'Deixar', infinitive: 'leave', pastSimple: 'left', pastParticiple: 'left', list: 'Lista 2' },
    { id: '8', portuguese: 'Perder', infinitive: 'lose', pastSimple: 'lost', pastParticiple: 'lost', list: 'Lista 2' },
    { id: '9', portuguese: 'Fazer', infinitive: 'make', pastSimple: 'made', pastParticiple: 'made', list: 'Lista 2' },
    { id: '10', portuguese: 'Pagar', infinitive: 'pay', pastSimple: 'paid', pastParticiple: 'paid', list: 'Lista 2' },
    { id: '11', portuguese: 'Ler', infinitive: 'read', pastSimple: 'read', pastParticiple: 'read', list: 'Lista 2' },
    { id: '12', portuguese: 'Correr', infinitive: 'run', pastSimple: 'ran', pastParticiple: 'run', list: 'Lista 2' },
    { id: '13', portuguese: 'Dizer', infinitive: 'say', pastSimple: 'said', pastParticiple: 'said', list: 'Lista 2' },
    { id: '14', portuguese: 'Ver', infinitive: 'see', pastSimple: 'saw', pastParticiple: 'seen', list: 'Lista 2' },
    { id: '15', portuguese: 'Vender', infinitive: 'sell', pastSimple: 'sold', pastParticiple: 'sold', list: 'Lista 2' },
    { id: '16', portuguese: 'Enviar', infinitive: 'send', pastSimple: 'sent', pastParticiple: 'sent', list: 'Lista 2' },
    { id: '17', portuguese: 'Cantar', infinitive: 'sing', pastSimple: 'sang', pastParticiple: 'sung', list: 'Lista 2' },
    { id: '18', portuguese: 'Sentar', infinitive: 'sit', pastSimple: 'sat', pastParticiple: 'sat', list: 'Lista 2' },
    { id: '19', portuguese: 'Dormir', infinitive: 'sleep', pastSimple: 'slept', pastParticiple: 'slept', list: 'Lista 2' },
    { id: '20', portuguese: 'Ser', infinitive: 'be', pastSimple: 'was / were', pastParticiple: 'been', list: 'Lista 1' },
    { id: '21', portuguese: 'Ter', infinitive: 'have', pastSimple: 'had', pastParticiple: 'had', list: 'Lista 1' },
    { id: '22', portuguese: 'Quebrar', infinitive: 'break', pastSimple: 'broke', pastParticiple: 'broken', list: 'Lista 1' },
    { id: '23', portuguese: 'Trazer', infinitive: 'bring', pastSimple: 'brought', pastParticiple: 'brought', list: 'Lista 1' },
    { id: '24', portuguese: 'Construir', infinitive: 'build', pastSimple: 'built', pastParticiple: 'built', list: 'Lista 1' },
    { id: '25', portuguese: 'Comprar', infinitive: 'buy', pastSimple: 'bought', pastParticiple: 'bought', list: 'Lista 1' },
    { id: '26', portuguese: 'Escolher', infinitive: 'choose', pastSimple: 'chose', pastParticiple: 'chosen', list: 'Lista 1' },
    { id: '27', portuguese: 'Vir', infinitive: 'come', pastSimple: 'came', pastParticiple: 'come', list: 'Lista 1' },
    { id: '28', portuguese: 'Fazer', infinitive: 'do', pastSimple: 'did', pastParticiple: 'done', list: 'Lista 1' },
    { id: '29', portuguese: 'Beber', infinitive: 'drink', pastSimple: 'drank', pastParticiple: 'drunk', list: 'Lista 1' },
    { id: '30', portuguese: 'Comer', infinitive: 'eat', pastSimple: 'ate', pastParticiple: 'eaten', list: 'Lista 1' },
    { id: '31', portuguese: 'Achar', infinitive: 'find', pastSimple: 'found', pastParticiple: 'found', list: 'Lista 1' },
    { id: '32', portuguese: 'Voar', infinitive: 'fly', pastSimple: 'flew', pastParticiple: 'flown', list: 'Lista 1' },
    { id: '33', portuguese: 'Esquecer', infinitive: 'forget', pastSimple: 'forgot', pastParticiple: 'forgotten', list: 'Lista 1' },
    { id: '34', portuguese: 'Dar', infinitive: 'give', pastSimple: 'gave', pastParticiple: 'given', list: 'Lista 1' },
    { id: '35', portuguese: 'Ir', infinitive: 'go', pastSimple: 'went', pastParticiple: 'gone', list: 'Lista 1' },
  ];

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
      catchError(() => {
        console.warn('API indisponível. Utilizando verbos fallback locais.');
        return of(this.getRandomFallbackRound(count, list, excludeIds));
      })
    );
  }

  private getRandomFallbackRound(
    count: number,
    list: string | null | undefined,
    excludeIds: string[]
  ): { verbs: Verb[]; cycleReset: boolean } {
    let pool = this.fallbackVerbs;
    if (list) {
      pool = this.fallbackVerbs.filter((v) => v.list === list);
    }
    return this.pickRound(pool, count, excludeIds);
  }

  private pickRound(pool: Verb[], count: number, excludeIds: string[]): { verbs: Verb[]; cycleReset: boolean } {
    const shuffle = <T>(items: T[]): T[] => [...items].sort(() => 0.5 - Math.random());
    const excludeSet = new Set(excludeIds);
    const remaining = pool.filter((v) => !excludeSet.has(v.id));

    if (remaining.length >= count) {
      return { verbs: shuffle(remaining).slice(0, count), cycleReset: false };
    }

    const shuffledRemaining = shuffle(remaining);
    const usedIds = new Set(shuffledRemaining.map((v) => v.id));
    const fillPool = pool.filter((v) => !usedIds.has(v.id));
    const needed = count - shuffledRemaining.length;
    const fill = shuffle(fillPool).slice(0, needed);

    return { verbs: [...shuffledRemaining, ...fill], cycleReset: true };
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
   * Compara a resposta dada pelo usuário com a resposta esperada
   */
  checkAnswer(given: string, expected: string, isTranslation: boolean = false): boolean {
    const normGiven = this.normalizeInput(given, isTranslation);
    const normExpected = this.normalizeInput(expected, isTranslation);
    return normGiven !== '' && normGiven === normExpected;
  }
}
