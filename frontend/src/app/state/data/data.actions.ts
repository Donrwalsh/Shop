import { createAction, props } from '@ngrx/store';
import { Furniture, Level, Slot } from '../../models/data.model';
import { BasicBlueprint } from 'src/app/models/blueprint.model';

export const getBlueprintRef = createAction('[Data] Get Blueprint Reference');

export const haveBlueprintRef = createAction(
  '[Data] Blueprint Reference Has Already Been Downloaded'
);

export const setBlueprintRef = createAction(
  '[Data] Set Blueprint Reference',
  props<{ payload: BasicBlueprint[] }>()
);

export const getFurniture = createAction('[Data] Get Furniture');

export const haveFurniture = createAction(
  '[Data] Furniture Data Has Already Been Downloaded'
);

export const setFurniture = createAction(
  '[Data] Set Furniture',
  props<{ payload: Furniture[] }>()
);

export const getLevels = createAction('[Data] Get Levels');

export const haveLevels = createAction(
  '[Data] Levels Data Has Already Been Downloaded'
);

export const setLevels = createAction(
  '[Data] Set Levels',
  props<{ payload: Level[] }>()
);

export const getSlots = createAction('[Data] Get Slots');

export const haveSlots = createAction(
  '[Data] Slots Data Has Already Been Downloaded'
);

export const setSlots = createAction(
  '[Data] Set Slots',
  props<{ payload: Slot[] }>()
);
