import { createSelector } from '@ngrx/store';
import { AppState, DataState } from '../app.state';

export const selectData = (state: AppState) => state.data;

export const selectFurniture = createSelector(
  selectData,
  (state: DataState) => state.furniture
);

export const selectFurnitureCapacity = (type: string, level: number) =>
  createSelector(
    selectData,
    (state: DataState) =>
      state.furniture.find(
        (furniture) => furniture.type == type && furniture.level == level
      )?.stats.storage
  );

export const selectFurnitureSize = (type: string, level: number) =>
  createSelector(
    selectData,
    (state: DataState) =>
      state.furniture.find(
        (furniture) => furniture.type === type && furniture.level === level
      )?.stats.size
  );

export const selectLevels = createSelector(
  selectData,
  (state: DataState) => state.levels
);

export const selectSlots = createSelector(
  selectData,
  (state: DataState) => state.slots
);

export const selectXpTNL = (levelParam: number) =>
  createSelector(
    selectData,
    (state: DataState) =>
      state.levels.filter((level) => level.level == levelParam)[0].upgrade
        ?.xpNeeded || -1
  );

export const selectMinLevel = createSelector(selectData, (state: DataState) =>
  Math.min(...state.levels.map((level) => level.level))
);

export const selectMaxLevel = createSelector(selectData, (state: DataState) =>
  Math.max(...state.levels.map((level) => level.level))
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
