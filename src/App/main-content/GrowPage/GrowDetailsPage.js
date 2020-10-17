import React, { Component } from 'react';
import '../../../styles/App.css';

import GrowDetailsGraphs from './GrowDetailsGraphs'
import GrowDataDisplay from './GrowDataDisplay'
import GrowSettings from './GrowSettings';


import DbHelper from '../../_utils/DbHelper.js'


import moment from 'moment'

import { WiThermometer, WiHumidity, WiHurricane, WiCloudUp, WiThermometerExterior } from 'react-icons/wi';
import { BsGearFill } from 'react-icons/bs';
import co2svg from '../../../assets/co2svg.svg'
import tvocSvg from '../../../assets/tvoc-svg.svg'


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



        if (this.props.grow && !this.state.SENSOR_DEVIATIONS) {
            var SENSOR_DEVIATIONS = []
            var SENSOR_MEANS = []

            for (const [key, value] of Object.entries(this.props.grow.config.SENSORS)) {
                SENSOR_DEVIATIONS[value.PID] = value._deviation
                SENSOR_MEANS[value.PID] = value._mean
            }

            this.setState({
                SENSOR_DEVIATIONS: SENSOR_DEVIATIONS,
                SENSOR_MEANS: SENSOR_MEANS
            })
        }



        if (this.props.rawGrowData && this.state.SENSOR_PIDS && this.state.SENSOR_MEANS) {
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

            if (this.props.grow !== this.state.GROW) {
                console.log("FRESH GROW!", this.props.grow.id)
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
                    ACTIVE_LINES: SENSOR_PIDS,
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


        this.processDeviationData(concatData, now)

    }

    processDeviationData = (concatData, now) => {
        var HARMONY_POINT_COUNT = []
        var HARMONY_PLUS_ONE_COUNT = []
        var HARMONY_PLUS_TWO_COUNT = []

        // INITIALIZING SENSOR INFO
        // get all sensor pids...   ?
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
                        console.log("PLUS2in" + pid, dataPoint[pid] + " " + sensor._mean + " " + sensor._deviation)
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

            this.harmonyRatiosUpdated = new Date().valueOf()

            for (const [key, value] of Object.entries(HARMONY_PLUS_ONE_COUNT)) {
                HARMONY_PLUS_ONE_COUNT[key] = Math.round((HARMONY_PLUS_ONE_COUNT[key] / HARMONY_POINT_COUNT[key]) * 100)
            }

            for (const [key, value] of Object.entries(HARMONY_PLUS_TWO_COUNT)) {
                HARMONY_PLUS_TWO_COUNT[key] = Math.round((HARMONY_PLUS_TWO_COUNT[key] / HARMONY_POINT_COUNT[key]) * 100)
            }

            console.log("UPDATED HARMONY RATIOS!", + "" + " " + " ")

            this.setState({
                HARMONY_DANGER: HARMONY_PLUS_TWO_COUNT,
                HARMONY_WARN: HARMONY_PLUS_ONE_COUNT
            });
        }
    }

    toggleLine = (rawPid) => {
        // var pid = e.currentTarget.getAttribute('data-value')

        var pid = rawPid.split("^")[0]

        console.log("DETAILS  PID", pid)


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

        // MAIN RENDER RETURN
        return (
            <div className="Grow-Details-Page">
                <div className="Grow-Details-Page-Content">
                    <div className="Grow-Details-Content-Bottom">
                        <div className="Grow-Details-Header">
                            <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                                <div style={{ color: indicatorColor, marginLeft: '1px', fontSize: '1.1em' }}>
                                    ⬤
                                </div>
                                <div id="Grow-Header-Text">{this.props.grow.name}</div>
                            </div>
                            <div onClick={() => this.openCloseSettings()} style={{ paddingRight: '30px', color: '#A9A9A9', userSelect: 'none', cursor: 'pointer' }}>
                                <BsGearFill style={{ color: '#9e9e9e', fontSize: '22px', marginTop: '8px' }} />
                            </div>
                        </div>
                        <div className="Grow-Details-Bottom-Item" >
                            <GrowDetailsGraphs activeLines={this.state.ACTIVE_LINES} rawGrowData={this.props.rawGrowData} grow={this.props.grow} />
                        </div>
                    </div>

                    {(() => {
                        if (this.state.SHOW_SETTINGS) {
                            return (
                                <GrowSettings grow={this.props.grow} refreshGrows={this.props.refreshGrows} close={this.openCloseSettings} />
                            )
                        }
                    })()}

                    <div className="Grow-Details-Page-Panel">
                        <div id="Grow-Details-Data-Display">
                            <GrowDataDisplay grow={this.props.grow} toggleLine={this.toggleLine} threeDayData={this.props.rawGrowData} liveGrowData={this.props.liveGrowData} user={this.props.user} activeLines={this.state.ACTIVE_LINES} />
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default GrowDetailsPage;
