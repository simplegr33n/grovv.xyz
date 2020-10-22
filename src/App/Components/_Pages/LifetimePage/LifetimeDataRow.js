import React, { Component } from 'react'
import '../../../../styles/App.css'

import { BiHide } from 'react-icons/bi'
import { MdSettingsApplications } from 'react-icons/md'

import DisplayFunctions from '../../../_utils/DisplayFunctions.js'


class LifetimeDataRow extends Component {

    constructor(props) {
        super(props);

        this.state = {
            allHidden: false
        };

        this.displayFunctions = new DisplayFunctions()
    }


    toggleLine = (e) => {
        this.props.handleLineToggle(e.currentTarget.getAttribute('data-value'))
    }

    toggleSensorLines = (e) => {
        this.props.toggleSensorLines(e.currentTarget.getAttribute('data-value'))
    }

    toggleGrowLines = (e) => {
        var tempBool = true
        if (this.state.allHidden) {
            tempBool = false
        }
        this.setState({ allHidden: tempBool })
        this.props.toggleGrowLines(this.props.grow.id)
    }

    openGrowLineSettings = (e) => {
        alert("TODO... ")
    }

    render() {

        console.log("props", this.props)

        var barOpacity = 1
        if (this.state.allHidden) {
            barOpacity = 0.5
        }

        var renderButtonItems = null
        if (this.props.allSensorsList && this.props.tableData) {
            renderButtonItems = this.props.allSensorsList.map((sensorID) =>
                (() => {
                    if (this.state.allHidden) {
                        return
                    }
                    if ((sensorID.split("^")[1] !== this.props.grow.id)) {
                        return
                    }
                    if (sensorID.split("^")[2] !== "HIGH") {
                        return
                    }

                    var reducedID = sensorID.split("^")[0] + "^" + sensorID.split("^")[1]
                    var sensorPID = sensorID.split("^")[0]

                    var setOpacity = 0.4
                    var highOpacitySetting = 0.4
                    var avgsOpacitySetting = 0.4
                    var lowOpacitySetting = 0.4
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

                    var sensorName = sensorID.split("^")[0]
                    var sensorType = "(?)"
                    var sensorUnit = ""
                    for (const [key, sensor] of Object.entries(this.props.grow.config.SENSORS)) {
                        if (sensorName === sensor.PID) {
                            if (sensor.name) (
                                sensorName = sensor.name
                            )
                            if (sensor.type) {
                                sensorType = sensor.type
                            }
                            if (sensor.unit) {
                                sensorUnit = sensor.unit
                            }
                        }
                    }


                    return (
                        <div data-value={sensorID} key={sensorID} style={{ margin: '1px', opacity: setOpacity, overflow: 'hidden' }}>

                            <div style={{ userSelect: 'none' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', background: '#3d5674', height: '24px' }}>
                                    <div style={{ padding: '2px', fontSize: '14px', fontWeight: 600 }} >
                                        {this.displayFunctions.displaySensorTypeIcon(sensorType)}
                                    </div>
                                    <div style={{ padding: '2px', fontSize: '16px', fontWeight: 600 }} >
                                        {sensorName}
                                    </div>
                                    <div style={{ flex: 1 }} />
                                    <BiHide data-value={sensorID} onClick={this.toggleSensorLines} style={{ fontSize: "14px", padding: "2px", cursor: 'pointer', background: "#5882bf" }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', userSelect: 'none', flexDirection: 'column', fontSize: '10px', background: '#6088a9', color: '#000', padding: '2px' }}>

                                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2px', maxHeight: '10px', color: '#000', fontSize: '12px', fontWeight: 1000, color: '#FFF' }}>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '10px' }} />
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '10px', marginLeft: '2px', background: '#526d88' }}>
                                        <div style={{ marginTop: '-4px' }}>
                                            &#8593;
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '10px', marginLeft: '2px', background: '#526d88' }}>
                                        <div style={{ marginTop: '-4px' }}>
                                            &#8595;
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '10px', marginLeft: '2px', background: '#526d88' }}>
                                        <div style={{ marginTop: '-4px' }}>
                                            ~
                                        </div>
                                    </div>
                                </div>


                                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2px', color: '#FFF' }}>
                                    <div data-value={reducedID + "^AVERAGE"} onClick={this.toggleLine} style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', background: '#495a65', cursor: 'pointer', opacity: avgsOpacitySetting }}>
                                        <div style={{ width: '100%', height: '4px', background: '#62ce92' }} />
                                        <div>
                                            averages
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', background: '#843c2c', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            {this.props.tableData[this.props.grow.id]['AVERAGE'][sensorPID].highValue} {sensorUnit}
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', background: '#171263', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            {this.props.tableData[this.props.grow.id]['AVERAGE'][sensorPID].lowValue} {sensorUnit}
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', background: '#4a6168', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            {this.props.tableData[this.props.grow.id]['AVERAGE'][sensorPID].averageValue} {sensorUnit}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2px', color: '#FFF' }}>
                                    <div data-value={reducedID + "^HIGH"} onClick={this.toggleLine} style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', flex: 1, background: '#b44b00', cursor: 'pointer', opacity: highOpacitySetting }}>
                                        <div style={{ width: '100%', height: '4px', background: '#FF0000' }} />
                                        <div>
                                            highs
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', background: '#843c2c', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            {this.props.tableData[this.props.grow.id]['HIGH'][sensorPID].highValue} {sensorUnit}
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', background: '#171263', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            {this.props.tableData[this.props.grow.id]['HIGH'][sensorPID].lowValue} {sensorUnit}
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', background: '#4a6168', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            {this.props.tableData[this.props.grow.id]['HIGH'][sensorPID].averageValue} {sensorUnit}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2px', color: '#FFF' }}>
                                    <div data-value={reducedID + "^LOW"} onClick={this.toggleLine} style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', flex: 1, background: '#2c48ad', cursor: 'pointer', opacity: lowOpacitySetting }}>
                                        <div style={{ width: '100%', height: '4px', background: '#19b2ff' }} />
                                        <div>
                                            lows
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', background: '#843c2c', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            {this.props.tableData[this.props.grow.id]['LOW'][sensorPID].highValue} {sensorUnit}
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', background: '#171263', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            {this.props.tableData[this.props.grow.id]['LOW'][sensorPID].lowValue} {sensorUnit}
                                        </div>
                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', background: '#4a6168', fontSize: '12px', marginLeft: '2px' }}>
                                        <div>
                                            {this.props.tableData[this.props.grow.id]['LOW'][sensorPID].averageValue} {sensorUnit}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '2px', color: '#FFF' }}>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', flex: 1, cursor: 'pointer' }}>

                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', fontSize: '12px', marginLeft: '2px' }}>

                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', fontSize: '10px', marginLeft: '2px', paddingTop: '6px', background: '#526d88' }}>
                                        deviation:
                                    </div>
                                    <div style={{ minWidth: '54px', maxWidth: '54px', minHeight: '20px', background: '#3c3c3c', fontSize: '14px', marginLeft: '2px', paddingTop: '3px' }}>
                                        <div>
                                            {Math.round(((this.props.tableData[this.props.grow.id]['HIGH'][sensorPID].averageValue - this.props.tableData[this.props.grow.id]['LOW'][sensorPID].averageValue) / 2) * 10) / 10} {sensorUnit}
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
            <div style={{ width: '100%', marginLeft: '4px', opacity: barOpacity }}>
                <div style={{ textAlign: 'left', fontSize: '30px', userSelect: 'none', display: 'flex', flexDirection: 'row', background: "#1e4354", marginBottom: '2px' }}>

                    <MdSettingsApplications data-value={this.props.grow} onClick={this.openGrowLineSettings} style={{ fontSize: "30px", padding: "4px", background: "#555555", cursor: 'pointer' }} />

                    <div style={{ fontSize: "24px", marginLeft: "2px", marginBottom: '2px' }}>
                        {this.props.grow.name}
                    </div>
                    <div style={{ flex: 1 }} />

                    <BiHide onClick={this.toggleGrowLines} style={{ fontSize: "24px", padding: "4px", cursor: 'pointer', background: "#5882bf" }} />

                </div >
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginLeft: '4px' }}>
                    {renderButtonItems}
                </div>
            </div>
        );
    }
}

export default LifetimeDataRow;
