import React, { Component } from 'react';
import '../../styles/App.css';


class Config extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }

    saveConfig = () => {
        console.log("Saving config... (TODO)")
    }


    render() {
        return (

            <div id="Config-Page">
                <div id="Config-Temp-Field">
                    <h2>TEMPERATURE</h2>
                    <div id="Config-Temp-Min-Max">
                        <div>
                            Min:
                            <input type="number" className="Config-Input" id="temp-min" />°C
                        </div>
                        <div>
                            Max:
                            <input type="number" className="Config-Input" id="temp-max" />°C
                        </div>
                        <div>
                            Hyst:
                            <input type="number" className="Config-Input" id="temp-hist" />Δ°C
                        </div>
                    </div>
                    <h3>FAN POWER</h3>
                    <div id="Config-Fan-Min-Max">
                        <div>
                            Min:
                            <input type="number" className="Config-Input" id="fan-min" />%
                        </div>
                        <div>
                            Max:
                            <input type="number" className="Config-Input" id="fan-max" />%
                        </div>
                    </div>

                </div>

                <div id="Config-Humidity-Field">
                    <h2>HUMIDITY</h2>
                    <div id="Config-Humidity-Min-Max">
                        <div>
                            Min:
                            <input type="number" className="Config-Input" id="humidity-min" />% R.H.
                        </div>
                        <div>
                            Max:
                            <input type="number" className="Config-Input" id="humidity-max" />% R.H.
                        </div>
                        <div>
                            Hyst:
                            <input type="number" className="Config-Input" id="humidity-hyst" />Δ % R.H.
                        </div>
                    </div>
                    <h3>HUMIDIFIER</h3>
                    <div id="Config-Humidifier-Min-Max">
                        <div>
                            Min:
                            <input type="number" className="Config-Input" id="humidifier-min" />
                        </div>
                        <div>
                            Max:
                            <input type="number" className="Config-Input" id="humidifier-max" />
                        </div>
                    </div>

                </div>

                <div id="SAVE-CONFIG-BTN" onClick={this.saveConfig}>
                    SAVE
                </div>
            </div>

        );
    }
}

export default Config;
