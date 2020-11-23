import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '../../store';
import { fetchUserData } from "../../operations"
import { checkUserIsLogged } from '../../utils/utils';
import { rootUrl } from '../../App';

export class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
        }
    }

    async componentDidMount(){

        if(checkUserIsLogged()){
            const token = localStorage.getItem("access_token");
            this.props.fetchUserData(rootUrl + "/auth/user", {method: "GET", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
        }
    }



    render() {
        const { redirect } = this.state;
        const { user } = this.props;
        if(redirect){
            return <><Redirect to="/user/home" />{this.setState({redirect: false})}</>
        }
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
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserData: (url, options) => dispatch(fetchUserData(url, options))
    }
}



Navbar = connect(mapStateToProps, mapDispatchToProps)(Navbar)