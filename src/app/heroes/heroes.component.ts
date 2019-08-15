import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[]; /* объявляем свойства для использования в шаблоне/где-то еще */

  getHeroes(): void {
    this.heroService.getHeroes() /* отслеживаем возврат асинхронно */
        .subscribe(heroes => this.heroes = heroes); /* из Observable<Hero[]> берем heroes */
  }

  /* обработка запроса на уровне компонента */
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero) /* сопоставляет объект с классом Hero, заполняя поле name */
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe(); /* при возвращении Observable нам в любом случае нужен метод .subscribe() */
  }
  
  constructor(private heroService: HeroService) { } /* получаем свой образец класса из сервиса в виде свойства */

  ngOnInit() {
    this.getHeroes(); /* запрос вызывается уже после конструктруирования компонента, что логичнее */
  }

}
