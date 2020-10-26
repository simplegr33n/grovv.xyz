import React, { Component } from 'react';
import '../../../../styles/App.css';


import moment from 'moment'

import DisplayFunctions from '../../../_utils/DisplayFunctions.js'


class GrowDataDisplay extends Component {

    constructor(props) {
        super(props);

        this.state = {
            DAILY_HIGHS: [],
            DAILY_HIGHS_TIMES: [],
            DAILY_LOWS: [],
            DAILY_LOWS_TIMES: [],
            DAILY_AVGS: [],
            YEST_AVGS: []
        };

        this.displayFunctions = new DisplayFunctions()
    }

    componentDidMount() {

        if (this.props.processedData && this.props.sensorPIDS) {
            this.grow = this.props.grow
            this.dataLengthRef = this.props.processedData.length

            this.harmonyRatiosUpdated = null

            var SENSOR_DEVIATIONS = []
            var SENSOR_MEANS = []

            for (const [key, value] of Object.entries(this.props.grow.config.SENSORS)) {
                SENSOR_DEVIATIONS[value.PID] = value._deviation
                SENSOR_MEANS[value.PID] = value._mean
            }

            this.setState({
                SENSOR_DEVIATIONS: SENSOR_DEVIATIONS,
                SENSOR_MEANS: SENSOR_MEANS,
                liveData: this.props.processedData[this.props.processedData.length - 1],
                lastLiveData: this.props.processedData[this.props.processedData.length - 2]
            })

            this.processGrowData(this.props.processedData)
        }
    }

    componentDidUpdate = () => {
        if (this.props.processedData && this.props.sensorPIDS) {
            if ((this.grow != this.props.grow) || (this.dataLengthRef !== this.props.processedData.length)) {
                this.grow = this.props.grow
                this.dataLengthRef = this.props.processedData.length

                this.harmonyRatiosUpdated = null

                var SENSOR_DEVIATIONS = []
                var SENSOR_MEANS = []

                for (const [sensorConfig] of Object.entries(this.props.grow.config.SENSORS)) {
                    SENSOR_DEVIATIONS[sensorConfig.PID] = sensorConfig._deviation
                    SENSOR_MEANS[sensorConfig.PID] = sensorConfig._mean
                }

                this.setState({
                    SENSOR_DEVIATIONS: SENSOR_DEVIATIONS,
                    SENSOR_MEANS: SENSOR_MEANS,
                    liveData: this.props.processedData[this.props.processedData.length - 1],
                    lastLiveData: this.props.processedData[this.props.processedData.length - 2]
                })

                this.processGrowData(this.props.processedData)
            }
        }
    }

