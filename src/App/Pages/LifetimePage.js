import React, { Component } from 'react'
import '../../styles/App.css'

import ProcessingFunctions from '../_utils/ProcessingFunctions.js'

import GraphLifetime from '../Components/_Pages/LifetimePage/GraphLifetime.js'


class LifetimePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Graph sizing
            graphElementSize: [150, 150], // needs init
            graphSizeUpdated: 0, // init at 0

            // TEMP HERE -- for getting lifetime data to process
            growID: 'EC1_0__D8:F1:5B:10:AB:04', // hardcoded for now // '-LdtkOvSXRrm1zIZ6EOx' // '-LdtfBTlG6Fgg-ADD8-b' // 'EC1_0__D8:F1:5B:10:AB:04' // 'EC1_0__FC:F5:C4:96:8C:A0'
            year: '2020',
            month: '10',
        };

        this.processingFunctions = new ProcessingFunctions()

    }

    componentDidMount() {
        this.calcGraphDimensions()

        // /////////////
        // SCARY TIMES!
        // this.getMonthChunkData()

    }

    componentDidUpdate() {
        this.calcGraphDimensions()
    }

    calcGraphDimensions() {
        var dateNow = new Date()

        if (((this.state.graphElementSize !== [this.divRef.clientWidth, this.divRef.clientHeight]) && ((dateNow.getTime() - this.state.graphSizeUpdated) > 500))) {

            var tempSize = [this.divRef.clientWidth, this.divRef.clientHeight + (this.divRef.clientHeight / 100) * 5]
            if (tempSize !== this.state.graphElementSize) {
                this.setState({
                    graphElementSize: tempSize,
                    graphSizeUpdated: dateNow.getTime()
                });
            }
        }
    }


    // ///////////////////////////////
    // CHUNKY stuff -- Relating to grabbing info from firebase, reading it, and pushing processed data back
    // ///////////////////////////////
    getMonthChunkData() {
        this.props.getMonthChunkData(this.state.growID, this.state.year, this.state.month, this.processChunk)
    }

    processChunk = (chunk) => {
        // JUST A HUGE FCKN function for now why not
        // Iterate over days
        console.log("chunky0PRIME ", chunk)
        for (const [day, dayChunk] of Object.entries(chunk)) {
            var datapointCount = []
            var averagesObject = []
            var lowsObject = []
            var highsObject = []

            for (const [hour, hourChunk] of Object.entries(dayChunk)) {
                for (const [entryID, entry] of Object.entries(hourChunk)) {
                    for (const [sensorPID, value] of Object.entries(entry)) {
                        // skip time
                        if (sensorPID === "time") {
                            continue
                        }

                        // datapointCount
                        if (!datapointCount[sensorPID]) {
                            datapointCount[sensorPID] = 1
                        } else {
                            datapointCount[sensorPID] = datapointCount[sensorPID] + 1
                        }

                        // averages
                        if (!averagesObject[sensorPID]) {
                            averagesObject[sensorPID] = Math.round((value) * 10) / 10
                        } else {
                            averagesObject[sensorPID] = parseFloat(averagesObject[sensorPID]) + parseFloat(value)
                        }

                        // highs
                        if (!highsObject[sensorPID] || highsObject[sensorPID] < value) {
                            highsObject[sensorPID] = Math.round((value) * 10) / 10
                        }

                        // lows
                        if (!lowsObject[sensorPID] || lowsObject[sensorPID] > value) {
                            lowsObject[sensorPID] = Math.round((value) * 10) / 10
                        }
                    }
                }
            }

            for (const [key, value] of Object.entries(averagesObject)) {
                averagesObject[key] = Math.round((value / datapointCount[key]) * 10) / 10
            }

            // post lifetimeObject
            var lifetimeObject = []
            lifetimeObject.HIGH = highsObject
            lifetimeObject.LOW = lowsObject
            lifetimeObject.AVERAGE = averagesObject
            this.postProcessedDayData(lifetimeObject, day)
        }
    }
    postProcessedDayData = (lifetimeObject, day) => {
        this.props.postLifetimeData(lifetimeObject, this.state.growID, this.state.year, this.state.month, day)
    }


    render() {



        return (
            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', maxWidth: '100%', maxHeight: '100%' }}>
                <div style={{ width: "100%", minHeight: "80vh", maxHeight: "80vh" }} ref={element => this.divRef = element} >
                    <div className="Lifetime-Graph-Area" >
                        <GraphLifetime parentSize={this.state.graphElementSize} normalizedLifetimeData={this.props.normalizedLifetimeData} allSensorsList={this.props.allSensorsList} sampleHighs={this.props.sampleHighs} userGrows={this.props.userGrows} />
                    </div>
                </div >
            </div>

        );
    }
}

export default LifetimePage;