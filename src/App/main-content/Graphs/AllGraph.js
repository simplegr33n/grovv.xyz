import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import moment from 'moment'




class AllGraph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayWindow: 43200000, // 1800000, 10800000, 43200000, 86400000, 259200000

            lightsOnArray: [],
            lightsOffArray: [],
            tickArray: [],
            lightBackgrounds: ['#7344e740', '#fff93640'],
        };

        this.concatData = []

        this.firstPointTime = 0
        this.lastPointTime = 0

    }

    componentDidMount() {
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentDidUpdate = () => {

        if (this.props.rawGrowData && this.props.growIDs) {

            var newArrayLengths = []
            var valChanged = false
            this.props.growIDs.forEach((gwID) => {

                // returns
                if (!this.props.rawGrowData[gwID]) {
                    newArrayLengths[gwID] = 0
                    return
                }
                if ((this.DataLengthChecks) && (this.DataLengthChecks[gwID] && this.props.rawGrowData[gwID]) && (this.DataLengthChecks[gwID] === this.props.rawGrowData[gwID][this.props.rawGrowData[gwID].length - 1].length)) {
                    newArrayLengths[gwID] = this.props.rawGrowData[gwID][this.props.rawGrowData[gwID].length - 1].length
                    return; // 
                }
                valChanged = true

                console.log("diff updating!", this.props.rawGrowData[gwID][this.props.rawGrowData[gwID].length - 1].length)
                newArrayLengths[gwID] = this.props.rawGrowData[gwID][this.props.rawGrowData[gwID].length - 1].length

                var subConcatData = []
                this.props.rawGrowData[gwID].forEach((list) => {
                    subConcatData = subConcatData.concat(list)
                })

                if (!this.DataLengthChecks || this.DataLengthChecks[gwID] !== subConcatData.length) {
                    subConcatData.sort((a, b) => (a.time > b.time) ? 1 : -1)
                    this.concatData[gwID] = subConcatData
                }

            })

            if (valChanged) {
                this.DataLengthChecks = newArrayLengths

                this.processData()
            }

        }

    }

    processData = (window = this.state.displayWindow) => {
        var superData = null
        if (!this.concatData) {
            return;
        } else {
            superData = this.concatData
        }

        var now = new Date().getTime()
        var processedData = []

        //forEach
        this.props.growIDs.forEach((id) => {
            if (!superData[id]) {
                return
            }

            var subProcessedData = []
            var i = -1
            superData[id].forEach((dataPoint) => {

                var reducerValue = Math.round(this.state.displayWindow / 10800000)
                if (reducerValue < 1) {
                    reducerValue = 1
                }

                if (now - dataPoint.time < window) {
                    i++;

                    if (i === 0 || i % reducerValue === 0) {
                        var processedPoint = dataPoint
                        subProcessedData[subProcessedData.length] = processedPoint
                    }
                }
            })

            processedData[id] = subProcessedData
        })

        this.setState({
            processedData: processedData
        });

    }


    renderTooltip = (props) => {
        var rawContent = props.payload
        if (rawContent === null || rawContent.length === 0) {
            return;
        }

        var readableTime = moment(props.payload[0].payload.time).format('ddd - HH:mm')

        const listItems = rawContent.map((curSensor) =>
            (() => {

                if (this.props.activeLines[curSensor.name.split("^")[1]].includes(curSensor.name.split("^")[3])) {

                    console.log("OHHHYEAH!", this.props.activeLines[curSensor.name.split("^")[1]])

                    return (
                        <div className="AllGraph-Tooltip-Data" key={curSensor.name} style={{ color: curSensor.stroke, paddingLeft: '2px', paddingRight: '2px' }}>
                            <div style={{ color: curSensor.stroke, display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
                                <div>{curSensor.name.split("^")[0]}: </div>
                                <div style={{ fontWeight: 600 }} >{rawContent[0].payload[curSensor.dataKey]} {curSensor.unit}</div>
                            </div>
                            <div style={{ width: "100%", height: '1px', background: "#2d2d2e" }} />
                        </div>
                    )
                }
            })()
        );


        return (
            <div className="AllGraph-Tooltip">
                <div>{readableTime}</div>

                {listItems}

            </div>

        )
    }


    toggleWindow = (e) => {
        console.log("Change " + e.target.id + ": " + e.target.value)

        this.setState({ displayWindow: e.target.value })
        this.processData(e.target.value)
    }



    render() {

        if (this.state.processedData) {
            var lineItems = this.props.userGrows.map(grow => grow.config.SENSORS.map((sensor) => {
                var dataBlob = sensor.name + "^" + grow.id + "^" + sensor.unit + "^" + sensor.PID
                var dataKey = sensor.PID
                var key = sensor.PID + "^" + grow.id

                if (!this.props.activeLines[grow.id].includes(sensor.PID)) {
                    return
                }

                if (sensor.type === "airTemp" || sensor.type === "waterTemp") {
                    return <Line yAxisId="temperature" type="monotone" data={this.state.processedData[grow.id]} name={dataBlob} dataKey={dataKey} key={key} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else if (sensor.type === "humidifier" || sensor.type === "fan" || sensor.type === "humidity") {
                    return <Line yAxisId="percent" type="monotone" data={this.state.processedData[grow.id]} name={dataBlob} dataKey={dataKey} key={key} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else if (sensor.type === "ppm") {
                    return <Line yAxisId="ppm" type="monotone" data={this.state.processedData[grow.id]} name={dataBlob} dataKey={dataKey} key={key} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else if (sensor.unit === "ppb") {
                    return <Line yAxisId="ppb" type="monotone" data={this.state.processedData[grow.id]} name={dataBlob} dataKey={dataKey} key={key} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else {
                    return <Line yAxisId="ppm" type="monotone" data={this.state.processedData[grow.id]} name={dataBlob} dataKey={dataKey} key={key} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                }
            }));


            var renderDayGraph = null
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 0.92)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                renderDayGraph = (
                    <LineChart width={xSize} height={ySize}>

                        {lineItems}

                        <CartesianGrid vertical horizontal={false} verticalFill={[this.state.lightBackgrounds[0], this.state.lightBackgrounds[1]]} stroke="none" fillOpacity={0.2} />

                        <XAxis
                            tick={{ fill: "#B3C2B5" }}
                            dataKey="time"
                            type="number"
                            domain={[new Date().getTime(), new Date(new Date() - this.state.displayWindow).getTime()]} //fix!
                            ticks={this.state.tickArray}
                            tickFormatter={(tick) => moment(tick * 1).format('ddd - HH:mm')}
                        />
                        <YAxis yAxisId="temperature" orientation="left" domain={[5, 24]} tick={{ fill: "#B3C2B5" }} />
                        <YAxis yAxisId="percent" orientation="right" hide={true} domain={[0, 100]} tick={{ fill: "#B3C2B5" }} />
                        <YAxis yAxisId="ppm" orientation="right" hide={true} domain={[0, 100]} tick={{ fill: "#false" }} />
                        <YAxis yAxisId="ppb" orientation="right" hide={true} domain={[0, 100]} tick={{ fill: "false" }} />
                        <Tooltip content={this.renderTooltip} />
                    </LineChart>
                );
            }

        }

        return (

            <div className="Chart-Container">

                {renderDayGraph}

                {/* Time Scale Select... */}
                <div style={{ width: '40px', fontSize: '0.55em', display: 'flex', flexDirection: 'column', position: 'absolute', marginLeft: '2.5%', marginTop: '2%' }}>

                    <select onChange={this.toggleWindow} id="AllGraph-Time-Scale" defaultValue={this.state.displayWindow} style={{ fontSize: '0.8em', maxWidth: "74px", height: '20px' }} >
                        <option value={1800000}>&#189;h</option>
                        <option value={10800000}>3h</option>
                        <option value={43200000}>12h</option>
                        <option value={86400000}>24h</option>
                        <option value={259200000}>72h</option>
                    </select>


                </div>
            </div>

        );
    }
}

export default AllGraph;
