import { createSelector } from '@ngrx/store';
import { AccountState, AppState, DataState } from '../app.state';

export const selectAccount = (state: AppState) => state.account;

export const selectMyAccount = createSelector(
  selectAccount,
  (state: AccountState) => state.myAccount
);
