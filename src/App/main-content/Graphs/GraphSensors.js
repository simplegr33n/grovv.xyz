import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import moment from 'moment'

import Firebase from '../../../config/firebaseConfig.js'


class GraphSensors extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };

        this.firebase = new Firebase()
    }

    componentDidMount() {
        this._ismounted = true;

    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentDidUpdate = () => {

        if (this.props.growDeprecate) {
            if (this.props.growDeprecate !== this.growDeprecate) {
                console.log("GRAPH SENSORS GROW DEPRECATE (TODO: REMOVE)!")
                console.log(this.props.growDeprecate)
                this.growDeprecate = this.props.growDeprecate;
                this.getGraphData = this.getGraphData()
            }
        }
    }

    getGraphData = () => {
        // Sensor data in firebase
        var ref = this.firebase.db.ref().child('sensor_data').child(this.props.growDeprecate)

        var date = new Date();
        var year = date.getFullYear().toString()
        var month = (date.getMonth() + 1).toString()
        if (month.length < 2) {
            month = '0' + month
        }

        var days = []
        var tempDay = null
        var dy = date.getDate()
        if ((dy - 2) >= 1) {
            tempDay = dy - 2
            if (tempDay.toString().length < 2) {
                tempDay = '0' + tempDay
            }
            days[days.length] = tempDay
        }
        if ((dy - 1) >= 1) {
            tempDay = dy - 1
            if (tempDay.toString().length < 2) {
                tempDay = '0' + tempDay
            }
            days[days.length] = tempDay
        }
        if (dy.toString().length < 2) {
            dy = '0' + dy
        }
        days[days.length] = dy

        var tempData = []
        var i = 0;

        days.forEach((day) => {
            console.log("read day!")
            console.log(day)
            ref.child(year).child(month).child(day).on("value", (snapshot) => {

                snapshot.forEach((child) => {
                    child.forEach((gChild) => {
                        i++;
                        if (i % 10 === 0 || i === 0) {
                            var dataPoint = gChild.val()
                            var dataTime = new Date(dataPoint.time).getTime()
                            dataPoint.time = dataTime
                            tempData[tempData.length] = dataPoint;
                        }
                    });
                });

                tempData.sort((a, b) => (a.time > b.time) ? 1 : -1)

                if (day === dy) {

                    console.log("Test 3-day Datapoints to render...")
                    console.log(tempData.length);
                    console.log(tempData[0]);

                    this.setState({
                        data: tempData
                    });
                }

            });

        });
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
        if (this.state.data[0]) {
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 0.95)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

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

export default GraphSensors;
