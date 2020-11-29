const INITIAL_STATE_CLIENT_DEVICES_REDUCER = {
    devices: [],
    isFetching: false,
    error: {
        operation: null,
        errorCode: null,
        message: null
    }
};
export const clientDevicesReducer = (state = INITIAL_STATE_CLIENT_DEVICES_REDUCER, action) => {
    switch(action.type) {
        case "SET_ERROR_CLIENT_DEVICES":
            return {...state, error: {operation: action.operation, errorCode: action.errorCode, message: action.message}};
        case "SET_FETCHING_CLIENT_DEVICES":
            return {...state, isFetching: action.isFetching};
		case "CLIENT_DEVICES_DATA_SUCCESS":{
            return {...state, devices: action.devices, isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
        case "ADD_CLIENT_DEVICE":{
            return {...state, devices: [...state.devices, action.device], isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
        case "DELETE_CLIENT_DEVICE":{
            let findIndex = state.devices.findIndex((item) => item.id === action.deviceId);
            if(findIndex > -1){
                return {...state, vehicles: [...state.devices.slice(0, findIndex), ...state.devices.slice(findIndex + 1)], isFetching: false, error: {operation: null, errorCode: null, message: null}}
            } else {
                return state;
            }
        }
        case "EDIT_CLIENT_DEVICE": {
            return {...state, devices: state.devices.map((item) => {
                if(item.id === action.device.id){
                    return {...item, ...action.device};
                } else {
                    return item;
                }
            }), isFetching: false, error: {operation: null, errorCode: null, message: null}};
        }
		default:
			return state;
	}
}