import React from 'react';
import { Link,  } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkUserIsLogged } from '../../utils/utils';
import { rootUrl } from '../../App';
import history from '../../history';
import { addUserDriver, deleteUserDriver, editUserDriver, fetchUserDrivers } from '../../operations/user-drivers-operations';
import { Modal, Button } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';

export class Drivers extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            selectedItem: null
        }
    }

    selectOption = (item) => {
        this.setState({selectedItem: item, show: true});
    }

    handleClose = () => {
        this.setState((prevState) => ({show: false}));
    };

    async componentDidMount(){
        if(checkUserIsLogged()){
            const token = localStorage.getItem("access_token");
            this.props.fetchUserDrivers(rootUrl + "/drivers/client/" + this.props.user.clientId, {method: "GET", headers:{'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}});
        } else {
            history.push("/");
        }
    }



    render() {
        const { show, selectedItem } = this.state;
        const { drivers, user } = this.props;
        return <>
                <button type="button" className="btn btn-primary" onClick={() => this.selectOption({add: true})}>Dodaj</button>
                <table class="table table-hover table-dark">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Imie</th>
                    <th scope="col">Nazwisko</th>
                    <th scope="col">Telefon</th>
                    <th scope="col">Stanowisko</th>
                    <th scope="col">Auto</th>
                    <th scope="col">Edytuj</th>
                    <th scope="col">Usuń</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map((item, index) => {
                        return <>
                                <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td>{item.phone}</td>
                                <td>{item.position}</td>
                                <td>{item?.vehicle ? item.vehicle : "Brak"}</td>
                                <td><button type="button" className="btn btn-primary" onClick={() => this.selectOption({...item, edit: true})}>Edytuj</button></td>
                                <td><button type="button" className="btn btn-primary" onClick={() => this.selectOption({...item, delete: true})}>Usuń</button></td>
                                </tr>
                        </>
                    })}
                </tbody>
                </table>

                <Modal show={show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {selectedItem?.add && "Dodaj kierowce"}
                            {selectedItem?.delete && "Usuń kierowce"}
                            {selectedItem?.edit && "Edytuj kierowce"}
                        </Modal.Title>
                    </Modal.Header>
                    
                    <Formik
                            initialValues={{
                                firstName: selectedItem ? selectedItem.firstName : '',
                                lastName: selectedItem ? selectedItem.lastName : '',
                                phone: selectedItem ? selectedItem.phone : '',
                                position: selectedItem ? selectedItem.position : ''}}
                            validate={values => {
                                const errors = {};
                                if(selectedItem.add || selectedItem.edit){
                                    if (!values.firstName) {
                                        errors.firstName = 'Podaj imie';
                                    } else if (values.firstName.length < 2) {
                                        errors.firstName = 'Imię musi mieć chociaż 2 znaki';
                                    }
                                    if (!values.lastName) {
                                        errors.lastName = 'Podaj nazwisko';
                                    } else if (values?.lastName?.length < 2) {
                                        errors.lastName = 'Nazwisko musi mieć chociaż 2 znaki';
                                    }

                                    if(values.phone && values.phone !== "" && values.phone.length !== 9){
                                        errors.phone = "Numer telefonu musi miec 9 znakow"
                                    }

                                    if (!values.position) {
                                        errors.position = 'Podaj stanowisko';
                                    } else if (values.position.length < 2) {
                                        errors.position = 'Stanowisko musi mieć chociaż 2 znaki';
                                    }
                                }
                                return errors;
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                console.error("VALUEESS DRIVERS", values, selectedItem);
                                if(selectedItem.add){
                                    const payload = {...values, clientId: this.props.user.clientId};
                                    this.props.addUserDriver(rootUrl + "/drivers/create", payload);
                                } else if(selectedItem.edit){
                                    const payload = {...selectedItem, ...values};
                                    console.error("EDIT PAYLOAD", payload);
                                    this.props.editUserDriver(rootUrl + "/drivers/edit", payload);                         
                                } else if (selectedItem.delete){
                                    this.props.deleteUserDriver(rootUrl + "/drivers/delete/" + selectedItem.id, selectedItem);
                                }
                                this.setState({show: false});
      
                            }}
                            >
                            {({ isSubmitting }) => (
                                <><Form>
                                    <Modal.Body>
                                    {(selectedItem.add || selectedItem.edit) &&
                                    <><div className="form-group">
                                        <label for="firstName">Imię</label>
                                        <Field type="text" class="form-control" name="firstName" />
                                        <ErrorMessage name="firstName" component="div" />
                                    </div>
                                    <div className="form-group">
                                        <label for="lastName">Nazwisko</label>
                                        <Field type="text" class="form-control" name="lastName" />
                                        <ErrorMessage name="lastName" component="div" />
                                    </div>
                                    <div className="form-group">
                                        <label for="phone">Telefon:</label>
                                        <Field type="text" class="form-control" name="phone" />
                                        <ErrorMessage name="phone" component="div" />
                                    </div>
                                    <div className="form-group">
                                        <label for="position">Stanowisko</label>
                                        <Field type="text" class="form-control" name="position" />
                                        <ErrorMessage name="position" component="div" />
                                    </div></>}
                                
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                                        {selectedItem?.add && "Dodaj"}
                                        {selectedItem?.delete && "Usuń"}
                                        {selectedItem?.edit && "Zapisz"}
                                    </Button>
                                    <Button variant="secondary"  onClick={() => {this.handleClose()}}>Zamknij</Button>
                                </Modal.Footer>
                                </Form></>
                            )}
                    </Formik>
                </Modal>                
        </>
    }


}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        drivers: state.drivers,
        driversHaveError: state.driversHaveError,
        driversAreLoading: state.driversAreLoading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserDrivers: (url, options) => dispatch(fetchUserDrivers(url, options)),
        addUserDriver: (url, body) => dispatch(addUserDriver(url, body)),
        editUserDriver: (url, body) => dispatch(editUserDriver(url, body)),
        deleteUserDriver: (url, item) => dispatch(deleteUserDriver(url, item))
    }
}



Drivers = connect(mapStateToProps, mapDispatchToProps)(Drivers)