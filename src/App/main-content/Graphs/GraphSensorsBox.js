import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import moment from 'moment'


class GraphSensorsBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentDidMount() {
        this._ismounted = true;
        if (this.props.grow && this._ismounted) {
            if (this.props.grow.id !== this.growID) {
                this.growID = this.props.grow.id;
            }

        }

    }

    componentWillUnmount() {
        this._ismounted = false;

        this.getGraphData = null;
    }

    componentDidUpdate = () => {

        if (this.props.grow.id && this._ismounted) {
            if (this.props.grow.id !== this.growID) {
                this.growID = this.props.grow.id;
            }
        }

        if (this.props.rawGrowData && this.props.grow.id) {

            var gwID = this.props.grow.id
            var rawData = this.props.rawGrowData

            if (rawData[gwID]) {
                var setData = rawData[gwID][rawData[gwID].length - 1]

                if (this.data !== setData) {

                    this.data = setData


                    var processedData = []
                    setData.forEach((dataPoint) => {
                        var processedPoint = dataPoint

                        if (new Date().getTime() - processedPoint.time < 7200000) {
                            processedData[processedData.length] = processedPoint
                        }
                    })

                    this.setState({
                        processedData: processedData
                    });

                }
            }
        }

    }


    renderTooltip = (props) => {
        var rawContent = props.payload
        if (rawContent.length === 0) {
            return;
        }

        var readableTime = moment(props.payload[0].payload.time).fromNow()

        const tooltipItems = rawContent.map((l) =>
            (() => {
                var tIndex = rawContent.indexOf(l)

                if (this.props.grow.config.SENSORS[tIndex].type === "airTemp" || this.props.grow.config.SENSORS[tIndex].type === "waterTemp") {
                    return <div className="Grow-Details-Graph-Tooltip-Data" key={this.props.grow.config.SENSORS[tIndex].PID} style={{ color: l.stroke }}>{l.name}: {rawContent[0].payload[l.dataKey]}°C </div>
                } else {
                    return <div className="Grow-Details-Graph-Tooltip-Data" key={this.props.grow.config.SENSORS[tIndex].PID} style={{ color: l.stroke }}>{l.name}: {rawContent[0].payload[l.dataKey]}% </div>
                }

            })()
        );


        return (
            <div className="Grow-Details-Graph-Tooltip">
                <div>{readableTime}</div>

                {tooltipItems}

            </div>

        )
    }

    render() {

        var renderDayGraph = null
        if (this.state.processedData && this.state.processedData[0]) {
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 1)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                renderDayGraph = (
                    <LineChart width={xSize} height={ySize} data={this.state.processedData}>
                        <Line yAxisId="left" type="monotone" name="temp" dataKey="sA1_Temp" stroke="#ca2014" dot={false} />
                        <Line yAxisId="right" type="monotone" name="humi" dataKey="sA1_Humi" stroke="#db5e24" dot={false} />
                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[new Date(this.state.processedData[0].time).getTime(), new Date(this.state.processedData[this.state.processedData.length - 1].time).getTime()]}
                            tickFormatter={(unixTime) => moment(unixTime).format('HH:mm - MMM Do')}
                            hide={true} />
                        <YAxis yAxisId="left" orientation="left" domain={[21, 27]} />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip content={this.renderTooltip} />
                    </LineChart>
                );
            }
        }


        return (


            <div className="Chart-Container-Box">
                {renderDayGraph}
            </div>


        );
    }
}

export default GraphSensorsBox;
