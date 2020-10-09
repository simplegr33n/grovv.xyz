import React, { Component } from 'react';
import '../../../styles/App.css';

import TimePicker from 'react-time-picker'

import DbHelper from '../../_utils/DbHelper.js'

import { WiThermometer, WiHumidity, WiHurricane, WiCloudUp, WiThermometerExterior } from 'react-icons/wi';

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
        // this.dbHelper.setGrowConfig(
        //     this.props.grow.id,
        //     {
        //         // NEEDS TO BE ALL OBJECT AT ONCE TO AVOID FUCKING UP...
        //         // lights_on: this.state.lights_on,
        //         // lights_off: this.state.lights_off
        //     }
        // )
    }

    handleLightsOnChange = (value) => {
        console.log('value...?')
        console.log(value)
        this.setState({ lights_on: value });
    }

    handleLightsOffChange = (value) => {
        console.log('value...?')
        console.log(value)
        this.setState({ lights_off: value });
    }

    close = () => {
        this.props.close();
    }


    render() {

        const sensorSettingRows = this.props.grow.config.SENSORS.map((sensor) =>

            <div key={sensor.PID} className="Config-Settings-Field" style={{ backgroundColor: '#3d7a80' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>

                    <div style={{ userSelect: 'none', fontsize: '0.6em' }} >
                        <WiThermometer /> {sensor.PID}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                Name
                            </div>
                            <div style={{ fontWeight: '400' }}>
                                <input id="name" name="name" type="name" defaultValue={sensor.name} maxlength="16" style={{ fontSize: '0.8em', maxWidth: "70px" }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                Type
                            </div>
                            <div>
                                <select id="myList" defaultValue={sensor.type} style={{ fontSize: '0.8em', maxWidth: "70px", height: '20px' }} >
                                    <option value="airTemp">airTemp</option>
                                    <option value="waterTemp">waterTemp</option>
                                    <option value="humidity">humidity</option>
                                    <option value="fan">fan</option>
                                    <option value="humidifier">humidifier</option>
                                </select>
                            </div>
                        </div>


                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                Weight
                            </div>
                            <div style={{ fontSize: '1em', fontWeight: '400' }}>
                                <input id="thickness" name="thickness" type="thickness" defaultValue={sensor.thickness} maxlength="10" style={{ fontSize: '0.8em', maxWidth: "24px" }} />
                            </div>
                        </div>



                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                Mean
                            </div>
                            <div style={{ fontSize: '1em', fontWeight: '400' }}>
                                <input id="_mean" name="_mean" type="_mean" defaultValue={sensor._mean} style={{ fontSize: '0.8em', maxWidth: "24px" }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                SDev
                            </div>
                            <div style={{ fontSize: '1em', fontWeight: '400' }}>
                                <input id="_deviation" name="_deviation" type="_deviation" defaultValue={sensor._deviation} style={{ fontSize: '0.8em', maxWidth: "24px" }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                Color
                            </div>
                            <div style={{ fontSize: '1em', fontWeight: '400' }}>
                                <input id="color" name="color" type="color" defaultValue={sensor.color} maxlength="10" style={{ fontSize: '0.8em', padding: 0, marginTop: '1px', maxWidth: "18px", maxHeight: '18px' }} />
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
                                        <div className="Config-Item-Header-Text">LIGHTS</div>

                                        <div className="Config-Settings-Field" style={{ backgroundColor: '#e8e81e' }}>
                                            <div className="Settings-Data-Line">
                                                <div>on <TimePicker
                                                    id="lights_on"
                                                    value={this.state.config.lights_on}
                                                    onChange={this.handleLightsOnChange.bind(this)} /></div>
                                                <div>off <TimePicker
                                                    id="lights_off"
                                                    value={this.state.config.lights_off}
                                                    onChange={this.handleLightsOffChange.bind(this)} /></div>
                                            </div>
                                        </div>

                                        {/* SENSORS */}
                                        <div className="Config-Item-Header-Text">SENSORS</div>

                                        {sensorSettingRows}


                                        {/* Doubly hid for now */}
                                        {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '4px' }}>
                                            <div id="GROW-DETAILS-SAVE-CONFIG-BTN" onClick={this.postConfig}>SAVE <br></br> CONFIG</div>
                                        </div> */}
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
