import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { DataService } from '../../data.service';
import * as accountActions from './account.actions';
import { Level, Slot } from '../../models/data.model';
import { AppState } from '../app.state';
import { of } from 'rxjs';

@Injectable()
export class AccountEffects {
  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private store: Store<AppState>
  ) {}

  getBigbrass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(accountActions.getBigbrass),
      exhaustMap(() => {
        const request = this.dataService.getBigbrass();
        return request.pipe(
          map((data: any) => accountActions.setMyAccount({ payload: data }))
        );
      })
    )
  );

  updateAccount$ = createEffect(() =>
      this.actions$.pipe(
        ofType(accountActions.updateMyAccount),
        exhaustMap((action) => {
          const request = this.dataService.updateMyAccount(action.payload);
          return request.pipe(
            map((data: any) => accountActions.setMyAccount({ payload: data.existingAccount }))
          )
        })
      )
  )
}
