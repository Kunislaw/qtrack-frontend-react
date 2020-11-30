import { rootUrl } from "../App"
import history from "../history"

export const clientsHaveError = (operation, errorCode, message) => {
    return {
        type: "SET_ERROR_CLIENTS",
        operation: operation,
        errorCode: errorCode,
        message: message
    }
}

export const setFetchingClients = (bool) => {
    return {
        type: "SET_FETCHING_CLIENTS",
        isFetching: bool
    }
}

export const clientsDataSuccess = (clients) => {
    return {
        type: "CLIENTS_DATA_SUCCESS",
        clients: clients
    }
}

export const addClientSuccess = (client) => {
    return {
        type: "ADD_CLIENT",
        client: client,
    }
}
export const deleteClientSuccess = (clientId) => {
    return {
        type: "DELETE_CLIENT",
        clientId: clientId,
    }  
}

export const editClientSuccess = (client) => {
    return {
        type: "EDIT_CLIENT_VEHICLE",
        client: client,
    }      
}




export const fetchClients = (token) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClients(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/clients", {method: "GET", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            if(response.status === 200){
                const bodyJson = await response.json();
                dispatch(clientsDataSuccess(bodyJson))
            } else {
                throw ({operation: "GET_CLIENTS", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR fetchClients", error);
            if(error?.operation){
                dispatch(clientsHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientsHaveError("GET_CLIENTS", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const addClient = (token, client) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClients(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/clients/create", {method: "POST", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify(client)});
            if(response.status === 201){
                const bodyJson = await response.json();
                dispatch(addClientSuccess(bodyJson))
            } else {
                throw ({operation: "ADD_CLIENT", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR addClient", error);
            if(error?.operation){
                dispatch(clientsHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientsHaveError("ADD_CLIENT", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const editClient = (token, client) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClients(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/clients/edit", {method: "PUT", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify(client)});
            if(response.status === 200){
                const bodyJson = await response.json();
                dispatch(editClientSuccess(bodyJson))
            } else {
                throw ({operation: "EDIT_CLIENT", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR editClient", error);
            if(error?.operation){
                dispatch(clientsHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientsHaveError("EDIT_CLIENT", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const deleteClient = (token, clientId) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClients(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/clients/delete/" + clientId, {method: "DELETE", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            if(response.status === 200){
                const bodyJson = await response.json();
                dispatch(deleteClientSuccess(clientId))
            } else {
                throw ({operation: "DELETE_CLIENT", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR deleteClientVehicle", error);
            if(error?.operation){
                dispatch(clientsHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientsHaveError("DELETE_CLIENT", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}