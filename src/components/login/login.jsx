import React from 'react';
import axios from 'axios';
import { rootUrl } from '../../App';

export class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fields: {
                email: '',
                password: ''
            }
        }
    }

    changeHandler = (e) => {
        this.setState((prevState) => ({fields:{
            ...prevState.fields,
            [e.target.name]: e.target.value
        }}));

    }

    loginHandler = async (e) => {
        console.log(this.state.fields);
        console.log(rootUrl + "/auth/login");
        axios.post(rootUrl + "/auth/login", {
            username: this.state.fields.email,
            password: this.state.fields.password})
        .then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
  
    }

    render() {
        const {email, passowrd} = this.state.fields;
        return <div className="base-container" ref={this.props.containerRef}>
            <div className="header">Logowanie</div>
            <div className="content">
                <div className="image">
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" placeholder="email" onChange={this.changeHandler}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="passowrd">Hasło</label>
                        <input type="password" name="password" placeholder="hasło" onChange={this.changeHandler}></input>
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn" onClick={this.loginHandler}>Zaloguj</button>
            </div>
        </div>
    }
}