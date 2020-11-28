import { rootUrl } from "../App"
import history from "../history"

export const clientVehiclesHaveError = (operation, errorCode, message) => {
    return {
        type: "SET_ERROR_CLIENT_VEHICLES",
        operation: operation,
        errorCode: errorCode,
        message: message
    }
}

export const setFetchingClientVehicles = (bool) => {
    return {
        type: "SET_FETCHING_CLIENT_VEHICLES",
        isFetching: bool
    }
}

export const clientVehiclesDataSuccess = (vehicles) => {
    return {
        type: "CLIENT_VEHICLES_DATA_SUCCESS",
        vehicles: vehicles
    }
}

export const addClientVehicleSuccess = (vehicle) => {
    return {
        type: "ADD_CLIENT_VEHICLE",
        vehicle: vehicle,
    }
}
export const deleteClientVehicleSuccess = (vehicleId) => {
    return {
        type: "DELETE_CLIENT_VEHICLE",
        vehicleId: vehicleId,
    }  
}

export const editClientVehicleSuccess = (vehicle) => {
    return {
        type: "EDIT_CLIENT_VEHICLE",
        vehicle: vehicle,
    }      
}




export const fetchClientVehicles = (token, clientId) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientVehicles(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/vehicles/client/" + clientId, {method: "GET", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            if(response.status === 200){
                const bodyJson = await response.json();
                dispatch(clientVehiclesDataSuccess(bodyJson))
            } else {
                throw ({operation: "GET_CLIENT_VEHICLES", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR fetchClientVehicles", error);
            if(error?.operation){
                dispatch(clientVehiclesHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientVehiclesHaveError("GET_CLIENT_VEHICLES", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const addClientVehicle = (token, driver) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientVehicles(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/vehicles/create", {method: "POST", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify(driver)});
            if(response.status === 201){
                const bodyJson = await response.json();
                dispatch(addClientVehicleSuccess(bodyJson))
            } else {
                throw ({operation: "ADD_CLIENT_VEHICLE", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR addClientVehicle", error);
            if(error?.operation){
                dispatch(clientVehiclesHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientVehiclesHaveError("ADD_CLIENT_VEHICLE", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const editClientVehicle = (token, driver) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientVehicles(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/vehicles/edit", {method: "PUT", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify(driver)});
            if(response.status === 200){
                const bodyJson = await response.json();
                dispatch(editClientVehicleSuccess(bodyJson))
            } else {
                throw ({operation: "EDIT_CLIENT_DRIVER", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR editClientVehicle", error);
            if(error?.operation){
                dispatch(clientVehiclesHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientVehiclesHaveError("EDIT_CLIENT_DRIVER", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const deleteClientVehicle = (token, driverId) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientVehicles(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/vehicles/delete/" + driverId, {method: "DELETE", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            if(response.status === 200){
                const bodyJson = await response.json();
                dispatch(deleteClientVehicleSuccess(driverId))
            } else {
                throw ({operation: "DELETE_CLIENT_VEHICLE", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR deleteClientVehicle", error);
            if(error?.operation){
                dispatch(clientVehiclesHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientVehiclesHaveError("DELETE_CLIENT_VEHICLE", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}