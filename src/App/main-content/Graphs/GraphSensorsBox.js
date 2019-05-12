import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, YAxis, Tooltip } from 'recharts';

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
    }

    componentDidUpdate() {

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
        // var i = 0;

        hoursList.forEach((hr) => {
            console.log("read hr!")
            console.log(hr)
            ref.child(year).child(month).child(day).child(hr).on("value", (snapshot) => {

                snapshot.forEach((child) => {
                    // child.forEach((gChild) => {
                    //     i++;
                    //     if (i % 10 === 0 || i === 0) {
                    var dataPoint = child.val()
                    var dataTime = new Date(dataPoint.time).getTime()
                    dataPoint.time = dataTime
                    tempData[tempData.length] = dataPoint;
                    //     }
                    // });
                });

                tempData.sort((a, b) => (a.time > b.time) ? 1 : -1)

                // tempData.forEach((dataPoint) => { 
                //     var itemDate = new Date(dataPoint.time);
                //     console.log(itemDate.getTime())
                //     dataPoint.time = new Date(dataPoint.time)
                //     dataPoint.time = itemDate.toLocaleTimeString(navigator.language, {
                //       hour: '2-digit',
                //       minute:'2-digit'
                //     });
                // })

                if (hr === hour) {

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



    render() {
        console.log("kjh")

        console.log(this.state.data[0])

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
                        <YAxis />
                        <Tooltip />
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