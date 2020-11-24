import React from 'react';
import { Link,  } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkUserIsLogged } from '../../utils/utils';
import { rootUrl } from '../../App';
import history from '../../history';
import { fetchUserData } from '../../operations/user-operations';

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
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
                <Link className="navbar-brand" to="/">Qtrack</Link>
                <ul class="navbar-nav ml-auto">
                    {user.role === "U" && <li><Link className="nav-link" to="/user/home">Ogólne</Link></li>}
                    {user.role === "U" && <li><Link className="nav-link" to="/user/drivers">Kierowcy</Link></li>}
                    {user.role === "U" && <li><Link className="nav-link" to="/user/vehicles">Pojazdy</Link></li>}
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