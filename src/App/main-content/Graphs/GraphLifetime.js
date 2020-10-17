import React, { Component } from 'react';
import '../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import moment, { relativeTimeThreshold } from 'moment'



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
            this.setState({
                normalizedData: this.props.normalizedData
            })
        }

        if (!this.state.activeLines && this.props.sensorList) {
            var newList = []
            this.props.sensorList.forEach((sensorID) => {
                newList[newList.length] = sensorID
            })
            this.setState({
                activeLines: newList
            })
        }
        if (!this.state.sensorList && this.props.sensorList) {
            this.setState({
                sensorList: this.props.sensorList
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

    toggleLine = (e) => {
        var sensorID = e.currentTarget.getAttribute('data-value')

        var tempActiveLines = this.state.activeLines
        if (tempActiveLines.includes(sensorID)) {
            const index = tempActiveLines.indexOf(sensorID);
            if (index > -1) {
                tempActiveLines.splice(index, 1);
            }
        } else {
            tempActiveLines[tempActiveLines.length] = sensorID
        }

        this.setState({ activeLines: tempActiveLines })
    }


    render() {

        var renderButtonItems = null
        if (this.props.sensorList) {
            renderButtonItems = this.props.sensorList.map((sensorID) =>
                (() => {
                    if (sensorID.split("^")[2] !== "HIGH") {
                        return
                    }

                    var reducedID = sensorID.split("^")[0] + "^" + sensorID.split("^")[1]

                    var buttonBackground = "#1b5926"
                    var setOpacity = 0.25
                    var highOpacitySetting = 0.25
                    var avgsOpacitySetting = 0.25
                    var lowOpacitySetting = 0.25
                    if (this.state.activeLines) {
                        if (this.state.activeLines.includes(reducedID + "^HIGH")) {
                            buttonBackground = "#1e7c2e"
                            setOpacity = 1
                            highOpacitySetting = 1
                        }
                        if (this.state.activeLines.includes(reducedID + "^AVERAGE")) {
                            buttonBackground = "#1e7c2e"
                            setOpacity = 1
                            avgsOpacitySetting = 1
                        }
                        if (this.state.activeLines.includes(reducedID + "^LOW")) {
                            buttonBackground = "#1e7c2e"
                            setOpacity = 1
                            lowOpacitySetting = 1
                        }
                    }


                    return (
                        <div data-value={sensorID} key={sensorID} style={{ width: '200px', height: '80px', maxWidth: '200px', maxHeight: '80px', margin: '2px', background: buttonBackground, opacity: setOpacity, overflow: 'hidden' }}>
                            <div style={{ fontSize: "8px", userSelect: 'none', background: '#000' }}>{sensorID.split("^")[1]}</div>
                            <div style={{ fontSize: "16px", userSelect: 'none' }}>{sensorID.split("^")[0]}</div>
                            <div style={{ display: 'flex', userSelect: 'none', flexDirection: 'row', justifyContent: 'space-around', fontSize: '10px' }}>
                                <div data-value={reducedID + "^HIGH"} onClick={this.toggleLine} style={{ background: '#000', cursor: 'pointer', padding: '10px', opacity: highOpacitySetting }}>
                                    HIGHS
                                </div>
                                <div data-value={reducedID + "^AVERAGE"} onClick={this.toggleLine} style={{ background: '#000', cursor: 'pointer', padding: '10px', opacity: avgsOpacitySetting }}>
                                    AVGS
                                </div>
                                <div data-value={reducedID + "^LOW"} onClick={this.toggleLine} style={{ background: '#000', cursor: 'pointer', padding: '10px', opacity: lowOpacitySetting }}>
                                    LOWS
                                </div>
                            </div>
                        </div>
                    )

                })()
            );
        }

        var renderLineItems = null
        if (this.state.activeLines) {
            const colours = ["#FFF", "#FF0000", "#00FF00", "#0000FF", "#F0F0F0", "#f542e3", "#52e625", "#25bce6", "#889c54", "#71418a",
                "#FFF", "#FF0000", "#00FF00", "#0000FF", "#F0F0F0", "#f542e3", "#52e625", "#25bce6", "#889c54", "#71418a"] // possible bug if getting past this number of sensors...

            renderLineItems = this.state.activeLines.map((sensorID) =>
                (() => {
                    // dumb naming stuff below. we need to clean that up.
                    var yAxisId = null
                    var shortenedID = sensorID.split("^")[0] + "^" + sensorID.split("^")[1]
                    if (this.props.sampleHighs[shortenedID] > 1000) {
                        yAxisId = "ppb"
                    } else if (this.props.sampleHighs[shortenedID] > 100) {
                        yAxisId = "ppm"
                    } else if (this.props.sampleHighs[shortenedID] > 35) {
                        yAxisId = "percent"
                    } else {
                        yAxisId = "temperature"
                    }

                    if (sensorID.split("^")[2] === "HIGH") {
                        return <Line yAxisId={yAxisId} type="monotone" name={sensorID} dataKey={sensorID} key={sensorID} stroke={"#FF0000"} thickness={0.25} dot={false} />
                    } else if (sensorID.split("^")[2] === "LOW") {
                        return <Line yAxisId={yAxisId} type="monotone" name={sensorID} dataKey={sensorID} key={sensorID} stroke={"#19b2ff"} thickness={0.25} dot={false} />
                    } else {
                        return <Line yAxisId={yAxisId} type="monotone" name={sensorID} dataKey={sensorID} key={sensorID} stroke={"#FFFFFF"} thickness={3} dot={false} />
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

                        {renderLineItems}

                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[new Date(this.state.normalizedData[0].time).getTime(), new Date(this.state.normalizedData[this.state.normalizedData.length - 1].time).getTime()]}
                            tickFormatter={(unixTime) => moment(unixTime).format('MM-D-YYYY')}
                            hide={false} />
                        <YAxis yAxisId="temperature" orientation="left" domain={[20]} tick={{ fill: "#B3C2B5" }} />
                        <YAxis yAxisId="percent" orientation="right" hide={true} domain={[0, 100]} tick={{ fill: "#B3C2B5" }} />
                        <YAxis yAxisId="ppm" orientation="right" hide={true} tick={{ fill: "#B3C2B5" }} />
                        <YAxis yAxisId="ppb" orientation="right" hide={true} tick={{ fill: "#B3C2B5" }} />

                        <Tooltip content={this.renderTooltip} />
                    </LineChart>
                );
            }
        }


        return (
            <div style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: '100%' }}>
                <div className="Chart-Container-Box" style={{ marginLeft: '-5%', background: '#000101' }}>
                    {renderLifetimeGraph}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: '10px' }}>
                    {renderButtonItems}
                </div>
            </div>
        );
    }
}

export default LifetimeGraph;