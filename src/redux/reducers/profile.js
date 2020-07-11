import { SETUP_PROFILE } from '../actionTypes';

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case SETUP_PROFILE:
            return action.payload;
        default:
            return state;
    }
}
