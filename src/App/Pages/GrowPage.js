import React, { Component } from 'react'
import '../../styles/App.css'

import DisplayFunctions from '../_utils/DisplayFunctions.js'

import GraphGrowPage from '../Components/_Pages/GrowPage/GraphGrowPage.js'
import GrowDataDisplay from '../Components/_Pages/GrowPage/GrowDataDisplay.js'
import GrowPageSettings from '../Components/_Pages/GrowPage/GrowPageSettings.js'



import { AiFillControl } from 'react-icons/ai'



class GrowPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sensorPIDS: [],

            activeLines: [],
            ACTIVE_INIT: false,

            SHOW_SETTINGS: false,

            // Graph sizing
            graphElementSize: [150, 150], // needs init
            graphSizeUpdated: 0 // init at 0
        };

        this.displayFunctions = new DisplayFunctions()
    }

    componentDidMount() {
        this.sensorAndLineInit()

        if (this.props.processedData && this.props.processedData[this.props.grow.id]) {
            this.dataLengthRef = this.props.processedData[this.props.grow.id].length
            this.setState({ processedData: this.props.processedData[this.props.grow.id] })
        }

        this.calcGraphDimensions()
    }

    componentDidUpdate = () => {
        if (this.props.grow !== this.state.ACTIVE_INIT) {
            this.sensorAndLineInit()
        }

        if (this.state.processedData !== this.props.processedData[this.props.grow.id]) {
            if (this.dataLengthRef === this.props.processedData[this.props.grow.id].length) {
                return
            }
            this.dataLengthRef = this.props.processedData[this.props.grow.id].length
            this.setState({ processedData: this.props.processedData[this.props.grow.id] })
        }

        this.calcGraphDimensions()
    }

    calcGraphDimensions() {
        var dateNow = new Date()

        if (((this.state.graphElementSize !== [this.divRef.clientWidth, this.divRef.clientHeight]) && ((dateNow.getTime() - this.state.graphSizeUpdated) > 500))) {

            var tempSize = [this.divRef.clientWidth + (this.divRef.clientWidth / 100) * 8, this.divRef.clientHeight + (this.divRef.clientHeight / 100) * 14]

            if (tempSize !== this.state.graphElementSize) {
                this.setState({
                    graphElementSize: tempSize,
                    graphSizeUpdated: dateNow.getTime()
                });
            }
        }
    }

    sensorAndLineInit = () => {
        var sensorPIDS = []
        var activeLines = []
        this.props.grow.config.SENSORS.forEach((sensor, key) => {
            sensorPIDS[key] = sensor.PID
            activeLines[key] = sensor.PID
        });
        this.setState({
            sensorPIDS: sensorPIDS,
            activeLines: activeLines,
            ACTIVE_INIT: this.props.grow
        });
    }

    toggleLine = (pid) => {

        var tIndex = this.state.sensorPIDS.indexOf(pid)

        var tActiveLines = this.state.activeLines

        if (tActiveLines.includes(pid)) {
            tActiveLines[tIndex] = null
        } else {
            tActiveLines[tIndex] = pid
        }

        console.log("toggle active lines", tActiveLines)

        this.setState({ activeLines: tActiveLines })
    }

    openCloseSettings = () => {
        if (this.state.SHOW_SETTINGS) {
            this.setState({ SHOW_SETTINGS: false })
        } else {
            this.setState({ SHOW_SETTINGS: true })
        }
    }

    render() {

        var indicatorColor = this.displayFunctions.returnActiveIndicatorColor(this.props.processedData[this.props.grow.id])

        // MAIN RENDER RETURN
        return (
            <div className="Grow-Details-Page">
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minWidth: '100%' }} >

                    <div className="Grow-Details-Header">
                        <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                            <div style={{ color: indicatorColor, marginLeft: '1px', fontSize: '1.1em', userSelect: 'none' }}>⬤</div>
                            <div id="Grow-Header-Text">{this.props.grow.name}</div>
                        </div>
                        <div onClick={() => this.openCloseSettings()} style={{ paddingRight: '30px', color: '#A9A9A9', userSelect: 'none', cursor: 'pointer' }}>
                            <AiFillControl style={{ color: '#9e9e9e', fontSize: '22px', marginTop: '8px' }} />
                        </div>
                    </div>

                    <div style={{ position: 'relative', width: "100%", maxWidth: '100%', height: "64vh", minHeight: "64vh", background: "#000" }} ref={element => this.divRef = element}>
                        <GraphGrowPage setDisplayWindow={this.props.setDisplayWindow} displayWindow={this.props.displayWindow} parentSize={this.state.graphElementSize} processedData={this.state.processedData} grow={this.props.grow} activeLines={this.state.activeLines} />
                    </div>

                    <div className="Grow-Details-Page-Panel">
                        <div id="Grow-Details-Data-Display">
                            <GrowDataDisplay toggleLine={this.toggleLine} grow={this.props.grow} user={this.props.user} processedData={this.state.processedData} activeLines={this.state.activeLines} sensorPIDS={this.state.sensorPIDS} />
                        </div>
                    </div>

                </div>

                {(() => {
                    if (this.state.SHOW_SETTINGS) {
                        return <GrowPageSettings close={this.openCloseSettings} refreshGrows={this.props.refreshGrows} grow={this.props.grow} />
                    }
                })()}

            </div >
        );
    }
}

export default GrowPage;
