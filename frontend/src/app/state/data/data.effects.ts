import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { exhaustMap, map, withLatestFrom } from 'rxjs/operators';
import { DataService } from '../../data.service';
import * as dataActions from './data.actions';
import * as dataSelectors from './data.selectors';
import { Furniture, Level, Slot } from '../../models/data.model';
import { AppState } from '../app.state';
import { of } from 'rxjs';
import { BasicBlueprint } from 'src/app/models/blueprint.model';

@Injectable()
export class DataEffects {
  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private store: Store<AppState>
  ) {}

  getBlueprintRef$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dataActions.getBlueprintRef),
      withLatestFrom(this.store.select(dataSelectors.selectBlueprintRef)),
      exhaustMap(([action, blueprints]) => {
        if (!blueprints.length) {
          const request = this.dataService.getBlueprintRef();
          return request.pipe(
            map((data: any) =>
              dataActions.setBlueprintRef({ payload: data as BasicBlueprint[] })
            )
          );
        } else {
          return of(dataActions.haveBlueprintRef());
        }
      })
    )
  );

  getFurniture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dataActions.getFurniture),
      withLatestFrom(this.store.select(dataSelectors.selectFurniture)),
      exhaustMap(([action, furniture]) => {
        if (!furniture.length) {
          const request = this.dataService.getFurniture();
          return request.pipe(
            map((data: any) =>
              dataActions.setFurniture({ payload: data as Furniture[] })
            )
          );
        } else {
          return of(dataActions.haveFurniture());
        }
      })
    )
  );

  getLevels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dataActions.getLevels),
      withLatestFrom(this.store.select(dataSelectors.selectLevels)),
      exhaustMap(([action, levels]) => {
        if (!levels.length) {
          const request = this.dataService.getLevels();
          return request.pipe(
            map((data: any) =>
              dataActions.setLevels({ payload: data.levelData as Level[] })
            )
          );
        } else {
          return of(dataActions.haveLevels());
        }
      })
    )
  );

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
