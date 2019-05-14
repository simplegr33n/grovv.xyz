import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import moment from 'moment'

import Firebase from '../../../config/firebaseConfig.js'


class GraphSensorsBox extends Component {

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
        
        this.getGraphData = null;
    }

    componentDidUpdate = () => {

        if (this.props.growDeprecate && this._ismounted) {
            if (this.props.growDeprecate !== this.growDeprecate) {
                console.log("GRAPH SENSORS GROW DEPRECATE (TODO: REMOVE)! (" + this.props.growDeprecate + ")")
                console.log()
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


        var day = date.getDate().toString()

        var hour = date.getHours()

        var hoursList = []
        var tempHour = null
        if ((hour - 1) >= 0) {
            tempHour = hour - 1
            if (tempHour.toString().length < 2) {
                tempHour = '0' + tempHour
            }
            hoursList[hoursList.length] = tempHour
        }
        if (hour.toString().length < 2) {
            hour = '0' + hour
        }
        hoursList[hoursList.length] = hour

        var tempData = []

        hoursList.forEach((hr) => {
            ref.child(year).child(month).child(day).child(hr).on("value", (snapshot) => {

                snapshot.forEach((child) => {
                    var dataPoint = child.val()
                    var dataTime = new Date(dataPoint.time).getTime()
                    dataPoint.time = dataTime
                    tempData[tempData.length] = dataPoint;
                });

                tempData.sort((a, b) => (a.time > b.time) ? 1 : -1)

                if (hr === hour) {

                    console.log("Test last hour Datapoints to render...")
                    console.log(tempData.length);
                    console.log(tempData[0]);

                    if (this._ismounted) {
                        this.setState({
                            data: tempData
                        });
                    }
                }

            });

        });
    }


    renderTooltip(props) {
        var rawContent = props.payload
        if (rawContent.length === 0) {
            return;
        }

        var readableTime = moment(props.payload[0].payload.time).fromNow()

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
                var xSize = Math.floor(this.props.parentSize[0] * 1)
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
                            tickFormatter={(unixTime) => moment(unixTime).format('HH:mm - MMM Do')}
                            hide={true} />
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

export default GraphSensorsBox;
