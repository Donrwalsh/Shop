import { ActionReducerMap } from '@ngrx/store';
import { dataReducer } from './data/data.reducer';
import { Furniture, Level, Slot } from '../models/data.model';
import { Account } from '../models/account.model';
import { accountReducer } from './account/account.reducer';
import { BasicBlueprint } from '../models/blueprint.model';

export interface AccountState {
  myAccount: Account | null;
}

export interface DataState {
  blueprints: BasicBlueprint[];
  furniture: Furniture[];
  levels: Level[];
  slots: Slot[];
}

export interface AppState {
  account: AccountState;
  data: DataState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  account: accountReducer,
  data: dataReducer,
};
