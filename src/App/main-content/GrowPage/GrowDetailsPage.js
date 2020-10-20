import React, { Component } from 'react';
import '../../../styles/App.css';

import GrowDetailsGraphs from './GrowDetailsGraphs'
import GrowDataDisplay from './GrowDataDisplay'
import GrowSettings from './GrowSettings';


import moment from 'moment'


import { AiFillControl } from 'react-icons/ai';



class GrowDetailsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            SENSOR_PIDS: [],
            SENSORS_INIT: false,

            ACTIVE_LINES: [],
            ACTIVE_INIT: false,

            TABLE_INIT: false,

            SHOW_SETTINGS: false
        };

    }

    componentDidMount() {
        if (this.props.threeDayData) {
            if (!this.props.threeDayData[this.props.grow.id]) {
                return;
            }

            var dataLengthRef = this.props.threeDayData[this.props.grow.id][this.props.threeDayData[this.props.grow.id].length - 1].length

            if (this.dataLengthRef !== dataLengthRef) {
                this.dataLengthRef = dataLengthRef
                this.initializeGrowPage()
            } else if (!this.state.TABLE_INIT) {
                // Gotta get this process in the first time for things to go smooth... not quite sure why.
                this.dataLengthRef = dataLengthRef
                this.initializeGrowPage()
                this.setState({ TABLE_INIT: true })
            }
        }
    }

    componentDidUpdate = () => {

        if (this.props.threeDayData) {
            if (!this.props.threeDayData[this.props.grow.id]) {
                return;
            }

            var dataLengthRef = this.props.threeDayData[this.props.grow.id][this.props.threeDayData[this.props.grow.id].length - 1].length

            if (this.dataLengthRef !== dataLengthRef) {
                this.dataLengthRef = dataLengthRef
                this.initializeGrowPage()
            } else if (!this.state.TABLE_INIT) {
                // Gotta get this process in the first time for things to go smooth... not quite sure why.
                this.dataLengthRef = dataLengthRef
                this.initializeGrowPage()
                this.setState({ TABLE_INIT: true })
            }
        }

    }

    initializeGrowPage = () => {
        // INITIALIZING SENSOR INFO
        var SENSOR_PIDS = []
        if (this.state.SENSORS_INIT !== this.props.grow && this.props.grow.config.SENSORS !== this.state.SENSOR_PIDS) {
            this.props.grow.config.SENSORS.forEach((sensor, key) => {

                if (SENSOR_PIDS[key] !== sensor.PID) {
                    SENSOR_PIDS[key] = sensor.PID
                }
            });

            this.setState({
                SENSOR_PIDS: SENSOR_PIDS
            });

            if (this.state.ACTIVE_INIT !== this.props.grow) {
                this.setState({
                    ACTIVE_LINES: SENSOR_PIDS,
                    ACTIVE_INIT: this.props.grow
                });
            }
        }
    }


    toggleLine = (rawPid) => {
        var pid = rawPid.split("^")[0]

        var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

        var tActiveLines = this.state.ACTIVE_LINES

        if (tActiveLines.includes(pid)) {
            tActiveLines[tIndex] = null
        } else {
            tActiveLines[tIndex] = pid
        }

        this.setState({ ACTIVE_LINES: tActiveLines })
        this.forceUpdate()
    }

    openCloseSettings = () => {
        if (this.state.SHOW_SETTINGS) {
            this.setState({ SHOW_SETTINGS: false })
        } else {
            this.setState({ SHOW_SETTINGS: true })
        }
    }

    render() {

        var indicatorColor = "#FFF"
        var lastUpdate = null;
        if (this.props.liveGrowData && this.props.liveGrowData[this.props.grow.id]) {
            var now = new Date().getTime();
            var updatedAtDate = new Date(this.props.liveGrowData[this.props.grow.id].time * 1000)

            if (this.updatedAtDate && (updatedAtDate !== this.updatedAtDate[this.props.grow.id])) {
                this.updatedAtDate[this.props.grow.id] = updatedAtDate
            }

            var difference = now - this.props.liveGrowData[this.props.grow.id].time * 1000
            if (difference > 10000000) {
                indicatorColor = "#989e98"
            } else if (difference > 300000) {
                indicatorColor = "#fa360a"
            } else if (difference > 60000) {
                indicatorColor = "#facb23"
            } else if (difference < 60000) {
                indicatorColor = "#27d927"
            }
            lastUpdate = moment(updatedAtDate).fromNow()
        }

        // MAIN RENDER RETURN
        return (
            <div className="Grow-Details-Page">
                <div className="Grow-Details-Page-Content">
                    <div className="Grow-Details-Content-Bottom">
                        <div className="Grow-Details-Header">
                            <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                                <div style={{ color: indicatorColor, marginLeft: '1px', fontSize: '1.1em' }}>
                                    ⬤
                                </div>
                                <div id="Grow-Header-Text">{this.props.grow.name}</div>
                            </div>
                            <div onClick={() => this.openCloseSettings()} style={{ paddingRight: '30px', color: '#A9A9A9', userSelect: 'none', cursor: 'pointer' }}>
                                <AiFillControl style={{ color: '#9e9e9e', fontSize: '22px', marginTop: '8px' }} />
                            </div>
                        </div>
                        <div className="Grow-Details-Bottom-Item" >
                            <GrowDetailsGraphs setDisplayWindow={this.props.setDisplayWindow} displayWindow={this.props.displayWindow} activeLines={this.state.ACTIVE_LINES} processedData={this.props.processedData} grow={this.props.grow} />
                        </div>
                    </div>

                    {(() => {
                        if (this.state.SHOW_SETTINGS) {
                            return (
                                <GrowSettings grow={this.props.grow} refreshGrows={this.props.refreshGrows} close={this.openCloseSettings} />
                            )
                        }
                    })()}

                    <div className="Grow-Details-Page-Panel">
                        <div id="Grow-Details-Data-Display">
                            <GrowDataDisplay grow={this.props.grow} toggleLine={this.toggleLine} threeDayData={this.props.threeDayData} liveGrowData={this.props.liveGrowData} user={this.props.user} activeLines={this.state.ACTIVE_LINES} />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default GrowDetailsPage;
