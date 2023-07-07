import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { DataService } from '../../data.service';
import * as dataActions from './data.actions';
import * as dataSelectors from './data.selectors';
import { Slot } from '../../models/slots.model';
import { AppState } from '../app.state';
import { of } from 'rxjs';

@Injectable()
export class DataEffects {
  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private store: Store<AppState>
  ) {}

  getSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dataActions.getSlots),
      withLatestFrom(this.store.select(dataSelectors.selectSlots)),
      exhaustMap(([action, slots]) => {
        if (!slots.length) {
          const request = this.dataService.getSlots();
          return request.pipe(
            map((data) => dataActions.setSlots({ payload: data as Slot[] }))
          );
        } else {
          return of(dataActions.haveSlots());
        }
      })
    )
  );
}
