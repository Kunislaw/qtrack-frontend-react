import { rootUrl } from "../App"
import history from "../history"

export const userHaveError = (bool) => {
    return {
        type: "USER_HAVE_ERROR",
        hasError: bool
    }
}

export const userIsLoading = (bool) => {
    return {
        type: "USER_IS_LOADING",
        isLoading: bool
    }
}

export const userDataSuccess = (user) => {
    return {
        type: "USER_DATA_SUCCESS",
        user: user
    }
}

export const fetchUserData = (token) => {
    return async (dispatch) => {
        try{
            dispatch(userIsLoading(true));
            const response =  await fetch(rootUrl + "/auth/user", {method: "GET", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
            if(response.status !== 200){
                throw (1);
            } else {
                const bodyJson = await response.json();
                dispatch(userDataSuccess(bodyJson))
                if(bodyJson.role === "A"){
                    history.push("/admin/home");
                } else if(bodyJson.role === "U"){
                    history.push("/user/manage/" + bodyJson.clientId + "/home");
                }
            }
        } catch (error){
            history.push("/");
            localStorage.removeItem("access_token");
            dispatch(userHaveError(true))
        }

    };
}



export const userLoggingError = (error) => {
    return {
        type: "USER_LOGGING_ERROR",
        errorCode: error
    }
}

export const userLoginRequest = (url, body) => {
    return (dispatch) => {
        fetch(url, {method: "POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}).then((response) => {
            if(response.status !== 201){
                throw response.status;
            }
            return response.json();
        }).then((bodyJson) => {
            localStorage.setItem("access_token", bodyJson.access_token);
            history.push("/user/home");
        }).catch((error) => {
            dispatch(userLoggingError(error));
        });
    }
};

export const userRegisterError = (error) => {
    return {
        type: "USER_REGISTER_ERROR",
        errorCode: error
    }
}

export const userRegisterRequest = (url, body) => {
    return (dispatch) => {
        fetch(url, {method: "POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}).then((response) => {
            if(response.status !== 201){
                throw response.status;
            }
            return response.json();
        }).then((bodyJson) => {
            dispatch(userRegisterError(false));
            history.push("/");
        }).catch((error) => {
            dispatch(userRegisterError(error));
        });
    }
};




