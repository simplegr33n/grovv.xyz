import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';


class GraphPage extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        this.data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, {name: 'Page B', uv: 300, pv: 2900, amt: 2000}];
    }

    render() {

        const renderLineChart = (
            <LineChart width={400} height={400} data={this.data}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                <XAxis dataKey="name" />
                <YAxis />
            </LineChart>
        );

        return (

            <div id="Chart-Page">
                Grow Chart...<br></br>
                {renderLineChart}           
            </div>

        );
    }
}

export default GraphPage;
