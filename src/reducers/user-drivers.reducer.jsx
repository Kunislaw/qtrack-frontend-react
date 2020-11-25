const INITIAL_STATE_USER_REDUCER = [];
export const userDriversReducer = (state = INITIAL_STATE_USER_REDUCER, action) => {
    switch(action.type) {
		case "USER_DRIVERS_DATA_SUCCESS":{
            return action.drivers;
        }
        case "ADD_USER_DRIVER":{
            return [...state, action.driver];
        }
        case "DELETE_USER_DRIVER":{
            let findIndex = state.findIndex((item) => item.id === action.driver.id);
            if(findIndex > -1){
                return [
                    ...state.slice(0, findIndex),
                    ...state.slice(findIndex + 1)
                ];
            } else {
                return state;
            }
        }
        case "EDIT_USER_DRIVER": {
            return state.map((item) => {
                if(item.id === action.driver.id){
                    return {...item, ...action.driver};
                } else {
                    return {...item}
                }
            });
        }
		default:
			return state;
	}
}
export const userDriversHaveErrorReducer = (state = false, action) => {
    switch (action.type) {
        case "USER_DRIVERS_HAVE_ERROR":
            return action.hasError;
        default:
            return state;    
    }
}