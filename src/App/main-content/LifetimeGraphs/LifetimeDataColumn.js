import React, { Component } from 'react'
import '../../../styles/App.css'

import { BiHide } from 'react-icons/bi'
import { MdSettingsApplications } from 'react-icons/md'

import { WiThermometer, WiHumidity, WiHurricane, WiCloudUp, WiThermometerExterior } from 'react-icons/wi'
import co2svg from '../../../assets/co2svg.svg'
import tvocSvg from '../../../assets/tvoc-svg.svg'


class LifetimeDataColumn extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    processGrowData = () => {
        // process it!
    }

    toggleLine = (e) => {
        this.props.handleLineToggle(e.currentTarget.getAttribute('data-value'))
    }

    toggleSensorLines = (e) => {
        this.props.toggleSensorLines(e.currentTarget.getAttribute('data-value'))
    }

    toggleGrowLines = (e) => {
        this.props.toggleGrowLines(this.props.grow.id)
    }

    openGrowLineSettings = (e) => {
        alert("TODO... ")
    }

    render() {

        var renderButtonItems = null
        if (this.props.allSensorsList) {
            renderButtonItems = this.props.allSensorsList.map((sensorID) =>
                (() => {
                    if ((sensorID.split("^")[1] !== this.props.grow.id)) {
                        return
                    }
                    if (sensorID.split("^")[2] !== "HIGH") {
                        return
                    }

                    var reducedID = sensorID.split("^")[0] + "^" + sensorID.split("^")[1]

                    var setOpacity = 0.25
                    var highOpacitySetting = 0.25
                    var avgsOpacitySetting = 0.25
                    var lowOpacitySetting = 0.25
                    if (this.props.activeLines) {
                        if (this.props.activeLines.includes(reducedID + "^HIGH")) {
                            setOpacity = 1
                            highOpacitySetting = 1
                        }
                        if (this.props.activeLines.includes(reducedID + "^AVERAGE")) {
                            setOpacity = 1
                            avgsOpacitySetting = 1
                        }
                        if (this.props.activeLines.includes(reducedID + "^LOW")) {
                            setOpacity = 1
                            lowOpacitySetting = 1
                        }
                    }


                    return (
                        <div data-value={sensorID} key={sensorID} style={{ margin: '2px', opacity: setOpacity, overflow: 'hidden' }}>

                            <div style={{ userSelect: 'none' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', background: '#233a27', height: '24px' }}>
                                    <div style={{ marginTop: '-2px', marginRight: '2px', fontSize: '14px', fontWeight: 600 }} >
                                        (?)
                                    </div>
                                    <div style={{ marginTop: '-2px', marginRight: '2px', fontSize: '16px', fontWeight: 600 }} >
                                        {sensorID.split("^")[0]}
                                    </div>
                                    <div style={{ flex: 1 }} />
                                    <BiHide data-value={sensorID} onClick={this.toggleSensorLines} style={{ fontSize: "14px", padding: "2px", cursor: 'pointer', background: "#355526" }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', userSelect: 'none', flexDirection: 'column', fontSize: '10px', fontWeight: 600, background: '#1a241a' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2px' }}>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '10px', marginLeft: '2px' }} />
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '10px', marginLeft: '2px' }}>
                                        <div>
                                            &#8593;
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '10px', marginLeft: '2px' }}>
                                        <div>
                                            &#8595;
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '10px', marginLeft: '2px' }}>
                                        <div>
                                            ~
                                        </div>
                                    </div>
                                </div>


                                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2px' }}>
                                    <div data-value={reducedID + "^AVERAGE"} onClick={this.toggleLine} style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', background: '#495a65', cursor: 'pointer', opacity: avgsOpacitySetting }}>
                                        <div style={{ width: '100%', height: '4px', background: '#62ce92' }} />
                                        <div>
                                            averages
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', background: '#843c2c', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            78888
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', background: '#171263', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            78888
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', background: '#727572', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            78888
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2px' }}>
                                    <div data-value={reducedID + "^HIGH"} onClick={this.toggleLine} style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', flex: 1, background: '#b44b00', cursor: 'pointer', opacity: highOpacitySetting }}>
                                        <div style={{ width: '100%', height: '4px', background: '#FF0000' }} />
                                        <div>
                                            highs
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', background: '#843c2c', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            78888
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', background: '#171263', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            78888
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', background: '#727572', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            78888
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2px' }}>
                                    <div data-value={reducedID + "^LOW"} onClick={this.toggleLine} style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', flex: 1, background: '#2c48ad', cursor: 'pointer', opacity: lowOpacitySetting }}>
                                        <div style={{ width: '100%', height: '4px', background: '#19b2ff' }} />
                                        <div>
                                            lows
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', background: '#843c2c', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            78888
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', background: '#171263', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            78888
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', background: '#727572', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            78888
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2px' }}>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', flex: 1, cursor: 'pointer' }}>

                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', fontSize: '12px', marginLeft: '2px' }}>

                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', fontSize: '10px', marginLeft: '2px', paddingTop: '6px' }}>
                                        deviation
                                    </div>
                                    <div style={{ minWidth: '60px', maxWidth: '60px', minHeight: '20px', background: '#3c3c3c', fontSize: '14px', marginLeft: '2px', paddingTop: '3px' }}>
                                        <div>
                                            78888
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    )

                })()
            );
        }

        // MAIN RENDER RETURN
        return (
            <div style={{ background: "#000", width: '100%' }}>
                <div style={{ textAlign: 'left', fontSize: '30px', userSelect: 'none', display: 'flex', flexDirection: 'row', background: "#1e4354" }}>
                    <BiHide onClick={this.toggleGrowLines} style={{ fontSize: "24px", padding: "4px", cursor: 'pointer', background: "#222f4b" }} />
                    <div style={{ fontSize: "24px", marginLeft: "4px", marginBottom: '2px' }}>
                        {this.props.grow.name}
                    </div>
                    <div style={{ flex: 1 }} />
                    <MdSettingsApplications data-value={this.props.grow} onClick={this.openGrowLineSettings} style={{ fontSize: "30px", padding: "4px", background: "#555555", cursor: 'pointer', marginRight: "16px" }} />
                </div >
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {renderButtonItems}
                </div>
            </div>
        );
    }
}

export default LifetimeDataColumn;
