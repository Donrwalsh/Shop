import { createSelector } from '@ngrx/store';
import { AppState, BlueprintState } from '../app.state';

export const selectBlueprint = (state: AppState) => state.blueprint;

export const selectCurrent = createSelector(
  selectBlueprint,
  (state: BlueprintState) => state.current
);
