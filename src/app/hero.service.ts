import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private heroesUrl = 'api/heroes';  // ссылка для web api
  constructor(private messageService: MessageService, private http: HttpClient) { } /* " Dependency Injection system" вступает тут в действие */
  /* представляем, что производится запрос на сторонний сервер, поэтому возвращаем "поток" */

  /** получаем(метод GET) героев с сервера */
  getHeroes (): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log(`fetched all heroes`)),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }
  /** получаем(метод GET) героя по id, используя нашу БД */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }
  /**обновляет (метод PUT) героя в БД на посланного через аргумент*/
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  /** добавляет (метод POST) нового героя в БД */
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero with id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  /** удаляет(метод DELETE) героя из БД */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  /**
   * Вызывается для HTTP-операции, в которой ошибка
   * Приложение не останавливается
   * @param operation - имя операции
   * @param result - опциональное значение, которое будет возвразено как Observable
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // просто отправим тут в консоль
      this.log(`${operation} failed: ${error.message}`);
      /* работа приложения продолжается корректно */
      return of(result as T);
    };
  }
  /* поиск (праметризованный GET) героев, чьи имена содержат данную строку */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) { /* если запрос пустой */
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
  /* делаем более удобный вызов */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
