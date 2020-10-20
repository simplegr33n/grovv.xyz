import React, { Component } from 'react';
import '../../../styles/App.css';


import moment from 'moment'

import { WiThermometer, WiHumidity, WiHurricane, WiCloudUp, WiThermometerExterior } from 'react-icons/wi';
import co2svg from '../../../assets/co2svg.svg'
import tvocSvg from '../../../assets/tvoc-svg.svg'


class GrowDataDisplay extends Component {

    constructor(props) {
        super(props);

        this.state = {
            SENSOR_PIDS: [],
            SENSORS_INIT: false,

            DAILY_HIGHS: [],
            DAILY_HIGHS_TIMES: [],
            DAILY_LOWS: [],
            DAILY_LOWS_TIMES: [],
            DAILY_AVGS: [],
            YEST_AVGS: [],

            ACTIVE_LINES: [],
            ACTIVE_INIT: false,

            TABLE_INIT: false,
        };
    }

    componentDidMount() {
        if (this.props.threeDayData) {
            if (!this.props.threeDayData[this.props.grow.id]) {
                return;
            }

            if (this.props.grow !== this.state.GROW) {
                this.harmonyRatiosUpdated = null

                var SENSOR_DEVIATIONS = []
                var SENSOR_MEANS = []

                for (const [key, value] of Object.entries(this.props.grow.config.SENSORS)) {
                    SENSOR_DEVIATIONS[value.PID] = value._deviation
                    SENSOR_MEANS[value.PID] = value._mean
                }

                this.setState({
                    GROW: this.props.grow,
                    SENSOR_DEVIATIONS: SENSOR_DEVIATIONS,
                    SENSOR_MEANS: SENSOR_MEANS
                })
            }

            var dataLengthRef = this.props.threeDayData[this.props.grow.id][this.props.threeDayData[this.props.grow.id].length - 1].length

            if (this.dataLengthRef !== dataLengthRef) {
                this.dataLengthRef = dataLengthRef
                this.processGrowData(this.props.threeDayData)
            } else if (!this.state.TABLE_INIT) {
                // Gotta get this process in the first time for things to go smooth... not quite sure why.
                this.dataLengthRef = dataLengthRef
                this.processGrowData(this.props.threeDayData)
                this.setState({ TABLE_INIT: true })
            }
        }

    }

    componentDidUpdate = () => {

        if (this.props.threeDayData) {
            if (!this.props.threeDayData[this.props.grow.id]) {
                return;
            }

            if (this.props.grow !== this.state.GROW) {
                this.harmonyRatiosUpdated = null

                var SENSOR_DEVIATIONS = []
                var SENSOR_MEANS = []

                for (const [key, value] of Object.entries(this.props.grow.config.SENSORS)) {
                    SENSOR_DEVIATIONS[value.PID] = value._deviation
                    SENSOR_MEANS[value.PID] = value._mean
                }

                this.setState({
                    GROW: this.props.grow,
                    SENSOR_DEVIATIONS: SENSOR_DEVIATIONS,
                    SENSOR_MEANS: SENSOR_MEANS
                })
            }

            var dataLengthRef = this.props.threeDayData[this.props.grow.id][this.props.threeDayData[this.props.grow.id].length - 1].length

            if (this.dataLengthRef !== dataLengthRef) {
                this.dataLengthRef = dataLengthRef
                this.processGrowData(this.props.threeDayData)
            } else if (!this.state.TABLE_INIT) {
                // Gotta get this process in the first time for things to go smooth... not quite sure why.
                this.dataLengthRef = dataLengthRef
                this.processGrowData(this.props.threeDayData)
                this.setState({ TABLE_INIT: true })
            }
        }

    }

