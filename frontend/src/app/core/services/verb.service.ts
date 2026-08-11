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
    { id: '1', portuguese: 'Ir', infinitive: 'go', pastSimple: 'went', pastParticiple: 'gone' },
    { id: '2', portuguese: 'Vir', infinitive: 'come', pastSimple: 'came', pastParticiple: 'come' },
    { id: '3', portuguese: 'Fazer', infinitive: 'do', pastSimple: 'did', pastParticiple: 'done' },
    { id: '4', portuguese: 'Ter', infinitive: 'have', pastSimple: 'had', pastParticiple: 'had' },
    { id: '5', portuguese: 'Ver', infinitive: 'see', pastSimple: 'saw', pastParticiple: 'seen' },
    { id: '6', portuguese: 'Correr', infinitive: 'run', pastSimple: 'ran', pastParticiple: 'run' },
    { id: '7', portuguese: 'Escrever', infinitive: 'write', pastSimple: 'wrote', pastParticiple: 'written' },
    { id: '8', portuguese: 'Ler', infinitive: 'read', pastSimple: 'read', pastParticiple: 'read' },
    { id: '9', portuguese: 'Pegar / Tomar', infinitive: 'take', pastSimple: 'took', pastParticiple: 'taken' },
    { id: '10', portuguese: 'Dar', infinitive: 'give', pastSimple: 'gave', pastParticiple: 'given' },
    { id: '11', portuguese: 'Comer', infinitive: 'eat', pastSimple: 'ate', pastParticiple: 'eaten' },
    { id: '12', portuguese: 'Beber', infinitive: 'drink', pastSimple: 'drank', pastParticiple: 'drunk' },
    { id: '13', portuguese: 'Falar', infinitive: 'speak', pastSimple: 'spoke', pastParticiple: 'spoken' },
    { id: '14', portuguese: 'Comprar', infinitive: 'buy', pastSimple: 'bought', pastParticiple: 'bought' },
    { id: '15', portuguese: 'Vender', infinitive: 'sell', pastSimple: 'sold', pastParticiple: 'sold' },
    { id: '16', portuguese: 'Pensar', infinitive: 'think', pastSimple: 'thought', pastParticiple: 'thought' },
    { id: '17', portuguese: 'Encontrar', infinitive: 'find', pastSimple: 'found', pastParticiple: 'found' },
    { id: '18', portuguese: 'Quebrar', infinitive: 'break', pastSimple: 'broke', pastParticiple: 'broken' },
    { id: '19', portuguese: 'Construir', infinitive: 'build', pastSimple: 'built', pastParticiple: 'built' },
    { id: '20', portuguese: 'Trazer', infinitive: 'bring', pastSimple: 'brought', pastParticiple: 'brought' },
    { id: '21', portuguese: 'Escolher', infinitive: 'choose', pastSimple: 'chose', pastParticiple: 'chosen' },
    { id: '22', portuguese: 'Voar', infinitive: 'fly', pastSimple: 'flew', pastParticiple: 'flown' },
    { id: '23', portuguese: 'Esquecer', infinitive: 'forget', pastSimple: 'forgot', pastParticiple: 'forgotten' },
    { id: '24', portuguese: 'Conhecer / Encontrar', infinitive: 'meet', pastSimple: 'met', pastParticiple: 'met' },
    { id: '25', portuguese: 'Pagar', infinitive: 'pay', pastSimple: 'paid', pastParticiple: 'paid' },
    { id: '26', portuguese: 'Enviar', infinitive: 'send', pastSimple: 'sent', pastParticiple: 'sent' },
    { id: '27', portuguese: 'Nadar', infinitive: 'swim', pastSimple: 'swam', pastParticiple: 'swum' },
    { id: '28', portuguese: 'Ensinar', infinitive: 'teach', pastSimple: 'taught', pastParticiple: 'taught' },
    { id: '29', portuguese: 'Entender', infinitive: 'understand', pastSimple: 'understood', pastParticiple: 'understood' },
    { id: '30', portuguese: 'Dizer', infinitive: 'say', pastSimple: 'said', pastParticiple: 'said' },
  ];

  getRandomVerbs(count: number = 3): Observable<Verb[]> {
    return this.http.get<{ data: Verb[]; error: string | null }>(`${this.apiUrl}/random?count=${count}`).pipe(
      map((res) => res.data),
      catchError(() => {
        console.warn('API indisponível. Utilizando verbos fallback locais.');
        return of(this.getRandomFallbackVerbs(count));
      })
    );
  }

  private getRandomFallbackVerbs(count: number): Verb[] {
    const shuffled = [...this.fallbackVerbs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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
