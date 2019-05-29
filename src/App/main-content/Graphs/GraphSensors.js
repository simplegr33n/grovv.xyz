import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import moment from 'moment'



class GraphSensors extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };

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
        if (rawContent.length === 0) {
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


    render() {

        var renderDayGraph = null
        if (this.state.processedData && this.state.processedData[0]) {
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 0.95)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                renderDayGraph = (
                    <LineChart width={xSize} height={ySize} data={this.state.processedData}>
                        <Line type="monotone" dataKey="cTemp" stroke="#ca2014" dot={false} />
                        <Line type="monotone" dataKey="fanSpeed" stroke="#db5e24" dot={false} />
                        <Line type="monotone" dataKey="humidity" stroke="#387d14" dot={false} />
                        <Line type="monotone" dataKey="humiPower" stroke="#8884d8" dot={false} />
                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[new Date(this.state.processedData[0].time).getTime(), new Date(this.state.processedData[this.state.processedData.length - 1].time).getTime()]}
                            tickFormatter={(unixTime) => moment(unixTime).format('HH:mm - MMM Do')} />
                        <YAxis />
                        <Tooltip content={this.renderTooltip} />
                    </LineChart>
                );
            }
        }


        return (


            <div className="Chart-Container">
                {renderDayGraph}
            </div>


        );
    }
}

export default GraphSensors;
