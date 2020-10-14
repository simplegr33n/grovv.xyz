import React, { Component } from 'react';
import '../../../styles/App.css';

import TimePicker from 'react-time-picker'

import DbHelper from '../../_utils/DbHelper.js'

import { WiThermometer, WiHumidity, WiHurricane, WiCloudUp, WiThermometerExterior } from 'react-icons/wi';
import co2svg from '../../../assets/co2svg.svg'
import tvocSvg from '../../../assets/tvoc-svg.svg'



class GrowSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            config: null
        };

        this.dbHelper = new DbHelper()
    }

    componentDidMount() {
        this._ismounted = true;
        this.watchConfig = this.getConfig(this.setFetchedConfig);
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    getConfig = async (setData) => {
        try {
            await this.dbHelper.getGrowConfig(this.props.grow.id, setData)
        } catch (e) {
            console.log(e);
            return 'caught ' + e
        }
    }

    setFetchedConfig = (configObj) => {
        this.setState({
            config: configObj
        });
    }


    // UI METHODS
    postConfig = () => {
        // Post config
        this.dbHelper.setGrowConfig(this.props.grow.id, this.state.config)
        // Refresh page data
        this.props.refreshGrows(this.state.config)
        // Close settings menu
        this.props.close()
    }

    sensorMeanChange = (e) => {
        console.log("Change " + e.target.id + ": " + e.target.value)

        var tempConfig = this.state.config
        tempConfig.SENSORS.forEach((sensor) => {
            if (sensor.PID === e.target.id) {
                sensor._mean = parseFloat(e.target.value)
            }
        })

        this.setState({
            config: tempConfig
        });
    }

    sensorDeviationChange = (e) => {
        console.log("Change " + e.target.id + ": " + e.target.value)

        var tempConfig = this.state.config
        tempConfig.SENSORS.forEach((sensor) => {
            if (sensor.PID === e.target.id) {
                sensor._deviation = parseFloat(e.target.value)
            }
        })

        this.setState({
            config: tempConfig
        });
    }

    sensorWeightChange = (e) => {
        console.log("Change " + e.target.id + ": " + e.target.value)

        var tempConfig = this.state.config
        tempConfig.SENSORS.forEach((sensor) => {
            if (sensor.PID === e.target.id) {
                sensor.thickness = e.target.value
            }
        })

        this.setState({
            config: tempConfig
        });
    }

    sensorColorChange = (e) => {
        var tempConfig = this.state.config
        tempConfig.SENSORS.forEach((sensor) => {
            if (sensor.PID === e.target.id) {
                sensor.color = e.target.value
            }
        })

        this.setState({
            config: tempConfig
        });
    }

    sensorTypeChange = (e) => {
        console.log("Change " + e.target.id + ": " + e.target.value)

        var tempConfig = this.state.config
        tempConfig.SENSORS.forEach((sensor) => {
            if (sensor.PID === e.target.id) {
                sensor.type = e.target.value
            }
        })

        this.setState({
            config: tempConfig
        });
    }

    sensorNameChange = (e) => {
        console.log("Change " + e.target.id + ": " + e.target.value)

        var tempConfig = this.state.config
        tempConfig.SENSORS.forEach((sensor) => {
            if (sensor.PID === e.target.id) {
                sensor.name = e.target.value
            }
        })

        this.setState({
            config: tempConfig
        });
    }

    handleLightsOnChange = (value) => {
        var tempConfig = this.state.config
        tempConfig.LIGHTS.on = value

        this.setState({
            config: tempConfig
        });
    }

    handleLightsOffChange = (value) => {
        var tempConfig = this.state.config
        tempConfig.LIGHTS.off = value

        this.setState({
            config: tempConfig
        });
    }

    close = () => {
        this.props.close();
    }


    render() {

        const sensorSettingRows = this.props.grow.config.SENSORS.map((sensor) =>

            <div key={sensor.PID} className="Config-Settings-Field" style={{ backgroundColor: '#3d7a80' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>

                    <div style={{ userSelect: 'none', fontsize: '0.6em', color: "#FFF", background: '#131B14', maxHeight: '30px', height: '30px' }} >

                        {(() => {
                            if (sensor.type === "airTemp") {
                                return (<WiThermometer style={{ fontSize: '1.3em', color: sensor.color }} />)
                            } else if (sensor.type === "waterTemp") {
                                return (<WiThermometerExterior style={{ fontSize: '1.3em', color: sensor.color }} />)
                            } else if (sensor.type === "humidity") {
                                return (<WiHumidity style={{ fontSize: '1.3em', color: sensor.color }} />)
                            } else if (sensor.type === "fan") {
                                return (<WiHurricane style={{ fontSize: '1.3em', color: sensor.color }} />)
                            } else if (sensor.type === "humidifier") {
                                return (<WiCloudUp style={{ fontSize: '1.3em', color: sensor.color }} />)
                            } else if (sensor.type === "co2") {
                                return (<img src={co2svg} alt="CO2 Icon" style={{ position: 'relative', display: 'inline-block', maxHeight: '80%', color: sensor.color }} />)
                            } else if (sensor.type === "tvoc") {
                                return (<img src={tvocSvg} alt="CO2 Icon" style={{ position: 'relative', display: 'inline-block', maxHeight: '80%', color: sensor.color }} />)
                            } else {
                                return (<div />)
                            }
                        })()}
                        {sensor.PID}

                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                Name
                            </div>
                            <div style={{ fontWeight: '400' }}>
                                <input onChange={this.sensorNameChange} id={sensor.PID} name="name" type="name" defaultValue={sensor.name} maxLength="16" style={{ fontSize: '0.8em', maxWidth: "70px" }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                Type
                            </div>
                            <div>
                                <select onChange={this.sensorTypeChange} id={sensor.PID} defaultValue={sensor.type} style={{ fontSize: '0.8em', maxWidth: "74px", height: '20px' }} >
                                    <option value="airTemp">airTemp</option>
                                    <option value="waterTemp">waterTemp</option>
                                    <option value="humidity">humidity</option>
                                    <option value="co2">CO&#8322;</option>
                                    <option value="fan">fan</option>
                                    <option value="humidifier">humidifier</option>
                                </select>
                            </div>
                        </div>


                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                Weight
                            </div>
                            <div>
                                <select onChange={this.sensorWeightChange} id={sensor.PID} defaultValue={sensor.thickness} style={{ fontSize: '0.7em', maxWidth: "44px", height: '20px' }} >
                                    <option value="3">3</option>
                                    <option value="2">2</option>
                                    <option value="1.5">1.5</option>
                                    <option value="1">1</option>
                                    <option value="0.75">0.75</option>
                                    <option value="0.5">0.5</option>
                                    <option value="0.25">0.25</option>
                                </select>
                            </div>
                        </div>



                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                Mean
                            </div>
                            <div style={{ fontSize: '1em', fontWeight: '400' }}>
                                <input type='number' onChange={this.sensorMeanChange} id={sensor.PID} name="_mean" defaultValue={sensor._mean} style={{ fontSize: '0.8em', maxWidth: "36px" }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                SDev
                            </div>
                            <div style={{ fontSize: '1em', fontWeight: '400' }}>
                                <input type='number' onChange={this.sensorDeviationChange} id={sensor.PID} name="_deviation" defaultValue={sensor._deviation} style={{ fontSize: '0.8em', maxWidth: "36px" }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                Color
                            </div>
                            <div style={{ fontSize: '1em', fontWeight: '400' }}>
                                <input onChange={this.sensorColorChange} id={sensor.PID} name="color" type="color" defaultValue={sensor.color} maxLength="10" style={{ fontSize: '0.8em', padding: 0, marginTop: '1px', maxWidth: "18px", maxHeight: '18px' }} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        );



        return (

            <div style={{ height: '100%', maxHeight: '100%', width: '100%', maxWidth: '100%', backgroundColor: '#000000BF', position: 'fixed', justifyItems: 'center', justifyContent: 'center', alignContent: 'center', zIndex: 3 }}>
                <div style={{ margin: 'auto', width: '90%', height: '90%', border: '3px solid #262626', padding: '10px', background: '#303630', color: '#d3dbd5' }}>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '1.2em', userSelect: 'none' }}></div>
                        <div style={{ fontSize: '1em', fontWeight: '100', userSelect: 'none' }}>Settings</div>
                        <div onClick={this.close} style={{ fontSize: '1.2em', color: '#FF0000', userSelect: 'none', cursor: 'pointer' }}>X</div>
                    </div>
                    {(() => {
                        if (this.state.config) {
                            return (
                                <div id="Grow-Details-Config-Settings-Div" style={{ margin: '4px', height: "95%" }}>
                                    <div id="Grow-Details-Config-Scroll" style={{ overflowY: 'scroll' }}>

                                        {/* LIGHTS */}
                                        {(() => {
                                            if (this.state.config.LIGHTS) {
                                                return (
                                                    <div>
                                                        <div className="Config-Item-Header-Text">LIGHTS</div>

                                                        <div className="Config-Settings-Field" style={{ backgroundColor: '#e8e81e' }}>
                                                            <div className="Settings-Data-Line">
                                                                <div>on <TimePicker
                                                                    clearIcon={null}
                                                                    id="lights_on"
                                                                    value={this.state.config.LIGHTS.on}
                                                                    onChange={this.handleLightsOnChange.bind(this)} />
                                                                </div>
                                                                <div>off <TimePicker
                                                                    clearIcon={null}
                                                                    id="lights_off"
                                                                    value={this.state.config.LIGHTS.off}
                                                                    onChange={this.handleLightsOffChange.bind(this)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })()}
                                        {/* SENSORS */}
                                        <div className="Config-Item-Header-Text">SENSORS</div>

                                        {sensorSettingRows}


                                        {/* Doubly hid for now */}
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '4px' }}>
                                            <div id="GROW-DETAILS-SAVE-CONFIG-BTN" onClick={() => this.postConfig()}>SAVE <br></br> SETTINGS</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })()}


                </div>

                {/* use me! */}
                {
                    (() => {
                    })()
                }
            </div >

        );
    }
}

export default GrowSettings;
