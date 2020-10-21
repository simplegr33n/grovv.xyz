import React, { Component } from 'react'
import '../../styles/App.css'

import GraphGrowPage from '../Components/_Pages/GrowPage/GraphGrowPage.js'
import GrowDataDisplay from '../Components/_Pages/GrowPage/GrowDataDisplay.js'
import GrowPageSettings from '../Components/_Pages/GrowPage/GrowPageSettings.js'


import { AiFillControl } from 'react-icons/ai'



class GrowPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            SENSOR_PIDS: [],
            SENSORS_INIT: false,

            ACTIVE_LINES: [],
            ACTIVE_INIT: false,

            TABLE_INIT: false,

            SHOW_SETTINGS: false,

            // Graph sizing
            graphElementSize: [150, 150], // needs init
            graphSizeUpdated: 0 // init at 0
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

        this.calcGraphDimensions()
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

        this.calcGraphDimensions()
    }

    calcGraphDimensions() {
        var dateNow = new Date()

        if (((this.state.graphElementSize !== [this.divRef.clientWidth, this.divRef.clientHeight]) && ((dateNow.getTime() - this.state.graphSizeUpdated) > 500))) {

            var tempSize = [this.divRef.clientWidth + (this.divRef.clientWidth / 100) * 10, this.divRef.clientHeight + (this.divRef.clientHeight / 100) * 14]

            if (tempSize !== this.state.graphElementSize) {
                this.setState({
                    graphElementSize: tempSize,
                    graphSizeUpdated: dateNow.getTime()
                });
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

        if (this.props.liveGrowData && this.props.liveGrowData[this.props.grow.id]) {

            var now = new Date().getTime();
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
        }

        // MAIN RENDER RETURN
        return (
            <div className="Grow-Details-Page">
                <div className="Grow-Details-Page-Content">
                    <div className="Grow-Details-Content-Bottom">
                        <div className="Grow-Details-Header">
                            <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                                <div style={{ color: indicatorColor, marginLeft: '1px', fontSize: '1.1em', userSelect: 'none' }}>⬤</div>
                                <div id="Grow-Header-Text">{this.props.grow.name}</div>
                            </div>
                            <div onClick={() => this.openCloseSettings()} style={{ paddingRight: '30px', color: '#A9A9A9', userSelect: 'none', cursor: 'pointer' }}>
                                <AiFillControl style={{ color: '#9e9e9e', fontSize: '22px', marginTop: '8px' }} />
                            </div>
                        </div>

                        <div style={{ position: 'relative', width: "100vw", height: "80vh", minHeight: "80vh", background: "#000" }} ref={element => this.divRef = element}>
                            <GraphGrowPage setDisplayWindow={this.props.setDisplayWindow} displayWindow={this.props.displayWindow} activeLines={this.props.activeLines} parentSize={this.state.graphElementSize} processedData={this.props.processedData} grow={this.props.grow} />
                        </div>
                    </div>

                    {(() => {
                        if (this.state.SHOW_SETTINGS) {
                            return <GrowPageSettings grow={this.props.grow} refreshGrows={this.props.refreshGrows} close={this.openCloseSettings} />
                        }
                    })()}

                    <div className="Grow-Details-Page-Panel">
                        <div id="Grow-Details-Data-Display">
                            <GrowDataDisplay key={this.props.grow.id} grow={this.props.grow} toggleLine={this.toggleLine} threeDayData={this.props.threeDayData} liveGrowData={this.props.liveGrowData} user={this.props.user} activeLines={this.state.ACTIVE_LINES} />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default GrowPage;
