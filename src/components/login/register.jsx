import React from 'react';

export class Register extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return <div className="base-container" ref={this.props.containerRef}>
            <div className="header">Rejestracja</div>
            <div className="content">
                <div className="image">
                </div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="clientId">Identyfikator klienta</label>
                        <input type="text" name="clientId" placeholder="ID klienta"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" placeholder="email"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">Imię</label>
                        <input type="text" name="firstName" placeholder="imię"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Nazwisko</label>
                        <input type="text" name="lastName" placeholder="nazwisko"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="passowrd">Hasło</label>
                        <input type="password" name="password" placeholder="hasło"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="passowrd">Powtórz hasło</label>
                        <input type="password" name="password" placeholder="powtórz hasło"></input>
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn">Zarejestruj</button>
            </div>
        </div>
    }
}