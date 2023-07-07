import { createReducer, on } from '@ngrx/store';
import * as actions from './account.actions';
import { AccountState } from '../app.state';

export const initialState: AccountState = {
  myAccount: null,
};

export const accountReducer = createReducer(
  initialState,

  on(actions.setMyAccount, (state, { payload }) => {
    return {
      ...state,
      myAccount: payload,
    };
  })
);