    processGrowData = (growData) => {

        var concatData = []
        growData[this.props.grow.id].forEach((list) => {
            concatData = concatData.concat(list)
        })
        concatData.sort((a, b) => (a.time > b.time) ? 1 : -1)

        this.setState({
            liveData: concatData[concatData.length - 1],
            lastLiveData: concatData[concatData.length - 2],
        })

        var now = new Date().valueOf()

        var DAILY_HIGHS = []
        var DAILY_HIGHS_TIMES = []
        var DAILY_LOWS = []
        var DAILY_LOWS_TIMES = []
        var DAILY_AVGS = []
        var YEST_AVGS = []

        var DAILY_POINT_COUNT = 0
        var YEST_POINT_COUNT = 0

        var lastDayData = []
        var yesterdayData = []

        // INITIALIZING SENSOR INFO
        // get all sensor pids...   ?
        var SENSOR_PIDS = []
        if (this.state.SENSORS_INIT !== this.props.grow && this.props.grow.config.SENSORS !== this.state.SENSOR_PIDS) {
            this.props.grow.config.SENSORS.forEach((sensor, key) => {

                if (SENSOR_PIDS[key] !== sensor.PID) {
                    SENSOR_PIDS[key] = sensor.PID
                }
            });

            this.setState({
                SENSOR_PIDS: SENSOR_PIDS
            });

            if (this.state.ACTIVE_INIT !== this.props.grow) {
                this.setState({
                    ACTIVE_INIT: this.props.grow
                });
            }
        }


        // ANALYTICS...
        concatData.forEach((dataPoint) => {
            if (now - dataPoint.time < 86400000) {
                DAILY_POINT_COUNT += 1

                lastDayData[lastDayData.length] = dataPoint

                // DATA and CALCS for avgs/lows/highs
                for (const pid in dataPoint) {

                    if (SENSOR_PIDS.includes(pid)) {
                        var tIndex = SENSOR_PIDS.indexOf(pid)

                        // HIGHS
                        if (!DAILY_HIGHS[tIndex] || parseFloat(dataPoint[pid]) >= DAILY_HIGHS[tIndex]) {
                            DAILY_HIGHS[tIndex] = dataPoint[pid]
                            DAILY_HIGHS_TIMES[tIndex] = dataPoint.time
                        }
                        // LOWS
                        if (!DAILY_LOWS[tIndex] || parseFloat(dataPoint[pid]) <= DAILY_LOWS[tIndex]) {
                            DAILY_LOWS[tIndex] = dataPoint[pid]
                            DAILY_LOWS_TIMES[tIndex] = dataPoint.time
                        }
                        // AVERAGES
                        if (!DAILY_AVGS[tIndex]) {
                            DAILY_AVGS[tIndex] = 0
                        }
                        DAILY_AVGS[tIndex] = parseFloat(dataPoint[pid]) + parseFloat(DAILY_AVGS[tIndex])
                    }
                }
            }

            // YESTERDAY AVERAGES
            if ((now - dataPoint.time < (86400000 * 2)) && (now - dataPoint.time > 86400000)) {
                YEST_POINT_COUNT += 1

                yesterdayData[yesterdayData.length] = dataPoint

                // DATA and CALCS for avgs/lows/highs
                for (const pid in dataPoint) {

                    if (SENSOR_PIDS.includes(pid)) {
                        var yIndex = SENSOR_PIDS.indexOf(pid)

                        //AVERAGES
                        if (!YEST_AVGS[yIndex]) {
                            YEST_AVGS[yIndex] = 0
                        }
                        YEST_AVGS[yIndex] = parseFloat(dataPoint[pid]) + parseFloat(YEST_AVGS[yIndex])
                    }
                }
            }
        })

        // CALCULATE AVERAGES
        DAILY_AVGS.forEach((avg, key) => {
            DAILY_AVGS[key] = DAILY_AVGS[key] / DAILY_POINT_COUNT
        });

        YEST_AVGS.forEach((avg, key) => {
            YEST_AVGS[key] = YEST_AVGS[key] / YEST_POINT_COUNT
        });

        this.setState({
            DAILY_HIGHS: DAILY_HIGHS,
            DAILY_HIGHS_TIMES: DAILY_HIGHS_TIMES,
            DAILY_LOWS: DAILY_LOWS,
            DAILY_LOWS_TIMES: DAILY_LOWS_TIMES,
            DAILY_AVGS: DAILY_AVGS,
            YEST_AVGS: YEST_AVGS
        });



        if (!this.processedDevs || (now - this.processedDevs > 150000)) {
            this.processDevs = now
            console.log("PROCESS DEVIATION")
            this.processDeviationData(concatData, now)
        }
    }

