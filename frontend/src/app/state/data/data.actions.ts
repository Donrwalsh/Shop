import { createAction, props } from '@ngrx/store';
import { Slot } from '../../models/slots.model';

export const getSlots = createAction(
    '[Data] Get Slots'
)

export const haveSlots = createAction(
    '[Data] Slots Data Has Already Been Downloaded'
)

export const setSlots = createAction(
    '[Data] Set Slots',
    props<{ payload: Slot[]}>()
)