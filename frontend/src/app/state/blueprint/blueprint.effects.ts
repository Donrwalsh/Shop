import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DataService } from 'src/app/data.service';
import { AppState } from '../app.state';
import * as blueprintActions from './blueprint.actions';
import * as blueprintSelectors from './blueprint.selectors';
import { Blueprint } from 'src/app/models/blueprint.model';
import { of } from 'rxjs';

@Injectable()
export class BlueprintEffects {
  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private store: Store<AppState>
  ) {}

  getFullBlueprint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(blueprintActions.getFullBlueprint),
      withLatestFrom(this.store.select(blueprintSelectors.selectCurrent)),
      exhaustMap(([action, current]) => {
        if (current._id !== action.payload) {
          const request = this.dataService.getFullBlueprint(action.payload);
          return request.pipe(
            map((data: any) =>
              blueprintActions.setCurrent({ payload: data as Blueprint })
            )
          );
        } else {
          return of(blueprintActions.matchesCurrent());
        }
      })
    )
  );
}