    processGrowData = (preProcessedData) => {

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


        // ANALYTICS...
        preProcessedData.forEach((dataPoint) => {
            if (now - dataPoint.time < 86400000) {
                DAILY_POINT_COUNT += 1

                lastDayData[lastDayData.length] = dataPoint

                // DATA and CALCS for avgs/lows/highs
                for (const pid in dataPoint) {

                    if (this.props.sensorPIDS.includes(pid)) {
                        var tIndex = this.props.sensorPIDS.indexOf(pid)

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

                    if (this.props.sensorPIDS.includes(pid)) {
                        var yIndex = this.props.sensorPIDS.indexOf(pid)

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
            this.processDeviationData(preProcessedData, now)
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
        this.props.toggleLine(e.currentTarget.getAttribute('data-value'))
    }

    render() {

        var indicatorColor = this.displayFunctions.returnActiveIndicatorColor(this.props.processedData)

        var sensorInfoRows = null
        if (this.props.sensorPIDS && this.state.liveData) {

            sensorInfoRows = this.props.sensorPIDS.map((pid) => {
                var tIndex = this.props.sensorPIDS.indexOf(pid)
                var curSensor = this.props.grow.config.SENSORS[tIndex]
                var lineKey = pid + "^" + this.props.grow.id

                var setOpacity = 1
                var setPaddingTop = '5px'

                if (this.props.activeLines && !this.props.activeLines.includes(pid)) {
                    setOpacity = 0.5
                    setPaddingTop = '6px'
                }

                return (
                    <div className="Grow-Details-Main-Data-Display-Row" style={{ opacity: setOpacity }} key={pid + "^" + this.props.grow.id}>

                        {(() => {

                            if (!this.props.grow.config.SENSORS[tIndex]) {
                                return
                            }

                            return (
                                <div data-value={pid} key={lineKey} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', cursor: 'pointer', marginBottom: '1px', background: '#131412', color: this.props.grow.config.SENSORS[tIndex].color }}  >

                                    <div style={{ paddingTop: setPaddingTop, fontSize: '12px', lineHeight: '12px', overflow: 'hidden', fontWeight: '500', textAlign: 'right' }} > {curSensor.name}</div>

                                    {this.displayFunctions.displaySensorTypeIcon(curSensor.type)}

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
                                            <div style={{ display: 'flex', flexDirection: 'column', height: "100%", width: "4px", maxWidth: "4px", minWidth: '4px' }}>
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
                            var tIndex = this.props.sensorPIDS.indexOf(pid)
                            var curSensor = this.props.grow.config.SENSORS[tIndex]
                            var setIndicatorColor = '#FFF'

                            if (!curSensor) {
                                return
                            }

                            if (this.state.liveData) {
                                if ((curSensor._mean || curSensor._mean === 0) && (curSensor._deviation || curSensor._deviation === 0)) {
                                    if (((curSensor._mean + (curSensor._deviation * 2)) < this.state.liveData[pid]) || ((curSensor._mean - (curSensor._deviation * 2)) > this.state.liveData[pid])) {
                                        setIndicatorColor = '#FF0000' // BAD
                                    } else if (((curSensor._mean + (curSensor._deviation)) < this.state.liveData[pid]) || ((curSensor._mean - (curSensor._deviation)) > this.state.liveData[pid])) {
                                        setIndicatorColor = '#ded954' // WARN
                                    } else {
                                        setIndicatorColor = '#38c538' // GOOD
                                    }
                                }
                            }


                            return (
                                <div className="Grow-Details-Main-Data-Current-Data" style={{ background: setIndicatorColor, overflow: 'hidden' }}>

                                    <div style={{ width: '1px', background: '#000' }} />

                                    {(() => {
                                        var tIndex = this.props.sensorPIDS.indexOf(pid)
                                        var curSensor = this.props.grow.config.SENSORS[tIndex]
                                        if (!curSensor) {
                                            return
                                        }

                                        if (!this.state.liveData || !this.state.liveData[pid]) {
                                            return
                                        }

                                        return (
                                            <div style={{ userSelect: 'none', flex: 1, display: 'flex', justifyContent: 'center', overflow: 'hidden', userSelect: 'none' }}>
                                                <div style={{ fontSize: '18px', userSelect: 'none', display: 'flex', fontWeight: 700 }}>{Math.round(this.state.liveData[pid] * 10) / 10}</div>
                                                <div style={{ fontSize: '14px', userSelect: 'none', display: 'flex', fontWeight: 600, marginTop: '2px' }}>{curSensor.unit}</div>
                                            </div>
                                        )
                                    })()}

                                    {(() => {
                                        if (this.state.liveData && this.state.liveData[pid] && this.state.lastLiveData) {
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

                        <div className="Grow-Details-Main-Data-Data" style={{ marginBottom: '1px', overflow: 'hidden' }}>
                            <div className="Grow-Details-Main-Yest-Data" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontSize: '10px', userSelect: 'none' }}>
                                {(() => {
                                    var tIndex = this.props.sensorPIDS.indexOf(pid)
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
                                    var tIndex = this.props.sensorPIDS.indexOf(pid)

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
                                var tIndex = this.props.sensorPIDS.indexOf(pid)
                                var curSensor = this.props.grow.config.SENSORS[tIndex]
                                if (!curSensor) {
                                    return
                                }

                                if (this.state.DAILY_AVGS && this.state.DAILY_AVGS[tIndex]) {
                                    return (
                                        <div style={{ userSelect: 'none', flex: 1, display: 'flex', justifyContent: 'center', paddingBottom: '2px' }}>
                                            <div style={{ fontSize: '16px', userSelect: 'none', display: 'flex', fontWeight: '600' }}>{Math.round(this.state.DAILY_AVGS[tIndex] * 10) / 10}</div>
                                            <div style={{ fontSize: '11px', userSelect: 'none', display: 'flex', fontWeight: 600, marginTop: '2px' }}>{curSensor.unit}</div>
                                        </div>
                                    )
                                }
                            })()}
                        </div>


                        <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#c77725', marginBottom: '1px', overflow: 'hidden' }}>
                            <div className="Grow-Details-Main-Data-Time">
                                {(() => {
                                    var tIndex = this.props.sensorPIDS.indexOf(pid)

                                    if (this.state.DAILY_HIGHS_TIMES && this.state.DAILY_HIGHS_TIMES[tIndex]) {
                                        var time = new Date(this.state.DAILY_HIGHS_TIMES[tIndex])
                                        return <div style={{ fontSize: '9px', userSelect: 'none', textAlign: 'right', fontWeight: '200', background: '#4b1a0a' }}>{time.getHours()}:{(time.getMinutes() < 10 ? '0' : '')}{time.getMinutes()}</div>
                                    }
                                })()}
                            </div>

                            {(() => {
                                var tIndex = this.props.sensorPIDS.indexOf(pid)
                                var curSensor = this.props.grow.config.SENSORS[tIndex]
                                if (!curSensor) {
                                    return
                                }

                                if (this.state.DAILY_HIGHS && this.state.DAILY_HIGHS[tIndex]) {
                                    return (
                                        <div style={{ userSelect: 'none', flex: 1, display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ fontSize: '16px', userSelect: 'none', display: 'flex', fontWeight: '600', paddingBottom: '2px' }}>{Math.round(this.state.DAILY_HIGHS[tIndex] * 10) / 10}</div>
                                            <div style={{ fontSize: '11px', userSelect: 'none', display: 'flex', fontWeight: 600 }}>{curSensor.unit}</div>
                                        </div>
                                    )
                                }
                            })()}
                        </div>

                        <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#2584c7', marginBottom: '1px', overflow: 'hidden' }}>
                            <div className="Grow-Details-Main-Data-Time">
                                {(() => {
                                    var tIndex = this.props.sensorPIDS.indexOf(pid)

                                    if (this.state.DAILY_LOWS_TIMES && this.state.DAILY_LOWS_TIMES[tIndex]) {
                                        var time = new Date(this.state.DAILY_LOWS_TIMES[tIndex])
                                        return <div style={{ fontSize: '9px', userSelect: 'none', textAlign: 'right', fontWeight: '200', background: '#20314e' }}>{time.getHours()}:{(time.getMinutes() < 10 ? '0' : '')}{time.getMinutes()}</div>
                                    }
                                })()}
                            </div>

                            {(() => {
                                var tIndex = this.props.sensorPIDS.indexOf(pid)
                                var curSensor = this.props.grow.config.SENSORS[tIndex]
                                if (!curSensor) {
                                    return
                                }

                                if (this.state.DAILY_LOWS && this.state.DAILY_LOWS[tIndex]) {
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
                )
            });

        }



        // MAIN RENDER RETURN
        return (

            <div className="Grow-Details-Page-Panel">
                <div id="Grow-Details-Data-Display">
                    {(() => {
                        if (this.state.liveData) {
                            return (
                                <div className="Component-Grow-Data-Display">
                                    <div className="Grow-Details-Headers-Display-Row" >
                                        {(() => {
                                            if (!this.props.activeLines || this.props.activeLines) {
                                                return (
                                                    <div className="Grow-Details-Main-Data-Row-Header" style={{ color: '#FFF', fontSize: '20px', userSelect: 'none', flex: 1, width: '208px', maxWidth: '208px', display: 'flex', flexDirection: 'row' }}>
                                                        <div style={{ color: indicatorColor, marginLeft: '2px', marginRight: '2px', marginTop: '-1px' }}>
                                                            ⬤
                                                        </div>
                                                        {this.props.grow.name}
                                                    </div>
                                                )
                                            } else {
                                                return <div className="Grow-Details-Main-Data-Row-Header" style={{ color: '#FFF', fontSize: '12px', userSelect: 'none', flex: 1, width: '208px', maxWidth: '208px', display: 'flex', flexDirection: 'row' }} />
                                            }
                                        })()}
                                        {/* <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '88px', maxWidth: '88px', userSelect: 'none' }}></div> */}
                                        <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '64px', maxWidth: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', userSelect: 'none' }}>24h~</div>
                                        <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '64px', maxWidth: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', userSelect: 'none' }}>24h&#8593;</div>
                                        <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '64px', maxWidth: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', userSelect: 'none' }}>24h&#8595;</div>
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
