import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { rootUrl } from '../../App';
import { Link, Redirect } from 'react-router-dom';
export class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            showErros: false,
            errorInfo: ""
        }
    }

    render() {
        const { redirect, showErros, errorInfo } = this.state;
        if(redirect){
            return <><Redirect to="/" />{this.setState({redirect: false})}</>
        }
        return <>
            <section id="cover" class="min-vh-100">
                <div id="cover-caption">
                    <div class="container">
                        <div class="row text-white">
                            <div class="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4">
                                <h1 class="display-4 py-2 text-truncate">Rejestracja</h1>
                                <div class="px-2">
                                <Formik
                                    initialValues={{ clientId: '', firstName: '', lastName: '', email: '', password: '', repeatPassword: '' }}
                                    validate={values => {
                                        const errors = {};
                                        //-----Client Id------//
                                        if(!values.clientId){
                                            errors.clientId = "Pole identyfikator klienta jest wymagane";
                                        } else if(values.clientId.length !== 36){
                                            errors.clientId = "Pole identyfikatora klienta musi mieć 36 znaków"
                                        }
                                         //-----firstName------//
                                        if(!values.firstName){
                                            errors.firstName = "Pole imię jest wymagane";
                                        } else if(values.firstName.length < 2){
                                            errors.firstName = "Pole imię musi posiadać chociaż 2 znaki";
                                        }
                                         //-----lastName------//
                                        if(!values.lastName){
                                            errors.lastName = "Pole nazwisko jest wymagane";
                                        } else if(values.lastName.length < 2){
                                            errors.lastName = "Pole nazwisko musi posiadać chociaż 2 znaki";
                                        }
                                        //------Email--------//
                                        if (!values.email) {
                                            errors.email = 'Adres email jest wymagany';
                                        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                            errors.email = 'Podano zły format adresu e-mail';
                                        }
                                        //------Haslo-------//
                                        if(!values.password){
                                            errors.passowrd = "Musisz podać hasło"
                                        } else if(values.password.length < 8){
                                            errors.password = "Hasło musi posiadać przynajmniej 8 znaków"
                                        }
                                        //------Powtorz haslo-----//
                                        if(values.passowrd && !values.repeatPassword){
                                            errors.repeatPassword = "Powtórz hasło"
                                        } else if(values.passowrd && values.repeatPassword.length < 8){
                                            errors.repeatPassword = "Powtórzone hasło musi posaidać przynajmniej 8 znaków"
                                        } else if(values.repeatPassword === values.passowrd){
                                            errors.repeatPassword = "Podane hasła nie zgadzają się"
                                        }
                                        return errors;
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                    
                                        console.error("VALUES", values);
                                        fetch(rootUrl + "/auth/register", {method: "POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(values)}).then((response) => {
                                            console.error("RESPONSE", response);
                                            if(response.status === 404){ //Brak clientId
                                                this.setState({showErros: true, errorInfo: "Nie znaleziono takiego identyfikatora klienta"});
                                            } else if(response.status === 201){ //Pomyslnie utworzono usera
                                                this.setState({redirect: true});
                                            } else if(response.status === 409){ //Uzytkownik z takim adresem email juz istnieje
                                                this.setState({showErros: true, errorInfo: "Podany adres email jest już użyty"});
                                            }
                                            setSubmitting(false);
                                        }).catch((error) => {
                                            console.error("LOGIN", error);
                                        });
                                    }}
                                    >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <div className="form-group row">
                                                <label for="clientId">Identyfikator klienta</label>
                                                <Field type="text" class="form-control" name="clientId" />
                                                <ErrorMessage name="clientId" component="div" />
                                            </div>
                                            <div className="form-group row">
                                                <label for="firstName">Imię</label>
                                                <Field type="text" class="form-control" name="firstName" />
                                                <ErrorMessage name="firstName" component="div" />
                                            </div>
                                            <div className="form-group row">
                                                <label for="lastName">Nazwisko</label>
                                                <Field type="text" class="form-control" name="lastName" />
                                                <ErrorMessage name="lastName" component="div" />
                                            </div>
                                            <div className="form-group row">
                                                <label for="email">Email</label>
                                                <Field type="email" class="form-control" name="email" />
                                                <ErrorMessage name="email" component="div" />
                                            </div>
                                            <div className="form-group row">
                                                <label for="password">Hasło</label>
                                                <Field type="password" class="form-control" name="password" />
                                                <ErrorMessage name="password" component="div" />
                                            </div>
                                            <div className="form-group row">
                                                <label for="repeatPassword">Powtórz Hasło</label>
                                                <Field type="password" class="form-control" name="repeatPassword" />
                                                <ErrorMessage name="repeatPassword" component="div" />
                                            </div>
                                            <div className="form-group row">
                                            {showErros && <div class="alert alert-danger" role="alert">
                                                {errorInfo}
                                            </div>}
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-md-6">
                                                    <button type="submit" class="btn btn-primary btn-lg" disabled={isSubmitting}>Zaloguj</button>
                                                </div>
                                                <div class="col-md-6">
                                                    <Link to="/"><button type="submit" class="btn btn-primary btn-lg">Logowanie</button></Link>
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    }
}