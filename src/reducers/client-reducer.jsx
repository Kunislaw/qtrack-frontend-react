const INITIAL_STATE_CLIENTS_REDUCER = {
    clients: [],
    isFetching: false,
    error: {
        operation: null,
        errorCode: null,
        message: null
    }
};
export const clientsReducer = (state = INITIAL_STATE_CLIENTS_REDUCER, action) => {
    switch(action.type) {
        case "SET_ERROR_CLIENTS":
            return {...state, error: {operation: action.operation, errorCode: action.errorCode, message: action.message}};
        case "SET_FETCHING_CLIENTS":
            return {...state, isFetching: action.isFetching};
		case "CLIENTS_DATA_SUCCESS":{
            return {...state, clients: action.clients, isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
        case "ADD_CLIENT":{
            return {...state, clients: [...state.clients, action.client], isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
        case "DELETE_CLIENT":{
            let findIndex = state.clients.findIndex((item) => item.id === action.clientId);
            if(findIndex > -1){
                return {...state, clients: [...state.clients.slice(0, findIndex), ...state.clients.slice(findIndex + 1)], isFetching: false, error: {operation: null, errorCode: null, message: null}}
            } else {
                return state;
            }
        }
        case "EDIT_CLIENT_VEHICLE": {
            return {...state, clients: state.clients.map((item) => {
                if(item.id === action.client.id){
                    return {...item, ...action.client};
                } else {
                    return item;
                }
            }), isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
		default:
			return state;
	}
}