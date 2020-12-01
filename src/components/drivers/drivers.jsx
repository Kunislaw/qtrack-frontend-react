import React from 'react';
import { Link,  } from 'react-router-dom';
import { connect } from 'react-redux';
import { checkUserIsLogged } from '../../utils/utils';
import { rootUrl } from '../../App';
import history from '../../history';
import { Modal, Button } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { addClientDriver, editClientDriver, fetchClientDrivers, deleteClientDriver } from '../../operations/client-drivers-operations';

export class Drivers extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            selectedItem: null,
            currentPage: 0,
            entriesPerPage: 15,
        }
    }

    selectOption = (item) => {
        this.setState({selectedItem: item, show: true});
    }

    handleClose = () => {
        this.setState((prevState) => ({show: false}));
    };

    previousPage = () => {
        if(this.state.currentPage > 0){
            this.setState((prevState) => ({currentPage: prevState.currentPage - 1}));
        }
    }

    nextPage = () => {
        if(((this.state.currentPage+1)*this.state.entriesPerPage) < this.props.driversState.drivers.length){
            this.setState((prevState) => ({currentPage: prevState.currentPage + 1}));
        }
    };


    async componentDidMount(){
        if(checkUserIsLogged()){
            const token = localStorage.getItem("access_token");
            const { clientId } = this.props.match.params;
            this.props.fetchClientDrivers(token, clientId);
        } else {
            history.push("/");
        }
    }



    render() {
        const { show, selectedItem, currentPage, entriesPerPage } = this.state;
        const { driversState, user } = this.props;
        const { clientId } = this.props.match.params;
        const driversOnPage = driversState.drivers.slice((currentPage*entriesPerPage), entriesPerPage*(currentPage+1));
        const howManyEmptyRowsAdd = entriesPerPage - driversOnPage.length;
        return <>
                <div className="container-md minHeight">
                    <div className="row pagination">
                        <div className="col-md-1 centering text-center">
                            <button type="button" className="btn btn-success" onClick={() => this.selectOption({add: true})}><FontAwesomeIcon icon={faPlus} /></button>
                        </div>
                        <div className="col-md-3 offset-md-8 centering text-center">
                            <button type="button" className="btn btn-primary" onClick={this.previousPage}><FontAwesomeIcon icon={faChevronLeft} /></button>
                             <span className="padding-page-information">Strona {(currentPage + 1)}/{Math.ceil(driversState.drivers.length/entriesPerPage)}</span>
                            <button type="button" className="btn btn-primary" onClick={this.nextPage}><FontAwesomeIcon icon={faChevronRight} /></button>
                        </div>    
                    </div>
                    <div className="row">
                        <div class="table-responsive">
                            <table class="table table-hover table-dark table-no-bottom-margin">
                            <thead class ="text-center">
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
                                {driversOnPage.map((item, index) => {
                                    return <>
                                            <tr className="text-center">
                                            <th scope="row">{index + 1 + ((currentPage*entriesPerPage))}</th>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.position}</td>
                                            <td>{item?.vehicle ? item.vehicle.mark + " " + item.vehicle.model + " (" + item.vehicle.plate + ")" : "Brak"}</td>
                                            <td><button type="button" className="btn btn-secondary" onClick={() => this.selectOption({...item, edit: true})}><FontAwesomeIcon icon={faEdit} /></button></td>
                                            <td><button type="button" className="btn btn-danger" onClick={() => this.selectOption({...item, delete: true})}><FontAwesomeIcon icon={faTrashAlt} /></button></td>
                                            </tr>
                                    </>
                                })}
                                {new Array(howManyEmptyRowsAdd).fill(0).map(() => {
                                    return <>
                                    <tr>    
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                    </>
                                })}
                            </tbody>
                            </table>
                        </div>
                    </div>
                </div>
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

                                    if(values.phone && values.phone !== "" && values.phone.match(new RegExp("\\d{9}"))){
                                        errors.phone = "Numer telefonu musi miec 9 cyfr"
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
                                if(checkUserIsLogged()){
                                    const token = localStorage.getItem("access_token");
                                    if(selectedItem.add){
                                        const payload = {...values, clientId: clientId};
                                        this.props.addClientDriver(token, payload);
                                    } else if(selectedItem.edit){
                                        const payload = {...selectedItem, ...values};
                                        this.props.editClientDriver(token, payload);                         
                                    } else if (selectedItem.delete){
                                        this.props.deleteClientDriver(token, selectedItem.id);
                                    }
                                    this.setState({show: false});
                                } else {
                                    history.push("/");
                                }
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
        driversState: state.driversState
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClientDrivers: (token, clientId) => dispatch(fetchClientDrivers(token, clientId)),
        addClientDriver: (token, driver) => dispatch(addClientDriver(token, driver)),
        editClientDriver: (token, driver) => dispatch(editClientDriver(token, driver)),
        deleteClientDriver: (token, driverId) => dispatch(deleteClientDriver(token, driverId))
    }
}



Drivers = connect(mapStateToProps, mapDispatchToProps)(Drivers)