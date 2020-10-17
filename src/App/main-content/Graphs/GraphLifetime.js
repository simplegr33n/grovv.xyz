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
    }

    componentDidUpdate = () => {
        if (this.props.normalizedData && this.props.normalizedData !== this.state.normalizedData) {
            console.log("NORMALIZED DATA", this.props.normalizedData)
            this.setState({
                normalizedData: this.props.normalizedData
            })
        }
    }

    renderTooltip = (props) => {
        var rawContent = props.payload
        if (rawContent === null || rawContent.length === 0) {
            return;
        }

        var readableTime = moment(props.payload[0].payload.time).format('MM-D-YYYY')

        const listItems = rawContent.map((l) =>
            (() => {
                return (
                    <div style={{ fontSize: '.6em', color: l.stroke }} key={l.dataKey}>{l.dataKey.split("^")[0]} {l.dataKey.split("^")[2]} : {rawContent[0].payload[l.dataKey]}</div>
                )
            })()
        );

        return (
            <div className="Lifetime-Graph-Tooltip">
                <div>{readableTime}</div>

                {listItems}

            </div>

        )
    }


    render() {

        var lineItems = null
        if (this.props.sensorList) {
            const colours = ["#FFF", "#FF0000", "#00FF00", "#0000FF", "#F0F0F0", "#f542e3", "#52e625", "#25bce6", "#889c54", "#71418a",
                "#FFF", "#FF0000", "#00FF00", "#0000FF", "#F0F0F0", "#f542e3", "#52e625", "#25bce6", "#889c54", "#71418a"] // possible bug if getting past this number of sensors...
            var i = 0
            lineItems = this.props.sensorList.map((sensorID) =>
                (() => {
                    i++
                    if (sensorID.split("^")[2] === "HIGH") {
                        return <Line yAxisId="left" type="monotone" name={sensorID} dataKey={sensorID} key={sensorID} stroke={"#FF0000"} thickness={0.5} dot={false} />
                    } else if (sensorID.split("^")[2] === "LOW") {
                        return <Line yAxisId="left" type="monotone" name={sensorID} dataKey={sensorID} key={sensorID} stroke={"#19b2ff"} thickness={0.5} dot={false} />
                    } else {
                        return <Line yAxisId="left" type="monotone" name={sensorID} dataKey={sensorID} key={sensorID} stroke={"#FFFFFF"} thickness={1} dot={false} />
                    }
                })()
            );
        }




        var renderLifetimeGraph = null
        if (this.state.normalizedData && this.state.normalizedData[0]) {
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 1)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                renderLifetimeGraph = (
                    <LineChart width={xSize} height={ySize} data={this.state.normalizedData}>

                        {lineItems}

                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[new Date(this.state.normalizedData[0].time).getTime(), new Date(this.state.normalizedData[this.state.normalizedData.length - 1].time).getTime()]}
                            tickFormatter={(unixTime) => moment(unixTime).format('MM-D-YYYY')}
                            hide={false} />
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