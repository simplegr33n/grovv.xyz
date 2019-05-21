import React, { Component } from 'react';
import '../../../styles/App.css';

import DbHelper from '../../_utils/DbHelper.js'



class GrowConfig extends Component {

    constructor(props) {
        super(props);
        this.state = {
            temp_min: '',
            temp_max: '',
            temp_hyst: '',
            fan_min: '',
            fan_max: '',
            humidity_min: '',
            humidity_max: '',
            humidity_hyst: '',
            humidifier_min: '',
            humidifier_max: ''
        };

        this.dbHelper = new DbHelper()

    }

    componentDidMount() {
        this._ismounted = true;
        this.watchConfig = this.watchGrowConfig(this.setFetchedConfig);
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    saveConfig = () => {
        this.dbHelper.setGrowConfig(
            {
                temp_min: this.state.temp_min,
                temp_max: this.state.temp_max,
                temp_hyst: this.state.temp_hyst,
                fan_min: this.state.fan_min,
                fan_max: this.state.fan_max,
                humidity_min: this.state.humidity_min,
                humidity_max: this.state.humidity_max,
                humidity_hyst: this.state.humidity_hyst,
                humidifier_min: this.state.humidifier_min,
                humidifier_max: this.state.humidifier_max
            }
        )

    }

    saveConfig = () => {
        this.dbHelper.setGrowConfig(
            this.props.growID,
            {
                temp_min: this.state.temp_min,
                temp_max: this.state.temp_max,
                temp_hyst: this.state.temp_hyst,
                fan_min: this.state.fan_min,
                fan_max: this.state.fan_max,
                humidity_min: this.state.humidity_min,
                humidity_max: this.state.humidity_max,
                humidity_hyst: this.state.humidity_hyst,
                humidifier_min: this.state.humidifier_min,
                humidifier_max: this.state.humidifier_max
            }
        )

    }

    watchGrowConfig = async (setData) => {
        try {
            await this.dbHelper.watchGrowConfig(this.props.growID, setData)
        } catch(e) {
            console.log(e); 
            return 'caught ' + e
        }
    }

    setFetchedConfig = (configObj) => {
        
        this.setState({
            temp_min: configObj.temp_min,
            temp_max: configObj.temp_max,
            temp_hyst: configObj.temp_hyst,
            fan_min: configObj.fan_min,
            fan_max: configObj.fan_max,
            humidity_min: configObj.humidity_min,
            humidity_max: configObj.humidity_max,
            humidity_hyst: configObj.humidity_hyst,
            humidifier_min: configObj.humidifier_min,
            humidifier_max: configObj.humidifier_max
        });

    }

    handleTempMinChange = (event) => {
        this.setState({ temp_min: event.target.value });
    }

    handleTempMaxChange = (event) => {
        this.setState({ temp_max: event.target.value });
    }

    handleTempHystChange = (event) => {
        this.setState({ temp_hyst: event.target.value });
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

    handleHumidityHystChange = (event) => {
        this.setState({ humidity_hyst: event.target.value });
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
                <h1>Grow Config</h1>
                <div id="Config-Temp-Field">
                    <h2>TEMPERATURE</h2>
                    <div id="Config-Temp-Min-Max">
                        <div>
                            Min:
                            <input type="number" className="Config-Input" id="temp-min" value={this.state.temp_min} onChange={this.handleTempMinChange} />°C
                        </div>
                        <div>
                            Max:
                            <input type="number" className="Config-Input" id="temp-max" value={this.state.temp_max} onChange={this.handleTempMaxChange} />°C
                        </div>
                        <div>
                            Hyst:
                            <input type="number" className="Config-Input" id="temp-hyst" value={this.state.temp_hyst} onChange={this.handleTempHystChange} />Δ°C
                        </div>
                    </div>
                    <h3>FAN POWER</h3>
                    <div id="Config-Fan-Min-Max">
                        <div>
                            Min:
                            <input type="number" className="Config-Input" id="fan-min" value={this.state.fan_min} onChange={this.handleFanMinChange} />%
                        </div>
                        <div>
                            Max:
                            <input type="number" className="Config-Input" id="fan-max" value={this.state.fan_max} onChange={this.handleFanMaxChange} />%
                        </div>
                    </div>

                </div>

                <div id="Config-Humidity-Field">
                    <h2>HUMIDITY</h2>
                    <div id="Config-Humidity-Min-Max">
                        <div>
                            Min:
                            <input type="number" className="Config-Input" id="humidity-min" value={this.state.humidity_min} onChange={this.handleHumidityMinChange} />% R.H.
                        </div>
                        <div>
                            Max:
                            <input type="number" className="Config-Input" id="humidity-max" value={this.state.humidity_max} onChange={this.handleHumidityMaxChange} />% R.H.
                        </div>
                        <div>
                            Hyst:
                            <input type="number" className="Config-Input" id="humidity-hyst" value={this.state.humidity_hyst} onChange={this.handleHumidityHystChange} />Δ % R.H.
                        </div>
                    </div>
                    <h3>HUMIDIFIER POWER</h3>
                    <div id="Config-Humidifier-Min-Max">
                        <div>
                            Min:
                            <input type="number" className="Config-Input" id="humidifier-min" value={this.state.humidifier_min} onChange={this.handleHumidifierMinChange} />%
                        </div>
                        <div>
                            Max:
                            <input type="number" className="Config-Input" id="humidifier-max" value={this.state.humidifier_max} onChange={this.handleHumidifierMaxChange} />%
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

export default GrowConfig;
