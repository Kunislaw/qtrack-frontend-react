import React from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import { fetchUserData } from '../../operations/user-operations';
import { checkUserIsLogged } from '../../utils/utils';


export class CheckAuth extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
        if(checkUserIsLogged()){
            const token = localStorage.getItem("access_token");
            this.props.fetchUserData(token);
        } else {
            history.push("/");
        }
    }
    render() {
        return <>
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
        fetchUserData: (token) => dispatch(fetchUserData(token))
    }
}



CheckAuth = connect(mapStateToProps, mapDispatchToProps)(CheckAuth)