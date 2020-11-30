import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, ErrorMessage, Field, Form } from 'formik';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import history from '../../history';
import { addClientVehicle, fetchClientVehicles, editClientVehicle, deleteClientVehicle } from '../../operations/client-vehicles-operations';
import { checkUserIsLogged } from '../../utils/utils';
import { faChevronLeft, faChevronRight, faEdit, faInfo, faLink, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';


export class Vehicles extends React.Component {
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
        if(((this.state.currentPage+1)*this.state.entriesPerPage) < this.props.vehiclesState.vehicles.length){
            this.setState((prevState) => ({currentPage: prevState.currentPage + 1}));
        }
    };

    componentDidMount(){
        if(checkUserIsLogged()){
            const token = localStorage.getItem("access_token");
            const { clientId } = this.props.match.params;
            this.props.fetchClientVehicles(token, clientId);
        } else {
            history.push("/");
        }
    }
    render() {
        const { show, selectedItem, currentPage, entriesPerPage } = this.state;
        const { vehiclesState, driversState, user } = this.props;
        const { clientId } = this.props.match.params;
        const vehiclesOnPage = vehiclesState.vehicles.slice((currentPage*entriesPerPage), entriesPerPage*(currentPage+1));
        const howManyEmptyRowsAdd = entriesPerPage - vehiclesOnPage.length;
        
        return <>
                <div className="container-md minHeight">
                    <div className="row pagination">
                        <div className="col-md-1 centering text-center">
                            <button type="button" className="btn btn-success" onClick={() => this.selectOption({add: true})}><FontAwesomeIcon icon={faPlus} /></button>
                        </div>
                        <div className="col-md-3 offset-md-8 centering text-center">
                            <button type="button" className="btn btn-primary" onClick={this.previousPage}><FontAwesomeIcon icon={faChevronLeft} /></button>
                             <span className="padding-page-information">Strona {(currentPage + 1)}/{Math.ceil(vehiclesState.vehicles.length/entriesPerPage)}</span>
                            <button type="button" className="btn btn-primary" onClick={this.nextPage}><FontAwesomeIcon icon={faChevronRight} /></button>
                        </div>    
                    </div>
                    <div className="row">
                        <div class="table-responsive">
                            <table class="table table-hover table-dark table-no-bottom-margin">
                            <thead class ="text-center">
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Marka</th>
                                <th scope="col">Model</th>
                                <th scope="col">Tablica</th>
                                <th scope="col">Przypisz kierowce</th>
                                <th scope="col">Szczegóły</th>
                                <th scope="col">Edytuj</th>
                                <th scope="col">Usuń</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehiclesOnPage.map((item, index) => {
                                    return <>
                                            <tr className="text-center">
                                            <th scope="row">{index + 1 + ((currentPage*entriesPerPage))}</th>
                                            <td>{item.mark}</td>
                                            <td>{item.model}</td>
                                            <td>{item.plate}</td>
                                            <td><button type="button" className="btn btn-warning" onClick={() => this.selectOption({...item, assign: true})}><FontAwesomeIcon icon={faLink} /></button></td>
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
                            {selectedItem?.add && "Dodaj pojazd"}
                            {selectedItem?.delete && "Usuń pojazd"}
                            {selectedItem?.edit && "Edytuj pojazd"}
                            {selectedItem?.details && "Szczegóły pojazdu"}
                            {selectedItem?.assign && "Przypisz kierowce do pojazdu"}
                        </Modal.Title>
                    </Modal.Header>
                    
                    <Formik
                            initialValues={{
                                mark: selectedItem ? selectedItem.mark : '',
                                model: selectedItem ? selectedItem.model : '',
                                plate: selectedItem ? selectedItem.plate : '',
                                yearOfProduction: selectedItem ? selectedItem.yearOfProduction : '',
                                vinNumber: selectedItem ? selectedItem.vinNumber : '',
                                tankCapacity: selectedItem ? selectedItem.tankCapacity : '',
                                engineCapacity: selectedItem ? selectedItem.engineCapacity : '',
                                fuelType: selectedItem ? selectedItem.fuelType : '',
                                odometer: selectedItem ? selectedItem.odometer : '',
                                driverId: selectedItem?.assign ? '' : selectedItem?.driver ? selectedItem.driver.id : ''
                                }}
                                validate={values => {
                                const errors = {};
                                if(selectedItem.add || selectedItem.edit){
                                    if (!values.mark) {
                                        errors.mark = 'Podaj marke pojazdu';
                                    } else if (values?.mark?.length < 2) {
                                        errors.mark = 'Marka pojazdu musi posiadać minimum 2 znaki';
                                    }

                                    if (!values.model) {
                                        errors.model = 'Podaj model pojazdu';
                                    } else if (values?.model?.length < 2) {
                                        errors.model = 'Model pojazdu musi posiadać minimum 2 znaki';
                                    }

                                    if(!values.plate){
                                        errors.plate = "Podaj tablice rejestracyjną pojazdu";
                                    } else if (values?.plate?.length < 4){
                                        errors.plate = "Tablica rejestracyjna musi posiadać minimum 4 znaki";
                                    }

                                    if(values?.yearOfProduction && values.yearOfProduction !== "" && !values.yearOfProduction.match(new RegExp("^\\d{4}$"))){
                                        errors.yearOfProduction = "Jeżeli chcesz podać rok produkcji to musi być w formacie XXXX";
                                    }

                                    if(values?.vinNumber && values.vinNumber !== "" && !values.vinNumber.match(new RegExp("[A-Z0-9]{17}"))){
                                        errors.vinNumber = "Jeżeli chcesz podać numer VIN, musi posiadać on 17 znaków";
                                    }

                                    if(values?.tankCapacity && values.tankCapacity !== "" && !values.tankCapacity.match(new RegExp("^\\d{1,4}$"))){
                                        errors.tankCapacity = "Jeżeli chcesz podać pojemność zbiornika paliwa to musi posiadać od 1 do 4 cyfr";
                                    }

                                    if(values?.engineCapacity && values.engineCapacity !== "" && !values.engineCapacity.match(new RegExp("^\\d{1,6}$"))){
                                        errors.engineCapacity = "Jeżeli chcesz podać pojemność silnika to musi posiadać od 1 do 6 cyfr";
                                    }
                                    
                                    if(values?.odometer && values.odometer !== "" && !values.odometer.match(new RegExp("^\\d{1,6}$"))){
                                        errors.odometer = "Jeżeli chcesz podać przebieg pojazdu to musi posiadać od 1 do 6 cyfr";
                                    }                                    

          
                                }
                                return errors;
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                if(checkUserIsLogged()){
                                    const token = localStorage.getItem("access_token");
                                    if(values.fuelType === "") values.fuelType = null;
                                    if(values.driverId === "") values.driverId = null;
                                    if(selectedItem.add){
                                        const payload = {...values, clientId: clientId};
                                        console.error("PAYLOAD11", payload);

                                        this.props.addClientVehicle(token, payload);
                                    } else if(selectedItem.edit || selectedItem.assign){
                                        const payload = {...selectedItem, ...values};
                                        console.error("PAYLOAD22", payload);

                                        this.props.editClientVehicle(token, payload);                         
                                    } else if (selectedItem.delete){
                                        this.props.deleteClientVehicle(token, selectedItem.id);
                                    } else if(selectedItem.assign){
                                        const payload = {...selectedItem, ...values};
                                        console.error("PAYLOAD22", payload);
                                        this.props.editClientVehicle(token, payload);     
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
                                        <label for="mark">Marka (wymagane)</label>
                                        <Field type="text" class="form-control" name="mark" />
                                        <ErrorMessage name="mark" component="div" />
                                    </div>
                                    <div className="form-group">
                                        <label for="model">Model (wymagane)</label>
                                        <Field type="text" class="form-control" name="model" />
                                        <ErrorMessage name="model" component="div" />
                                    </div>
                                    <div className="form-group">
                                        <label for="plate">Tablica rejestracyjna (wymagane)</label>
                                        <Field type="text" class="form-control" name="plate" />
                                        <ErrorMessage name="plate" component="div" />
                                    </div>
                                    <div className="form-group">
                                        <label for="yearOfProduction">Rok produkcji (opcjonalne)</label>
                                        <Field type="text" class="form-control" name="yearOfProduction" />
                                        <ErrorMessage name="yearOfProduction" component="div" />
                                    </div>
                                    <div className="form-group">
                                        <label for="vinNumber">Numer VIN (opcjonalne)</label>
                                        <Field type="text" class="form-control" name="vinNumber" />
                                        <ErrorMessage name="vinNumber" component="div" />
                                    </div>
                                    <div className="form-group">
                                        <label for="tankCapacity">Pojemność zbiornika paliwa (opcjonalne)</label>
                                        <Field type="text" class="form-control" name="tankCapacity" />
                                        <ErrorMessage name="tankCapacity" component="div" />
                                    </div>
                                    <div className="form-group">
                                        <label for="engineCapacity">Pojemność silnika (opcjonalne)</label>
                                        <Field type="text" class="form-control" name="engineCapacity" />
                                        <ErrorMessage name="engineCapacity" component="div" />
                                    </div>
                                    <div className="form-group">
                                        <label for="fuelType">Rodzaj paliwa (opcjonalne)</label>
                                        <Field as="select"  class="form-control" name="fuelType">
                                            <option value="" selected>Nieistotne</option>
                                            <option value="Benzyna">Benzyna</option>
                                            <option value="Benzyna + LPG">Benzyna + LPG</option>
                                            <option value="Benzyna + CNG">Benzyna + CNG</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="Diesel + LPG">Diesel + LPG</option>
                                            <option value="Hybryda">Hybryda</option>
                                            <option value="Elektryczny">Elektryczny</option>
                                        </Field>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label for="odometer">Przebieg (opcjonalne)</label>
                                        <Field type="text" class="form-control" name="odometer" />
                                        <ErrorMessage name="odometer" component="div" />
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
                                    {selectedItem.assign && <>
                                        <div className="form-group">
                                        <label for="driverId">Kierowca</label>
                                        <Field as="select"  class="form-control" name="driverId">
                                            <option value="">Brak</option>
                                            {driversState.drivers.filter((driver) => !driver.vehicle).map((item) => {
                                                return <option value={item.id}>{item.firstName + " " + item.lastName + "(" + item.position + ")"}</option>
                                            })}
                                        </Field>
                                    </div>
                                    </>}
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
        driversState: state.driversState,
        vehiclesState: state.vehiclesState
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClientVehicles: (token, clientId) => dispatch(fetchClientVehicles(token, clientId)),
        addClientVehicle: (token, vehicle) => dispatch(addClientVehicle(token, vehicle)),
        editClientVehicle: (token, vehicle) => dispatch(editClientVehicle(token, vehicle)),
        deleteClientVehicle: (token, vehicleId) => dispatch(deleteClientVehicle(token, vehicleId))

    }
}

Vehicles = connect(mapStateToProps, mapDispatchToProps)(Vehicles);