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
            return (<img src={co2svg} alt="CO2 Icon" style={{ maxHeight: '70%', maxWidth: '20px', color: '#fff', padding: '2px' }} />)
        } else if (sensorType === "tvoc") {
            return (<img src={tvocSvg} alt="TVoC Icon" style={{ maxHeight: '70%', maxWidth: '20px', color: '#fff', padding: '2px' }} />)
        } else {
            return (<div />)
        }
    }

    /////////////////////
    // Grow Active? Color
    /////////////////////
    returnActiveIndicatorColor = (processedData) => {
        if (processedData && processedData[processedData.length - 1]) {
            var now = new Date().getTime();
            var difference = (now / 1000) - processedData[processedData.length - 1].time

            if (difference > 10000000) {
                return "#989e98"
            } else if (difference > 300000) {
                return "#fa360a"
            } else if (difference > 60000) {
                return "#facb23"
            } else if (difference < 60000) {
                return "#27d927"
            } else {
                return "#000"
            }
        }
    }
}

export default DisplayFunctions;