import { ActionReducerMap } from '@ngrx/store';
import { dataReducer } from './data/data.reducer';
import { Level, Slot } from '../models/data.model';

export interface DataState {
  levels: Level[];
  slots: Slot[];
}

export interface AppState {
  data: DataState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  data: dataReducer,
};
