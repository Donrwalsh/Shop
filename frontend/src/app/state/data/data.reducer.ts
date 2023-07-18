import { DataState } from '../app.state';
import { createReducer, on } from '@ngrx/store';
import * as actions from './data.actions';

export const initialState: DataState = {
  blueprints: [],
  furniture: [],
  levels: [],
  slots: [],
};

export const dataReducer = createReducer(
  initialState,

  on(actions.setBlueprintRef, (state, { payload }) => {
    return {
      ...state,
      blueprints: (payload as any).blueprintData,
    };
  }),
  on(actions.setFurniture, (state, { payload }) => {
    return {
      ...state,
      furniture: payload,
    };
  }),

  on(actions.setLevels, (state, { payload }) => {
    return {
      ...state,
      levels: payload,
    };
  }),

  on(actions.setSlots, (state, { payload }) => {
    return {
      ...state,
      slots: payload,
    };
  })
);
