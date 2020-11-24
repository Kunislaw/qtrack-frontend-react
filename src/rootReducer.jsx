import { combineReducers } from 'redux'
import { userDriversHaveErrorReducer, userDriversReducer } from './reducers/user-drivers.reducer';
import { userHaveErrorReducer, userIsLoadingReducer, userLoggingErrorReducer, userReducer, userRegisterErrorReducer } from './reducers/user-reducer';


const rootReducer = combineReducers({
    user: userReducer,
    userIsLoading: userIsLoadingReducer,
    userHaveError: userHaveErrorReducer,
    userLoggingError: userLoggingErrorReducer,
    userRegisterError: userRegisterErrorReducer,
    drivers: userDriversReducer,
    driversHaveError: userDriversHaveErrorReducer,
});

export default rootReducer;