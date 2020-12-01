const INITIAL_STATE_CLIENT_POSITIONS_REDUCER = {
    positions: [],
    isFetching: false,
    error: {
        operation: null,
        errorCode: null,
        message: null
    }
};
export const clientPositionsReducer = (state = INITIAL_STATE_CLIENT_POSITIONS_REDUCER, action) => {
    switch(action.type) {
        case "SET_ERROR_CLIENT_POSITIONS":
            return {...state, error: {operation: action.operation, errorCode: action.errorCode, message: action.message}};
        case "SET_FETCHING_CLIENT_POSITIONS":
            return {...state, isFetching: action.isFetching};
		case "CLIENT_POSITIONS_DATA_SUCCESS":{
            return {...state, positions: action.positions, isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
		default:
			return state;
	}
}