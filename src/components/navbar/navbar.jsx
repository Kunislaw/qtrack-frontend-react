import React from 'react';
import { connect } from 'react-redux';
import { checkUserIsLogged, historyPush } from '../../utils/utils';
import { rootUrl } from '../../App';
import history from '../../history';
import { fetchUserData } from '../../operations/user-operations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt, faTruck, faUser, faWheelchair } from '@fortawesome/free-solid-svg-icons';

export class Navbar extends React.Component {
    constructor(props){
        super(props);
    }

    async componentDidMount(){

        if(checkUserIsLogged()){
            const token = localStorage.getItem("access_token");
            this.props.fetchUserData(rootUrl + "/auth/user", {method: "GET", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
        } else {
            history.push("/");
        }
    }



    render() {
        const { user } = this.props;
        return <>
            <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
                <a className="navbar-brand" href="#" onClick={(e) => historyPush(e, "/")}>Qtrack</a>
                <ul class="navbar-nav ml-auto">
                    {user.role === "U" && <li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/user/home")}><FontAwesomeIcon icon={faHome}/>Ogólne</a></li>}
                    {user.role === "U" && <li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/user/drivers")}><FontAwesomeIcon icon={faUser}/>Kierowcy</a></li>}
                    {user.role === "U" && <li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/user/vehicles")}><FontAwesomeIcon icon={faTruck}/>Pojazdy</a></li>}
                    <li><a className="nav-link" href="#" onClick={(e) => historyPush(e, "/logout")}><FontAwesomeIcon icon={faSignOutAlt}/>Wyloguj</a></li>
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

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserData: (url, options) => dispatch(fetchUserData(url, options))
    }
}



Navbar = connect(mapStateToProps, mapDispatchToProps)(Navbar)