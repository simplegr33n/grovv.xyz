import React, { Component } from 'react';
import '../../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import moment from 'moment'


class GraphAllPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // displayWindow: 43200000, // 1800000, 10800000, 43200000, 86400000, 259200000

            lightsOnArray: [],
            lightsOffArray: [],
            tickArray: [],
            lightBackgrounds: ['#7344e740', '#fff93640'],
        };
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }


    toggleWindow = (e) => {
        this.setState({ displayWindow: e.target.value })

        this.props.setDisplayWindow(parseInt(e.target.value))
    }



    renderTooltip = (props) => {
        var rawContent = props.payload
        if (rawContent === null || rawContent.length === 0) {
            return;
        }

        var readableTime = moment(props.payload[0].payload.time).format('ddd - HH:mm')

        const listItems = rawContent.map((curSensor) => {
            var tID = curSensor.name.split("^")[1]
            var tPID = curSensor.name.split("^")[3]

            if (this.props.user) {
                if (this.props.user.PREFS) {
                    if (this.props.user.PREFS.GRAPHS) {
                        if (this.props.user.PREFS.GRAPHS.AllGraph) {
                            if (this.props.user.PREFS.GRAPHS.AllGraph.showSensors && (this.props.user.PREFS.GRAPHS.AllGraph.showSensors[curSensor.dataKey] === false)) {
                                return
                            }
                        }
                    }
                }
            }

            var grow = null
            this.props.userGrows.forEach((g) => {
                if (g.id === tID) {
                    grow = g
                    return
                } else {
                    return
                }
            })

            var sensor = null
            grow.config.SENSORS.forEach((s) => {
                if (s.PID === tPID) {
                    sensor = s
                }
            })

            return (
                <div className="AllGraph-Tooltip-Data" key={curSensor.dataKey} style={{ color: sensor.color, paddingLeft: '2px', paddingRight: '2px' }}>
                    <div style={{ color: sensor.color, display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
                        <div>{sensor.name}: </div>
                        <div style={{ fontWeight: 800 }} >{curSensor.payload[curSensor.dataKey]} {sensor.unit}</div>
                    </div>
                    <div style={{ width: "100%", height: '1px', background: "#2d2d2e" }} />
                </div>
            )
        });

        return (
            <div className="AllGraph-Tooltip" >
                <div>{readableTime}</div>
                { listItems}
            </div>

        )
    }


    render() {

        var now = new Date().getTime()

        var defaultWindow = 43200000
        if (this.props.user) {
            if (this.props.user.PREFS) {
                if (this.props.user.PREFS.GRAPHS) {
                    if (this.props.user.PREFS.GRAPHS.AllGraph) {
                        if (this.props.user.PREFS.GRAPHS.AllGraph.timeWindow) {
                            defaultWindow = this.props.user.PREFS.GRAPHS.AllGraph.timeWindow
                        }
                    }
                }
            }
        }

        if (this.props.combinedProcessedData) {
            var lineItems = this.props.userGrows.map(grow => grow.config.SENSORS.map((sensor) => {
                var dataBlob = sensor.name + "^" + grow.id + "^" + sensor.unit + "^" + sensor.PID
                var lineKey = sensor.PID + "^" + grow.id

                if (this.props.user) {
                    if (this.props.user.PREFS) {
                        if (this.props.user.PREFS.GRAPHS) {
                            if (this.props.user.PREFS.GRAPHS.AllGraph) {
                                if (this.props.user.PREFS.GRAPHS.AllGraph.showSensors && (this.props.user.PREFS.GRAPHS.AllGraph.showSensors[lineKey] === false)) {
                                    return
                                }
                            }
                        }
                    }
                }


                if (sensor.type === "airTemp" || sensor.type === "waterTemp") {
                    return <Line yAxisId="temperature" connectNulls={true} type="monotone" name={dataBlob} dataKey={lineKey} key={lineKey} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else if (sensor.type === "humidifier" || sensor.type === "fan" || sensor.type === "humidity") {
                    return <Line yAxisId="percent" connectNulls={true} type="monotone" name={dataBlob} dataKey={lineKey} key={lineKey} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else if (sensor.unit === "ᵖᵖᵐ") {
                    return <Line yAxisId="ppm" connectNulls={true} type="monotone" name={dataBlob} dataKey={lineKey} key={lineKey} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else if (sensor.unit === "ᵖᵖᵇ") {
                    return <Line yAxisId="ppb" connectNulls={true} type="monotone" name={dataBlob} dataKey={lineKey} key={lineKey} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                } else {
                    return <Line yAxisId="ppm" connectNulls={true} type="monotone" name={dataBlob} dataKey={lineKey} key={lineKey} stroke={sensor.color} strokeWidth={sensor.thickness} dot={false} />
                }
            }));


            var renderDayGraph = null
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 0.9)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                renderDayGraph = (
                    <LineChart width={xSize} height={ySize} data={this.props.combinedProcessedData}>

                        {lineItems}

                        <CartesianGrid vertical horizontal={false} verticalFill={[this.state.lightBackgrounds[0], this.state.lightBackgrounds[1]]} stroke="none" fillOpacity={0.2} />

                        <XAxis
                            tick={{ fill: "#B3C2B5" }}
                            dataKey="time"
                            type="number"
                            domain={[now - this.props.displayWindow, now]}
                            allowDataOverflow={true}
                            ticks={this.state.tickArray}
                            tickFormatter={(tick) => moment(tick * 1).format('MMM DDᵗʰ - HH:mm')}
                        />
                        <YAxis yAxisId="temperature" orientation="left" type="number" allowDataOverflow={true} tick={{ fill: "#B3C2B5" }} />
                        <YAxis yAxisId="percent" orientation="right" hide={true} domain={[0, 100]} tick={{ fill: "#B3C2B5" }} />
                        <YAxis yAxisId="ppm" orientation="right" hide={true} domain={[0, 100]} tick={{ fill: "#false" }} />
                        <YAxis yAxisId="ppb" orientation="right" hide={true} domain={[0, 100]} tick={{ fill: "false" }} />
                        <Tooltip content={this.renderTooltip} />
                    </LineChart>
                );
            }

        }

        return (

            <div className="Chart-Container" style={{ background: '#000' }}>

                {renderDayGraph}

                {/* Time Scale Select... */}
                <div style={{ width: '40px', fontSize: '0.55em', display: 'flex', flexDirection: 'column', position: 'absolute', marginLeft: '4px', marginTop: '18px' }}>

                    <select onChange={this.toggleWindow} id="AllGraph-Time-Scale" defaultValue={defaultWindow} style={{ fontSize: '0.8em', maxWidth: "74px", height: '20px' }} >
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

export default GraphAllPage;
