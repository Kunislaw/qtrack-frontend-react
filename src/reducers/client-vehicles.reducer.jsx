const INITIAL_STATE_CLIENT_VEHICLES_REDUCER = {
    vehicles: [],
    isFetching: false,
    error: {
        operation: null,
        errorCode: null,
        message: null
    }
};
export const clientVehiclesReducer = (state = INITIAL_STATE_CLIENT_VEHICLES_REDUCER, action) => {
    switch(action.type) {
        case "SET_ERROR_CLIENT_VEHICLES":
            return {...state, error: {operation: action.operation, errorCode: action.errorCode, message: action.message}};
        case "SET_FETCHING_CLIENT_VEHICLES":
            return {...state, isFetching: action.isFetching};
		case "CLIENT_VEHICLES_DATA_SUCCESS":{
            return {...state, vehicles: action.vehicles, isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
        case "ADD_CLIENT_VEHICLE":{
            return {...state, vehicles: [...state.vehicles, action.vehicle], isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
        case "DELETE_CLIENT_VEHICLE":{
            let findIndex = state.vehicles.findIndex((item) => item.id === action.vehicleId);
            if(findIndex > -1){
                return {...state, vehicles: [...state.vehicles.slice(0, findIndex), ...state.vehicles.slice(findIndex + 1)], isFetching: false, error: {operation: null, errorCode: null, message: null}}
            } else {
                return state;
            }
        }
        case "EDIT_CLIENT_VEHICLE": {
            return {...state, vehicles: state.vehicles.map((item) => {
                if(item.id === action.vehicle.id){
                    return {...item, ...action.vehicle};
                } else {
                    return item;
                }
            }), isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
        case "ASSIGN_DEVICE": {
            return {...state, vehicles: state.vehicles.map((item) => {
                if(!item?.device && item.id === action.device.vehicleId){
                    return {...item, device: action.device};
                } else if(item?.device && item.device.id === action.device.id){
                    return {...item, device: null};
                } else {
                    return item;
                }
            }), isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
		default:
			return state;
	}
}