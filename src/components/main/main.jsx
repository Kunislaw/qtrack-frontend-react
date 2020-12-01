import { faChevronLeft, faChevronRight, faRoute, faTable } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { connect } from 'react-redux';
import { fetchClientPositions } from '../../operations/client-positions-operations';
import { checkUserIsLogged } from '../../utils/utils';
import { Modal, Button } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import history from '../../history';

export class Main extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            selectedItem: null,
            currentPage: 0,
            entriesPerPage: 15,
        }
    }

    componentDidMount(){
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
        if(((this.state.currentPage+1)*this.state.entriesPerPage) < this.props.vehiclesState.vehicles.filter((vehicle) => vehicle.device).length){
            this.setState((prevState) => ({currentPage: prevState.currentPage + 1}));
        }
    };

    render() {
        const { show, selectedItem, currentPage, entriesPerPage } = this.state;
        const { vehiclesState, user } = this.props;
        const { clientId } = this.props.match.params;
        const vehiclesWithDevicesOnPage = vehiclesState.vehicles.filter((vehicle) => vehicle.device).slice((currentPage*entriesPerPage), entriesPerPage*(currentPage+1));
        const howManyEmptyRowsAdd = entriesPerPage - vehiclesWithDevicesOnPage.length;

        const center = [53.121132, 17.992970]

        const polyline = [
          [53.121132, 17.992970],
          [53.015331, 18.605700],
        ]


        return <>
        <div className="container-fluid px-0">
            <div className="row no-gutters">
                <div className="col-md-3 pagination-main">
                        <div className="col-md-12 text-center no-gutters">
                            <button type="button" className="btn btn-primary" onClick={this.previousPage}><FontAwesomeIcon icon={faChevronLeft} /></button>
                             <span className="padding-page-information">Strona {(currentPage + 1)}/{Math.ceil(vehiclesState.vehicles.length/entriesPerPage)}</span>
                            <button type="button" className="btn btn-primary" onClick={this.nextPage}><FontAwesomeIcon icon={faChevronRight} /></button>
                        </div>   
                        <div class="table-responsive">
                            <table class="table table-hover table-dark table-no-bottom-margin">
                            <thead class ="text-center">
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Auto</th>
                                <th scope="col">Trasa</th>
                                <th scope="col">Raport</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehiclesWithDevicesOnPage.map((item, index) => {
                                    return <>
                                            <tr className="text-center">
                                            <th scope="row">{index + 1 + ((currentPage*entriesPerPage))}</th>
                                            <td>{item.mark + " " + item.model + " (" + item.plate + ")"}</td>
                                            <td><button type="button" className="btn btn-secondary" onClick={() => this.selectOption({...item, route: true})}><FontAwesomeIcon icon={faRoute} /></button></td>
                                            <td><button type="button" className="btn btn-danger" onClick={() => this.selectOption({...item, raport: true})}><FontAwesomeIcon icon={faTable} /></button></td>
                                            </tr>
                                    </>
                                })}
                            </tbody>
                            </table>
                        </div>
                </div>
                <div className="col-md-9">
                <div className="leaflet-container">
                <MapContainer center={center} zoom={13} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polyline positions={polyline}/>
                </MapContainer>
                </div>
                </div>
            </div>
        </div>
        <Modal show={show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {selectedItem?.route && "Wyznacz trase"}
                            {selectedItem?.raport && "Generuj raport"}
                        </Modal.Title>
                    </Modal.Header>
                    
                    <Formik
                            enableReinitialize
                            initialValues={{
                                startDate: new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString().padStart(2,"0") + "-" + new Date().getDate().toString().padStart(2,"0"),
                                startTime: "00:00",
                                stopDate: new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString().padStart(2,"0") + "-" + new Date().getDate().toString().padStart(2,"0"),
                                stopTime: new Date().getHours().toString().padStart(2,"0") + ":" + new Date().getMinutes().toString().padStart(2,"0")}}
                                validate={values => {
                                const errors = {};
                                if(selectedItem.route){
                                    if (!values.startDate || values.startDate === "") {
                                        errors.startDate = 'Podaj date poczatkowa';
                                    } else if (!values.startTime || values.startTime === "") {
                                        errors.startDate = 'Podaj czas startowy';
                                    } else if (!values.stopDate || values.stopDate === "") {
                                        errors.startDate = "Podaj date końcową"
                                    } else if(!values.stopTime || values.stopTime === "") {
                                        errors.startDate = "Podaj czas końcowy"
                                    } else if(values.startDate && values.startDate !== "" &&values.startTime && values.startTime !== "" && values.stopDate && values.stopDate !== "" && values.stopTime && values.stopTIme !== ""){
                                        let splittedDateStart = values.startDate.split("-");
                                        let splittedTimeStart = values.startTime.split(":");
                                        let splittedDateStop = values.stopDate.split("-");
                                        let splittedTimeStop = values.stopTime.split(":");
                                        let yearStart = parseInt(splittedDateStart[0]);
                                        let monthStart = parseInt(splittedDateStart[1]);
                                        let dayStart = parseInt(splittedDateStart[2]);
                                        let hoursStart = parseInt(splittedTimeStart[0]);
                                        let minutesStart = parseInt(splittedTimeStart[1]);
                                        let yearStop = parseInt(splittedDateStop[0]);
                                        let monthStop = parseInt(splittedDateStop[1]);
                                        let dayStop = parseInt(splittedDateStart[2]);
                                        let hoursStop = parseInt(splittedTimeStop[0]);
                                        let minutesStop = parseInt(splittedTimeStop[1]);
                                        let startDate = new Date(yearStart, monthStart - 1, dayStart, hoursStart, minutesStart);
                                        let stopDate = new Date(yearStop, monthStop - 1, dayStop, hoursStop, minutesStop);
                                        let currentDateMinus3Month = new Date().setMonth(new Date().getMonth() - 3);
                                        if(startDate.getTime() > stopDate.getTime()){
                                            errors.startDate = "Data i czas startowy nie moze byc wiekszy od daty i czasu konćowego";
                                        } else if((currentDateMinus3Month > startDate.getTime())) {
                                            errors.startDate = "Data startowa jest starsza niz 3 miesiace, nie przechowujemy danych dluzej niz 3 m-c";
                                        } else if((currentDateMinus3Month > stopDate.getTime())){
                                            errors.startDate = "Data koncowa jest starsza niz 3 miesiace, nie przechowujemy danych dluzej niz 3 m-c";
                                        }
                                    }                            
                                }
                                return errors;
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                console.error("VALUEESS DRIVERS", values, selectedItem);
                                if(checkUserIsLogged()){
                                    const token = localStorage.getItem("access_token");
                                    // if(selectedItem.route){
                                    //     const payload = {...values, clientId: clientId};
                                    //     this.props.addClientDriver(token, payload);
                                    // } else if(selectedItem.raport){
                                    //     const payload = {...selectedItem, ...values};
                                    //     this.props.editClientDriver(token, payload);                         
                                    // }
                                    this.setState({show: false});
                                } else {
                                    history.push("/");
                                }
                            }}
                            >
                            {({ isSubmitting }) => (
                                <><Form>
                                    <Modal.Body>
                                    {selectedItem.route &&
                                    <><div className="form-group">
                                        <label for="startDate">Data początkowa</label>
                                        <Field type="date" class="form-control" name="startDate" />
                                    </div>
                                    <div className="form-group">
                                        <label for="startTime">Czas początkowy</label>
                                        <Field type="time" class="form-control" name="startTime" />
                                    </div>
                                    <div className="form-group">
                                        <label for="stopDate">Data końcowa</label>
                                        <Field type="date" class="form-control" name="stopDate" />
                                    </div>
                                    <div className="form-group">
                                        <label for="stopTime">Czas końcowy</label>
                                        <Field type="time" class="form-control" name="stopTime" />
                                    </div>
                                    <div className="form-group">
                                        <ErrorMessage name="startDate" component="div" />
                                    </div>
                                    </>}
                                    {selectedItem.raport && <></>}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                                        {selectedItem?.route && "Wyznacz"}
                                        {selectedItem?.raport && "Generuj"}
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
        vehiclesState: state.vehiclesState,
        positionsState: state.driversState
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClientPositions: (token, payload) => dispatch(fetchClientPositions(token, payload)),

    }
}



Main = connect(mapStateToProps, mapDispatchToProps)(Main)

