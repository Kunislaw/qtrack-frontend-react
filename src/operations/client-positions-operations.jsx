import { rootUrl } from "../App"
import history from "../history"

export const clientPositionsHaveError = (operation, errorCode, message) => {
    return {
        type: "SET_ERROR_CLIENT_POSITIONS",
        operation: operation,
        errorCode: errorCode,
        message: message
    }
}

export const setFetchingClientPositions = (bool) => {
    return {
        type: "SET_FETCHING_CLIENT_POSITIONS",
        isFetching: bool
    }
}

export const clientPositionsDataSuccess = (positions) => {
    return {
        type: "CLIENT_POSITIONS_DATA_SUCCESS",
        positions: positions
    }
}
export const clearClientPositionsData = () => {
    return {
        type: "CLEAR_CLIENT_POSITIONS_DATA"
    }
}




export const fetchClientPositions = (token, payload) => {
    return async (dispatch) => {
        try{
            dispatch(setFetchingClientPositions(true));//Ustaw oczekiwanie na dane
            const response = await fetch(rootUrl + "/positions/device/fromto", {method: "POST", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify(payload)});
            if(response.status === 201){
                const bodyJson = await response.json();
                console.error("XDD", bodyJson);
                dispatch(clientPositionsDataSuccess(bodyJson))
            } else {
                throw ({operation: "GET_CLIENT_POSITIONS", errorCode: response.status, message: response.statusText});
            }
           
        } catch (error){
            console.error("ERROR fetchClientPositions", error);
            if(error?.operation){
                dispatch(clientPositionsHaveError(error.operation, error.errorCode, error.message));
            } else {
                dispatch(clientPositionsHaveError("GET_CLIENT_POSITIONS", null, error.message));
            }
            localStorage.removeItem("access_token");
            history.push("/");
        }
    }
}

export const clearClientPositions = () => {
    return async (dispatch) => {
        dispatch(clearClientPositionsData());
    }
}