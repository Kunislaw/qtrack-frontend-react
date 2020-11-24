const INITIAL_STATE_USER_REDUCER = {};
export const userReducer = (state = INITIAL_STATE_USER_REDUCER, action) => {
    switch(action.type) {
		case "USER_DATA_SUCCESS":{
            return action.user;
        }
		default:
			return state;
	}
}
export const userIsLoadingReducer = (state = false, action) => {
    switch (action.type) {
        case "USER_IS_LOADING":
            return action.isLoading;
        default:
            return state;    
    }
}
export const userHaveErrorReducer = (state = false, action) => {
    switch (action.type) {
        case "USER_HAVE_ERROR":
            return action.hasError;
        default:
            return state;    
    }
}

export const userLoggingErrorReducer = (state = false, action) => {
    switch (action.type) {
        case "USER_LOGGING_ERROR":
            return action.errorCode;
        default:
            return state;    
    }
}

export const userRegisterErrorReducer = (state = false, action) => {
    switch (action.type) {
        case "USER_REGISTER_ERROR":
            return action.errorCode;
        default:
            return state;    
    }
}