// #docregion
import { Injectable } from '@angular/core';

import { HEROES } from './mock-heroes';

@Injectable({
  // we declare that this service should be created
  // by any injector that includes HeroModule.
  providedIn: /* TODO(standalone-migration): clean up removed NgModule reference manually. */  HeroModule,
})
export class HeroService {
  getHeroes() { return HEROES; }
}
