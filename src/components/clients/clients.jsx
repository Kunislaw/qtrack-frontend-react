import React from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import { addClient, deleteClient, editClient, fetchClients } from '../../operations/client-operations';
import { checkUserIsLogged } from '../../utils/utils';


export class Clients extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
        console.error("XXXXXXXXXXXXXX", this.props.match.params.clientId);
        if(checkUserIsLogged()){
            
        } else {
            history.push("/");
        }
    }
    render() {
        return <>
        AAAAAAAAAAAAAAAAAAAA
            </>
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        clientsState: state.clientsState
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClients: (token) => dispatch(fetchClients(token)),
        addClient: (token, client) => dispatch(addClient(token, client)),
        editClient: (token, client) => dispatch(editClient(token, client)),
        deleteClient: (token, clientId) => dispatch(deleteClient(token, clientId))
    };
}

Clients = connect(mapStateToProps, mapDispatchToProps)(Clients);