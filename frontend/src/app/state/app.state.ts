import { ActionReducerMap } from '@ngrx/store';
import { dataReducer } from './data/data.reducer';
import { Furniture, Level, Slot } from '../models/data.model';
import { Account } from '../models/account.model';
import { accountReducer } from './account/account.reducer';
import { BasicBlueprint, Blueprint } from '../models/blueprint.model';
import { blueprintReducer } from './blueprint/blueprint.reducer';

export interface AccountState {
  myAccount: Account | null;
}

export interface BlueprintState {
  current: Blueprint;
}

export interface DataState {
  blueprints: BasicBlueprint[];
  furniture: Furniture[];
  levels: Level[];
  slots: Slot[];
}

export interface AppState {
  account: AccountState;
  blueprint: BlueprintState;
  data: DataState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  account: accountReducer,
  blueprint: blueprintReducer,
  data: dataReducer,
};
