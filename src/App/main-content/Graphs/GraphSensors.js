import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import moment from 'moment'

import { WiThermometer, WiHumidity, WiHurricane, WiSprinkle } from 'react-icons/wi';



class GraphSensors extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayHours: 72, // 24, 72

            displayTemp: true,
            displayFan: true,
            displayHumidity: true,
            displayHumidifier: true
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

                    var processedData = []
                    var i = -1
                    concatData.forEach((dataPoint) => {
                        i++;
                        if (i === 0 || i % 10 === 0) {
                            var processedPoint = dataPoint
                            processedData[processedData.length] = processedPoint
                        }
                    })

                    if (processedData.length >= concatData.length / 11) {
                        this.setState({
                            processedData: processedData
                        });
                    }
                }
            }
        }
    }

    renderTooltip = (props) => {
        var rawContent = props.payload
        if (rawContent === null || rawContent.length === 0) {
            return;
        }

        var readableTime = moment(props.payload[0].payload.time).format('ddd - HH:mm')

        var tempTemp = null;
        var tempTempColor = "#000"
        var tempFanPower = null;
        var tempFanSpdColor = "#000"
        var tempHumidity = null;
        var tempHumidityColor = "#000"
        var tempHumidifierPower = null;
        var tempHumiPwrColor = "#000"

        rawContent.forEach((line) => {
            if (line.dataKey === "cTemp") {
                tempTempColor = line.stroke
                tempTemp = rawContent[0].payload.cTemp
            }

            if (line.dataKey === "fanSpeed") {
                tempFanSpdColor = line.stroke
                tempFanPower = rawContent[0].payload.fanSpeed
            }

            if (line.dataKey === "humidity") {
                tempHumidityColor = line.stroke
                tempHumidity = rawContent[0].payload.humidity
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
                        return <div className="Grow-Details-Graph-Tooltip-Data" style={{ color: tempTempColor }}>TEMP: {tempTemp}°C </div>
                    }
                })()}

                {(() => {
                    if (tempFanPower) {
                        return <div className="Grow-Details-Graph-Tooltip-Data" style={{ color: tempFanSpdColor }}>FAN-PWR: {tempFanPower}% </div>
                    }
                })()}

                {(() => {
                    if (tempHumidity) {
                        return <div className="Grow-Details-Graph-Tooltip-Data" style={{ color: tempHumidityColor }}>HUMID: {tempHumidity}% RH </div>
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
                                return <Line yAxisId="left" type="monotone" dataKey="cTemp" stroke="#ca2014" dot={false} />
                            } else {
                                return <Line yAxisId="left" type="monotone" dataKey=" " stroke="#ca2014" dot={false} />

                            }
                        })()}
                        {(() => {
                            if (this.state.displayFan) {
                                return <Line yAxisId="right" type="monotone" dataKey="fanSpeed" stroke="#db5e24" dot={false} />
                            } else {
                                return <Line yAxisId="right" type="monotone" dataKey=" " stroke="#db5e24" dot={false} />

                            }
                        })()}
                        {(() => {
                            if (this.state.displayHumidity) {
                                return <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#387d14" dot={false} />
                            } else {
                                return <Line yAxisId="right" type="monotone" dataKey=" " stroke="#387d14" dot={false} />

                            }
                        })()}
                        {(() => {
                            if (this.state.displayHumidifier) {
                                return <Line yAxisId="right" type="monotone" dataKey="humiPower" stroke="#8884d8" dot={false} />
                            } else {

                                return <Line yAxisId="right" type="monotone" dataKey=" " stroke="#8884d8" dot={false} />
                            }
                        })()}


                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[new Date(this.state.processedData[0].time).getTime(), new Date(this.state.processedData[this.state.processedData.length - 1].time).getTime()]}
                            tickFormatter={(unixTime) => moment(unixTime).format('HH:mm - MMM Do')} />
                        <YAxis yAxisId="left" orientation="left" domain={[21, 30]} />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip content={this.renderTooltip} />
                    </LineChart>
                );
            }
        }





        return (

            <div className="Chart-Container">
                <div style={{ width: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        {(() => {
                            if (this.state.displayTemp) {
                                return <button style={{ width: '30px', height: '30px', backgroundColor: '#ca2014' }} data-value={'temp'} onClick={this.toggleTempLine}><WiThermometer /></button>
                            } else {
                                return <button style={{ width: '30px', height: '30px' }} data-value={'temp'} value={'temp'} onClick={this.toggleTempLine}><WiThermometer /></button>

                            }
                        })()}
                        {(() => {
                            if (this.state.displayFan) {
                                return <button style={{ width: '30px', height: '30px', backgroundColor: '#db5e24' }} data-value={'fan'} onClick={this.toggleFanLine}><WiHurricane /></button>
                            } else {
                                return <button style={{ width: '30px', height: '30px' }} data-value={'fan'} onClick={this.toggleFanLine}><WiHurricane /></button>

                            }
                        })()}
                        {(() => {
                            if (this.state.displayHumidity) {
                                return <button style={{ width: '30px', height: '30px', backgroundColor: '#387d14' }} data-value={'humidity'} onClick={this.toggleHumidityLine}><WiHumidity /></button>
                            } else {
                                return <button style={{ width: '30px', height: '30px' }} data-value={'humidity'} onClick={this.toggleHumidityLine}><WiHumidity /></button>

                            }
                        })()}
                        {(() => {
                            if (this.state.displayHumidifier) {
                                return <button style={{ width: '30px', height: '30px', backgroundColor: '#8884d8' }} data-value={'humidifier'} onClick={this.toggleHumidifierLine}><WiSprinkle /></button>
                            } else {
                                return <button style={{ width: '30px', height: '30px' }} data-value={'humidifier'} onClick={this.toggleHumidifierLine}><WiSprinkle /></button>

                            }
                        })()}


                    </div>

                    <div>
                        <button style={{ width: '30px', height: '30px', fontSize: '10px', padding: '0' }}>24hr</button>
                        <button style={{ width: '30px', height: '30px', fontSize: '10px', padding: '0' }}>72hr</button>
                    </div>


                </div>
                {renderDayGraph}
            </div>

        );
    }
}

export default GraphSensors;
