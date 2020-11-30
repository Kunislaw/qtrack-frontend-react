import { combineReducers } from 'redux'
import { clientDevicesReducer } from './reducers/client-devices.reducer';
import { clientDriversReducer } from './reducers/client-drivers.reducer';
import { clientsReducer } from './reducers/client-reducer';
import { clientVehiclesReducer } from './reducers/client-vehicles.reducer';
import { userHaveErrorReducer, userIsLoadingReducer, userLoggingErrorReducer, userReducer, userRegisterErrorReducer } from './reducers/user-reducer';


const rootReducer = combineReducers({
    user: userReducer,
    userIsLoading: userIsLoadingReducer,
    userHaveError: userHaveErrorReducer,
    userLoggingError: userLoggingErrorReducer,
    userRegisterError: userRegisterErrorReducer,
    driversState: clientDriversReducer,
    vehiclesState: clientVehiclesReducer,
    devicesState: clientDevicesReducer,
    clientsState: clientsReducer
});

export default rootReducer;