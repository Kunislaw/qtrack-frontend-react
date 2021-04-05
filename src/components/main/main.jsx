import { faChevronLeft, faChevronRight, faEraser, faRoute, faTable } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createRef } from 'react';
import { Map, Marker, Polyline, Popup, TileLayer, Tooltip } from 'react-leaflet';
import { connect } from 'react-redux';
import { clearClientPositions, fetchClientPositions } from '../../operations/client-positions-operations';
import { checkUserIsLogged } from '../../utils/utils';
import { Modal, Button } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import history from '../../history';
import { iconFinish, iconPin, iconStart, iconTruck } from '../../icons';
import { fetchClientDrivers } from '../../operations/client-drivers-operations';
import { fetchClientDevices } from '../../operations/client-devices-operations';
import { fetchClientVehicles } from '../../operations/client-vehicles-operations';
export class Main extends React.Component {
    mapRef = createRef();
    polylineRef = createRef();
    intervalVehicles = null;
    constructor(props){
        super(props);
        this.state = {
            show: false,
            selectedItem: null,
            currentPage: 0,
            entriesPerPage: 15
        };
        this.intervalVehicles = null;
    }
    degToRad = (degress) => {
        const pi = Math.PI;
        return degress * (pi/180);     
    }

    distFrom = (lat1, lng1, lat2, lng2) => {
        let earthRadius = 6371000; //meters
        let dLat = this.degToRad(lat2-lat1);
        let dLng = this.degToRad(lng2-lng1); 
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * Math.sin(dLng/2) * Math.sin(dLng/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let dist = (earthRadius * c);
        return dist;     
    }

    componentDidMount(){
        if(checkUserIsLogged()){
            const token = localStorage.getItem("access_token");
            const { clientId } = this?.props?.match?.params || {clientId: null};
            this.props.fetchClientVehicles(token, clientId);
            this.props.fetchClientDrivers(token, clientId);
            this.props.fetchClientDevices(token, clientId);
            this.intervalVehicles = setInterval(this.props.fetchClientVehicles, 5000, token, clientId);
        } else {
            history.push("/");
        }
    }

    componentWillUnmount(){
        clearInterval(this.intervalVehicles);
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
        const { vehiclesState, positionsState, user } = this.props;
        const { clientId } = this.props.match.params;
        const vehiclesWithDevicesOnPage = vehiclesState.vehicles.filter((vehicle) => vehicle.device).slice((currentPage*entriesPerPage), entriesPerPage*(currentPage+1));
        const vehiclesWithLastPosition = vehiclesState.vehicles.filter((vehicle) => vehicle?.device?.lastPosition);
        const howManyEmptyRowsAdd = entriesPerPage - vehiclesWithDevicesOnPage.length;

        let arrayOfSpeeds = [];
        let minSpeed;
        let averageSpeed;
        let maxSpeed;
        let distance;
        let bounds = [[53.13639949265994, 17.97219069937233],
                      [53.11833656504155, 18.079250439434617]
                    ];
        
        if(positionsState.positions.length > 0){
            bounds = [];
            for(let i = 0; i < positionsState.positions.length; i++){
                bounds.push([positionsState.positions[i].latitude, positionsState.positions[i].longitude])
                if(i === 0){
                    distance = 0;
                } else {
                    distance += this.distFrom(positionsState.positions[i].latitude, positionsState.positions[i].longitude, positionsState.positions[i-1].latitude, positionsState.positions[i-1].longitude);
                }
            }
            distance = (distance/1000).toFixed(1);
            arrayOfSpeeds = positionsState.positions.map((v) => v.speed);
            minSpeed = (Math.min(...arrayOfSpeeds) * 3.6).toFixed(1);
            averageSpeed = ((arrayOfSpeeds.reduce((a,b) => a+b, 0) * 3.6) / arrayOfSpeeds.length).toFixed(1)
            maxSpeed = (Math.max(...arrayOfSpeeds) * 3.6).toFixed(1);
        } else if (vehiclesWithLastPosition.length > 0){
            bounds = [];
            for(let i = 0; i < vehiclesWithLastPosition.length; i++){
                bounds.push([vehiclesWithLastPosition[i].device.lastPosition.latitude, vehiclesWithLastPosition[i].device.lastPosition.longitude]);
            }
        }

        const polyline = positionsState.positions.map((value) => [value.latitude, value.longitude])


        return <>
        <div className="container-fluid px-0">
            <div className="row no-gutters">
                <div className="col-md-3 pagination-main">
                        <div className="row">
                            <div className="col-md-6 text-center no-gutters">
                                <button type="button" className="btn btn-primary" onClick={this.previousPage}><FontAwesomeIcon icon={faChevronLeft} /></button>
                                <span className="padding-page-information">Strona {(currentPage + 1)}/{Math.ceil(vehiclesState.vehicles.length/entriesPerPage)}</span>
                                <button type="button" className="btn btn-primary" onClick={this.nextPage}><FontAwesomeIcon icon={faChevronRight} /></button>
                            </div>
                            <div className="col-md-3 text-center no-gutters">
                                <button type="button" className="btn btn-info" onClick={() => this.selectOption({eraseRoute: true})}><FontAwesomeIcon icon={faEraser} /></button>
                            </div>
                            <div className="col-md-3 text-center no-gutters">
                                <button type="button" className="btn btn-danger" onClick={() => this.selectOption({raport: true})}><FontAwesomeIcon icon={faTable} /></button>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover table-dark table-no-bottom-margin">
                            <thead class ="text-center">
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Auto</th>
                                <th scope="col">Trasa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehiclesWithDevicesOnPage.map((item, index) => {
                                    return <>
                                            <tr className="text-center">
                                            <th scope="row">{index + 1 + ((currentPage*entriesPerPage))}</th>
                                            <td>{item.mark + " " + item.model + " (" + item.plate + ")"}</td>
                                            <td><button type="button" className="btn btn-secondary" onClick={() => this.selectOption({...item, route: true})}><FontAwesomeIcon icon={faRoute} /></button></td>
                                            </tr>
                                    </>
                                })}
                            </tbody>
                            </table>
                        </div>
                </div>
                <div className="col-md-9">
                <div className="leaflet-container">
                <Map bounds={bounds} zoom={13}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polyline positions={polyline}/>
                    {positionsState.positions.length >= 1 && <>
                    <Marker position={[positionsState.positions[0].latitude, positionsState.positions[0].longitude]} icon={iconStart}>
                        <Popup>
                            Czas rozpoczęcia trasy: {new Date(positionsState.positions[0].utcTimestamp * 1000).toLocaleString()}
                        </Popup>
                    </Marker>
                    </>}
                    {positionsState.positions.length >= 2 && <>
                    <Marker position={[positionsState.positions[positionsState.positions.length-1].latitude, positionsState.positions[positionsState.positions.length-1].longitude]} icon={iconFinish}>
                        <Popup>
                            Czas zakończenia trasy: {new Date(positionsState.positions[positionsState.positions.length-1].utcTimestamp * 1000).toLocaleString()}
                        </Popup>
                    </Marker>
                    </>}
                    {vehiclesWithLastPosition.length > 0 && <>
                        {vehiclesWithLastPosition.map((vehicle) => {
                            return <><Marker position={[vehicle.device.lastPosition.latitude, vehicle.device.lastPosition.longitude]} icon={iconTruck}>
                            <Popup>{<>Predkość: {(vehicle.device.lastPosition.speed * 3.6).toFixed(1)} km/h<br />
                                    Czas zgłoszenia: {new Date(vehicle.device.lastPosition.utcTimestamp * 1000).toLocaleString()}<br />
                                    </>}</Popup>
                            <Tooltip direction='bottom' opacity={1} permanent>
                                <span>{vehicle.mark + ' ' + vehicle.model + ' (' + vehicle.plate + ')'}</span>
                            </Tooltip>
                            </Marker></>
                        })}
                    </>}
                </Map>
                </div>
                </div>
            </div>
        </div>
        <Modal show={show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {selectedItem?.route && "Wyznacz trase"}
                            {selectedItem?.raport && "Raport z wyznaczone trasy"}
                            {selectedItem?.eraseRoute && "Wyczyśc trase"}
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
                                    if(selectedItem.route){
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
                                        let dayStop = parseInt(splittedDateStop[2]);
                                        let hoursStop = parseInt(splittedTimeStop[0]);
                                        let minutesStop = parseInt(splittedTimeStop[1]);
                                        const payload = {
                                            deviceId: selectedItem.device.id,
                                            from: new Date(yearStart, monthStart - 1, dayStart, hoursStart, minutesStart),
                                            to: new Date(yearStop, monthStop - 1, dayStop, hoursStop, minutesStop)};
                                        this.props.fetchClientPositions(token, payload);
                                    } else if (selectedItem.eraseRoute){
                                        this.props.clearClientPositions();
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
                                    {selectedItem.raport && positionsState.positions.length > 0 && <>
                                    <div className="row">
                                        <div className="col-md-12">Prędkość maksymalna: {maxSpeed} km/h</div>
                                        <div className="col-md-12">Prędkość średnia: {averageSpeed} km/h</div>
                                        <div className="col-md-12">Prędkość minimalna: {minSpeed} km/h</div>
                                        <div className="col-md-12">Dystans: {distance} km</div>
                                    </div>                                       
                                    </>}
                                    {selectedItem.raport && positionsState.positions.length === 0 && <>
                                        Brak danych do przeliczenia, wyznacz najpierw trase, która zawiera przynajmniej dwa punkty
                                    </>}
                                    {selectedItem.eraseRoute && <>
                                        Czy na pewno chcesz wyczyścić trase na mapie?
                                    </>}
                                </Modal.Body>
                                <Modal.Footer>
                                    {!selectedItem.raport && 
                                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                                        {selectedItem.route && "Wyznacz"}
                                        {selectedItem.eraseRoute && "Wyczyść"}
                                    </Button>}
                                    <Button variant="secondary"  onClick={() => {this.handleClose()}}>Zamknij</Button>
                                </Modal.Footer>
                                </Form></>
                            )}
                    </Formik>
                </Modal>
                {}                
        </>
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        vehiclesState: state.vehiclesState,
        positionsState: state.positionsState
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClientPositions: (token, payload) => dispatch(fetchClientPositions(token, payload)),
        clearClientPositions: () => dispatch(clearClientPositions()),
        fetchClientVehicles: (token, clientId) => dispatch(fetchClientVehicles(token, clientId)),
        fetchClientDrivers: (token, clientId) => dispatch(fetchClientDrivers(token, clientId)),
        fetchClientDevices: (token, clientId) => dispatch(fetchClientDevices(token, clientId))
    }
}



Main = connect(mapStateToProps, mapDispatchToProps)(Main)

