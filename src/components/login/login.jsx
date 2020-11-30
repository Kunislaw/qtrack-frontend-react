import React from 'react';
import { rootUrl } from '../../App';
import { Link, Redirect } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import store from '../../store';
import { connect } from 'react-redux';
import { userLoginRequest, userRegisterRequest } from '../../operations/user-operations';

export class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            showError: false,
            errorInfo: ""
        }
    }

    componentDidMount(){
        console.error("STATE", store.getState());
    }

    render() {
        const { userLoggingError } = this.props;
        return <>
            <section id="cover" class="min-vh-100">
                <div id="cover-caption">
                    <div class="container">
                        <div class="row text-white">
                            <div class="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4">
                                <h1 class="display-4 py-2 text-truncate">Logowanie</h1>
                                <div class="px-2">
                                <Formik
                                    initialValues={{ email: '', password: '' }}
                                    validate={values => {
                                        const errors = {};
                                        if (!values.email) {
                                            errors.email = 'Adres email jest wymagany';
                                        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                            errors.email = 'Podano zły format adresu e-mail';
                                        }
                                        if(!values.password){
                                            errors.passowrd = "Musisz podać hasło"
                                        } else if(values.password.length < 5){
                                            errors.password = "Hasło musi posiadać przynajmniej 6 znaków"
                                        }
                                        return errors;
                                    }}
                                    onSubmit={async (values, { setSubmitting }) => {
                                        const payload = {username: values.email, password: values.password};
                                        this.props.userLoginRequest(rootUrl + "/auth/login", payload);
                                    }}
                                    >
                                    {({ isSubmitting }) => (
                                        <Form>
                                            <div className="form-group row">
                                                <label for="email text-center">Email</label>
                                                <Field type="email" class="form-control" name="email" />
                                                <ErrorMessage name="email" component="div" />
                                            </div>
                                            <div className="form-group row">
                                                <label for="password">Hasło</label>
                                                <Field type="password" class="form-control" name="password" />
                                                <ErrorMessage name="password" component="div" />
                                            </div>
                                            <div className="form-group row">
                                            {userLoggingError && <div class="alert alert-danger" role="alert">
                                                {userLoggingError === 401 && "Błędny login lub hasło"}
                                            </div>}
                                            </div>
                                            <div class="form-group row">
                                                <div class="col-md-6">
                                                    <button type="submit" class="btn btn-primary btn-lg" disabled={isSubmitting}>Zaloguj</button>
                                                </div>
                                                <div class="col-md-6">
                                                    <Link to="/register"><button type="submit" class="btn btn-primary btn-lg">Rejestracja</button></Link>
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

const mapStateToProps = (state) => {
    return {
        userLoggingError: state.userLoggingError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        userLoginRequest: (url, body) => dispatch(userLoginRequest(url, body))
    }
}


Login = connect(mapStateToProps, mapDispatchToProps)(Login);