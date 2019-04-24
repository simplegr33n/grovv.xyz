import React, { Component } from 'react';
import '../../styles/App.css';


class Config extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }


    render() {
        return (

            <div id="Config-Page">
                _CONFIG_
                <div id="Config-Temp-Field">
                    TEMP
                    temp_min, temp_max
                    fan_min, fan_max
                    temp_hyst
                </div>
                <div id="Config-Humidity-Field">
                    HUMIDITY
                    humid_min, humid_max
                    humidifier_min, humidifier_max
                    humid_hyst
                </div>
                <div>
                    SAVE
                </div>
            </div>

        );
    }
}

export default Config;
