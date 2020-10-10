import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import moment from 'moment'




class GraphSensors extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayWindow: 72, // 1/2, 3, 12, 24, 72

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

        switch (window) {
            case 72:
                data.forEach((dataPoint) => {
                    i++;
                    if (i === 0 || i % 10 === 0) {
                        var processedPoint = dataPoint
                        processedData[processedData.length] = processedPoint
                    }
                })

                if (processedData.length >= data.length / 11) { //TODO: not sure why i've included this check, removed for other hours...
                    this.setState({
                        processedData: processedData
                    });
                }
                break;
            case 24:
                data.forEach((dataPoint) => {
                    if (now - dataPoint.time < 86400000) {
                        i++;
                        if (i === 0 || i % 4 === 0) {
                            var processedPoint = dataPoint
                            processedData[processedData.length] = processedPoint
                        }
                    }
                })

                this.setState({
                    processedData: processedData
                });
                break;
            case 12:
                data.forEach((dataPoint) => {
                    if (now - dataPoint.time < 43200000) {
                        var processedPoint = dataPoint
                        processedData[processedData.length] = processedPoint
                    }
                })

                this.setState({
                    processedData: processedData
                });
                break;
            case 3:
                data.forEach((dataPoint) => {
                    if (now - dataPoint.time < 10800000) {
                        var processedPoint = dataPoint
                        processedData[processedData.length] = processedPoint
                    }
                })

                this.setState({
                    processedData: processedData
                });
                break;
            case 1: // stupid naming for half hour... but if i'm using integers..
                data.forEach((dataPoint) => {
                    if (now - dataPoint.time < 1800000) {
                        var processedPoint = dataPoint
                        processedData[processedData.length] = processedPoint
                    }
                })

                this.setState({
                    processedData: processedData
                });
                break;
            default: //72
                data.forEach((dataPoint) => {
                    i++;
                    if (i === 0 || i % 10 === 0) {
                        var processedPoint = dataPoint
                        processedData[processedData.length] = processedPoint
                    }
                })

                if (processedData.length >= data.length / 11) {
                    this.setState({
                        processedData: processedData
                    });
                }
                break;
        }

        this.createTickArray(processedData)

    }

    renderTooltip = (props) => {
        var rawContent = props.payload
        if (rawContent === null || rawContent.length === 0) {
            return;
        }

        var readableTime = moment(props.payload[0].payload.time).format('ddd - HH:mm')

        const listItems = rawContent.map((l) =>
            (() => {
                var tIndex = this.props.activeLines.indexOf(l.dataKey)
                var curSensor = this.props.grow.config.SENSORS[tIndex]

                if (curSensor.type === "airTemp" || curSensor.type === "waterTemp") {
                    return <div className="Grow-Details-Graph-Tooltip-Data" key={curSensor.PID} style={{ color: l.stroke }}>{l.name}: {rawContent[0].payload[l.dataKey]}°C </div>
                } else {
                    return <div className="Grow-Details-Graph-Tooltip-Data" key={curSensor.PID} style={{ color: l.stroke }}>{l.name}: {rawContent[0].payload[l.dataKey]}% </div>
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


    toggle1 = () => {
        this.setState({ displayWindow: 1 })
        this.processData(1)
    }

    toggle3 = () => {
        this.setState({ displayWindow: 3 })
        this.processData(3)
    }

    toggle12 = () => {
        this.setState({ displayWindow: 12 })
        this.processData(12)
    }

    toggle24 = () => {
        this.setState({ displayWindow: 24 })
        this.processData(24)
    }

    toggle72 = () => {
        this.setState({ displayWindow: 72 })
        this.processData(72)
    }

    render() {

        const lineItems = this.props.grow.config.SENSORS.map((l) =>
            (() => {
                if (this.props.activeLines && this.props.activeLines.includes(l.PID)) {
                    if (l.type === "airTemp" || l.type === "waterTemp") {
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
                var xSize = Math.floor(this.props.parentSize[0] * 0.95)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                renderDayGraph = (
                    <LineChart width={xSize} height={ySize} data={this.state.processedData}>

                        {lineItems}

                        <CartesianGrid vertical horizontal={false} verticalFill={[this.state.lightBackgrounds[0], this.state.lightBackgrounds[1]]} stroke="none" fillOpacity={0.2} />

                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[new Date(this.state.processedData[0].time).getTime(), new Date(this.state.processedData[this.state.processedData.length - 1].time).getTime()]}
                            ticks={this.state.tickArray}
                            tickFormatter={(tick) => moment(tick * 1).format('ddd - HH:mm')}
                        />
                        <YAxis yAxisId="left" orientation="left" domain={[21, 24]} />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip content={this.renderTooltip} />
                    </LineChart>
                );
            }
        }




        return (

            <div className="Chart-Container">

                {renderDayGraph}

                <div style={{ width: '18px', display: 'flex', flexDirection: 'column', position: 'absolute', marginLeft: '10x' }}>

                    <div>
                        {(() => {
                            if (this.state.displayWindow === 1) {
                                return <button style={{ width: '18px', height: '18px', fontSize: '0.45em', padding: '0' }} onClick={this.toggle1}>&#189;h</button>
                            } else {
                                return <button style={{ width: '18px', height: '18px', fontSize: '0.45em', padding: '0', color: '#FFF', backgroundColor: '#0b2e11' }} onClick={this.toggle1}>&#189;h</button>
                            }
                        })()}
                        {(() => {
                            if (this.state.displayWindow === 3) {
                                return <button style={{ width: '18px', height: '18px', fontSize: '0.45em', padding: '0' }} onClick={this.toggle3}>3h</button>
                            } else {
                                return <button style={{ width: '18px', height: '18px', fontSize: '0.45em', padding: '0', color: '#FFF', backgroundColor: '#0b2e11' }} onClick={this.toggle3}>3h</button>
                            }
                        })()}
                        {(() => {
                            if (this.state.displayWindow === 12) {
                                return <button style={{ width: '18px', height: '18px', fontSize: '0.45em', padding: '0' }} onClick={this.toggle12}>12h</button>
                            } else {
                                return <button style={{ width: '18px', height: '18px', fontSize: '0.45em', padding: '0', color: '#FFF', backgroundColor: '#0b2e11' }} onClick={this.toggle12}>12h</button>
                            }
                        })()}
                        {(() => {
                            if (this.state.displayWindow === 24) {
                                return <button style={{ width: '18px', height: '18px', fontSize: '0.45em', padding: '0' }} onClick={this.toggle24}>24h</button>
                            } else {
                                return <button style={{ width: '18px', height: '18px', fontSize: '0.45em', padding: '0', color: '#FFF', backgroundColor: '#0b2e11' }} onClick={this.toggle24}>24h</button>
                            }
                        })()}
                        {(() => {
                            if (this.state.displayWindow === 72) {
                                return <button style={{ width: '18px', height: '18px', fontSize: '0.45em', padding: '0' }} onClick={this.toggle72}>72h</button>
                            } else {
                                return <button style={{ width: '18px', height: '18px', fontSize: '0.45em', padding: '0', color: '#FFF', backgroundColor: '#0b2e11' }} onClick={this.toggle72}>72h</button>
                            }
                        })()}
                    </div>
                </div>
            </div>

        );
    }
}

export default GraphSensors;
