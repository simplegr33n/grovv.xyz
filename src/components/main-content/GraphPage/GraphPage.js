import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import Firebase from '../../../config/firebaseConfig.js'


class GraphPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };

        this.firebase = new Firebase()
        this.getGraphData();
    }

    componentDidMount() {
        this._ismounted = true;
        // this.getGraphData = this.getGraphData();
    }

    componentWillUnmount() {
        this._ismounted = false;
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
        var day = date.getDate().toString()
        if (day.length < 2) {
            day = '0' + day
        }
        var hours = []
        var tempHour = null
        var hr = date.getHours()

        if ((hr - 2) >= 0) {
            tempHour = hr - 2
            if (tempHour.toString().length < 2) {
                tempHour = '0' + tempHour
            }
            hours[hours.length] = tempHour
        }
        if ((hr - 1) >= 0) {
            tempHour = hr - 1
            if (tempHour.toString().length < 2) {
                tempHour = '0' + tempHour
            }
            hours[hours.length] = tempHour
        }
        if (hr.toString().length < 2) {
            hr = '0' + hr
        }
        hours[hours.length] = hr

        var tempData = []

        hours.forEach((hour) => {
            console.log("read time!")
            console.log(hour)
            ref.child(year).child(month).child(day).child(hour).on("value", (snapshot) => {

                snapshot.forEach((child) => {
                    tempData[tempData.length] = child.val();
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

                if (hour === hr) {

                    console.log("Test 3-hour Datapoints to render...")
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

        const renderGraph = (
            <LineChart width={800} height={400} data={this.state.data}>

                {(() => {
                    console.log("Inside the chart render")
                    console.log(this.state.data.length)
                    console.log(this.state.data[0])
                    console.log(this.state.data[this.state.data.length - 1])
                    console.log(this.state.data)
                })()}

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

        return (

            <div id="Chart-Page">
                Grow Graph [Last 3 hours (ish)]<br></br>
                <div className="Chart-Container">
                    {renderGraph}
                </div>
            </div>

        );
    }
}

export default GraphPage;
