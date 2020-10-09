import React, { Component } from 'react';
import '../../../styles/App.css';

import TimePicker from 'react-time-picker'

import DbHelper from '../../_utils/DbHelper.js'

import { HiOutlinePencilAlt } from 'react-icons/hi';

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

        return (



            <div style={{ height: '100%', maxHeight: '100%', width: '100%', maxWidth: '100%', backgroundColor: '#000000BF', position: 'fixed', justifyItems: 'center', justifyContent: 'center', alignContent: 'center', zIndex: 3 }}>
                <div style={{ margin: 'auto', width: '85%', height: '85%', border: '3px solid #262626', padding: '10px', background: '#303630', color: '#d3dbd5' }}>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '1.2em', userSelect: 'none' }}>Settings </div>
                        <div style={{ fontSize: '1em', fontWeight: '100', userSelect: 'none' }}>({this.props.grow.name})</div>
                        <div onClick={this.close} style={{ fontSize: '1.2em', color: '#FF0000', userSelect: 'none', cursor: 'pointer' }}>X</div>
                    </div>
                    {(() => {
                        if (this.state.config) {
                            return (
                                <div id="Grow-Details-Config-Settings-Div">
                                    <div id="Grow-Details-Config-Scroll" style={{ margin: '4px' }}>

                                        <div className="Config-Settings-Field" style={{ backgroundColor: '#e8e81e' }}>
                                            <div className="Config-Item-Header-Text">LIGHTS</div>
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

                                        <div className="Config-Settings-Field" style={{ backgroundColor: '#e0001e' }}>
                                            <div className="Config-Item-Header-Text" style={{ userSelect: 'none' }}>SENSORS</div>

                                            <div className="Settings-Data-Line">
                                                <div>
                                                    <HiOutlinePencilAlt style={{ userSelect: 'none', cursor: 'pointer' }} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                                        PID
                                                    </div>
                                                    <div style={{ fontSize: '1em', fontWeight: '400' }}>
                                                        sA1_Temp
                                                    </div>
                                                </div>

                                                <div>
                                                    <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                                        Name
                                                    </div>
                                                    <div style={{ fontSize: '1em', fontWeight: '400' }}>
                                                        Tent Temp
                                                    </div>
                                                </div>

                                                <div>
                                                    <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                                        Type
                                                    </div>
                                                    <div style={{ fontSize: '1em', fontWeight: '400' }}>
                                                        airTemp
                                                    </div>
                                                </div>

                                                <div>
                                                    <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                                        Color
                                                    </div>
                                                    <div style={{ fontSize: '1em', fontWeight: '400' }}>
                                                        #FF0000
                                                    </div>
                                                </div>

                                                <div>
                                                    <div style={{ fontSize: '0.7em', userSelect: 'none' }}>
                                                        Weight
                                                    </div>
                                                    <div style={{ fontSize: '1em', fontWeight: '400' }}>
                                                        2
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

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
                {(() => {
                })()}
            </div>

        );
    }
}

export default GrowSettings;
