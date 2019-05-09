import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import Firebase from '../../../config/firebaseConfig.js'


class TESTTwoFourGraph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };

        this.firebase = new Firebase()
    }

    componentDidMount() {
        this._ismounted = true;
        this.getGraphData = this.getGraphData();
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    getDayGraphData = () => {
        // Sensor data in firebase
        var ref = this.firebase.db.ref().child('sensor_data').child('flower')

        var date = new Date();
        var year = date.getFullYear().toString()
        var month = (date.getMonth() + 1).toString()
        if (month.length < 2) {
            month = '0' + month
        }
        var day = date.getDate().toString()
        if (day.length < 2) {
            day = '0' + day
        }
        var hour = date.getHours().toString()
        if (hour.length < 2) {
            hour = '0' + hour
        }

        ref.child(year).child(month).child(day).on("value", (snapshot) => {

            var tempData = []
            var i = 0;

            snapshot.forEach((child) => {
                child.forEach((gChild) => {
                    i++;
                    if (i % 10 === 0 || i === 0) {
                        tempData[tempData.length] = gChild.val();
                    }
                });

                tempData.sort((a, b) => (a.time > b.time) ? 1 : -1)


            });

            this.setState({
                dayData: tempData
            });

        });
    }

    getGraphData = () => {
        // Sensor data in firebase
        var ref = this.firebase.db.ref().child('sensor_data').child('flower')

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
                            tempData[tempData.length] = gChild.val();
                        }
                    });
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



    render() {
        var renderDayGraph = null
        if (this.state.data) {

            renderDayGraph = (
                <LineChart width={800} height={400} data={this.state.data}>
                    <Line type="monotone" dataKey="cTemp" stroke="#ca2014" />
                    <Line type="monotone" dataKey="fanSpeed" stroke="#db5e24" />
                    <Line type="monotone" dataKey="humidity" stroke="#131366" />
                    <Line type="monotone" dataKey="humiPower" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            );
        }


        return (

            <div id="Chart-Page">
                Grow Graph [3-Day]<br></br>
                <div className="Chart-Container">
                    {renderDayGraph}
                </div>
            </div>

        );
    }
}

export default TESTTwoFourGraph;
