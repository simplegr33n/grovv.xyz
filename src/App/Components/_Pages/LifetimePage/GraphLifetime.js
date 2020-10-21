import React, { Component } from 'react';
import '../../../../styles/App.css';

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import moment from 'moment'
import LifetimeDataRow from './LifetimeDataRow.js'



class LifetimeGraph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rangeMax: new Date().valueOf(),
            rangeMin: new Date("2019-05").valueOf()
        };

    }

    componentDidMount() {
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentDidUpdate = () => {
        if (this.props.normalizedLifetimeData && this.props.normalizedLifetimeData !== this.state.normalizedLifetimeData) {
            this.setState({
                normalizedLifetimeData: this.props.normalizedLifetimeData
            })
        }

        if (!this.state.activeLines && this.props.allSensorsList) {
            var activeLines = []
            var allSensorsList = []
            this.props.allSensorsList.forEach((sensorID) => {
                activeLines[activeLines.length] = sensorID
                allSensorsList[allSensorsList.length] = sensorID
            })
            this.setState({
                activeLines: activeLines,
                allSensorsList: allSensorsList
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

    toggleRangeMin = (e) => {
        var newValue = new Date(e.target.value).valueOf()
        var maxValue = this.state.rangeMax
        if (!maxValue) {
            maxValue = new Date().valueOf()
        }

        this.setState({ rangeMin: newValue })

        this.props.updateTimeframe(newValue, maxValue)
    }

    toggleRangeMax = (e) => {
        var newValue = new Date(e.target.value).valueOf() + 3029800000 // add a month here
        var minValue = this.state.rangeMin
        if (!minValue) {
            minValue = 0
        }

        this.setState({ rangeMax: newValue })

        this.props.updateTimeframe(minValue, newValue)
    }

    handleLineToggle = (lineName) => {
        var tempActiveLines = this.state.activeLines
        if (tempActiveLines.includes(lineName)) {
            const index = tempActiveLines.indexOf(lineName);
            if (index > -1) {
                tempActiveLines.splice(index, 1);
            }
        } else {
            tempActiveLines[tempActiveLines.length] = lineName
        }

        this.setState({ activeLines: tempActiveLines })
    }

    toggleSensorLines = (rawID) => {
        const cycleList = ['^AVERAGE', '^HIGH', '^LOW']
        var tempName = rawID.split("^")[0] + "^" + rawID.split("^")[1]

        var tempActiveLines = this.state.activeLines
        var tempActivatedGrows = this.state.activatedGrows

        cycleList.forEach((type) => {
            var value = tempName + type

            if (!tempActivatedGrows) {
                tempActivatedGrows = []
            }

            if (tempActivatedGrows[value] === false) {
                tempActivatedGrows[value] = true
                this.state.allSensorsList.forEach((sensor) => {
                    // ADD
                    if (value === sensor) {
                        if (!tempActiveLines.includes(sensor)) {
                            tempActiveLines[tempActiveLines.length] = sensor
                        }
                    }
                })
            } else if (!tempActivatedGrows[value] || tempActivatedGrows[value] === true) {
                tempActivatedGrows[value] = false
                this.state.allSensorsList.forEach((sensor) => {
                    // REMOVE
                    if (value === sensor) {
                        if (tempActiveLines.includes(sensor)) {
                            const index = tempActiveLines.indexOf(sensor);
                            if (index > -1) {
                                tempActiveLines.splice(index, 1);
                            }
                        }
                    }
                })

            }
        })

        this.setState({
            activatedGrows: tempActivatedGrows,
            activeLines: tempActiveLines
        })
    }

    toggleGrowLines = (value) => {
        var tempActiveLines = this.state.activeLines
        var tempActivatedGrows = this.state.activatedGrows
        if (!tempActivatedGrows) {
            tempActivatedGrows = []
        }

        if (tempActivatedGrows[value] === false) {
            tempActivatedGrows[value] = true
            this.state.allSensorsList.forEach((sensor) => {
                // ADD
                if (value === sensor.split("^")[1]) {
                    if (!tempActiveLines.includes(sensor)) {
                        tempActiveLines[tempActiveLines.length] = sensor
                    }
                }
            })
        } else if (!tempActivatedGrows[value] || tempActivatedGrows[value] === true) {
            tempActivatedGrows[value] = false
            this.state.allSensorsList.forEach((sensor) => {
                // REMOVE
                if (value === sensor.split("^")[1]) {
                    if (tempActiveLines.includes(sensor)) {
                        const index = tempActiveLines.indexOf(sensor);
                        if (index > -1) {
                            tempActiveLines.splice(index, 1);
                        }
                    }
                }
            })

        }

        this.setState({
            activatedGrows: tempActivatedGrows,
            activeLines: tempActiveLines
        })
    }


    render() {

        var renderLifetimeColumns = null
        if (this.props.allSensorsList && this.props.userGrows) {
            renderLifetimeColumns = this.props.userGrows.map((grow) => {
                return <LifetimeDataRow handleLineToggle={this.handleLineToggle} toggleGrowLines={this.toggleGrowLines} toggleSensorLines={this.toggleSensorLines} grow={grow} allSensorsList={this.props.allSensorsList} data-value={grow.id} key={grow.id} activeLines={this.state.activeLines} normalizedLifetimeData={this.state.normalizedLifetimeData} />
            })
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
                        return <Line yAxisId={yAxisId} type="monotone" name={sensorID} dataKey={sensorID} key={sensorID} stroke={"#62ce92"} thickness={3} dot={false} />
                    }
                })()
            );
        }

        var renderLifetimeGraph = null
        if (this.state.normalizedLifetimeData && this.state.normalizedLifetimeData[0]) {
            if (this.props.parentSize) {
                var xSize = Math.floor(this.props.parentSize[0] * 1)
                var ySize = Math.floor(this.props.parentSize[1] * 0.9)

                renderLifetimeGraph = (
                    <LineChart width={xSize} height={ySize} data={this.state.normalizedLifetimeData}>

                        {renderLineItems}

                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[new Date(this.props.displayWindow[0]).getTime(), new Date(this.props.displayWindow[1]).getTime()]}
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
                    {/* Time Scale Select... */}
                    <div style={{ width: '40px', fontSize: '0.55em', display: 'flex', flexDirection: 'column', position: 'absolute', left: '2px', top: '42px' }}>

                        <input onChange={this.toggleRangeMin} id="minimumToggle" name="date" min="2020-09" max={moment(new Date(this.state.rangeMax - 3029800000)).format('YYYY-MM')} type="month" defaultValue={"2020-09"} style={{ fontSize: '0.8em', padding: 0, maxWidth: '40px', marginTop: '1px' }} />
                        <input onChange={this.toggleRangeMax} id="maximumToggle" name="date" min={moment(new Date(this.state.rangeMin + 3029800000)).format('YYYY-MM')} max={moment(new Date()).format('YYYY-MM')} type="month" defaultValue={moment(new Date()).format('YYYY-MM')} style={{ fontSize: '0.8em', padding: 0, marginTop: '1px' }} />

                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: '2px' }}>
                    {renderLifetimeColumns}
                </div>
            </div>
        );
    }
}

export default LifetimeGraph;