    processDeviationData = (concatData, now) => {
        var HARMONY_POINT_COUNT = []
        var HARMONY_PLUS_ONE_COUNT = []
        var HARMONY_PLUS_TWO_COUNT = []

        // INITIALIZING SENSOR INFO
        concatData.forEach((dataPoint) => {
            if (now - dataPoint.time < 86400000) { // one day 
                // for loop sensors rather than datapoint
                for (const [key, sensor] of Object.entries(this.props.grow.config.SENSORS)) {
                    var pid = sensor.PID

                    // HARMONY_POINT_COUNT
                    if (!HARMONY_POINT_COUNT[pid]) {
                        HARMONY_POINT_COUNT[pid] = 0
                        HARMONY_PLUS_ONE_COUNT[pid] = 0
                        HARMONY_PLUS_TWO_COUNT[pid] = 0
                    }
                    HARMONY_POINT_COUNT[pid] = HARMONY_POINT_COUNT[pid] + 1

                    // HARMONY_PLUS_TWO_COUNT
                    if ((dataPoint[pid] > (sensor._mean) + (sensor._deviation * 2)) ||
                        (dataPoint[pid] < (sensor._mean) - (sensor._deviation * 2))) {
                        HARMONY_PLUS_TWO_COUNT[pid] = HARMONY_PLUS_TWO_COUNT[pid] + 1
                    } else if ((dataPoint[pid] > (sensor._mean) + (sensor._deviation)) ||
                        (dataPoint[pid] < (sensor._mean) - (sensor._deviation))) {  // HARMONY_PLUS_ONE_COUNT
                        HARMONY_PLUS_ONE_COUNT[pid] = HARMONY_PLUS_ONE_COUNT[pid] + 1
                    }
                }
            }
        })

        // CALCULATE HARMONIES
        if (Object.keys(HARMONY_POINT_COUNT).length !== 0) {

            for (const [key, value] of Object.entries(HARMONY_PLUS_ONE_COUNT)) {
                HARMONY_PLUS_ONE_COUNT[key] = Math.round((HARMONY_PLUS_ONE_COUNT[key] / HARMONY_POINT_COUNT[key]) * 100)
            }

            for (const [key, value] of Object.entries(HARMONY_PLUS_TWO_COUNT)) {
                HARMONY_PLUS_TWO_COUNT[key] = Math.round((HARMONY_PLUS_TWO_COUNT[key] / HARMONY_POINT_COUNT[key]) * 100)
            }

            this.setState({
                HARMONY_DANGER: HARMONY_PLUS_TWO_COUNT,
                HARMONY_WARN: HARMONY_PLUS_ONE_COUNT
            });
        }
    }

    toggleLine = (e) => {
        var pid = e.currentTarget.getAttribute('data-value')
        this.props.toggleLine(pid + "^" + this.props.grow.id)
    }

