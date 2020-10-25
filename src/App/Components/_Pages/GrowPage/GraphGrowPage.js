import React, { Component } from 'react';
import '../../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import moment from 'moment'




class GraphGrowPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lightsOnArray: [],
            lightsOffArray: [],
            tickArray: [],
            lightBackgrounds: ['#7344e740', '#fff9365C']
        };

        this.displayWindow = 0
        this.growID = null

    }

    componentDidMount() {
        if ((this.displayWindow !== this.props.displayWindow) || (this.props.grow.id !== this.growID)) {
            this.growID = this.props.grow.id
            this.displayWindow = this.props.displayWindow
            this.generateTickSourceArrays()
        }
    }

    componentDidUpdate = () => {
        if ((this.displayWindow !== this.props.displayWindow) || (this.props.grow.id !== this.growID)) {
            this.growID = this.props.grow.id
            this.displayWindow = this.props.displayWindow
            this.generateTickSourceArrays()
        }
    }

    generateTickSourceArrays = () => {
        if (!this.props.grow.config.LIGHTS) {
            this.setState({
                lightsOnArray: [],
                lightsOffArray: []
            })

            this.lightsOnArray = []
            this.lightsOffArray = []

            this.createTickArray()
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

    createTickArray() {
        var now = new Date().getTime()

        var tickRange = [now - this.props.displayWindow, now]

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
            this.setState({ lightBackgrounds: ['#7344e740', '#fff9365C'] })
        } else {
            this.setState({ lightBackgrounds: ['#fff9365C', '#7344e740'] })

        }

        this.setState({ tickArray: ticks })
    }

    toggleWindow = (e) => {
        this.props.setDisplayWindow(parseInt(e.target.value))
    }

    renderTooltip = (props) => {
        var rawContent = props.payload
        if (rawContent === null || rawContent.length === 0) {
            return;
        }

        var readableTime = moment(props.payload[0].payload.time).format('ddd - HH:mm')

        const listItems = rawContent.map((sensor) =>
            (() => {
                if (this.props.activeLines) {

                    var tIndex = this.props.activeLines.indexOf(sensor.dataKey)

                    var curSensor = this.props.grow.config.SENSORS[tIndex]
                    if (!curSensor) {
                        return
                    }


                    return (
                        <div className="Grow-Details-Graph-Tooltip-Data" key={curSensor.PID} style={{ color: sensor.stroke, paddingLeft: '2px', paddingRight: '2px' }}>
                            <div style={{ color: sensor.stroke, display: "flex", flexDirection: "row", justifyContent: 'space-between', fontSize: '10px' }}>
                                <div>{sensor.name}: </div>
                                <div style={{ fontWeight: 600 }} >{rawContent[0].payload[sensor.dataKey]} {curSensor.unit}</div>
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
        var now = new Date().getTime()

        const lineItems = this.props.grow.config.SENSORS.map((sensor) =>
            (() => {

                var lineKey = sensor.PID
                var lineName = sensor.name

                if (this.props.activeLines) {
                    var tIndex = this.props.activeLines.indexOf(sensor.PID)
                    if (tIndex < 0) {
                        return
                    }
                }

                if (sensor.type === "airTemp" || sensor.type === "waterTemp") {
                    return <Line yAxisId="temperature" type="monotone" name={lineName} dataKey={lineKey} key={lineKey} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else if (sensor.type === "humidifier" || sensor.type === "fan" || sensor.type === "humidity") {
                    return <Line yAxisId="percent" type="monotone" name={lineName} dataKey={lineKey} key={lineKey} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else if (sensor.unit === "ᵖᵖᵐ") {
                    return <Line yAxisId="ppm" type="monotone" name={lineName} dataKey={lineKey} key={lineKey} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else if (sensor.unit === "ᵖᵖᵇ") {
                    return <Line yAxisId="ppb" type="monotone" name={lineName} dataKey={lineKey} key={lineKey} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else if (sensor.unit === "kPa") {
                    return <Line yAxisId="pressure" type="monotone" name={lineName} dataKey={lineKey} key={lineKey} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else {
                    return <Line yAxisId="ppm" type="monotone" name={lineName} dataKey={lineKey} key={lineKey} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                }

            })()
        );


        var renderDayGraph = null
        if (this.props.processedData) {
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 0.91)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                renderDayGraph = (
                    <LineChart width={xSize} height={ySize} data={this.props.processedData.slice()}>

                        {lineItems}

                        <CartesianGrid vertical horizontal={false} verticalFill={[this.state.lightBackgrounds[0], this.state.lightBackgrounds[1]]} stroke="none" fillOpacity={0.2} />

                        <XAxis
                            tick={{ fill: "#B3C2B5" }}
                            dataKey="time"
                            type="number"
                            domain={[now - this.props.displayWindow, now]}
                            allowDataOverflow={true}
                            ticks={this.state.tickArray}
                            tickFormatter={(tick) => moment(tick * 1).format('MMM DDᵗʰ - HH:mm')} />

                        <YAxis yAxisId="temperature" orientation="left" type="number" width={20} allowDataOverflow={true} tick={{ fill: "#B3C2B5" }} />
                        <YAxis yAxisId="percent" orientation="right" hide={true} domain={[0, 100]} tick={{ fill: "#B3C2B5" }} />
                        <YAxis yAxisId="pressure" orientation="right" hide={true} domain={[95]} tick={{ fill: "#B3C2B5" }} />
                        <YAxis yAxisId="ppm" orientation="right" hide={true} domain={[0, 5000]} tick={{ fill: "#false" }} />
                        <YAxis yAxisId="ppb" orientation="right" hide={true} domain={[0, 5000]} tick={{ fill: "false" }} />

                        <Tooltip content={this.renderTooltip} />
                    </LineChart>
                );
            }
        }


        return (

            <div className="Chart-Container">

                {renderDayGraph}

                {/* Time Scale Select... */}
                <div style={{ width: '42px', fontSize: '0.55em', display: 'flex', flexDirection: 'column', position: 'absolute', left: '28px', top: '2px' }}>

                    <select onChange={this.toggleWindow} id="GraphSensors-Time-Scale" defaultValue={parseInt(this.props.displayWindow)} style={{ fontSize: '10px', maxWidth: "74px", height: '20px' }} >
                        <option value={1800000}>&#189;ʰ</option>
                        <option value={10800000}>3ʰ</option>
                        <option value={43200000}>12ʰ</option>
                        <option value={86400000}>24ʰ</option>
                        <option value={259200000}>72ʰ</option>
                    </select>

                </div>
            </div>

        );
    }
}

export default GraphGrowPage;
