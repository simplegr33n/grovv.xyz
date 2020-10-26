import React, { Component } from 'react';
import '../../../../styles/App.css';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


class GraphTestPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            compiledData: [{
                temp: [],
                humidity: []
            }]
        };
    }



    componentDidMount() {
        // if (this.props.processedData) {
        this.createChart()
        // }
    }

    componentDidUpdate() {
        if (this.props.processedData && this.props.processedData.length !== this.dataCheckLength) {
            this.dataCheckLength = this.props.processedData.length
            this.createChart()
        }
    }

    createChart = () => {
        var compiledData = []

        if (!compiledData.temp) {
            compiledData.temp = []
        }
        if (!compiledData.humidity) {
            compiledData.humidity = []
        }

        console.log(this.props)

        var i = 0
        for (const [growID, growData] of Object.entries(this.props.processedData)) {
            i++
            if (i > 1) {
                continue
            }
            growData.forEach((dataPoint) => {
                compiledData.temp[compiledData.temp.length] = [dataPoint.time, parseFloat(dataPoint.s1t)]
                compiledData.humidity[compiledData.humidity.length] = [dataPoint.time, parseFloat(dataPoint.s1h)]
            })
        }

        compiledData.temp.sort((a, b) => (a[0] > b[0]) ? 1 : -1)
        compiledData.humidity.sort((a, b) => (a[0] > b[0]) ? 1 : -1)

        this.setState({ compiledData: compiledData })
    }

    render() {

        var options = {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'test chart'
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'days'
                }
            },
            series: [
                {
                    name: 'temp',
                    data: this.state.compiledData.temp
                },
                {
                    name: 'humidity',
                    data: this.state.compiledData.humidity
                }
            ]
        }

        return (

            <div style={{ background: '#000', overflow: 'hidden' }}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options} />
            </div >

        );
    }
}

export default GraphTestPage;
