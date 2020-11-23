export const checkUserIsLogged = () => {
    const token = localStorage.getItem("access_token");
    if(token) return true;
    else return false;
};