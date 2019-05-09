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
    }

    componentDidMount() {
        this._ismounted = true;
        this.getGraphData = this.getGraphData();
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
        var hour = date.getHours().toString()
        if (hour.length < 2) {
            hour = '0' + hour
        }


        ref.child(year).child(month).child(day).child(hour).on('value', (snapshot) => {

            var tempData = []

            snapshot.forEach((child) => {
                tempData[tempData.length] = child.val();
            });

            console.log("Datapoints to render...")
            console.log(tempData.length);

            this.setState({
                data: tempData
            });

        }, function (errorObject) {
            console.log("getGraphData failed: " + errorObject.code);
        });
    }

    render() {

        const renderHourGraph = (
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

        return (

            <div id="Chart-Page">
                Grow Graph [current HOUR til now]<br></br>
                <div className="Chart-Container">
                    {renderHourGraph}
                </div>
            </div>

        );
    }
}

export default GraphPage;
