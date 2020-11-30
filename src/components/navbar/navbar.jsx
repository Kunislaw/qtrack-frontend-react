import React from 'react';
import { connect } from 'react-redux';
import { checkUserIsLogged, historyPush } from '../../utils/utils';
import { rootUrl } from '../../App';
import history from '../../history';
import { fetchUserData } from '../../operations/user-operations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMicrochip, faSignOutAlt, faTruck, faUser, faUsers, faWheelchair } from '@fortawesome/free-solid-svg-icons';

export class Navbar extends React.Component {
    constructor(props){
        super(props);
    }

    logOut = (e) => {
        localStorage.removeItem("access_token");
        historyPush(e, "/");
    }

    render() {
        const { user } = this.props;
        const { clientId } = this?.props?.match?.params || {clientId: null};
        return <>
            <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
                <a className="navbar-brand" href="#" onClick={(e) => historyPush(e, "/")}>Qtrack</a>
                <ul class="navbar-nav ml-auto">
                    {user.role === "U" && <><li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/user/manage/" + clientId + "/home")}><FontAwesomeIcon icon={faHome}/>Ogólne</a></li>
                    <li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/user/manage/" + clientId + "/drivers")}><FontAwesomeIcon icon={faUser}/>Kierowcy</a></li>
                    <li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/user/manage/" + clientId + "/vehicles")}><FontAwesomeIcon icon={faTruck}/>Pojazdy</a></li>
                    <li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/user/manage/" + clientId + "/devices")}><FontAwesomeIcon icon={faMicrochip}/>Urządzenia</a></li></>}


                    {user.role === "A" && clientId && <><li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/admin/home")}><FontAwesomeIcon icon={faUsers}/>Klienci</a></li>
                    <li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/admin/manage/" + clientId + "/home")}><FontAwesomeIcon icon={faHome}/>Ogólne</a></li>
                    <li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/admin/manage/" + clientId + "/drivers")}><FontAwesomeIcon icon={faUser}/>Kierowcy</a></li>
                    <li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/admin/manage/" + clientId + "/vehicles")}><FontAwesomeIcon icon={faTruck}/>Pojazdy</a></li>
                    <li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/admin/manage/" + clientId + "/devices")}><FontAwesomeIcon icon={faMicrochip}/>Urządzenia</a></li></>}
                    <li><a className="nav-link" href="#" onClick={(e) => this.logOut(e)}><FontAwesomeIcon icon={faSignOutAlt}/>Wyloguj</a></li>
                </ul>
            </nav>
        </>
    }


}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        userIsLoading: state.userIsLoading,
        userHaveError: state.userHaveError
    }
}

Navbar = connect(mapStateToProps, null)(Navbar)