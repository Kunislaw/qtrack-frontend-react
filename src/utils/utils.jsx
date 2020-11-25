import history from "../history";

export const checkUserIsLogged = () => {
    const token = localStorage.getItem("access_token");
    if(token) return true;
    else return false;
};

export const historyPush = (e, url) => {
    e.preventDefault();
    history.push(url);
}