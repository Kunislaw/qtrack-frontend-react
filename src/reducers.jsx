import { combineReducers } from 'redux'
import { rootUrl } from './App';
import { checkUserIsLogged } from './utils/utils';

const INITIAL_STATE_USER_REDUCER = {};
const userReducer = (state = INITIAL_STATE_USER_REDUCER, action) => {
    switch(action.type) {
		case "USER_DATA_SUCCESS":{
            return action.user;
        }
		default:
			return state;
	}
}
const userIsLoadingReducer = (state = false, action) => {
    switch (action.type) {
        case "USER_IS_LOADING":
            return action.isLoading;
        default:
            return state;    
    }
}
const userHaveErrorReducer = (state = false, action) => {
    switch (action.type) {
        case "USER_HAVE_ERROR":
            return action.hasError;
        default:
            return state;    
    }
}

const rootReducer = combineReducers({
    user: userReducer,
    userAreLoading: userIsLoadingReducer,
    userHaveError: userHaveErrorReducer
});

export default rootReducer;