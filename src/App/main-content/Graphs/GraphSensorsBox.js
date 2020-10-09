import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import moment from 'moment'


class GraphSensorsBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentDidMount() {
        this._ismounted = true;
        if (this.props.growID && this._ismounted) {
            if (this.props.growID !== this.growID) {
                this.growID = this.props.growID;
            }

        }

    }

    componentWillUnmount() {
        this._ismounted = false;

        this.getGraphData = null;
    }

    componentDidUpdate = () => {

        if (this.props.growID && this._ismounted) {
            if (this.props.growID !== this.growID) {
                this.growID = this.props.growID;
            }
        }

        if (this.props.rawGrowData && this.props.growID) {

            var gwID = this.props.growID
            var rawData = this.props.rawGrowData

            if (rawData[gwID]) {
                var setData = rawData[gwID][rawData[gwID].length - 1]

                if (this.data !== setData) {

                    this.data = setData


                    var processedData = []
                    setData.forEach((dataPoint) => {
                        var processedPoint = dataPoint

                        if (new Date().getTime() - processedPoint.time < 7200000) {
                            processedData[processedData.length] = processedPoint
                        }
                    })

                    this.setState({
                        processedData: processedData
                    });

                }

            }

        }

    }


    renderTooltip(props) {
        var rawContent = props.payload
        if (rawContent.length === 0) {
            return;
        }

        var readableTime = moment(props.payload[0].payload.time).fromNow()

        var tempTemp = null;
        var tempTempColor = "#000"
        var tempHumidity = null;
        var tempHumidityColor = "#000"


        rawContent.forEach((line) => {
            if (line.dataKey === "sA1_Temp") {
                tempTempColor = line.stroke
                tempTemp = rawContent[0].payload.sA1_Temp
            }

            if (line.dataKey === "sA1_Humi") {
                tempHumidityColor = line.stroke
                tempHumidity = rawContent[0].payload.sA1_Humi
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
                    if (tempHumidity) {
                        return <div className="Grow-Details-Graph-Tooltip-Data" style={{ color: tempHumidityColor }}>HUMID: {tempHumidity}% RH </div>
                    }
                })()}

            </div>

        )
    }

    render() {

        var renderDayGraph = null
        if (this.state.processedData && this.state.processedData[0]) {
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 1)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                renderDayGraph = (
                    <LineChart width={xSize} height={ySize} data={this.state.processedData}>
                        <Line yAxisId="left" type="monotone" dataKey="cTemp" stroke="#ca2014" dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="fanSpeed" stroke="#db5e24" dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#387d14" dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="humiPower" stroke="#8884d8" dot={false} />
                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[new Date(this.state.processedData[0].time).getTime(), new Date(this.state.processedData[this.state.processedData.length - 1].time).getTime()]}
                            tickFormatter={(unixTime) => moment(unixTime).format('HH:mm - MMM Do')}
                            hide={true} />
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
            </div>


        );
    }
}

export default GraphSensorsBox;
