import { rootUrl } from "../App"
import history from "../history"

export const clientDriversHaveError = (operation, errorCode, message) => {
    return {
        type: "SET_ERROR_CLIENT_DRIVERS",
        operation: operation,
        errorCode: errorCode,
        message: message
    }
}

export const setFetchingClientDrivers = (bool) => {
    return {
        type: "SET_FETCHING_CLIENT_DRIVERS",
        isFetching: bool
    }
}

export const clientDriversDataSuccess = (drivers) => {
    return {
        type: "CLIENT_DRIVERS_DATA_SUCCESS",
        drivers: drivers
    }
}

export const addClientDriverSuccess = (driver) => {
    return {
        type: "ADD_CLIENT_DRIVER",
        driver: driver,
    }
}
export const deleteClientDriverSuccess = (driverId) => {
    return {
        type: "DELETE_CLIENT_DRIVER",
        driverId: driverId,
    }  
}

export const editClientDriverSuccess = (driver) => {
    return {
        type: "EDIT_CLIENT_DRIVER",
        driver: driver,
    }      
}




export const fetchClientDrivers = (token, clientId) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientDrivers(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/drivers/client/" + clientId, {method: "GET", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            if(response.status === 200){
                const bodyJson = await response.json();
                dispatch(clientDriversDataSuccess(bodyJson))
            } else {
                throw ({operation: "GET_CLIENT_DRIVERS", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR fetchClientDrivers", error);
            if(error?.operation){
                dispatch(clientDriversHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientDriversHaveError("GET_CLIENT_DRIVERS", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const addClientDriver = (token, driver) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientDrivers(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/drivers/create", {method: "POST", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify(driver)});
            if(response.status === 201){
                const bodyJson = await response.json();
                dispatch(addClientDriverSuccess(bodyJson))
            } else {
                throw ({operation: "ADD_CLIENT_DRIVER", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR addClientDriver", error);
            if(error?.operation){
                dispatch(clientDriversHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientDriversHaveError("ADD_CLIENT_DRIVER", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const editClientDriver = (token, driver) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientDrivers(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/drivers/edit", {method: "PUT", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify(driver)});
            if(response.status === 200){
                const bodyJson = await response.json();
                dispatch(editClientDriverSuccess(bodyJson))
            } else {
                throw ({operation: "EDIT_CLIENT_DRIVER", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            if(error?.operation){
                dispatch(clientDriversHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientDriversHaveError("EDIT_CLIENT_DRIVER", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const deleteClientDriver = (token, driverId) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientDrivers(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/drivers/delete/" + driverId, {method: "DELETE", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            if(response.status === 200){
                const bodyJson = await response.json();
                dispatch(deleteClientDriverSuccess(driverId))
            } else {
                throw ({operation: "DELETE_CLIENT_DRIVER", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("deleteClientDriver", error);
            if(error?.operation){
                dispatch(clientDriversHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientDriversHaveError("DELETE_CLIENT_DRIVER", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}