import React, { Component } from 'react';
import '../../../styles/App.css';

import TimePicker from 'react-time-picker'

import DbHelper from '../../_utils/DbHelper.js'



class GrowDetailsConfig extends Component {

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
            humidifier_max: '',

            resetValue: false
        };

        this.dbHelper = new DbHelper()

    }

    componentDidMount() {
        this._ismounted = true;
        this.watchConfig = this.watchGrowConfig(this.setFetchedConfig);
        this.getResetValue = this.getResetValue()
    }

    componentWillUnmount() {
        this._ismounted = false;
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
                humidifier_max: this.state.humidifier_max,
                lights_on: this.state.lights_on,
                lights_off: this.state.lights_off
            }
        )

    }

    watchGrowConfig = async (setData) => {
        try {
            await this.dbHelper.watchGrowConfig(this.props.growID, setData)
        } catch (e) {
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
            humidifier_max: configObj.humidifier_max,
            lights_on: configObj.lights_on,
            lights_off: configObj.lights_off
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

    handleLightsOnChange = (event) => {
        if (!event.target) {
            console.log("no event target...")
            return
        }
        console.log("Lights on change!")
        console.log(event.target.value)
        // this.setState({ humidifier_min: event.target.value });
    }

    handleLightsOffChange = (event) => {
        if (!event.target) {
            console.log("no event target...")
            return
        }
        console.log("Lights off change!")
        console.log(event.target.value)
        // this.setState({ humidifier_max: event.target.value });
    }

    getResetValue = () => {
        this.dbHelper.getResetValue(this.props.growID, this.setResetValue)
    }

    setResetValue = (value) => {
        this.setState({ resetValue: value });
    }

    handleReset = () => {
        if (this.state.resetValue === false) {
            this.dbHelper.resetGrow(this.props.growID)
        }
    }



    render() {
        return (

            <div id="Grow-Details-Config-Page">
                <div id="Grow-Details-Config-Settings-Div">
                    <div id="Grow-Details-Config-Header-Text">Grow Config</div>
                    <div id="Grow-Details-Config-Scroll">

                        <div id="Config-Temp-Field" style={{ backgroundColor: '#e8e81e' }}>
                            <div className="Config-Item-Header-Text">LIGHTS</div>
                            <div id="Config-Temp-Min-Max">
                                <div>On: <TimePicker
                                    id="lights_on"
                                    value={this.state.lights_on}
                                    onChange={this.handleLightsOnChange} /></div>
                                <div>Off: <TimePicker
                                    id="lights_off"
                                    value={this.state.lights_off}
                                    onChange={this.handleLightsOnChange} /></div>
                            </div>
                        </div>

                        <div id="Config-Temp-Field">
                            <div className="Config-Item-Header-Text">TEMPERATURE <b>(°C)</b></div>
                            <div id="Config-Temp-Min-Max">
                                <div> Min: <input type="number" className="Config-Input" id="temp-min" value={this.state.temp_min} onChange={this.handleTempMinChange} /></div>
                                <div>Max: <input type="number" className="Config-Input" id="temp-max" value={this.state.temp_max} onChange={this.handleTempMaxChange} /></div>
                                <div>Hyst Δ: <input type="number" className="Config-Input" id="temp-hyst" value={this.state.temp_hyst} onChange={this.handleTempHystChange} />Δ</div>
                            </div>
                            <div className="Config-Item-Header-Text">FAN POWER (%)</div>
                            <div id="Config-Fan-Min-Max">
                                <div>Min: <input type="number" className="Config-Input" id="fan-min" value={this.state.fan_min} onChange={this.handleFanMinChange} /></div>
                                <div>Max: <input type="number" className="Config-Input" id="fan-max" value={this.state.fan_max} onChange={this.handleFanMaxChange} /></div>
                            </div>
                        </div>

                        <div id="Config-Humidity-Field">
                            <div className="Config-Item-Header-Text">HUMIDITY (% r.h.)</div>
                            <div id="Config-Humidity-Min-Max">
                                <div>Min: <input type="number" className="Config-Input" id="humidity-min" value={this.state.humidity_min} onChange={this.handleHumidityMinChange} /></div>
                                <div>Max: <input type="number" className="Config-Input" id="humidity-max" value={this.state.humidity_max} onChange={this.handleHumidityMaxChange} /></div>
                                <div>Hyst Δ: <input type="number" className="Config-Input" id="humidity-hyst" value={this.state.humidity_hyst} onChange={this.handleHumidityHystChange} /></div>
                            </div>
                            <div className="Config-Item-Header-Text">HUMIDIFIER POWER (%)</div>
                            <div id="Config-Humidifier-Min-Max">
                                <div>Min: <input type="number" className="Config-Input" id="humidifier-min" value={this.state.humidifier_min} onChange={this.handleHumidifierMinChange} /></div>
                                <div>Max: <input type="number" className="Config-Input" id="humidifier-max" value={this.state.humidifier_max} onChange={this.handleHumidifierMaxChange} /></div>
                            </div>

                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '4px' }}>

                            {(() => {
                                if (!this.state.resetValue || this.state.resetValue === false) {
                                    return (
                                        <div id="GROW-DETAILS-RESET-BTN" onClick={this.handleReset}>
                                            RESET<br></br>
                                            GROWLAB
                                </div>
                                    )
                                } else {
                                    return (
                                        <div id="GROW-DETAILS-RESET-BTN" style={{ userSelect: 'none', cursor: 'auto', backgroundColor: '#c77725' }}>
                                            RESETTING<br></br>
                                            GROWLAB...
                                </div>
                                    )
                                }
                            })()}

                            <div id="GROW-DETAILS-SAVE-CONFIG-BTN" onClick={this.saveConfig}>SAVE <br></br> CONFIG</div>



                        </div>



                    </div>
                </div>
                <div id="Grow-Details-Config-Layout-Div">

                </div>
            </div>

        );
    }
}

export default GrowDetailsConfig;
