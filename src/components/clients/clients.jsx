import React from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import { addClient, deleteClient, editClient, fetchClients } from '../../operations/client-operations';
import { checkUserIsLogged, historyPush } from '../../utils/utils';
import { faChevronLeft, faChevronRight, faEdit, faInfo, faLink, faPlus, faTrashAlt, faWrench } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import { Formik, ErrorMessage, Field, Form } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Footer } from '../footer';

export class Clients extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedItem: null,
            currentPage: 0,
            entriesPerPage: 15,
            show: false            
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
        if(((this.state.currentPage+1)*this.state.entriesPerPage) < this.props.clientsState.clients.length){
            this.setState((prevState) => ({currentPage: prevState.currentPage + 1}));
        }
    };


    componentDidMount(){
        //console.error("XXXXXXXXXXXXXX", this.props.match.params.clientId);
        if(checkUserIsLogged()){
            const token = localStorage.getItem("access_token");
            this.props.fetchClients(token);
        } else {
            history.push("/");
        }
    }
    render() {
        const { show, selectedItem, currentPage, entriesPerPage } = this.state;
        const { clientsState, user } = this.props;
        const clientsOnPage = clientsState.clients.slice((currentPage*entriesPerPage), entriesPerPage*(currentPage+1));
        const howManyEmptyRowsAdd = entriesPerPage - clientsOnPage.length;

        return <>
                <div className="container-md minHeight">
                    <div className="row pagination">
                        <div className="col-md-1 centering text-center">
                            {user.role === "A" && <button type="button" className="btn btn-success" onClick={() => this.selectOption({add: true})}><FontAwesomeIcon icon={faPlus} /></button>}
                        </div>
                        <div className="col-md-3 offset-md-8 centering text-center">
                            <button type="button" className="btn btn-primary" onClick={this.previousPage}><FontAwesomeIcon icon={faChevronLeft} /></button>
                             <span className="padding-page-information">Strona {(currentPage + 1)}/{Math.ceil(clientsState.clients.length/entriesPerPage)}</span>
                            <button type="button" className="btn btn-primary" onClick={this.nextPage}><FontAwesomeIcon icon={faChevronRight} /></button>
                        </div>    
                    </div>
                    <div className="row">
                        <div class="table-responsive">
                            <table class="table table-hover table-dark table-no-bottom-margin">
                            <thead class ="text-center">
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Identyfikator</th>
                                <th scope="col">Nazwa</th>
                                <th scope="col">Telefon</th>
                                <th scope="col">Zarządzaj</th>
                                <th scope="col">Szczegóły</th>
                                <th scope="col">Edytuj</th>
                                <th scope="col">Usuń</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientsOnPage.map((item, index) => {
                                    return <>
                                            <tr className="text-center">
                                            <th scope="row">{index + 1 + ((currentPage*entriesPerPage))}</th>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.phone}</td>
                                            <td><button type="button" className="btn btn-warning" onClick={(e) => historyPush(e, "/admin/manage/" + item.id + "/home")}><FontAwesomeIcon icon={faWrench} /></button></td>
                                            <td><button type="button" className="btn btn-primary" onClick={() => this.selectOption({...item, details: true})}><FontAwesomeIcon icon={faInfo} /></button></td>
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
                            {selectedItem?.add && "Dodaj klienta"}
                            {selectedItem?.delete && "Usuń klienta"}
                            {selectedItem?.edit && "Edytuj dane klienta"}
                        </Modal.Title>
                    </Modal.Header>
                    
                    <Formik
                            initialValues={{
                                name: selectedItem ? selectedItem.name : '',
                                phone: selectedItem ? selectedItem.phone : '',
                                zipCode: selectedItem ? selectedItem.zipCode : '',
                                address: selectedItem ? selectedItem.address : '',
                                firstName: selectedItem ? selectedItem.firstName : '',
                                lastName: selectedItem ? selectedItem.lastName : '',
                                isCompany: selectedItem ? selectedItem.isCompany : false,
                                companyName: selectedItem ? selectedItem.companyName : '',
                                companyCountry: selectedItem ? selectedItem.companyCountry : '',
                                companyTaxIdentifier: selectedItem ? selectedItem.companyTaxIdentifier : '',
                                }}
                                validate={values => {
                                const errors = {};
                                if(selectedItem.add || selectedItem.edit){

                                    if (!values.name) {
                                        errors.name = 'Podaj nazwe klienta';
                                    } else if (values?.name?.length < 2) {
                                        errors.name = 'Nazwa klienta nie może być krótsza niż 2 znaki';
                                    }

                                    if(!values.phone){
                                        errors.phone = "Podaj numer telefonu";
                                    } else if(values.phone && values.phone.match(new RegExp("\\d{9}"))){
                                        errors.phone = "Numer telefonu musi miec 9 cyfr"
                                    }

                                    if(!values.zipCode){
                                        errors.zipCode = "Podaj kod pocztowy";
                                    }
                                    if(!values.address){
                                        errors.address = "Podaj adres klienta"
                                    }

                                    if(values.isCompany){
                                        if(!values.companyName){
                                            errors.companyName = "Jeżeli klient jest firma, to podaj jej nazwe";
                                        } else if(values?.companyName?.length < 2 ){
                                            errors.companyName = "Nazwa firmy nie może być krótsza niż 2 znaki";
                                        }
                                        if(!values.companyTaxIdentifier){
                                            errors.companyTaxIdentifier = "Jeżeli klient jest firma, to podaj jego numer identyfikacji podatkowej";
                                        } else if (values?.companyTaxIdentifier?.length < 5){
                                            errors.companyTaxIdentifier = "Numer identyfikacji podatkowej nie może być krótszy niż znaków"
                                        }
                                    }

                                    if(!values.isCompany){
                                        if(!values.firstName){
                                            errors.firstName = "Jeżeli klient jest osoba prywatna, to podaj jego imie";
                                        } else if(values?.firstName?.length < 2){
                                            errors.firstName = "Imie klienta nie może być krótsze niż 2 znaki";
                                        }
                                    }

          
                                }
                                return errors;
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                if(checkUserIsLogged()){
                                    const token = localStorage.getItem("access_token");

                                    if(selectedItem.add){
                                        const payload = {...values, clientId: user.clientId};
                                        console.error("PAYLOAD11", payload);

                                        this.props.addClientVehicle(token, payload);
                                    } else if(selectedItem.edit){
                                        const payload = {...selectedItem, ...values};
                                        console.error("PAYLOAD22", payload);

                                        this.props.editClientVehicle(token, payload);                         
                                    } else if (selectedItem.delete){
                                        this.props.deleteClientVehicle(token, selectedItem.id);
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
                                        <label for="ownName">Nazwa własna (wymagane)</label>
                                        <Field type="text" class="form-control" name="ownName" />
                                        <ErrorMessage name="ownName" component="div" />
                                    </div>
                                    </>}
                                    {selectedItem.details && <>
                                    <div className="row">
                                        <div className="col-md-12">Marka: {selectedItem.mark}</div>
                                        <div className="col-md-12">Model: {selectedItem.model}</div>
                                        <div className="col-md-12">Numer rejestracyjny: {selectedItem.plate}</div>
                                        <div className="col-md-12">Rok produkcji: {selectedItem?.yearOfProduction ? selectedItem.yearOfProduction : "Brak"}</div>
                                        <div className="col-md-12">Numer VIN: {selectedItem?.vinNumber ? selectedItem.vinNumber : "Brak"}</div>
                                        <div className="col-md-12">Pojemność zbiornika paliwa: {selectedItem?.tankCapacity ? selectedItem.tankCapacity : "Brak"}</div>
                                        <div className="col-md-12">Pojemność silnika: {selectedItem?.engineCapacity ? selectedItem.engineCapacity : "Brak"}</div>
                                        <div className="col-md-12">Rodzaj paliwa: {selectedItem?.fuelType ? selectedItem.fuelType : "Brak"}</div>
                                        <div className="col-md-12">Przebieg: {selectedItem?.odometer ? selectedItem.odometer : "Brak"}</div>
                                        <div className="col-md-12">Kierowca: {selectedItem?.driver ? selectedItem.driver.firstName + " " + selectedItem.driver.lastName : "Brak"}</div>
                                        <div className="col-md-12">Urządzenie: {selectedItem?.device ? selectedItem.device.id : "Brak"}</div>
                                    </div>
                                    </>}
                                    {selectedItem.delete && "Czy na pewno chcesz usunać tego klienta i wszystkie zwiazane z nim dane?"}
                                </Modal.Body>
                                <Modal.Footer>
                                    {!selectedItem.details && <Button type="submit" variant="primary" disabled={isSubmitting}>
                                        {selectedItem?.add && "Dodaj"}
                                        {selectedItem?.delete && "Usuń"}
                                        {selectedItem?.edit && "Zapisz"}
                                    </Button>}
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