import React, { Component } from 'react';
import '../../../../styles/App.css';

import HighStock from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'


class GraphAllPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };

        this.seriesCounter = 0
    }



    componentDidMount() {

    }

    componentDidUpdate() {
        if (this.props.combinedProcessedData && (this.props.combinedProcessedData.length !== 0) && this.props.combinedProcessedData.length !== this.combinedProcessedDataLength) {
            this.combinedProcessedDataLength = this.props.combinedProcessedData.length

            this.setGraphOptions(this.props.combinedProcessedData)
        }
    }

    setGraphOptions(combinedProcessedData) {

        var processedSeries = []

        combinedProcessedData.forEach((dataObject) => {

            var time = 0
            if (dataObject['time']) {
                time = dataObject['time']
            }

            for (const [key, value] of Object.entries(dataObject)) {
                if (key === 'time') {
                    continue
                }

                if (!processedSeries[key]) {
                    processedSeries[key] = []
                }

                var processedPoint = []
                processedPoint[0] = time
                processedPoint[1] = parseFloat(value)

                var processedPointObject = []
                processedPointObject.name = key
                processedPointObject.data = processedPoint
                // console.log("processed point", processedPointObject)

                // processedSeries[key][processedSeries[key].length] = new Object()
                // processedSeries[key][processedSeries[key].length].name = key
                // processedSeries[key][processedSeries[key].length].data = processedPoint


                processedSeries[processedSeries.length] = processedPointObject


                // processedSeries[key][processedSeries[key].length].push(time)
                // // processedSeries[key][processedSeries[key].length].push(parseFloat(value))

                // console.log("HMM" + key, processedSeries[key])
                // console.log("HMM" + key, processedSeries[key][0])
            }
        })

        console.log("processed")

        this.createChart(processedSeries);

    }

    createChart = (processedSeries) => {


        console.log("processedser", processedSeries)



        this.setState({
            options: {
                title: {
                    text: 'Test All Chart'
                },

                series: processedSeries

                // series: [{
                //     data: [[Date.UTC(2013, 5, 2), 0.7695],
                //     [Date.UTC(2013, 5, 3), 0.7648],
                //     ...
                //     [Date.UTC(2013, 5, 24), 0.7623],]
                // }]
            }
        })
    }

    render() {



        return (

            <div style={{ background: '#000' }}>
                <HighchartsReact
                    highcharts={HighStock}
                    constructorType={'stockChart'}
                    options={this.state.options} />
            </div >

        );
    }
}

export default GraphAllPage;
