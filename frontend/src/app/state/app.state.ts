import { ActionReducerMap } from '@ngrx/store';
import { dataReducer} from './data/data.reducer';
import { Slot } from '../models/slots.model';

export interface DataState {
    slots: Slot[];
}

export interface AppState {
    data: DataState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
    data: dataReducer,
}