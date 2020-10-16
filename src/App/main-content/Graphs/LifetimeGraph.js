import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import moment from 'moment'



class LifetimeGraph extends Component {

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
                return <div>sup</div>

                // return <div className="Grow-Details-Graph-Tooltip-Data" key={this.props.grow.config.SENSORS[tIndex].PID} style={{ color: l.stroke }}>{l.name}: {rawContent[0].payload[l.dataKey]}{this.props.grow.config.SENSORS[tIndex].unit} </div>

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

        var renderLifetimeGraph = null
        if (this.state.processedData && this.state.processedData[0]) {
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 1)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                renderLifetimeGraph = (
                    <LineChart width={xSize} height={ySize} data={this.state.processedData}>
                        <Line yAxisId="left" type="monotone" name="temp" dataKey="sA1_Temp" stroke="#ca2014" dot={false} />
                        <Line yAxisId="right" type="monotone" name="humi" dataKey="sA1_Humi" stroke="#db5e24" dot={false} />
                        <Line yAxisId="left" type="monotone" name="co2" dataKey="sC1_C02" stroke="#a9a9a9" dot={false} />
                        <Line yAxisId="right" type="monotone" name="tvoc" dataKey="sC1_TVoc" stroke="#a6a6a6" dot={false} />
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
                {renderLifetimeGraph}
            </div>

        );
    }
}

export default LifetimeGraph;