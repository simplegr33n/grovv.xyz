import React, { Component } from 'react';
import '../../styles/App.css';

import Firebase from '../../config/firebaseConfig.js'


class Config extends Component {

    constructor(props) {
        super(props);
        this.state = {
            temp_min: null,
            temp_max: null,
            temp_hist: null,
            fan_min: null,
            fan_max: null,
            humidity_min: null,
            humidity_max: null,
            humidity_hist: null,
            humidifier_min: null,
            humidifier_max: null
        };

        this.firebase = new Firebase()
        this.watchConfig();
    }

    saveConfig = () => {
        console.log("Saving config... (TODO)")
        var ref = this.firebase.db.ref().child('grow').child('-LdG6gTCNZxfu1wU5Xvx').child('config')
        
        ref.set(
            {
                temp_min: this.state.temp_min,
                temp_max: this.state.temp_max,
                temp_hist: this.state.temp_hist,
                fan_min: this.state.fan_min,
                fan_max: this.state.fan_max,
                humidity_min: this.state.humidity_min,
                humidity_max: this.state.humidity_max,
                humidity_hist: this.state.humidity_hist,
                humidifier_min: this.state.humidifier_min,
                humidifier_max: this.state.humidifier_max
            }
        )

    }

    watchConfig = () => {
		// Sensor data in firebase
		var ref = this.firebase.db.ref().child('grow').child('-LdG6gTCNZxfu1wU5Xvx').child('config')

		ref.on('value', (snapshot) => {

            console.log(snapshot.val());

			this.setState({
                temp_min: snapshot.val().temp_min,
                temp_max: snapshot.val().temp_max,
                temp_hist: snapshot.val().temp_hist,
                fan_min: snapshot.val().fan_min,
                fan_max: snapshot.val().fan_max,
                humidity_min: snapshot.val().humidity_min,
                humidity_max: snapshot.val().humidity_max,
                humidity_hist: snapshot.val().humidity_hist,
                humidifier_min: snapshot.val().humidifier_min,
                humidifier_max: snapshot.val().humidifier_max
			});

		}, function (errorObject) {
			console.log("follow config failed: " + errorObject.code);
		});
    }
    
    handleTempMinChange = (event) => {
        this.setState({ temp_min: event.target.value });
    }

    handleTempMaxChange = (event) => {
        this.setState({ temp_max: event.target.value });
    }

    handleTempHistChange = (event) => {
        this.setState({ temp_hist: event.target.value });
    }

    handleFanMinChange = (event) => {
        this.setState({ fan_min: event.target.value });
    }

    handleFanMaxChange = (event) => {
        this.setState({ fan_max: event.target.value });
    }

    handleHumidityMinChange = (event) => {
        this.setState({ humidity_min: event.target.value });
    }

    handleHumidityMaxChange = (event) => {
        this.setState({ humidity_max: event.target.value });
    }

    handleHumidityHistChange = (event) => {
        this.setState({ humidity_hist: event.target.value });
    }

    handleHumidifierMinChange = (event) => {
        this.setState({ humidifier_min: event.target.value });
    }

    handleHumidifierMaxChange = (event) => {
        this.setState({ humidifier_max: event.target.value });
    }



    render() {
        return (

            <div id="Config-Page">
                <div id="Config-Temp-Field">
                    <h2>TEMPERATURE</h2>
                    <div id="Config-Temp-Min-Max">
                        <div>
                            Min:
                            <input type="number" className="Config-Input" id="temp-min" value={this.state.temp_min} onChange={this.handleTempMinChange}/>°C
                        </div>
                        <div>
                            Max:
                            <input type="number" className="Config-Input" id="temp-max" value={this.state.temp_max} onChange={this.handleTempMaxChange}/>°C
                        </div>
                        <div>
                            Hist:
                            <input type="number" className="Config-Input" id="temp-hist" value={this.state.temp_hist} onChange={this.handleTempHistChange}/>Δ°C
                        </div>
                    </div>
                    <h3>FAN POWER</h3>
                    <div id="Config-Fan-Min-Max">
                        <div>
                            Min:
                            <input type="number" className="Config-Input" id="fan-min" value={this.state.fan_min} onChange={this.handleFanMinChange}/>%
                        </div>
                        <div>
                            Max:
                            <input type="number" className="Config-Input" id="fan-max" value={this.state.fan_max} onChange={this.handleFanMaxChange}/>%
                        </div>
                    </div>

                </div>

                <div id="Config-Humidity-Field">
                    <h2>HUMIDITY</h2>
                    <div id="Config-Humidity-Min-Max">
                        <div>
                            Min:
                            <input type="number" className="Config-Input" id="humidity-min" value={this.state.humidity_min} onChange={this.handleHumidityMinChange}/>% R.H.
                        </div>
                        <div>
                            Max:
                            <input type="number" className="Config-Input" id="humidity-max" value={this.state.humidity_max} onChange={this.handleHumidityMaxChange}/>% R.H.
                        </div>
                        <div>
                            Hist:
                            <input type="number" className="Config-Input" id="humidity-hyst" value={this.state.humidity_hist} onChange={this.handleHumidityHistChange}/>Δ % R.H.
                        </div>
                    </div>
                    <h3>HUMIDIFIER POWER</h3>
                    <div id="Config-Humidifier-Min-Max">
                        <div>
                            Min:
                            <input type="number" className="Config-Input" id="humidifier-min" value={this.state.humidifier_min} onChange={this.handleHumidifierMinChange}/>%
                        </div>
                        <div>
                            Max:
                            <input type="number" className="Config-Input" id="humidifier-max" value={this.state.humidifier_max} onChange={this.handleHumidifierMaxChange}/>%
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
