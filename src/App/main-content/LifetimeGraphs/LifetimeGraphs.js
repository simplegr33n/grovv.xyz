import React, { Component } from 'react';
import '../../../styles/App.css';

import ProcessingFunctions from '../../_utils/ProcessingFunctions'

import LifetimeGraph from '../_Graphs/GraphLifetime'


class LifetimeGraphs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            graphElementSize: [150, 150], // needs init
            graphSizeUpdated: 0, // init at 0

            growID: '-C02kOvSXRrm1zIZ6EOx', // hardcoded for now // '-LdtkOvSXRrm1zIZ6EOx' // '-LdtfBTlG6Fgg-ADD8-b' // '-C02kOvSXRrm1zIZ6EOx'
            year: '2020',
            month: '10',
        };

        this.processingFunctions = new ProcessingFunctions()

    }

    componentDidMount = () => {
        this._ismounted = true;
        if (this.props.lifetimeData) {
            // this.normalizeLifetimeData()
            this.processingFunctions.normalizeLifetimeData(this.props.lifetimeData, this.setProcessedData, 0, new Date().valueOf())
        }

        // SCARY TIMES!
        // this.getMonthChunkData()

        this.calcGraphDimensions()
    }

    componentDidUpdate() {
        this.calcGraphDimensions()
    }

    calcGraphDimensions() {
        var dateNow = new Date()

        if (((this.state.graphElementSize !== [this.divRef.clientWidth, this.divRef.clientHeight]) && ((dateNow.getTime() - this.state.graphSizeUpdated) > 500))) {

            var tempSize = [this.divRef.clientWidth, this.divRef.clientHeight + (this.divRef.clientHeight / 100) * 5]

            if (tempSize !== this.state.graphElementSize) {
                if (this._ismounted) {
                    this.setState({
                        graphElementSize: tempSize,
                        graphSizeUpdated: dateNow.getTime()
                    });
                }
            }
        }
    }

    setProcessedData = (sensorList, normalizedData, sampleHighs) => {
        // setState
        this.setState({
            sensorList: sensorList,
            normalizedData: normalizedData,
            sampleHighs: sampleHighs
        })
    }

    updateTimeframe = (rangeMin, rangeMax) => {
        this.processingFunctions.normalizeLifetimeData(this.props.lifetimeData, this.setProcessedData, rangeMin, rangeMax)
    }



    // ///////////////////////////////
    // CHUNKY stuff -- Relating to grabbing info from firebase, reading it, and pushing processed data back
    // ///////////////////////////////
    getMonthChunkData() {
        this.props.getMonthChunkData(this.state.growID, this.state.year, this.state.month, this.processChunk)
    }

    processChunk(chunk) {
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

    postProcessedDayData(lifetimeObject, day) {
        this.props.postLifetimeData(lifetimeObject, this.state.growID, this.state.year, this.state.month, day)
    }


    render() {

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: "100vw", minHeight: "80vh" }} ref={element => this.divRef = element} >
                    <div className="Lifetime-Graph-Area" >
                        <LifetimeGraph updateTimeframe={this.updateTimeframe} parentSize={this.state.graphElementSize} normalizedData={this.state.normalizedData} sensorList={this.state.sensorList} sampleHighs={this.state.sampleHighs} userGrows={this.props.userGrows} />
                    </div>
                </div >
            </div>

        );
    }
}

export default LifetimeGraphs;
