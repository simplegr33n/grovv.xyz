import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import moment from 'moment'

import DbHelper from '../../_utils/DbHelper.js'


class GraphSensorsTest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };

        this.dbHelper = new DbHelper()

    }

    componentDidMount() {

        this._ismounted = true;

        if (this.props.growDeprecate) {
            if (this.props.growDeprecate !== this.growDeprecate) {
                this.growDeprecate = this.props.growDeprecate;
                this.getData()
            }

        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentDidUpdate = () => {

        if (this.props.growDeprecate) {
            if (this.props.growDeprecate !== this.growDeprecate) {
                this.growDeprecate = this.props.growDeprecate;
                this.getData()
            }
        }
    }

    getData = async () => {
        try {
            await this.dbHelper.getThreeDays(this.props.growDeprecate, this.setData)
        } catch(e) {
            console.log(e); 
            return 'caught ' + e
        }
    }

    setData = (data) => {
        if (this._ismounted) {
            this.setState({
                data: data
            });
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
        if (this.state.data && this.state.data[0]) {
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 0.95)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                console.log("WOW GraphSensorsTest graph size:")
                console.log(xSize + ", " + ySize)
                console.log("WOW GraphSensorsTest datalength at render:")
                console.log(this.state.data.length)

                renderDayGraph = (
                    <LineChart width={xSize} height={ySize} data={this.state.data}>
                        <Line type="monotone" dataKey="cTemp" stroke="#ca2014" dot={false} />
                        <Line type="monotone" dataKey="fanSpeed" stroke="#db5e24" dot={false} />
                        <Line type="monotone" dataKey="humidity" stroke="#387d14" dot={false} />
                        <Line type="monotone" dataKey="humiPower" stroke="#8884d8" dot={false} />
                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[new Date(this.state.data[0].time).getTime(), new Date(this.state.data[this.state.data.length - 1].time).getTime()]}
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

export default GraphSensorsTest;
