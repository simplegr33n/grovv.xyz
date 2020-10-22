import React, { Component } from 'react';

import { WiThermometer, WiHumidity, WiHurricane, WiCloudUp, WiThermometerExterior, WiBarometer } from 'react-icons/wi';
import co2svg from '../../assets/co2svg.svg'
import tvocSvg from '../../assets/tvoc-svg.svg'

class DisplayFunctions {

    constructor() {
    }


    ////////////////////
    // Sensor Type Icon
    ///////////////////
    displaySensorTypeIcon = (sensorType) => {
        if (sensorType === "airTemp") {
            return (<WiThermometer style={{ fontSize: '20px', color: '#fff', padding: '1px' }} />)
        } else if (sensorType === "waterTemp") {
            return (<WiThermometerExterior style={{ fontSize: '20px', color: '#fff', padding: '1px' }} />)
        } else if (sensorType === "humidity") {
            return (<WiHumidity style={{ fontSize: '20px', color: '#fff', padding: '1px' }} />)
        } else if (sensorType === "fan") {
            return (<WiHurricane style={{ fontSize: '20px', color: '#fff', padding: '1px' }} />)
        } else if (sensorType === "humidifier") {
            return (<WiCloudUp style={{ fontSize: '20px', color: '#fff', padding: '1px' }} />)
        } else if (sensorType === "pressure") {
            return (<WiBarometer style={{ fontSize: '20px', color: '#fff', padding: '1px' }} />)
        } else if (sensorType === "co2") {
            return (<img src={co2svg} alt="CO2 Icon" style={{ position: 'relative', display: 'inline-block', maxHeight: '55%', color: '#fff', padding: '2px' }} />)
        } else if (sensorType === "tvoc") {
            return (<img src={tvocSvg} alt="CO2 Icon" style={{ position: 'relative', display: 'inline-block', maxHeight: '55%', color: '#fff', padding: '2px' }} />)
        } else {
            return (<div />)
        }
    }

}

export default DisplayFunctions;