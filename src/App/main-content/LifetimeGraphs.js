import React, { Component } from 'react';
import '../../styles/App.css';

import LifetimeGraph from './Graphs/GraphLifetime'

import moment from 'moment' // for datetime...


class LifetimeGraphs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            graphElementSize: [150, 150], // needs init
            graphSizeUpdated: 0, // init at 0

            growID: '-C02kOvSXRrm1zIZ6EOx', // hardcoded for now // '-LdtkOvSXRrm1zIZ6EOx' // '-LdtfBTlG6Fgg-ADD8-b' // '-C02kOvSXRrm1zIZ6EOx'
            year: '2020',
            month: '09',
        };

    }

    componentDidMount = () => {
        this._ismounted = true;
        if (this.props.lifetimeData) {
            this.normalizeLifetimeData()
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

    componentWillUnmount = () => {
        this._ismounted = false;
    }

    postLifetimeData(lifetimeObject, day) {
        this.props.postLifetimeData(lifetimeObject, this.state.growID, this.state.year, this.state.month, day)
    }

    normalizeLifetimeData(rangeMin = 0, rangeMax = new Date().valueOf()) {

        var allYears = [2019, 2020]
        var allMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
        var allDays = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]

        var normalizedEntries = []
        var sensorList = []

        var sampleHighs = []

        allYears.forEach((year) => {
            allMonths.forEach((month) => {
                var testDate = new Date(year + "-" + month).valueOf()

                if ((testDate < rangeMax) && (testDate > rangeMin)) {
                    allDays.forEach((day) => {
                        var normalizedDataPoint = {}
                        for (const [growID, dataSet] of Object.entries(this.props.lifetimeData)) {
                            if (dataSet[year] && dataSet[year][month] && dataSet[year][month][day]) {

                                // add datapieces to normalizedDataPoint
                                for (const [dataType, values] of Object.entries(dataSet[year][month][day])) {
                                    for (const [pid, value] of Object.entries(values)) {
                                        var renamedSensor = pid + "^" + growID + "^" + dataType
                                        normalizedDataPoint[renamedSensor] = value
                                        // add to sensorlist if not yet there
                                        if (!sensorList.includes(renamedSensor)) {
                                            sensorList[sensorList.length] = renamedSensor
                                        }

                                        // add to sample highs for axis picking if not there
                                        if (dataType === "HIGH" && !sampleHighs[pid + "^" + growID] || sampleHighs[pid + "^" + growID] < value) {
                                            sampleHighs[pid + "^" + growID] = value
                                        }
                                    }
                                }
                            }
                        }

                        if (Object.keys(normalizedDataPoint).length !== 0) {
                            // add normalized datapoint to normalizedEntries
                            var aDate = new Date(year + "-" + month + "-" + day).valueOf()
                            normalizedDataPoint.time = aDate
                            normalizedEntries[normalizedEntries.length] = normalizedDataPoint
                        }
                    })
                }
            })
        })

        // setState
        this.setState({
            sensorList: sensorList,
            normalizedData: normalizedEntries,
            sampleHighs: sampleHighs
        })
    }

    updateTimeframe = (rangeMin, rangeMax) => {
        console.log("MINAND MAX" + rangeMin, rangeMax)
        this.normalizeLifetimeData(rangeMin, rangeMax)
    }




    // ///////////////////////////////
    // CHUNKY stuff -- Relating to grabbing info from firebase, reading it, and pushing processed data back
    // ///////////////////////////////
    getMonthChunkData() {
        this.props.getMonthChunkData(this.state.growID, this.state.year, this.state.month, this.setStateMonthChunk)
    }

    setStateMonthChunk = (chunk) => {
        this.setState({
            monthChunk: chunk
        });

        this.processChunk(chunk)
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
            this.postLifetimeData(lifetimeObject, day)
        }
    }


    render() {

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: "100vw", minHeight: "80vh" }} ref={element => this.divRef = element} >
                    <div className="Lifetime-Graph-Area" >
                        <LifetimeGraph updateTimeframe={this.updateTimeframe} parentSize={this.state.graphElementSize} normalizedData={this.state.normalizedData} sensorList={this.state.sensorList} sampleHighs={this.state.sampleHighs} />
                    </div>
                </div >
                <div className="Grow-Details-Page-Panel">

                </div>
            </div>

        );
    }
}

export default LifetimeGraphs;
