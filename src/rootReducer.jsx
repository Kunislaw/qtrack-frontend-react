import { combineReducers } from 'redux'
import { clientDriversReducer } from './reducers/client-drivers.reducer';
import { clientVehiclesReducer } from './reducers/client-vehicles.reducer';
import { userHaveErrorReducer, userIsLoadingReducer, userLoggingErrorReducer, userReducer, userRegisterErrorReducer } from './reducers/user-reducer';


const rootReducer = combineReducers({
    user: userReducer,
    userIsLoading: userIsLoadingReducer,
    userHaveError: userHaveErrorReducer,
    userLoggingError: userLoggingErrorReducer,
    userRegisterError: userRegisterErrorReducer,
    driversState: clientDriversReducer,
    vehiclesState: clientVehiclesReducer
});

export default rootReducer;