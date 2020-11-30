import { rootUrl } from "../App"
import history from "../history"

export const clientDevicesHaveError = (operation, errorCode, message) => {
    return {
        type: "SET_ERROR_CLIENT_DEVICES",
        operation: operation,
        errorCode: errorCode,
        message: message
    }
}

export const setFetchingClientDevices = (bool) => {
    return {
        type: "SET_FETCHING_CLIENT_DEVICES",
        isFetching: bool
    }
}

export const clientDevicesDataSuccess = (devices) => {
    return {
        type: "CLIENT_DEVICES_DATA_SUCCESS",
        devices: devices
    }
}

export const addClientDeviceSuccess = (device) => {
    return {
        type: "ADD_CLIENT_DEVICE",
        device: device,
    }
}
export const deleteClientDeviceSuccess = (deviceId) => {
    return {
        type: "DELETE_CLIENT_DEVICE",
        deviceId: deviceId,
    }  
}

export const editClientDeviceSuccess = (device) => {
    return {
        type: "EDIT_CLIENT_DEVICE",
        device: device,
    }      
}




export const fetchClientDevices = (token, clientId) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientDevices(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/devices/client/" + clientId, {method: "GET", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            if(response.status === 200){
                const bodyJson = await response.json();
                dispatch(clientDevicesDataSuccess(bodyJson))
            } else {
                throw ({operation: "GET_CLIENT_DEVICES", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR fetchClientVehicles", error);
            if(error?.operation){
                dispatch(clientDevicesHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientDevicesHaveError("GET_CLIENT_DEVICES", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const addClientDevice = (token, device) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientDevices(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/devices/create", {method: "POST", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify(device)});
            if(response.status === 201){
                const bodyJson = await response.json();
                dispatch(addClientDeviceSuccess(bodyJson))
            } else {
                throw ({operation: "ADD_CLIENT_DEVICE", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR addClientVehicle", error);
            if(error?.operation){
                dispatch(clientDevicesHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientDevicesHaveError("ADD_CLIENT_DEVICE", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const editClientDevice = (token, device) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientDevices(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/devices/edit", {method: "PUT", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify(device)});
            if(response.status === 200){
                const bodyJson = await response.json();
                dispatch(editClientDeviceSuccess(bodyJson))
                dispatch({type: "ASSIGN_DEVICE", device: device});
            } else {
                throw ({operation: "EDIT_CLIENT_DRIVER", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR editClientVehicle", error);
            if(error?.operation){
                dispatch(clientDevicesHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientDevicesHaveError("EDIT_CLIENT_DRIVER", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const deleteClientDevice = (token, deviceId) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientDevices(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/devices/delete/" + deviceId, {method: "DELETE", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            if(response.status === 200){
                const bodyJson = await response.json();
                dispatch(deleteClientDeviceSuccess(deviceId))
            } else {
                throw ({operation: "DELETE_CLIENT_DEVICE", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR deleteClientDevice", error);
            if(error?.operation){
                dispatch(clientDevicesHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientDevicesHaveError("DELETE_CLIENT_DEVICE", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}