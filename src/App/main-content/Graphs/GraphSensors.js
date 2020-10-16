import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import moment from 'moment'




class GraphSensors extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayWindow: 43200000, // 1800000, 10800000, 43200000, 86400000, 259200000

            lightsOnArray: [],
            lightsOffArray: [],
            tickArray: [],
            lightBackgrounds: ['#7344e740', '#fff93640']
        };

        this.displayTemp = true
        this.displayFan = true
        this.displayHumidity = true
        this.displayHumidifier = true

    }

    componentDidMount() {
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentDidUpdate = () => {

        if (this.props.grow && this.growConfig !== this.props.grow.config) {
            this.growConfig = this.props.grow.config
            this.generateTickSourceArrays()
        }

        if (this.props.rawGrowData && this.props.grow) {

            var gwID = this.props.grow.id
            var rawData = this.props.rawGrowData

            if (rawData[gwID] && ((!this.rawRef) || rawData[gwID][rawData[gwID].length - 1] !== this.rawRef)) {
                this.rawRef = rawData[gwID][rawData[gwID].length - 1]

                var concatData = []

                rawData[gwID].forEach((list) => {
                    concatData = concatData.concat(list)
                })

                if (this.dataLength !== concatData.length) {
                    this.dataLength = concatData.length
                    concatData.sort((a, b) => (a.time > b.time) ? 1 : -1)

                    // process data
                    this.concatData = concatData
                    this.processData()
                }
            }
        }

    }

    generateTickSourceArrays = () => {
        if (!this.props.grow.config.LIGHTS) {
            return;
        }

        var m = moment(new Date())
        m.subtract(3, 'days')

        var lightsOnArray = []
        var lightsOffArray = []

        lightsOnArray[lightsOnArray.length] = moment(new Date(m.format('L') + ' ' + this.props.grow.config.LIGHTS.on)).format('x')
        lightsOffArray[lightsOffArray.length] = moment(new Date(m.format('L') + ' ' + this.props.grow.config.LIGHTS.off)).format('x')

        m.add(1, 'days')

        lightsOnArray[lightsOnArray.length] = moment(new Date(m.format('L') + ' ' + this.props.grow.config.LIGHTS.on)).format('x')
        lightsOffArray[lightsOffArray.length] = moment(new Date(m.format('L') + ' ' + this.props.grow.config.LIGHTS.off)).format('x')

        m.add(1, 'days')

        lightsOnArray[lightsOnArray.length] = moment(new Date(m.format('L') + ' ' + this.props.grow.config.LIGHTS.on)).format('x')
        lightsOffArray[lightsOffArray.length] = moment(new Date(m.format('L') + ' ' + this.props.grow.config.LIGHTS.off)).format('x')

        m.add(1, 'days')

        lightsOnArray[lightsOnArray.length] = moment(new Date(m.format('L') + ' ' + this.props.grow.config.LIGHTS.on)).format('x')
        lightsOffArray[lightsOffArray.length] = moment(new Date(m.format('L') + ' ' + this.props.grow.config.LIGHTS.off)).format('x')

        this.setState({
            lightsOnArray: lightsOnArray,
            lightsOffArray: lightsOffArray
        })

        this.lightsOnArray = lightsOnArray
        this.lightsOffArray = lightsOffArray

        this.createTickArray()

    }

    createTickArray = (processedData = this.state.processedData) => {
        if (!processedData || !processedData[0]) {
            return
        }

        var tickRange = [new Date(processedData[0].time).getTime(), new Date(processedData[processedData.length - 1].time).getTime()]

        var ticks = []

        var tempOnArray = this.lightsOnArray
        var tempOffArray = this.lightsOffArray

        if (!tempOffArray && !tempOnArray) {
            return
        }

        var sourceArray = tempOnArray.concat(tempOffArray)

        sourceArray.sort((a, b) => (a > b) ? 1 : -1)

        sourceArray.forEach((tick) => {
            if (tick > tickRange[0] && tick < tickRange[1]) {
                ticks[ticks.length] = tick
            }
        })

        //set backgrounds
        if (tempOnArray.includes(ticks[0])) {
            this.setState({ lightBackgrounds: ['#7344e740', '#fff93640'] })
        } else {
            this.setState({ lightBackgrounds: ['#fff93640', '#7344e740'] })

        }

        this.setState({ tickArray: ticks })

    }

    processData = (window = this.state.displayWindow) => {
        var data = null
        if (!this.concatData) {
            return;
        } else {
            data = this.concatData
        }

        var processedData = []
        var i = -1
        var now = new Date().getTime()

        var reducerValue = Math.round(window / 10800000)
        if (reducerValue < 1) {
            reducerValue = 1
        }


        data.forEach((dataPoint) => {
            if (now - dataPoint.time < window) {
                i++;
                if (i === 0 || i % reducerValue === 0) {
                    var processedPoint = dataPoint
                    processedData[processedData.length] = processedPoint
                }
            }
        })

        this.setState({
            processedData: processedData
        });

        this.createTickArray(processedData)

    }

    toggleWindow = (e) => {
        var setVAl = parseInt(e.target.value)

        this.setState({ displayWindow: setVAl })
        this.processData(setVAl)
        this.render()
    }

    renderTooltip = (props) => {
        var rawContent = props.payload
        if (rawContent === null || rawContent.length === 0) {
            return;
        }

        var readableTime = moment(props.payload[0].payload.time).format('ddd - HH:mm')

        const listItems = rawContent.map((l) =>
            (() => {
                if (this.props.activeLines) {
                    var tIndex = this.props.activeLines.indexOf(l.dataKey)
                    var curSensor = this.props.grow.config.SENSORS[tIndex]
                    if (!curSensor) {
                        return
                    }


                    return (
                        <div className="Grow-Details-Graph-Tooltip-Data" key={curSensor.PID} style={{ color: l.stroke, paddingLeft: '2px', paddingRight: '2px' }}>
                            <div style={{ color: l.stroke, display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
                                <div>{l.name}: </div>
                                <div style={{ fontWeight: 600 }} >{rawContent[0].payload[l.dataKey]} {curSensor.unit}</div>
                            </div>
                            <div style={{ width: "100%", height: '1px', background: "#2d2d2e" }} />
                        </div>
                    )
                }
            })()
        );


        return (
            <div className="Grow-Details-Graph-Tooltip">
                <div>{readableTime}</div>

                {listItems}

            </div>

        )
    }


    render() {

        const lineItems = this.props.grow.config.SENSORS.map((l) =>
            (() => {
                if (this.props.activeLines && this.props.activeLines.includes(l.PID)) {
                    if (l.type === "airTemp" || l.type === "waterTemp" || l.type === "co2") {
                        return <Line yAxisId="left" type="monotone" name={l.name} dataKey={l.PID} key={l.PID} stroke={l.color} strokeWidth={l.thickness} dot={false} />
                    } else {
                        return <Line yAxisId="right" type="monotone" name={l.name} dataKey={l.PID} key={l.PID} stroke={l.color} strokeWidth={l.thickness} dot={false} />
                    }
                    // temp solition for the multi graph page
                } else if (!this.props.activeLines) {
                    if (l.type === "airTemp" || l.type === "waterTemp" || l.type === "co2") {
                        return <Line yAxisId="left" type="monotone" name={l.name} dataKey={l.PID} key={l.PID} stroke={l.color} strokeWidth={l.thickness} dot={false} />
                    } else {
                        return <Line yAxisId="right" type="monotone" name={l.name} dataKey={l.PID} key={l.PID} stroke={l.color} strokeWidth={l.thickness} dot={false} />
                    }
                }
            })()
        );


        var renderDayGraph = null
        if (this.state.processedData && this.state.processedData[0]) {
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 0.91)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                renderDayGraph = (
                    <LineChart width={xSize} height={ySize} data={this.state.processedData}>

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
                        <YAxis yAxisId="left" orientation="left" domain={[24]} tick={{ fill: "#B3C2B5" }} />
                        <YAxis yAxisId="right" hide={true} orientation="right" tick={{ fill: "#B3C2B5" }} />
                        <Tooltip content={this.renderTooltip} />
                    </LineChart>
                );
            }
        }




        return (

            <div className="Chart-Container">

                {renderDayGraph}

                {/* Time Scale Select... */}
                <div style={{ width: '40px', fontSize: '0.55em', display: 'flex', flexDirection: 'column', position: 'absolute', marginLeft: '2.5%', marginTop: '4%' }}>

                    <select onChange={this.toggleWindow} id="GraphSensors-Time-Scale" defaultValue={43200000} style={{ fontSize: '0.8em', maxWidth: "74px", height: '20px' }} >
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

export default GraphSensors;
