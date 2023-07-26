import { createReducer, on } from '@ngrx/store';
import { Blueprint } from 'src/app/models/blueprint.model';
import { BlueprintState } from '../app.state';
import * as actions from './blueprint.actions';

export const initialState: BlueprintState = {
  current: {} as Blueprint,
};

export const blueprintReducer = createReducer(
  initialState,

  on(actions.setCurrent, (state, { payload }) => {
    return {
      ...state,
      current: (payload as any).existingBlueprint,
    };
  })
);
