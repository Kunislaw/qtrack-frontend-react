import L from 'leaflet';
import pin from "./img-icons/pin.svg";
import finish from "./img-icons/finish.svg";
import start from "./img-icons/start.svg";
import truck from "./img-icons/truck.svg";

const iconPin = new L.Icon({
    iconUrl: pin,
    iconRetinaUrl: pin,
    iconAnchor: [20,40],
    popupAnchor: [0,0],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(40, 40)
});

const iconFinish = new L.Icon({
    iconUrl: finish,
    iconRetinaUrl: finish,
    iconAnchor: [3, 40],
    popupAnchor: [0, 0],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(40, 40)
});


const iconStart = new L.Icon({
    iconUrl: start,
    iconRetinaUrl: start,
    iconAnchor: [20, 25],
    popupAnchor: [0, 0],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(40, 40)
});

const iconTruck = new L.Icon({
    iconUrl: truck,
    iconRetinaUrl: truck,
    iconAnchor: [20, 30],
    popupAnchor: [0, -20],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(40, 40)
});

export { iconPin, iconFinish, iconStart, iconTruck };