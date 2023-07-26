import { createAction, props } from '@ngrx/store';
import { Blueprint } from 'src/app/models/blueprint.model';

export const getFullBlueprint = createAction(
  '[Blueprint] Get Full Blueprint',
  props<{ payload: string }>()
);

export const matchesCurrent = createAction('[Blueprint] Matches Current');

export const setCurrent = createAction(
  '[Blueprint] Set Current',
  props<{ payload: Blueprint }>()
);
