import { createAction, props } from '@ngrx/store';
import { Account } from 'src/app/models/account.model';

export const getBigbrass = createAction('[Account] Get Bigbrass');

export const setMyAccount = createAction(
  `[Account] Set My Account`,
  props<{ payload: Account }>()
);

export const updateMyAccount = createAction(
  `[Account] Update My Account`,
  props<{ payload: Partial<Account> }>()
)
