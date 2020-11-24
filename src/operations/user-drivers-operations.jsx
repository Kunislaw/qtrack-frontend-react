import history from "../history"

export const userDriversHaveError = (bool) => {
    return {
        type: "USER_DRIVERS_HAVE_ERROR",
        hasError: bool
    }
}

export const userDriversDataSuccess = (drivers) => {
    return {
        type: "USER_DRIVERS_DATA_SUCCESS",
        drivers: drivers
    }
}

export const addUserDriverSuccess = (driver) => {
    return {
        type: "ADD_USER_DRIVER",
        driver: driver,
    }
}
export const deleteUserDriverSuccess = (driver) => {
    return {
        type: "DELETE_USER_DRIVER",
        driver: driver,
    }  
}

export const editUserDriverSuccess = (driver) => {
    return {
        type: "EDIT_USER_DRIVER",
        driver: driver,
    }      
}



export const fetchUserDrivers = (url, options) => {
    return (dispatch) => {
        fetch(url, options).then((response) => {
            if(response.status !== 200){
                throw response.status
            }
            return response.json();
        })
        .then((bodyJson) => {
            dispatch(userDriversDataSuccess(bodyJson))
        })
        .catch((error) => {
            history.push("/");
            localStorage.removeItem("access_token");
            dispatch(userDriversHaveError(true))
        });
    }
}

export const addUserDriver = (url, body) => {
    return (dispatch) => {
        fetch(url, {method: "POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}).then((response) => {
            if(response.status !== 201){
                throw response.status
            }
            return response.json();
        })
        .then((bodyJson) => {
            dispatch(addUserDriverSuccess(bodyJson))
        })
        .catch((error) => {
            history.push("/");
            localStorage.removeItem("access_token");
            dispatch(userDriversHaveError(true))
        });
    }
}

export const editUserDriver = (url, options) => {
    return (dispatch) => {
        fetch(url, options).then((response) => {
            if(response.status !== 201){
                throw response.status
            }
            return response.json();
        })
        .then((bodyJson) => {
            dispatch(userDriversDataSuccess(bodyJson))
        })
        .catch((error) => {
            history.push("/");
            localStorage.removeItem("access_token");
            dispatch(userDriversHaveError(true))
        });
    }
}

export const deleteUserDriver = (url, options) => {
    return (dispatch) => {
        fetch(url, options).then((response) => {
            if(response.status !== 200){
                throw response.status
            }
            return response.json();
        })
        .then((bodyJson) => {
            dispatch(userDriversDataSuccess(bodyJson))
        })
        .catch((error) => {
            history.push("/");
            localStorage.removeItem("access_token");
            dispatch(userDriversHaveError(true))
        });
    }
}