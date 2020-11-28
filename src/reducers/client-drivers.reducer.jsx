const INITIAL_STATE_USER_REDUCER = {
    drivers: [],
    isFetching: false,
    error: {
        operation: null,
        errorCode: null,
        message: null
    }
};
export const clientDriversReducer = (state = INITIAL_STATE_USER_REDUCER, action) => {
    switch(action.type) {
        case "SET_ERROR_CLIENT_DRIVERS":
            return {...state, error: {operation: action.operation, errorCode: action.errorCode, message: action.message}};
        case "SET_FETCHING_CLIENT_DRIVERS":
            return {...state, isFetching: action.isFetching};
		case "CLIENT_DRIVERS_DATA_SUCCESS":{
            return {...state, drivers: action.drivers, isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
        case "ADD_CLIENT_DRIVER":{
            return {...state, drivers: [...state.drivers, action.driver], isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
        case "DELETE_CLIENT_DRIVER":{
            let findIndex = state.drivers.findIndex((item) => item.id === action.driverId);
            if(findIndex > -1){
                return {...state, drivers: [...state.drivers.slice(0, findIndex), ...state.drivers.slice(findIndex + 1)], isFetching: false, error: {operation: null, errorCode: null, message: null}}
            } else {
                return state;
            }
        }
        case "EDIT_CLIENT_DRIVER": {
            return {...state, drivers: state.drivers.map((item) => {
                if(item.id === action.driver.id){
                    return {...item, ...action.driver};
                } else {
                    return item;
                }
            }), isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
		default:
			return state;
	}
}