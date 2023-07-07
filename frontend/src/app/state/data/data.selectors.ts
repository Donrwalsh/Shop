import { createSelector } from '@ngrx/store';
import { AppState, DataState } from '../app.state';

export const selectData = (state: AppState) => state.data;

export const selectSlots = createSelector(
  selectData,
  (state: DataState) => state.slots
);

export const selectMinFurnitureSlots = createSelector(
  selectData,
  (state: DataState) =>
    Math.min(
      ...state.slots
        .filter((slot) => slot.type === 'Shop Expansion')
        .map((data: any) => data.stats?.capacity)
    )
);

export const selectMaxFurnitureSlots = createSelector(
  selectData,
  (state: DataState) =>
    Math.max(
      ...state.slots
        .filter((slot) => slot.type === 'Shop Expansion')
        .map((data: any) => data.stats?.capacity)
    )
);
