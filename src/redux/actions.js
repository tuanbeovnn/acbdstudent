import { SETUP_PROFILE } from './actionTypes';

export const setupProfile = profile => ({
    type: SETUP_PROFILE,
    payload: profile
});