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

export const fetchUserData = (url, options) => {
    return (dispatch) => {
        dispatch(userIsLoading(true));
        fetch(url, options).then((response) => {
            if(response.status !== 200){
                throw Error(response.statusText)
            }
            return response.json();
        })
        .then((bodyJson) => dispatch(userDataSuccess(bodyJson)))
        .catch((error) => dispatch(userHaveError(true)));
    }
}