    render() {

        var indicatorColor = "#FFF"
        var lastUpdate = null;
        if (this.props.liveGrowData && this.props.liveGrowData[this.props.grow.id]) {
            var now = new Date().getTime();
            var updatedAtDate = new Date(this.props.liveGrowData[this.props.grow.id].time * 1000)

            if (this.updatedAtDate && (updatedAtDate !== this.updatedAtDate[this.props.grow.id])) {
                this.updatedAtDate[this.props.grow.id] = updatedAtDate
            }

            var difference = now - this.props.liveGrowData[this.props.grow.id].time * 1000
            if (difference > 10000000) {
                indicatorColor = "#989e98"
            } else if (difference > 300000) {
                indicatorColor = "#fa360a"
            } else if (difference > 60000) {
                indicatorColor = "#facb23"
            } else if (difference < 60000) {
                indicatorColor = "#27d927"
            }
            lastUpdate = moment(updatedAtDate).fromNow()
        }

        const sensorInfoRows = this.state.SENSOR_PIDS.map((pid) =>
            <div className="Grow-Details-Main-Data-Display-Row" key={pid}>

                {(() => {

                    var tIndex = this.state.SENSOR_PIDS.indexOf(pid)
                    var curSensor = this.props.grow.config.SENSORS[tIndex]
                    var lineKey = pid + "^" + this.props.grow.id

                    var setOpacity = 1
                    var setPaddingTop = '4px'

                    // for ALL graph
                    if (!this.props.activeLines && this.props.user) {
                        if (this.props.user.PREFS) {
                            if (this.props.user.PREFS.GRAPHS) {
                                if (this.props.user.PREFS.GRAPHS.AllGraph) {
                                    if (this.props.user.PREFS.GRAPHS.AllGraph.showSensors && (this.props.user.PREFS.GRAPHS.AllGraph.showSensors[lineKey] === false)) {
                                        setOpacity = 0.3
                                        setPaddingTop = '3px'
                                    }
                                }
                            }
                        }
                    }
                    // For individual graphs
                    if (this.props.activeLines && !this.props.activeLines.includes(pid)) {
                        setOpacity = 0.3
                        setPaddingTop = '3px'
                    }



                    if (!this.props.grow.config.SENSORS[tIndex]) {
                        return
                    }

                    return (
                        <div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.65em', cursor: 'pointer', background: '#0c140d', opacity: setOpacity, color: this.props.grow.config.SENSORS[tIndex].color }}  >
                            <div style={{ paddingTop: setPaddingTop, fontSize: '12px', lineHeight: '12px', overflow: 'hidden', fontWeight: '500' }} > {curSensor.name}</div>

                            {(() => {
                                if (curSensor.type === "airTemp") {
                                    return <WiThermometer style={{ color: '#FFF', fontSize: '30px' }} />
                                } else if (curSensor.type === "humidity") {
                                    return <WiHumidity style={{ color: '#FFF', fontSize: '30px' }} />
                                } else if (curSensor.type === "fan") {
                                    return <WiHurricane style={{ color: '#FFF', fontSize: '30px' }} />
                                } else if (curSensor.type === "humidifier") {
                                    return <WiCloudUp style={{ color: '#FFF', fontSize: '30px' }} />
                                } else if (curSensor.type === "waterTemp") {
                                    return <WiThermometerExterior style={{ color: '#FFF', fontSize: '30px' }} />
                                } else if (curSensor.type === "co2") {
                                    return <img src={co2svg} alt="CO2 Icon" style={{ position: 'relative', display: 'inline-block', maxHeight: '20px', marginLeft: '4px', marginRight: '2px' }} />
                                } else if (curSensor.type === "tvoc") {
                                    return <img src={tvocSvg} alt="TVOC Icon" style={{ position: 'relative', display: 'inline-block', maxHeight: '20px', marginLeft: '4px', marginRight: '2px' }} />
                                } else {
                                    return <div />
                                }
                            })()}

                            {(() => {
                                var harmonyWarnFlex = 0
                                var harmonyDangerFlex = 0
                                var harmonyGoodFlex = 100
                                // EXAGERATE WARNINGS *2 / *10
                                if (this.state.HARMONY_WARN) {
                                    harmonyWarnFlex = this.state.HARMONY_WARN[pid] * 2
                                }
                                if (this.state.HARMONY_DANGER) {
                                    harmonyDangerFlex = this.state.HARMONY_DANGER[pid] * 10
                                }
                                if (harmonyDangerFlex > 100) {
                                    harmonyWarnFlex = 0
                                }
                                harmonyGoodFlex = harmonyGoodFlex - harmonyWarnFlex - harmonyDangerFlex

                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', height: "100%", width: "4px", maxWidth: "4px", flex: 99 }}>
                                        <div style={{ flex: harmonyDangerFlex, background: '#FF0000' }} />
                                        <div style={{ flex: harmonyWarnFlex, background: '#fcba03' }} />
                                        <div style={{ flex: harmonyGoodFlex, background: '#38c538' }} />
                                    </div>
                                )
                            })()}

                        </div>
                    )
                })()}
                {(() => {
                    var tIndex = this.state.SENSOR_PIDS.indexOf(pid)
                    var curSensor = this.props.grow.config.SENSORS[tIndex]
                    var setIndicatorColor = '#FFF'

                    if (!curSensor) {
                        return
                    }

                    if ((curSensor._mean || curSensor._mean === 0) && (curSensor._deviation || curSensor._deviation === 0)) {
                        if (((curSensor._mean + (curSensor._deviation * 2)) < this.state.liveData[pid]) || ((curSensor._mean - (curSensor._deviation * 2)) > this.state.liveData[pid])) {
                            setIndicatorColor = '#FF0000' // BAD
                        } else if (((curSensor._mean + (curSensor._deviation)) < this.state.liveData[pid]) || ((curSensor._mean - (curSensor._deviation)) > this.state.liveData[pid])) {
                            setIndicatorColor = '#ded954' // WARN
                        } else {
                            setIndicatorColor = '#38c538' // GOOD
                        }
                    }

                    return (
                        <div className="Grow-Details-Main-Data-Current-Data" style={{ background: setIndicatorColor }}>

                            <div style={{ width: '1px', background: '#000' }} />

                            {(() => {
                                var tIndex = this.state.SENSOR_PIDS.indexOf(pid)
                                var curSensor = this.props.grow.config.SENSORS[tIndex]
                                if (!curSensor) {
                                    return
                                }

                                if (!this.state.liveData || !this.state.liveData[pid]) {
                                    return
                                }

                                return (
                                    <div style={{ userSelect: 'none', flex: 1, display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ fontSize: '20px', userSelect: 'none', display: 'flex', fontWeight: 700 }}>{Math.round(this.state.liveData[pid] * 10) / 10}</div>
                                        <div style={{ fontSize: '14px', userSelect: 'none', display: 'flex', fontWeight: 600, marginTop: '2px' }}>{curSensor.unit}</div>
                                    </div>
                                )
                            })()}

                            {(() => {
                                if (this.state.liveData && this.state.liveData[pid]) {
                                    if ((this.state.liveData[pid] > this.state.lastLiveData[pid])) {
                                        return <div style={{ fontSize: '11px', userSelect: 'none', color: '#a02525', marginRight: '2px' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                    } else if (this.state.liveData[pid] < this.state.lastLiveData[pid]) {
                                        return <div style={{ fontSize: '11px', userSelect: 'none', color: '#242490', marginRight: '2px' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                    } else {
                                        return <div />
                                    }
                                }
                            })()}

                        </div>
                    )
                })()}

                <div className="Grow-Details-Main-Data-Data" style={{ marginBottom: '1px' }}>
                    <div className="Grow-Details-Main-Yest-Data" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontSize: '10px', userSelect: 'none' }}>
                        {(() => {
                            var tIndex = this.state.SENSOR_PIDS.indexOf(pid)
                            var curSensor = this.props.grow.config.SENSORS[tIndex]
                            if (!curSensor) {
                                return
                            }

                            if (this.state.YEST_AVGS[tIndex]) {

                                return (
                                    <div style={{ userSelect: 'none', flex: 1, display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ fontSize: '9px', userSelect: 'none', display: 'flex', fontWeight: '600' }}>{Math.round(this.state.YEST_AVGS[tIndex] * 10) / 10}</div>
                                        <div style={{ fontSize: '9px', userSelect: 'none', display: 'flex', fontWeight: 400 }}>{curSensor.unit}</div>
                                    </div>
                                )
                            }
                        })()}


                        {(() => {
                            var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                            if (this.state.DAILY_AVGS[tIndex] && this.state.YEST_AVGS[tIndex]) {

                                if (this.state.DAILY_AVGS[tIndex] > this.state.YEST_AVGS[tIndex]) {
                                    return <div style={{ fontSize: '9px', color: '#FFF', userSelect: 'none', marginRight: '2px' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                } else if (this.state.DAILY_AVGS[tIndex] < this.state.YEST_AVGS[tIndex]) {
                                    return <div style={{ fontSize: '9px', color: '#FFF', userSelect: 'none', marginRight: '2px' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                } else {
                                    return <div />
                                }
                            }
                        })()}
                    </div>


                    {(() => {
                        var tIndex = this.state.SENSOR_PIDS.indexOf(pid)
                        var curSensor = this.props.grow.config.SENSORS[tIndex]
                        if (!curSensor) {
                            return
                        }

                        if (this.state.DAILY_AVGS[tIndex]) {
                            return (
                                <div style={{ userSelect: 'none', flex: 1, display: 'flex', justifyContent: 'center', paddingBottom: '2px' }}>
                                    <div style={{ fontSize: '16px', userSelect: 'none', display: 'flex', fontWeight: '600' }}>{Math.round(this.state.DAILY_AVGS[tIndex] * 10) / 10}</div>
                                    <div style={{ fontSize: '11px', userSelect: 'none', display: 'flex', fontWeight: 600, marginTop: '2px' }}>{curSensor.unit}</div>
                                </div>
                            )
                        }
                    })()}
                </div>


                <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#c77725', marginBottom: '1px' }}>
                    <div className="Grow-Details-Main-Data-Time">
                        {(() => {
                            var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                            if (this.state.DAILY_HIGHS_TIMES) {
                                var m = moment(this.state.DAILY_HIGHS_TIMES[tIndex])
                                return <div style={{ fontSize: '9px', userSelect: 'none', textAlign: 'right', fontWeight: '200', background: '#4b1a0a' }}>{m.format('HH:mm')}</div>
                            }
                        })()}
                    </div>

                    {(() => {
                        var tIndex = this.state.SENSOR_PIDS.indexOf(pid)
                        var curSensor = this.props.grow.config.SENSORS[tIndex]
                        if (!curSensor) {
                            return
                        }

                        if (this.state.DAILY_HIGHS) {

                            return (
                                <div style={{ userSelect: 'none', flex: 1, display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ fontSize: '16px', userSelect: 'none', display: 'flex', fontWeight: '600', paddingBottom: '2px' }}>{Math.round(this.state.DAILY_HIGHS[tIndex] * 10) / 10}</div>
                                    <div style={{ fontSize: '11px', userSelect: 'none', display: 'flex', fontWeight: 600 }}>{curSensor.unit}</div>
                                </div>
                            )

                        }
                    })()}
                </div>

                <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#2584c7', marginBottom: '1px' }}>
                    <div className="Grow-Details-Main-Data-Time">
                        {(() => {
                            var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                            if (this.state.DAILY_LOWS_TIMES) {
                                var m = moment(this.state.DAILY_LOWS_TIMES[tIndex])
                                return <div style={{ fontSize: '9px', userSelect: 'none', textAlign: 'right', fontWeight: '200', background: '#20314e' }}>{m.format('HH:mm')}</div>
                            }
                        })()}
                    </div>

                    {(() => {
                        var tIndex = this.state.SENSOR_PIDS.indexOf(pid)
                        var curSensor = this.props.grow.config.SENSORS[tIndex]
                        if (!curSensor) {
                            return
                        }

                        if (this.state.DAILY_LOWS) {


                            return (
                                <div style={{ userSelect: 'none', flex: 1, display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ fontSize: '16px', userSelect: 'none', display: 'flex', fontWeight: '600', paddingBottom: '2px' }}>{Math.round(this.state.DAILY_LOWS[tIndex] * 10) / 10}</div>
                                    <div style={{ fontSize: '11px', userSelect: 'none', display: 'flex', fontWeight: 600 }}>{curSensor.unit}</div>
                                </div>
                            )

                        }
                    })()}
                </div>
            </div>
        );



        // MAIN RENDER RETURN
        return (

            <div className="Grow-Details-Page-Panel">
                <div id="Grow-Details-Data-Display">
                    {(() => {
                        if (this.state.liveData) {
                            return (
                                <div className="Component-Grow-Data-Display">
                                    <div className="Grow-Details-Headers-Display-Row">
                                        {(() => {
                                            if (!this.props.activeLines) {
                                                return (
                                                    <div className="Grow-Details-Main-Data-Row-Header" style={{ color: '#FFF', fontSize: '12px', userSelect: 'none', width: '120px', maxWidth: '120px', display: 'flex', flexDirection: 'row' }}>
                                                        <div style={{ color: indicatorColor, marginLeft: '2px', marginRight: '2px', marginTop: '-1px' }}>
                                                            ⬤
                                                        </div>
                                                        {this.props.grow.name}
                                                    </div>
                                                )
                                            } else {
                                                return <div className="Grow-Details-Main-Data-Row-Header" style={{ color: '#FFF', fontSize: '12px', userSelect: 'none', width: '120px', maxWidth: '120px', display: 'flex', flexDirection: 'row' }} />
                                            }
                                        })()}
                                        <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '88px', maxWidth: '88px', userSelect: 'none' }}></div>
                                        <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '64px', maxWidth: '64px', userSelect: 'none' }}>24h~</div>
                                        <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '64px', maxWidth: '64px', userSelect: 'none' }}>24h&#8593;</div>
                                        <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '64px', maxWidth: '64px', userSelect: 'none' }}>24h&#8595;</div>
                                    </div>

                                    {sensorInfoRows}

                                </div>
                            )
                        }
                    })()}
                </div>
            </div>

        );
    }
}

export default GrowDataDisplay;
