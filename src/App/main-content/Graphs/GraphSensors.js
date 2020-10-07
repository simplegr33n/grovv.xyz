import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import moment from 'moment'

import { WiThermometer, WiHumidity, WiHurricane, WiSprinkle } from 'react-icons/wi';



class GraphSensors extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayWindow: 72, // 3, 12, 24, 72

            displayTemp: true,
            displayFan: true,
            displayHumidity: true,
            displayHumidifier: true,

            lightsOnArray: [],
            lightsOffArray: [],
            tickArray: [],
            lightBackgrounds: ['#7344e7', '#fff936']
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

        if (this.props.growConfig && this.growConfig !== this.props.growConfig) {
            this.growConfig = this.props.growConfig
            this.generateTickSourceArrays()
        }

        if (this.props.rawGrowData && this.props.growID) {

            var gwID = this.props.growID
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

        lightsOnArray[lightsOnArray.length] = moment(new Date(m.format('L') + ' ' + this.props.growConfig.lights_on)).format('x')
        lightsOffArray[lightsOffArray.length] = moment(new Date(m.format('L') + ' ' + this.props.growConfig.lights_off)).format('x')

        m.add(1, 'days')

        lightsOnArray[lightsOnArray.length] = moment(new Date(m.format('L') + ' ' + this.props.growConfig.lights_on)).format('x')
        lightsOffArray[lightsOffArray.length] = moment(new Date(m.format('L') + ' ' + this.props.growConfig.lights_off)).format('x')

        m.add(1, 'days')

        lightsOnArray[lightsOnArray.length] = moment(new Date(m.format('L') + ' ' + this.props.growConfig.lights_on)).format('x')
        lightsOffArray[lightsOffArray.length] = moment(new Date(m.format('L') + ' ' + this.props.growConfig.lights_off)).format('x')

        m.add(1, 'days')

        lightsOnArray[lightsOnArray.length] = moment(new Date(m.format('L') + ' ' + this.props.growConfig.lights_on)).format('x')
        lightsOffArray[lightsOffArray.length] = moment(new Date(m.format('L') + ' ' + this.props.growConfig.lights_off)).format('x')


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
            this.setState({ lightBackgrounds: ['#7344e7', '#fff936'] })
        } else {
            this.setState({ lightBackgrounds: ['#fff936', '#7344e7'] })

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

        var tempTemp = null;
        var tempTempColor = "#000"
        var tempHumidity = null;
        var tempHumidityColor = "#000"
        var tempTemp2 = null;
        var tempTempColor2 = "#000"
        var tempHumidity2 = null;
        var tempHumidityColor2 = "#000"
        var tempTemp3 = null;
        var tempTempColor3 = "#000"
        var tempHumidity3 = null;
        var tempHumidityColor3 = "#000"

        var tempFanPower = null;
        var tempFanSpdColor = "#000"

        var tempHumidifierPower = null;
        var tempHumiPwrColor = "#000"


        rawContent.forEach((line) => {
            if (line.dataKey === "cTemp") {
                tempTempColor = line.stroke
                tempTemp = rawContent[0].payload.cTemp
            }

            if (line.dataKey === "humidity") {
                tempHumidityColor = line.stroke
                tempHumidity = rawContent[0].payload.humidity
            }

            if (line.dataKey === "s2Temp") {
                tempTempColor2 = line.stroke
                tempTemp2 = rawContent[0].payload.s2Temp
            }

            if (line.dataKey === "s2Humi") {
                tempHumidityColor2 = line.stroke
                tempHumidity2 = rawContent[0].payload.s2Humi
            }

            if (line.dataKey === "s3Temp") {
                tempTempColor3 = line.stroke
                tempTemp3 = rawContent[0].payload.s3Temp
            }

            if (line.dataKey === "s3Humi") {
                tempHumidityColor3 = line.stroke
                tempHumidity3 = rawContent[0].payload.s3Humi
            }


            if (line.dataKey === "fanSpeed") {
                tempFanSpdColor = line.stroke
                tempFanPower = rawContent[0].payload.fanSpeed
            }



            if (line.dataKey === "humiPower") {
                tempHumiPwrColor = line.stroke
                tempHumidifierPower = rawContent[0].payload.humiPower
            }


        })

        return (
            <div className="Grow-Details-Graph-Tooltip">
                <div>{readableTime}</div>

                {(() => {
                    if (tempTemp) {
                        return <div className="Grow-Details-Graph-Tooltip-Data" style={{ color: tempTempColor }}>T1: {tempTemp}°C </div>
                    }
                })()}

                {(() => {
                    if (tempHumidity) {
                        return <div className="Grow-Details-Graph-Tooltip-Data" style={{ color: tempHumidityColor }}>H1: {tempHumidity}% RH </div>
                    }
                })()}

                {(() => {
                    if (tempTemp2) {
                        return <div className="Grow-Details-Graph-Tooltip-Data" style={{ color: tempTempColor2 }}>T2: {tempTemp2}°C </div>
                    }
                })()}

                {(() => {
                    if (tempHumidity2) {
                        return <div className="Grow-Details-Graph-Tooltip-Data" style={{ color: tempHumidityColor2 }}>H2: {tempHumidity2}% RH </div>
                    }
                })()}

                {(() => {
                    if (tempTemp3) {
                        return <div className="Grow-Details-Graph-Tooltip-Data" style={{ color: tempTempColor3 }}>T3: {tempTemp3}°C </div>
                    }
                })()}

                {(() => {
                    if (tempHumidity3) {
                        return <div className="Grow-Details-Graph-Tooltip-Data" style={{ color: tempHumidityColor3 }}>H3: {tempHumidity3}% RH </div>
                    }
                })()}



                {(() => {
                    if (tempFanPower) {
                        return <div className="Grow-Details-Graph-Tooltip-Data" style={{ color: tempFanSpdColor }}>FAN-PWR: {tempFanPower}% </div>
                    }
                })()}


                {(() => {
                    if (tempHumidifierPower) {
                        return <div className="Grow-Details-Graph-Tooltip-Data" style={{ color: tempHumiPwrColor }}>HUM-PWR: {tempHumidifierPower}% </div>
                    }
                })()}


            </div>

        )
    }



    toggleTempLine = () => {
        if (this.displayTemp === true) {
            this.displayTemp = false
            this.setState({ displayTemp: false })
        } else {
            this.displayTemp = true
            this.setState({ displayTemp: true })
        }
    }

    toggleFanLine = () => {
        if (this.displayFan === true) {
            this.displayFan = false
            this.setState({ displayFan: false })
        } else {
            this.displayFan = true
            this.setState({ displayFan: true })
        }
    }

    toggleHumidityLine = () => {
        if (this.displayHumidity === true) {
            this.displayHumidity = false
            this.setState({ displayHumidity: false })
        } else {
            this.displayHumidity = true
            this.setState({ displayHumidity: true })
        }
    }


    toggleHumidifierLine = () => {
        if (this.displayHumidifier === true) {
            this.displayHumidifier = false
            this.setState({ displayHumidifier: false })
        } else {
            this.displayHumidifier = true
            this.setState({ displayHumidifier: true })
        }
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

        var renderDayGraph = null
        if (this.state.processedData && this.state.processedData[0]) {
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 0.95)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                renderDayGraph = (
                    <LineChart width={xSize} height={ySize} data={this.state.processedData}>
                        {(() => {
                            if (this.state.displayTemp) {
                                return <Line yAxisId="left" type="monotone" dataKey="cTemp" stroke="#FF0000" strokeWidth="3" dot={false}/>
                            } else {
                                return <Line yAxisId="left" type="monotone" dataKey=" " stroke="#FF0000" dot={false} />

                            }
                        })()}
                        {(() => {
                            if (this.state.displayHumidity) {
                                return <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#FF0000" dot={false} />
                            } else {
                                return <Line yAxisId="right" type="monotone" dataKey=" " stroke="#FF0000" dot={false} />

                            }
                        })()}
                        <Line yAxisId="left" type="monotone" dataKey="s2Temp" stroke="#E42CEC" strokeWidth="3" dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="s2Humi" stroke="#E42CEC" dot={false} />

                        <Line yAxisId="left" type="monotone" dataKey="s3Temp" stroke="#ECA92C" strokeWidth="3" dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="s3Humi" stroke="#ECA92C" dot={false} />


                        {(() => {
                            if (this.state.displayFan) {
                                return <Line yAxisId="right" type="monotone" dataKey="fanSpeed" stroke="#4c4c4c" dot={false} />
                            } else {
                                return <Line yAxisId="right" type="monotone" dataKey=" " stroke="#4c4c4c" dot={false} />

                            }
                        })()}

                        {(() => {
                            if (this.state.displayHumidifier) {
                                return <Line yAxisId="right" type="monotone" dataKey="humiPower" stroke="#8884d8" dot={false} />
                            } else {

                                return <Line yAxisId="right" type="monotone" dataKey=" " stroke="#8884d8" dot={false} />
                            }
                        })()}
                        <Line yAxisId="left" type="monotone" dataKey="outTemp" stroke="#FFF" dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="outHumidity" stroke="#FFF" dot={false} />


                        <CartesianGrid vertical horizontal={false} verticalFill={[this.state.lightBackgrounds[0], this.state.lightBackgrounds[1]]} fillOpacity={0.2} />

                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[new Date(this.state.processedData[0].time).getTime(), new Date(this.state.processedData[this.state.processedData.length - 1].time).getTime()]}
                            ticks={this.state.tickArray}
                            tickFormatter={(tick) => moment(tick * 1).format('ddd - HH:mm')}
                        />
                        <YAxis yAxisId="left" orientation="left" domain={[21, 30]} />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip content={this.renderTooltip} />
                    </LineChart>
                );
            }
        }





        return (

            <div className="Chart-Container">
                
                {renderDayGraph}
                <div style={{ width: '30px', display: 'flex', flexDirection: 'column', position: 'absolute', marginLeft: '10x' }}>

                    <div>
                        {(() => {
                            if (this.state.displayWindow === 1) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '10px', padding: '0', color: '#FFF', backgroundColor: '#0b2e11' }} onClick={this.toggle1}>1/2hr</button>
                            } else {
                                return <button style={{ width: '30px', height: '30px', fontSize: '10px', padding: '0' }} onClick={this.toggle1}>1/2hr</button>
                            }
                        })()}
                        {(() => {
                            if (this.state.displayWindow === 3) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '10px', padding: '0', color: '#FFF', backgroundColor: '#0b2e11' }} onClick={this.toggle3}>3hr</button>
                            } else {
                                return <button style={{ width: '30px', height: '30px', fontSize: '10px', padding: '0' }} onClick={this.toggle3}>3hr</button>
                            }
                        })()}
                        {(() => {
                            if (this.state.displayWindow === 12) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '10px', padding: '0', color: '#FFF', backgroundColor: '#0b2e11' }} onClick={this.toggle12}>12hr</button>
                            } else {
                                return <button style={{ width: '30px', height: '30px', fontSize: '10px', padding: '0' }} onClick={this.toggle12}>12hr</button>
                            }
                        })()}
                        {(() => {
                            if (this.state.displayWindow === 24) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '10px', padding: '0', color: '#FFF', backgroundColor: '#0b2e11' }} onClick={this.toggle24}>24hr</button>
                            } else {
                                return <button style={{ width: '30px', height: '30px', fontSize: '10px', padding: '0' }} onClick={this.toggle24}>24hr</button>
                            }
                        })()}
                        {(() => {
                            if (this.state.displayWindow === 72) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '10px', padding: '0', color: '#FFF', backgroundColor: '#0b2e11' }} onClick={this.toggle72}>72hr</button>
                            } else {
                                return <button style={{ width: '30px', height: '30px', fontSize: '10px', padding: '0' }} onClick={this.toggle72}>72hr</button>
                            }
                        })()}
                    </div>

                    <div style={{ height: '20px' }}></div>
                    <div>
                        {(() => {
                            if (this.state.displayTemp && this.state.processedData && this.state.processedData[0] && this.state.processedData[0].cTemp) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '28px', color: '#FFF', padding: '0px', backgroundColor: '#ca2014' }} onClick={this.toggleTempLine}><WiThermometer /></button>
                            } else if (this.state.processedData && this.state.processedData[0] && this.state.processedData[0].cTemp) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '28px', padding: '0px' }} onClick={this.toggleTempLine}><WiThermometer /></button>

                            }
                        })()}
                        {(() => {
                            if (this.state.displayFan && this.state.processedData && this.state.processedData[0] && this.state.processedData[0].fanSpeed) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '28px', color: '#FFF',  padding: '0px', backgroundColor: '#db5e24' }} onClick={this.toggleFanLine}><WiHurricane /></button>
                            } else if (this.state.processedData && this.state.processedData[0] && this.state.processedData[0].fanSpeed) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '28px', padding: '0px' }} onClick={this.toggleFanLine}><WiHurricane /></button>

                            }
                        })()}
                        {(() => {
                            if (this.state.displayHumidity && this.state.processedData && this.state.processedData[0] && this.state.processedData[0].humidity) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '28px', color: '#FFF',  padding: '0px', backgroundColor: '#387d14' }} onClick={this.toggleHumidityLine}><WiHumidity /></button>
                            } else if (this.state.processedData && this.state.processedData[0] && this.state.processedData[0].humidity) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '28px', padding: '0px' }} onClick={this.toggleHumidityLine}><WiHumidity /></button>

                            }
                        })()}
                        {(() => {
                            if (this.state.displayHumidifier && this.state.processedData && this.state.processedData[0] && this.state.processedData[0].humiPower) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '28px', color: '#FFF',  padding: '0px', backgroundColor: '#8884d8' }} onClick={this.toggleHumidifierLine}><WiSprinkle /></button>
                            } else if (this.state.processedData && this.state.processedData[0] && this.state.processedData[0].humiPower) {
                                return <button style={{ width: '30px', height: '30px', fontSize: '28px', padding: '0px' }} onClick={this.toggleHumidifierLine}><WiSprinkle /></button>

                            }
                        })()}


                    </div>



                </div>
            </div>

        );
    }
}

export default GraphSensors;
