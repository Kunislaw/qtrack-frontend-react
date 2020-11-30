import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, ErrorMessage, Field, Form } from 'formik';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import history from '../../history';
import { addClientDevice, deleteClientDevice, editClientDevice, fetchClientDevices } from '../../operations/client-devices-operations';
import { checkUserIsLogged } from '../../utils/utils';
import { faChevronLeft, faChevronRight, faEdit, faInfo, faLink, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export class Devices extends React.Component {
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
        if(((this.state.currentPage+1)*this.state.entriesPerPage) < this.props.devicesState.devices.length){
            this.setState((prevState) => ({currentPage: prevState.currentPage + 1}));
        }
    };

    componentDidMount(){
        if(checkUserIsLogged()){
            const token = localStorage.getItem("access_token");
            const { clientId } = this.props.match.params;
            this.props.fetchClientDevices(token, clientId);
        } else {
            history.push("/");
        }
    }

    render() {
        const { show, selectedItem, currentPage, entriesPerPage } = this.state;
        const { devicesState, user } = this.props;
        const { clientId } = this.props.match.params;
        const devicesOnPage = devicesState.devices.slice((currentPage*entriesPerPage), entriesPerPage*(currentPage+1));
        const howManyEmptyRowsAdd = entriesPerPage - devicesOnPage.length;

        return <>
                <div className="container-md minHeight">
                    <div className="row pagination">
                        <div className="col-md-1 centering text-center">
                            {user.role === "A" && <button type="button" className="btn btn-success" onClick={() => this.selectOption({add: true})}><FontAwesomeIcon icon={faPlus} /></button>}
                        </div>
                        <div className="col-md-3 offset-md-8 centering text-center">
                            <button type="button" className="btn btn-primary" onClick={this.previousPage}><FontAwesomeIcon icon={faChevronLeft} /></button>
                             <span className="padding-page-information">Strona {(currentPage + 1)}/{Math.ceil(devicesState.devices.length/entriesPerPage)}</span>
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
                                <th scope="col">Nazwa własna</th>
                                <th scope="col">Pojazd</th>
                                <th scope="col">Przypisz urządzenie</th>
                                {user.role === "A" && <><th scope="col">Edytuj</th>
                                <th scope="col">Usuń</th></>}
                                </tr>
                            </thead>
                            <tbody>
                                {devicesOnPage.map((item, index) => {
                                    return <>
                                            <tr className="text-center">
                                            <th scope="row">{index + 1 + ((currentPage*entriesPerPage))}</th>
                                            <td>{item.id}</td>
                                            <td>{item.ownName}</td>
                                            <td>{item?.vehicle ? item.vehicle.mark + item.vehicle.model + "(" + item.vehicle.plate + ")" : "Brak"}</td>
                                            <td><button type="button" className="btn btn-warning" onClick={() => this.selectOption({...item, assign: true})}><FontAwesomeIcon icon={faLink} /></button></td>
                                            <td><button type="button" className="btn btn-primary" onClick={() => this.selectOption({...item, details: true})}><FontAwesomeIcon icon={faInfo} /></button></td>
                                            {user.role === "A" && <><td><button type="button" className="btn btn-secondary" onClick={() => this.selectOption({...item, edit: true})}><FontAwesomeIcon icon={faEdit} /></button></td>
                                            <td><button type="button" className="btn btn-danger" onClick={() => this.selectOption({...item, delete: true})}><FontAwesomeIcon icon={faTrashAlt} /></button></td></>}
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
                                        {user.role === "A" && <><th>&nbsp;</th>
                                        <th>&nbsp;</th></>}
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
                            {selectedItem?.add && "Dodaj Urządzenie"}
                            {selectedItem?.delete && "Usuń urządzenie"}
                            {selectedItem?.edit && "Edytuj urządzenie"}
                            {selectedItem?.assign && "Przypisz urządzenie do pojazdu"}
                        </Modal.Title>
                    </Modal.Header>
                    
                    <Formik
                            initialValues={{
                                ownName: selectedItem ? selectedItem.mark : '',
                                model: selectedItem ? selectedItem.model : '',

                                }}
                                validate={values => {
                                const errors = {};
                                if(selectedItem.add || selectedItem.edit){
                                    if (!values.ownName) {
                                        errors.ownName = 'Podaj nazwe własną urządzenia';
                                    } else if (values?.ownName?.length < 2) {
                                        errors.ownName = 'Nazwa własna nie możę być krótsza niż 2 znaki';
                                    }                           

          
                                }
                                return errors;
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                if(checkUserIsLogged()){
                                    const token = localStorage.getItem("access_token");
                                    if(values.fuelType === "") values.fuelType = null;
                                    if(selectedItem.add){
                                        const payload = {...values, clientId: clientId};
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
                                    {selectedItem.delete && "Czy na pewno chcesz usunać ten pojazd?"}
                                </Modal.Body>
                                <Modal.Footer>
                                    
                                    {!selectedItem.details && <Button type="submit" variant="primary" disabled={isSubmitting}>
                                        {selectedItem?.assign && "Przypisz"}
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
        devicesState: state.devicesState
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClientDevices: (token, clientId) => dispatch(fetchClientDevices(token, clientId)),
        addClientDevice: (token, device) => dispatch(addClientDevice(token, device)),
        editClientDevice: (token, device) => dispatch(editClientDevice(token, device)),
        deleteClientDevice: (token, deviceId) => dispatch(deleteClientDevice(token, deviceId))

    }
}

Devices = connect(mapStateToProps, mapDispatchToProps)(Devices);