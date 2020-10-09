import React, { Component } from 'react';
import '../../../styles/App.css';

import GrowDetailsGraphs from './GrowDetailsGraphs'
import GrowSettings from './GrowSettings';

import DbHelper from '../../_utils/DbHelper.js'


import moment from 'moment'

import { WiThermometer, WiHumidity, WiHurricane, WiCloudUp, WiThermometerExterior } from 'react-icons/wi';
import { BsGearFill } from 'react-icons/bs';



class GrowDetailsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeIndicatorStyle: 'Grow-Active-Indicator-Circle',

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

            SHOW_SETTINGS: false
        };

        this.dbHelper = new DbHelper(); // Need for linked journals

    }

    componentDidMount() {
        this._ismounted = true;

        if (this.props.rawGrowData && this.state.SENSOR_PIDS) {
            if (!this.props.rawGrowData[this.props.grow.id]) {
                return;
            }

            var dataLengthRef = this.props.rawGrowData[this.props.grow.id][this.props.rawGrowData[this.props.grow.id].length - 1].length

            if (this.dataLengthRef !== dataLengthRef) {
                this.dataLengthRef = dataLengthRef
                this.processGrowData(this.props.rawGrowData)
            }
            this.forceUpdate()
        }

    }

    componentWillUnmount = () => {
        this._ismounted = false;
    }

    componentDidUpdate = () => {
        if (this.props.rawGrowData) {
            if (!this.props.rawGrowData[this.props.grow.id]) {
                return;
            }

            var dataLengthRef = this.props.rawGrowData[this.props.grow.id][this.props.rawGrowData[this.props.grow.id].length - 1].length

            if (this.dataLengthRef !== dataLengthRef) {
                this.dataLengthRef = dataLengthRef
                this.processGrowData(this.props.rawGrowData)
            } else if (!this.state.TABLE_INIT) {
                // Gotta get this process in the first time for things to go smooth... not quite sure why.
                this.dataLengthRef = dataLengthRef
                this.processGrowData(this.props.rawGrowData)
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

        var now = new Date().getTime()

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
        var SENSOR_PIDS = []
        if (this.state.SENSORS_INIT === false && this.props.grow.config.SENSORS !== this.state.SENSOR_PIDS) {
            this.props.grow.config.SENSORS.forEach((sensor, key) => {

                if (SENSOR_PIDS[key] !== sensor.PID) {
                    SENSOR_PIDS[key] = sensor.PID
                }
            });

            this.setState({
                SENSOR_PIDS: SENSOR_PIDS
            });

            if (this.state.ACTIVE_INIT === false) {
                this.setState({
                    ACTIVE_LINES: SENSOR_PIDS,
                    ACTIVE_INIT: true
                });
            }
        }

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
                        //AVERAGES
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
    }

    toggleLine = (e) => {
        var pid = e.currentTarget.getAttribute('data-value')

        var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

        var tActiveLines = this.state.ACTIVE_LINES

        if (tActiveLines.includes(pid)) {
            tActiveLines[tIndex] = null
        } else {
            tActiveLines[tIndex] = pid
        }

        this.setState({ ACTIVE_LINES: tActiveLines })
        this.forceUpdate()
    }

    openCloseSettings = () => {
        if (this.state.SHOW_SETTINGS) {
            this.setState({ SHOW_SETTINGS: false })
        } else {
            this.setState({ SHOW_SETTINGS: true })
        }
    }


    render() {

        const sensorInfoRows = this.state.SENSOR_PIDS.map((pid) =>
            <div className="Grow-Details-Main-Data-Display-Row" key={pid}>

                {(() => {
                    var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                    if (this.state.ACTIVE_LINES.includes(pid)) {
                        if (this.props.grow.config.SENSORS[tIndex].type === "airTemp") {
                            return (<div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em', cursor: 'pointer', color: this.props.grow.config.SENSORS[tIndex].color }}  >
                                {this.props.grow.config.SENSORS[tIndex].name} <WiThermometer style={{ color: '#FFF', fontSize: '30px' }} />
                            </div>)
                        } else if (this.props.grow.config.SENSORS[tIndex].type === "humidity") {
                            return (<div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em', cursor: 'pointer', color: this.props.grow.config.SENSORS[tIndex].color }}>
                                {this.props.grow.config.SENSORS[tIndex].name}  <WiHumidity style={{ color: '#FFF', fontSize: '30px' }} />
                            </div>)
                        } else if (this.props.grow.config.SENSORS[tIndex].type === "fan") {
                            return (<div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em', cursor: 'pointer', color: this.props.grow.config.SENSORS[tIndex].color }}>
                                {this.props.grow.config.SENSORS[tIndex].name}  <WiHurricane style={{ color: '#FFF', fontSize: '30px' }} />
                            </div>)
                        } else if (this.props.grow.config.SENSORS[tIndex].type === "humidifier") {
                            return (<div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em', cursor: 'pointer', color: this.props.grow.config.SENSORS[tIndex].color }}>
                                {this.props.grow.config.SENSORS[tIndex].name}  <WiCloudUp style={{ color: '#FFF', fontSize: '30px' }} />
                            </div>)
                        } else if (this.props.grow.config.SENSORS[tIndex].type === "waterTemp") {
                            return (<div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em', cursor: 'pointer', color: this.props.grow.config.SENSORS[tIndex].color }}>
                                {this.props.grow.config.SENSORS[tIndex].name}  <WiThermometerExterior style={{ color: '#FFF', fontSize: '30px' }} />
                            </div>)
                        } else {
                            return (<div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em', cursor: 'pointer', color: this.props.grow.config.SENSORS[tIndex].color }}>
                                {this.props.grow.config.SENSORS[tIndex].name}
                            </div>)
                        }
                    } else {
                        if (this.props.grow.config.SENSORS[tIndex].type === "airTemp") {
                            return (<div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em', cursor: 'pointer', opacity: '0.5' }}>
                                {this.props.grow.config.SENSORS[tIndex].name} <WiThermometer style={{ color: '#FFF', fontSize: '30px' }} />
                            </div>)
                        } else if (this.props.grow.config.SENSORS[tIndex].type === "humidity") {
                            return (<div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em', cursor: 'pointer', opacity: '0.5' }}>
                                {this.props.grow.config.SENSORS[tIndex].name}  <WiHumidity style={{ color: '#FFF', fontSize: '30px' }} />
                            </div>)
                        } else if (this.props.grow.config.SENSORS[tIndex].type === "fan") {
                            return (<div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em', cursor: 'pointer', opacity: '0.5' }}>
                                {this.props.grow.config.SENSORS[tIndex].name}  <WiHurricane style={{ color: '#FFF', fontSize: '30px' }} />
                            </div>)
                        } else if (this.props.grow.config.SENSORS[tIndex].type === "humidifier") {
                            return (<div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em', cursor: 'pointer', opacity: '0.5' }}>
                                {this.props.grow.config.SENSORS[tIndex].name}  <WiCloudUp style={{ color: '#FFF', fontSize: '30px' }} />
                            </div>)
                        } else if (this.props.grow.config.SENSORS[tIndex].type === "waterTemp") {
                            return (<div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em', cursor: 'pointer', opacity: '0.5' }}>
                                {this.props.grow.config.SENSORS[tIndex].name}  <WiThermometerExterior style={{ color: '#FFF', fontSize: '30px' }} />
                            </div>)
                        } else {
                            return (<div data-value={pid} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em', cursor: 'pointer', opacity: '0.5' }}>
                                {this.props.grow.config.SENSORS[tIndex].name}
                            </div>)
                        }
                    }


                })()}

                <div className="Grow-Details-Main-Data-Current-Data">
                    {(() => {
                        if (this.state.liveData[pid] > this.state.lastLiveData[pid]) {
                            return <div style={{ fontSize: '14px', color: '#a02525' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                        } else if (this.state.liveData[pid] < this.state.lastLiveData[pid]) {
                            return <div style={{ fontSize: '14px', color: '#242490' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                        } else {
                            return <div style={{ fontSize: '14px', visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                        }
                    })()}

                    {(() => {
                        var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                        if ((this.props.grow.config.SENSORS[tIndex].type === "airTemp" || this.props.grow.config.SENSORS[tIndex].type === "waterTemp")) {

                            return <div>{Math.round(this.state.liveData[pid] * 10) / 10}°C</div>
                        } else {
                            return <div>{Math.round(this.state.liveData[pid] * 10) / 10}%</div>
                        }
                    })()}
                </div>


                <div className="Grow-Details-Main-Data-Data" style={{ marginBottom: '1px' }}>
                    <div className="Grow-Details-Main-Yest-Data" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        {(() => {
                            var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                            if (this.state.YEST_AVGS[tIndex]) {
                                if (this.props.grow.config.SENSORS[tIndex].type === "airTemp" || this.props.grow.config.SENSORS[tIndex].type === "waterTemp") {
                                    return Math.round(this.state.YEST_AVGS[tIndex] * 10) / 10 + '°C'
                                } else {
                                    return Math.round(this.state.YEST_AVGS[tIndex] * 10) / 10 + '%'
                                }
                            }
                        })()}


                        {(() => {
                            var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                            if (this.state.DAILY_AVGS[tIndex] && this.state.YEST_AVGS[tIndex]) {

                                if (this.state.DAILY_AVGS[tIndex] > this.state.YEST_AVGS[tIndex]) {
                                    return <div style={{ color: '#FFF' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                } else if (this.state.DAILY_AVGS[tIndex] < this.state.YEST_AVGS[tIndex]) {
                                    return <div style={{ color: '#FFF' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                } else {
                                    return <div style={{ visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                }
                            }
                        })()}
                    </div>


                    {(() => {
                        var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                        if (this.state.DAILY_AVGS[tIndex]) {
                            if (this.props.grow.config.SENSORS[tIndex].type === "airTemp" || this.props.grow.config.SENSORS[tIndex].type === "waterTemp") {
                                return Math.round(this.state.DAILY_AVGS[tIndex] * 10) / 10 + '°C'
                            } else {
                                return Math.round(this.state.DAILY_AVGS[tIndex] * 10) / 10 + '%'
                            }
                        }
                    })()}
                </div>


                <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#c77725', marginBottom: '1px' }}>
                    <div className="Grow-Details-Main-Data-Time">
                        {(() => {
                            var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                            if (this.state.DAILY_HIGHS_TIMES) {
                                var m = moment(this.state.DAILY_HIGHS_TIMES[tIndex])
                                return m.format('HH:mm')
                            }
                        })()}
                    </div>

                    {(() => {
                        var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                        if (this.state.DAILY_HIGHS) {
                            if (this.props.grow.config.SENSORS[tIndex].type === "airTemp" || this.props.grow.config.SENSORS[tIndex].type === "waterTemp") {
                                return Math.round(this.state.DAILY_HIGHS[tIndex] * 10) / 10 + '°C'
                            } else {
                                return Math.round(this.state.DAILY_HIGHS[tIndex] * 10) / 10 + '%'
                            }
                        }
                    })()}
                </div>

                <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#2584c7', marginBottom: '1px' }}>
                    <div className="Grow-Details-Main-Data-Time">
                        {(() => {
                            var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                            if (this.state.DAILY_LOWS_TIMES) {
                                var m = moment(this.state.DAILY_LOWS_TIMES[tIndex])
                                return m.format('HH:mm')
                            }
                        })()}
                    </div>

                    {(() => {
                        var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                        if (this.state.DAILY_LOWS) {
                            if (this.props.grow.config.SENSORS[tIndex].type === "airTemp" || this.props.grow.config.SENSORS[tIndex].type === "waterTemp") {
                                return Math.round(this.state.DAILY_LOWS[tIndex] * 10) / 10 + '°C'
                            } else {
                                return Math.round(this.state.DAILY_LOWS[tIndex] * 10) / 10 + '%'
                            }
                        }
                    })()}
                </div>
            </div>
        );



        // MAIN RENDER RETURN
        return (
            <div className="Grow-Details-Page">

                <div className="Grow-Details-Page-Content">

                    <div className="Grow-Details-Content-Bottom">
                        <div className="Grow-Details-Header">
                            <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                                <div className={this.state.activeIndicatorStyle} />
                                <div id="Grow-Header-Text">{this.props.grow.name}</div>
                            </div>
                            <div onClick={() => this.openCloseSettings()} style={{ paddingRight: '30px', color: '#A9A9A9', userSelect: 'none', cursor: 'pointer' }}>
                                <BsGearFill style={{ color: '#9e9e9e', fontSize: '22px', marginTop: '10px' }} />
                            </div>
                        </div>
                        <div className="Grow-Details-Bottom-Item" >
                            <GrowDetailsGraphs activeLines={this.state.ACTIVE_LINES} rawGrowData={this.props.rawGrowData} grow={this.props.grow} />
                        </div>
                    </div>

                    {(() => {
                        if (this.state.SHOW_SETTINGS) {
                            return (
                                <GrowSettings grow={this.props.grow} close={this.openCloseSettings} />
                            )
                        }
                    })()}

                    <div className="Grow-Details-Page-Panel">
                        <div id="Grow-Details-Data-Display">
                            {(() => {
                                if (this.state.liveData) {
                                    return (
                                        <div id="Grow-Details-Main-Data-Display">
                                            <div className="Grow-Details-Headers-Display-Row">
                                                <div className="Grow-Details-Main-Data-Row-Header" style={{ color: '#FFF', width: '120px', maxWidth: '120px' }}></div>
                                                <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '86px', maxWidth: '86px' }}></div>
                                                <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '60px', maxWidth: '60px' }}>24h~</div>
                                                <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '60px', maxWidth: '60px' }}>24h&#8593;</div>
                                                <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '60px', maxWidth: '60px' }}>24h&#8595;</div>
                                            </div>

                                            {sensorInfoRows}

                                        </div>
                                    )
                                }
                            })()}
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default GrowDetailsPage;
