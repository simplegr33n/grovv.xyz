import React, { Component } from 'react';
import '../../../styles/App.css';


import GrowDetailsConfig from './GrowDetailsConfig'
import GrowDetailsGraphs from './GrowDetailsGraphs'

import JournalBoxItem from '../GrowJournal/JournalBoxItem'


import DbHelper from '../../_utils/DbHelper.js'


import moment from 'moment'

import { WiThermometer, WiHumidity, WiHurricane, WiCloudUp, WiThermometerExterior } from 'react-icons/wi';



class GrowDetailsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayBottom: 'data', // data, config, feed, edit-feed, journals
            activeIndicatorStyle: 'Grow-Active-Indicator-Circle',
            linkedJournals: [],
            camURL: null,
            growConfig: null,

            SENSOR_PIDS: [],

            DAILY_HIGHS: [],
            DAILY_HIGHS_TIMES: [],
            DAILY_LOWS: [],
            DAILY_LOWS_TIMES: [],
            DAILY_AVGS: [],
            YEST_AVGS: []
        };

        this.dbHelper = new DbHelper(); // Need for linked journals

    }

    componentDidMount() {
        this._ismounted = true;

        if (this.props.grow.id) {
            this.getConfig()
        }

        if (this.props.grow.urls.cam) {
            if (this._ismounted) {
                this.setState({ camURL: this.props.grow.urls.cam });
            }
        }

        if (this.props.rawGrowData) {
            if (!this.props.rawGrowData[this.props.grow.id]) {
                return;
            }

            var dataLengthRef = this.props.rawGrowData[this.props.grow.id][this.props.rawGrowData[this.props.grow.id].length - 1].length

            if (this.dataLengthRef !== dataLengthRef) {
                this.dataLengthRef = dataLengthRef
                this.processGrowData(this.props.rawGrowData)
            }
        }

        this.getLinkedJournals(this.props.grow.journals, this.setLinkedJournals)
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

        var SENSOR_PIDS = []

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

        // DEFINING SENSOR INFO
        if (this.props.grow.config.SENSORS) {
            this.props.grow.config.SENSORS.forEach((sensor, key) => {
                console.log("key: " + key + ", sensor: " + sensor.name);

                if (SENSOR_PIDS[key] !== sensor.PID) {
                    SENSOR_PIDS[key] = sensor.PID
                }

            });
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
                        DAILY_AVGS[tIndex] += parseFloat(dataPoint[pid])

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
                        YEST_AVGS[yIndex] += parseFloat(dataPoint[pid])

                    }

                }

            }
        })
        // ACTUALLY AVERAGE THEM...
        console.log("DAILY!")
        console.log(DAILY_AVGS)
        console.log("YEST!")
        console.log(YEST_AVGS)

        this.setState({
            SENSOR_PIDS: SENSOR_PIDS,

            DAILY_HIGHS: DAILY_HIGHS,
            DAILY_HIGHS_TIMES: DAILY_HIGHS_TIMES,
            DAILY_LOWS: DAILY_LOWS,
            DAILY_LOWS_TIMES: DAILY_LOWS_TIMES,
            DAILY_AVGS: DAILY_AVGS,
            YEST_AVGS: YEST_AVGS
        });

    }






    // TODO: remove function
    watchPiCam = () => {
        var tempURL = this.props.grow.urls.cam + 'cam_pic.php?time='

        var i = 0
        setInterval(() => {
            i++
            var tempCamURL = tempURL + i.toString()
            if (this._ismounted) {
                this.setState({
                    camURL: tempCamURL
                });
            }
        }, 5000);
    }


    getLinkedJournals = (key, journals, setData) => {
        this.dbHelper.getLinkedJournals(key, journals, setData)
    }


    setLinkedJournals = (data) => {
        if (this._ismounted) {
            this.setState({
                linkedJournals: data
            });
        }
    }



    checkActive = (lastUpdateTime) => {

        if (lastUpdateTime) {
            var now = new Date();
            var difference = now - (new Date(lastUpdateTime).getTime())

            if (this._ismounted) {

                if (difference >= 120000) {
                    this.setState({
                        activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Warning-Background'
                    });
                }

                if (difference >= 240000) {
                    this.setState({
                        activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Danger-Background'
                    });
                }

                if (difference < 120000) {
                    this.setState({
                        activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Optimal-Background'
                    });
                }
            }

        } else {
            console.log("NO LAST UPDATE ERROR")
        }

    }

    openJournals = () => {
        console.log("GROWDETAILS OPEN JOURNALS!")
        if (this._ismounted) {
            this.setState({
                displayBottom: 'journals'
            });
        }
    }
    openData = () => {
        console.log("GROWDETAILS OPEN DATA")
        if (this._ismounted) {
            this.setState({
                displayBottom: 'data'
            });
        }
    }
    openConfig = () => {
        console.log("GROWDETAILS OPEN CONFIG")
        if (this._ismounted) {
            this.setState({
                displayBottom: 'config'
            });
        }
    }
    openFeed = () => {
        if (this._ismounted) {
            console.log("GROWDETAILS OPEN FEED")
            this.setState({
                displayBottom: 'feed'
            });
        }

    }
    openEditFeed = () => {
        if (this._ismounted) {
            console.log("GROWDETAILS OPEN EDIT FEED")
            this.setState({
                displayBottom: 'edit-feed'
            });
        }

    }

    openFullCam = (ev) => {
        this.props.openFullCam(ev.target.dataset.value)
    }

    openJournal = (journal) => {
        console.log("TODO: GrowDetailsPage open journal")
        console.log(journal)
        this.props.setJournalID(journal.id);
    }

    getConfig = () => {
        this.dbHelper.watchGrowConfig(this.props.grow.id, this.setConfig)
    }

    setConfig = (config) => {
        this.setState({ growConfig: config })
    }


    render() {
        //TODO: below in less code... or not using zIndex.
        var zIndexOne = { zIndex: '1', position: 'absolute' }
        var zIndexZero = { zIndex: '0', position: 'absolute' }

        var journalsStyle = zIndexOne
        var graphsStyle = zIndexZero
        var feedStyle = zIndexZero
        var editFeedStyle = zIndexZero
        var configStyle = zIndexZero

        if (this.state.displayBottom) {
            switch (this.state.displayBottom) {
                case 'journals':
                    journalsStyle = zIndexOne
                    graphsStyle = zIndexZero
                    feedStyle = zIndexZero
                    editFeedStyle = zIndexZero
                    configStyle = zIndexZero
                    break;
                case 'data':
                    journalsStyle = zIndexZero
                    graphsStyle = zIndexOne
                    feedStyle = zIndexZero
                    editFeedStyle = zIndexZero
                    configStyle = zIndexZero
                    break;
                case 'feed':
                    journalsStyle = zIndexZero
                    graphsStyle = zIndexZero
                    feedStyle = zIndexOne
                    editFeedStyle = zIndexZero
                    configStyle = zIndexZero
                    break;
                case 'edit-feed':
                    journalsStyle = zIndexZero
                    graphsStyle = zIndexZero
                    feedStyle = zIndexZero
                    editFeedStyle = zIndexOne
                    configStyle = zIndexZero
                    break;
                case 'config':
                    journalsStyle = zIndexZero
                    graphsStyle = zIndexZero
                    feedStyle = zIndexZero
                    editFeedStyle = zIndexZero
                    configStyle = zIndexOne
                    break;
                default:
                    break;
            }
        }

        var renderedLinkedJournals = null;
        if (this.state.linkedJournals.length !== 0) {
            renderedLinkedJournals = this.state.linkedJournals.map((journal) =>
                <div key={journal.id} className="Journal-Box-Item-Container">
                    <JournalBoxItem journal={journal} openJournal={this.openJournal} />
                </div>
            )
        }

        const listItems = this.state.SENSOR_PIDS.map((pid) =>
            <div className="Grow-Details-Main-Data-Display-Row">

                {(() => {
                    var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                    if (this.props.grow.config.SENSORS[tIndex].type === "airTemp") {
                        return (<div style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em' }}>
                            {this.props.grow.config.SENSORS[tIndex].name} <WiThermometer style={{ color: '#FFF', fontSize: '30px' }} />
                        </div>)
                    } else if (this.props.grow.config.SENSORS[tIndex].type === "humidity") {
                        return (<div style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em' }}>
                            {this.props.grow.config.SENSORS[tIndex].name}  <WiHumidity style={{ color: '#FFF', fontSize: '30px' }} />
                        </div>)
                    } else if (this.props.grow.config.SENSORS[tIndex].type === "fan") {
                        return (<div style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em' }}>
                            {this.props.grow.config.SENSORS[tIndex].name}  <WiHurricane style={{ color: '#FFF', fontSize: '30px' }} />
                        </div>)
                    } else if (this.props.grow.config.SENSORS[tIndex].type === "humidifier") {
                        return (<div style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em' }}>
                            {this.props.grow.config.SENSORS[tIndex].name}  <WiCloudUp style={{ color: '#FFF', fontSize: '30px' }} />
                        </div>)
                    } else if (this.props.grow.config.SENSORS[tIndex].type === "waterTemp") {
                        return (<div style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em' }}>
                            {this.props.grow.config.SENSORS[tIndex].name}  <WiThermometerExterior style={{ color: '#FFF', fontSize: '30px' }} />
                        </div>)
                    } else {
                        return (<div style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.7em' }}>
                            {this.props.grow.config.SENSORS[tIndex].name}
                        </div>)
                    }
                })()}

                <div className="Grow-Details-Main-Data-Current-Data">
                    {(() => {
                        if (this.state.liveData[pid] > this.state.lastLiveData.sA1_Temp[pid]) {
                            return <div style={{ fontSize: '14px', color: '#a02525' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                        } else if (this.state.liveData[pid] < this.state.lastLiveData[pid]) {
                            return <div style={{ fontSize: '14px', color: '#242490' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                        } else {
                            return <div style={{ fontSize: '14px', visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                        }
                    })()}

                    {(() => {
                        var tIndex = this.state.SENSOR_PIDS.indexOf(pid)

                        if (this.props.grow.config.SENSORS[tIndex].type === "airTemp" || this.props.grow.config.SENSORS[tIndex].type === "waterTemp") {
                            return <div>{Math.round(this.state.liveData[pid] * 10) / 10}°C</div>
                        } else {
                            return <div>{Math.round(this.state.liveData[pid] * 10) / 10}%</div>
                        }
                    })()}
                </div>


                <div className="Grow-Details-Main-Data-Data" style={{ marginBottom: '1px' }}>
                    <div className="Grow-Details-Main-Yest-Data" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        {(() => {
                            if (this.state.yestTempAVG) {
                                return Math.round(this.state.yestTempAVG * 10) / 10 + '°C'
                            }
                        })()}


                        {(() => {
                            if (this.state.tempAVG && this.state.yestTempAVG) {
                                if (this.state.tempAVG > this.state.yestTempAVG) {
                                    return <div style={{ color: '#FFF' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                } else if (this.state.tempAVG < this.state.yestTempAVG) {
                                    return <div style={{ color: '#FFF' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                } else {
                                    return <div style={{ visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                }
                            }
                        })()}
                    </div>

                    {(() => {
                        if (this.state.tempAVG) {
                            return Math.round(this.state.tempAVG * 10) / 10 + '°C'
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

                    {/* <div className="Grow-Details-Bottom-Btns">
                        <button className="Grow-Box-Function-Btn" data-value={'data'} onClick={this.openData} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
                        <button className="Grow-Box-Function-Btn" data-value={'journals'} onClick={this.openJournals} >JRNLS <span role="img" aria-label="journal">&#128214;</span></button>
                        <button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openConfig} >CNFG <span role="img" aria-label="grow config icon">&#128187;</span></button>
                        <button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openFeed} >FEED &#9619;&#9619;</button>
                        <button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openEditFeed} >&#9998;</button>
                    </div> */}

                    <div className="Grow-Details-Content-Bottom">

                        <div className="Grow-Details-Bottom-Item" style={journalsStyle} >
                            <div className="Grow-Details-Journals">

                                <div className="Grow-Details-Journals-Header">Connected Journals</div>
                                <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
                                    {renderedLinkedJournals}
                                </div>

                            </div>
                        </div>

                        <div className="Grow-Details-Bottom-Item" style={graphsStyle} >
                            <GrowDetailsGraphs growID={this.props.grow.id} rawGrowData={this.props.rawGrowData} growConfig={this.state.growConfig} grow={this.props.grow} />
                        </div>

                        <div className="Grow-Details-Bottom-Item" style={feedStyle} >
                            <iframe id="Food-Chart" title="FoodChart" src={this.props.grow.urls.feed_chart} />
                        </div>

                        <div className="Grow-Details-Bottom-Item" style={editFeedStyle} >
                            <object id="Edit-Food-Chart" type="text/html" data={this.props.grow.urls.feed_edit} width="100%" height="100%" aria-label="edit food chart" />
                        </div>

                        <div className="Grow-Details-Bottom-Item" style={configStyle} >
                            <GrowDetailsConfig growID={this.props.grow.id} />
                        </div>

                    </div>


                    <div className="Grow-Details-Page-Panel">
                        <div className="Grow-Details-Header">
                            <div className={this.state.activeIndicatorStyle} />
                            <div id="Grow-Header-Text">{this.props.grow.name}</div>
                        </div>


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


                                            {listItems}


                                        </div>
                                    )
                                }
                            })()}
                        </div>



                    </div>



                </div>

            </div>
        );
    }
}

export default GrowDetailsPage;
