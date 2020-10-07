import React, { Component } from 'react';
import '../../../styles/App.css';


import GrowDetailsConfig from './GrowDetailsConfig'
import GrowDetailsGraphs from './GrowDetailsGraphs'

import JournalBoxItem from '../GrowJournal/JournalBoxItem'


import DbHelper from '../../_utils/DbHelper.js'


import moment from 'moment'

import { WiThermometer, WiHumidity, WiHurricane, WiSprinkle } from 'react-icons/wi';



class GrowDetailsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayBottom: 'data', // data, config, feed, edit-feed, journals
            activeIndicatorStyle: 'Grow-Active-Indicator-Circle',
            linkedJournals: [],
            camURL: null,
            growConfig: null
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

            // if (!(this.props.rawGrowData[this.props.grow.id][this.props.rawGrowData[this.props.grow.id].length - 1])) {
            //     return;
            // }

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

        var highTemp = []
        var lowTemp = []
        var highHumidity = []
        var lowHumidity = []
        var highTemp2 = []
        var lowTemp2 = []
        var highHumi2 = []
        var lowHumi2 = []
        var highTemp3 = []
        var lowTemp3 = []
        var highHumi3 = []
        var lowHumi3 = []

        var highFan = []
        var lowFan = []
        var highHumidifier = []
        var lowHumidifier = []

        var dataPointCount = 0
        var tempAVG = 0
        var humidityAVG = 0
        var temp2AVG = 0
        var humidity2AVG = 0
        var temp3AVG = 0
        var humidity3AVG = 0
        var fanAVG = 0
        var humidifierAVG = 0

        var yestPointCount = 0
        var yestTempAVG = 0
        var yestHumidityAVG = 0
        var yestTemp2AVG = 0
        var yestHumidity2AVG = 0
        var yestTemp3AVG = 0
        var yestHumidity3AVG = 0
        var yestFanAVG = 0
        var yestHumidifierAVG = 0

        var now = new Date().getTime()


        var lastDayData = []

        var yesterdayData = []

        concatData.forEach((dataPoint) => {
            if (now - dataPoint.time < 86400000) {
                dataPointCount += 1

                lastDayData[lastDayData.length] = dataPoint
                if (dataPoint.cTemp) {
                    if (!highTemp[0] || parseFloat(dataPoint.cTemp) >= highTemp[0]) {
                        highTemp[0] = dataPoint.cTemp
                        highTemp[1] = dataPoint.time
                    }

                    if (!lowTemp[0] || parseFloat(dataPoint.cTemp) <= lowTemp[0]) {
                        lowTemp[0] = dataPoint.cTemp
                        lowTemp[1] = dataPoint.time
                    }
                    tempAVG += parseFloat(dataPoint.cTemp)
                }
                if (dataPoint.s2Temp) {
                    if (!highTemp2[0] || parseFloat(dataPoint.s2Temp) >= highTemp2[0]) {
                        highTemp2[0] = dataPoint.s2Temp
                        highTemp2[1] = dataPoint.time
                    }

                    if (!lowTemp2[0] || parseFloat(dataPoint.s2Temp) <= lowTemp2[0]) {
                        lowTemp2[0] = dataPoint.s2Temp
                        lowTemp2[1] = dataPoint.time
                    }
                    temp2AVG += parseFloat(dataPoint.s2Temp)
                }
                if (dataPoint.s3Temp) {
                    if (!highTemp3[0] || parseFloat(dataPoint.s3Temp) >= highTemp3[0]) {
                        highTemp3[0] = dataPoint.s3Temp
                        highTemp3[1] = dataPoint.time
                    }

                    if (!lowTemp3[0] || parseFloat(dataPoint.s3Temp) <= lowTemp3[0]) {
                        lowTemp3[0] = dataPoint.s3Temp
                        lowTemp3[1] = dataPoint.time
                    }
                    temp3AVG += parseFloat(dataPoint.s3Temp)
                }
                if (dataPoint.humidity) {
                    if (!highHumidity[0] || parseFloat(dataPoint.humidity) >= highHumidity[0]) {
                        highHumidity[0] = dataPoint.humidity
                        highHumidity[1] = dataPoint.time
                    }

                    if (!lowHumidity[0] || parseFloat(dataPoint.humidity) <= lowHumidity[0]) {
                        lowHumidity[0] = dataPoint.humidity
                        lowHumidity[1] = dataPoint.time
                    }

                    humidityAVG += parseFloat(dataPoint.humidity)
                }
                if (dataPoint.s2Humi) {
                    if (!highHumi2[0] || parseFloat(dataPoint.s2Humi) >= highHumi2[0]) {
                        highHumi2[0] = dataPoint.s2Humi
                        highHumi2[1] = dataPoint.time
                    }

                    if (!lowHumi2[0] || parseFloat(dataPoint.s2Humi) <= lowHumi2[0]) {
                        lowHumi2[0] = dataPoint.s2Humi
                        lowHumi2[1] = dataPoint.time
                    }
                    humidity2AVG += parseFloat(dataPoint.s2Humi)
                }
                if (dataPoint.s3Humi) {
                    if (!highHumi3[0] || parseFloat(dataPoint.s3Humi) >= highHumi3[0]) {
                        highHumi3[0] = dataPoint.s3Humi
                        highHumi3[1] = dataPoint.time
                    }

                    if (!lowHumi3[0] || parseFloat(dataPoint.s3Humi) <= lowHumi3[0]) {
                        lowHumi3[0] = dataPoint.s3Humi
                        lowHumi3[1] = dataPoint.time
                    }
                    humidity3AVG += parseFloat(dataPoint.s3Humi)
                }


                if (dataPoint.fanSpeed) {
                    if (!highFan[0] || parseFloat(dataPoint.fanSpeed) >= highFan[0]) {
                        highFan[0] = dataPoint.fanSpeed
                        highFan[1] = dataPoint.time
                    }

                    if (!lowFan[0] || parseFloat(dataPoint.fanSpeed) <= lowFan[0]) {
                        lowFan[0] = dataPoint.fanSpeed
                        lowFan[1] = dataPoint.time
                    }
                    fanAVG += parseFloat(dataPoint.fanSpeed)
                }
                if (dataPoint.humiPower) {
                    if (highHumidifier[0] === undefined || parseFloat(dataPoint.humiPower) >= highHumidifier[0]) {
                        highHumidifier[0] = dataPoint.humiPower
                        highHumidifier[1] = dataPoint.time
                    }

                    if (!lowHumidifier[0] || parseFloat(dataPoint.humiPower) <= lowHumidifier[0]) {
                        lowHumidifier[0] = dataPoint.humiPower
                        lowHumidifier[1] = dataPoint.time
                    }
                    humidifierAVG += parseFloat(dataPoint.humiPower)
                }
            }

            if ((now - dataPoint.time < (86400000 * 2)) && (now - dataPoint.time > 86400000)) {
                yestPointCount += 1

                yesterdayData[yesterdayData.length] = dataPoint

                if (dataPoint.cTemp) {
                    yestTempAVG += parseFloat(dataPoint.cTemp)
                }
                if (dataPoint.humidity) {
                    yestHumidityAVG += parseFloat(dataPoint.humidity)
                }
                if (dataPoint.s2Temp) {
                    yestTemp2AVG += parseFloat(dataPoint.s2Temp)
                }
                if (dataPoint.s2Humi) {
                    yestHumidity2AVG += parseFloat(dataPoint.s2Humi)
                }
                if (dataPoint.s3Temp) {
                    yestTemp3AVG += parseFloat(dataPoint.s3Temp)
                }
                if (dataPoint.s3Humi) {
                    yestHumidity3AVG += parseFloat(dataPoint.s3Humi)
                }
                if (dataPoint.fanSpeed) {
                    yestFanAVG += parseFloat(dataPoint.fanSpeed)
                }
                if (dataPoint.humiPower) {
                    yestHumidifierAVG += parseFloat(dataPoint.humiPower)
                }

            }

        })

        tempAVG = tempAVG / dataPointCount
        humidityAVG = humidityAVG / dataPointCount

        temp2AVG = temp2AVG / dataPointCount
        humidity2AVG = humidity2AVG / dataPointCount

        temp3AVG = temp3AVG / dataPointCount
        humidity3AVG = humidity3AVG / dataPointCount

        fanAVG = fanAVG / dataPointCount
        humidifierAVG = humidifierAVG / dataPointCount

        yestTempAVG = yestTempAVG / yestPointCount
        yestHumidityAVG = yestHumidityAVG / yestPointCount
        yestFanAVG = yestFanAVG / yestPointCount
        yestHumidifierAVG = yestHumidifierAVG / yestPointCount

        this.setState({
            highTemp: highTemp,
            lowTemp: lowTemp,
            highTemp2: highTemp2,
            lowTemp2: lowTemp2,
            highTemp3: highTemp3,
            lowTemp3: lowTemp3,
            highFan: highFan,
            lowFan: lowFan,
            highHumidity: highHumidity,
            lowHumidity: lowHumidity,
            highHumi2: highHumi2,
            lowHumi2: lowHumi2,
            highHumi3: highHumi3,
            lowHumi3: lowHumi3,
            highHumidifier: highHumidifier,
            lowHumidifier: lowHumidifier,
            tempAVG: tempAVG,
            humidityAVG: humidityAVG,
            fanAVG: fanAVG,
            humidifierAVG: humidifierAVG,
            yestTempAVG: yestTempAVG,
            yestHumidityAVG: yestHumidityAVG,
            yestTemp2AVG: yestTemp2AVG,
            yestHumidity2AVG: yestHumidity2AVG,
            yestTemp3AVG: yestTemp3AVG,
            yestHumidity3AVG: yestHumidity3AVG,
            yestFanAVG: yestFanAVG,
            yestHumidifierAVG: yestHumidifierAVG

        })

        console.log("lastDayData")
        console.log(lastDayData)

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

        return (
            <div className="Grow-Details-Page">

                <div className="Grow-Details-Page-Content">

                    <div className="Grow-Details-Bottom-Btns">
                        <button className="Grow-Box-Function-Btn" data-value={'data'} onClick={this.openData} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
                        <button className="Grow-Box-Function-Btn" data-value={'journals'} onClick={this.openJournals} >JRNLS <span role="img" aria-label="journal">&#128214;</span></button>
                        <button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openConfig} >CNFG <span role="img" aria-label="grow config icon">&#128187;</span></button>
                        <button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openFeed} >FEED &#9619;&#9619;</button>
                        <button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openEditFeed} >&#9998;</button>
                    </div>

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
                            <GrowDetailsGraphs growID={this.props.grow.id} rawGrowData={this.props.rawGrowData} growConfig={this.state.growConfig} />
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
                                                <div className="Grow-Details-Main-Data-Row-Header" style={{ color: '#FFF', width: '100px', maxWidth: '100px' }}></div>
                                                <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '86px', maxWidth: '86px' }}></div>
                                                <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '60px', maxWidth: '60px' }}>24h~</div>
                                                <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '60px', maxWidth: '60px' }}>24h&#8593;</div>
                                                <div className="Grow-Details-Main-Data-Row-Header" style={{ width: '60px', maxWidth: '60px' }}>24h&#8595;</div>
                                            </div>

                                            {(() => {
                                                if (this.state.liveData.cTemp) {
                                                    return (
                                                        <div className="Grow-Details-Main-Data-Display-Row">
                                                            <div style={{ width: '100px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                Temp 1 <WiThermometer style={{ color: '#FFF', fontSize: '30px' }} />
                                                            </div>
                                                            <div className="Grow-Details-Main-Data-Current-Data">
                                                                {(() => {
                                                                    if (this.state.liveData.cTemp > this.state.lastLiveData.cTemp) {
                                                                        return <div style={{ fontSize: '14px', color: '#a02525' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                    } else if (this.state.liveData.cTemp < this.state.lastLiveData.cTemp) {
                                                                        return <div style={{ fontSize: '14px', color: '#242490' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    } else {
                                                                        return <div style={{ fontSize: '14px', visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    }
                                                                })()}
                                                                {Math.round(this.state.liveData.cTemp * 10) / 10}°C
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
                                                                        if (this.state.highTemp) {
                                                                            var m = moment(this.state.highTemp[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.highTemp) {
                                                                        return Math.round(this.state.highTemp[0] * 10) / 10 + '°C'
                                                                    }
                                                                })()}




                                                            </div>

                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#2584c7', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time">
                                                                    {(() => {
                                                                        if (this.state.lowTemp) {
                                                                            var m = moment(this.state.lowTemp[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.lowTemp) {
                                                                        return Math.round(this.state.lowTemp[0] * 10) / 10 + '°C'
                                                                    }
                                                                })()}

                                                            </div>

                                                        </div>

                                                    )
                                                }
                                            })()}


                                            {(() => {
                                                if (this.state.liveData.humidity) {
                                                    return (


                                                        <div className="Grow-Details-Main-Data-Display-Row">

                                                            <div style={{ width: '100px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                Humi 1 <WiHumidity style={{ color: '#FFF', fontSize: '30px' }} />
                                                            </div>
                                                            <div className="Grow-Details-Main-Data-Current-Data">
                                                                {(() => {
                                                                    if (this.state.liveData.humidity > this.state.lastLiveData.humidity) {
                                                                        return <div style={{ fontSize: '14px', color: '#a02525' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                    } else if (this.state.liveData.humidity < this.state.lastLiveData.humidity) {
                                                                        return <div style={{ fontSize: '14px', color: '#242490' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    } else {
                                                                        return <div style={{ fontSize: '14px', visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    }
                                                                })()}
                                                                {Math.round(this.state.liveData.humidity * 10) / 10}%
                                                        </div>

                                                            <div className="Grow-Details-Main-Data-Data" style={{ marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Yest-Data" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    {(() => {
                                                                        if (this.state.yestHumidityAVG) {
                                                                            return Math.round(this.state.yestHumidityAVG * 10) / 10 + '%'
                                                                        }
                                                                    })()}

                                                                    {(() => {
                                                                        if (this.state.humidityAVG && this.state.yestHumidityAVG) {
                                                                            if (this.state.humidityAVG > this.state.yestHumidityAVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                            } else if (this.state.humidityAVG < this.state.yestHumidityAVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            } else {
                                                                                return <div style={{ visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            }
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.humidityAVG) {
                                                                        return Math.round(this.state.humidityAVG * 10) / 10 + '%'
                                                                    }
                                                                })()}
                                                            </div>




                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#c77725', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time" >
                                                                    {(() => {
                                                                        if (this.state.highHumidity) {
                                                                            var m = moment(this.state.highHumidity[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.highHumidity) {
                                                                        return Math.round(this.state.highHumidity[0] * 10) / 10 + '%'
                                                                    }
                                                                })()}
                                                            </div>

                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#2584c7', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time">
                                                                    {(() => {
                                                                        if (this.state.lowHumidity) {
                                                                            var m = moment(this.state.lowHumidity[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.lowHumidity) {
                                                                        return Math.round(this.state.lowHumidity[0] * 10) / 10 + '%'
                                                                    }
                                                                })()}
                                                            </div>

                                                        </div>

                                                    )
                                                }
                                            })()}




                                            {(() => {
                                                if (this.state.liveData.s2Temp) {
                                                    return (
                                                        <div className="Grow-Details-Main-Data-Display-Row">
                                                            <div style={{ width: '100px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                Temp 2 <WiThermometer style={{ color: '#FFF', fontSize: '30px' }} />
                                                            </div>
                                                            <div className="Grow-Details-Main-Data-Current-Data">
                                                                {(() => {
                                                                    if (this.state.liveData.s2Temp > this.state.lastLiveData.s2Temp) {
                                                                        return <div style={{ fontSize: '14px', color: '#a02525' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                    } else if (this.state.liveData.s2Temp < this.state.lastLiveData.s2Temp) {
                                                                        return <div style={{ fontSize: '14px', color: '#242490' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    } else {
                                                                        return <div style={{ fontSize: '14px', visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    }
                                                                })()}
                                                                {Math.round(this.state.liveData.s2Temp * 10) / 10}°C
                                                        </div>


                                                            <div className="Grow-Details-Main-Data-Data" style={{ marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Yest-Data" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    {(() => {
                                                                        if (this.state.yestTemp2AVG) {
                                                                            return Math.round(this.state.yestTemp2AVG * 10) / 10 + '°C'
                                                                        }
                                                                    })()}


                                                                    {(() => {
                                                                        if (this.state.temp2AVG && this.state.yestTemp2AVG) {
                                                                            if (this.state.temp2AVG > this.state.yestTemp2AVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                            } else if (this.state.tempAVG < this.state.yestTemp2AVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            } else {
                                                                                return <div style={{ visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            }
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.temp2AVG) {
                                                                        return Math.round(this.state.temp2AVG * 10) / 10 + '°C'
                                                                    }
                                                                })()}
                                                            </div>





                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#c77725', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time">
                                                                    {(() => {
                                                                        if (this.state.highTemp2) {
                                                                            var m = moment(this.state.highTemp2[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.highTemp2) {
                                                                        return Math.round(this.state.highTemp2[0] * 10) / 10 + '°C'
                                                                    }
                                                                })()}




                                                            </div>

                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#2584c7', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time">
                                                                    {(() => {
                                                                        if (this.state.lowTemp2) {
                                                                            var m = moment(this.state.lowTemp2[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.lowTemp2) {
                                                                        return Math.round(this.state.lowTemp2[0] * 10) / 10 + '°C'
                                                                    }
                                                                })()}

                                                            </div>

                                                        </div>

                                                    )
                                                }
                                            })()}


                                            {(() => {
                                                if (this.state.liveData.s2Humi) {
                                                    return (


                                                        <div className="Grow-Details-Main-Data-Display-Row">
                                                            <div style={{ width: '100px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                Humi 2 <WiHumidity style={{ color: '#FFF', fontSize: '30px' }} />
                                                            </div>
                                                            <div className="Grow-Details-Main-Data-Current-Data">
                                                                {(() => {
                                                                    if (this.state.liveData.s2Humi > this.state.lastLiveData.s2Humi) {
                                                                        return <div style={{ fontSize: '14px', color: '#a02525' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                    } else if (this.state.liveData.s2Humi < this.state.lastLiveData.s2Humi) {
                                                                        return <div style={{ fontSize: '14px', color: '#242490' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    } else {
                                                                        return <div style={{ fontSize: '14px', visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    }
                                                                })()}
                                                                {Math.round(this.state.liveData.s2Humi * 10) / 10}%
                                                        </div>

                                                            <div className="Grow-Details-Main-Data-Data" style={{ marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Yest-Data" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    {(() => {
                                                                        if (this.state.yestHumidity2AVG) {
                                                                            return Math.round(this.state.yestHumidity2AVG * 10) / 10 + '%'
                                                                        }
                                                                    })()}

                                                                    {(() => {
                                                                        if (this.state.humidity2AVG && this.state.yestHumidity2AVG) {
                                                                            if (this.state.humidity2AVG > this.state.yestHumidity2AVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                            } else if (this.state.humidity2AVG < this.state.yestHumidity2AVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            } else {
                                                                                return <div style={{ visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            }
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.humidity2AVG) {
                                                                        return Math.round(this.state.humidity2AVG * 10) / 10 + '%'
                                                                    }
                                                                })()}
                                                            </div>




                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#c77725', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time" >
                                                                    {(() => {
                                                                        if (this.state.highHumi2) {
                                                                            var m = moment(this.state.highHumi2[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.highHumi2) {
                                                                        return Math.round(this.state.highHumi2[0] * 10) / 10 + '%'
                                                                    }
                                                                })()}
                                                            </div>

                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#2584c7', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time">
                                                                    {(() => {
                                                                        if (this.state.lowHumi2) {
                                                                            var m = moment(this.state.lowHumi2[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.lowHumi2) {
                                                                        return Math.round(this.state.lowHumi2[0] * 10) / 10 + '%'
                                                                    }
                                                                })()}
                                                            </div>

                                                        </div>

                                                    )
                                                }
                                            })()}


                                            {(() => {
                                                if (this.state.liveData.s3Temp) {
                                                    return (
                                                        <div className="Grow-Details-Main-Data-Display-Row">
                                                            <div style={{ width: '100px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                Temp 3 <WiThermometer style={{ color: '#FFF', fontSize: '30px' }} />
                                                            </div>
                                                            <div className="Grow-Details-Main-Data-Current-Data">
                                                                {(() => {
                                                                    if (this.state.liveData.s3Temp > this.state.lastLiveData.s3Temp) {
                                                                        return <div style={{ fontSize: '14px', color: '#a02525' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                    } else if (this.state.liveData.s3Temp < this.state.lastLiveData.s3Temp) {
                                                                        return <div style={{ fontSize: '14px', color: '#242490' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    } else {
                                                                        return <div style={{ fontSize: '14px', visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    }
                                                                })()}
                                                                {Math.round(this.state.liveData.s3Temp * 10) / 10}°C
                                                        </div>


                                                            <div className="Grow-Details-Main-Data-Data" style={{ marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Yest-Data" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    {(() => {
                                                                        if (this.state.yestTemp3AVG) {
                                                                            return Math.round(this.state.yestTemp3AVG * 10) / 10 + '°C'
                                                                        }
                                                                    })()}


                                                                    {(() => {
                                                                        if (this.state.temp3AVG && this.state.yestTemp3AVG) {
                                                                            if (this.state.temp3AVG > this.state.yestTemp3AVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                            } else if (this.state.temp3AVG < this.state.yestTemp3AVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            } else {
                                                                                return <div style={{ visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            }
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.temp3AVG) {
                                                                        return Math.round(this.state.temp3AVG * 10) / 10 + '°C'
                                                                    }
                                                                })()}
                                                            </div>





                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#c77725', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time">
                                                                    {(() => {
                                                                        if (this.state.highTemp3) {
                                                                            var m = moment(this.state.highTemp3[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.highTemp3) {
                                                                        return Math.round(this.state.highTemp3[0] * 10) / 10 + '°C'
                                                                    }
                                                                })()}




                                                            </div>

                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#2584c7', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time">
                                                                    {(() => {
                                                                        if (this.state.lowTemp3) {
                                                                            var m = moment(this.state.lowTemp3[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.lowTemp3) {
                                                                        return Math.round(this.state.lowTemp3[0] * 10) / 10 + '°C'
                                                                    }
                                                                })()}

                                                            </div>

                                                        </div>

                                                    )
                                                }
                                            })()}

                                            {(() => {
                                                if (this.state.liveData.s3Humi) {
                                                    return (


                                                        <div className="Grow-Details-Main-Data-Display-Row">
                                                            <div style={{ width: '100px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                Humi 3 <WiHumidity style={{ color: '#FFF', fontSize: '30px' }} />
                                                            </div>
                                                            <div className="Grow-Details-Main-Data-Current-Data">
                                                                {(() => {
                                                                    if (this.state.liveData.s3Humi > this.state.lastLiveData.s3Humi) {
                                                                        return <div style={{ fontSize: '14px', color: '#a02525' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                    } else if (this.state.liveData.s3Humi < this.state.lastLiveData.s3Humi) {
                                                                        return <div style={{ fontSize: '14px', color: '#242490' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    } else {
                                                                        return <div style={{ fontSize: '14px', visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    }
                                                                })()}
                                                                {Math.round(this.state.liveData.s3Humi * 10) / 10}%
                                                        </div>

                                                            <div className="Grow-Details-Main-Data-Data" style={{ marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Yest-Data" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    {(() => {
                                                                        if (this.state.yestHumidity3AVG) {
                                                                            return Math.round(this.state.yestHumidity3AVG * 10) / 10 + '%'
                                                                        }
                                                                    })()}

                                                                    {(() => {
                                                                        if (this.state.humidity3AVG && this.state.yestHumidity3AVG) {
                                                                            if (this.state.humidity3AVG > this.state.yestHumidity3AVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                            } else if (this.state.humidity3AVG < this.state.yestHumidity3AVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            } else {
                                                                                return <div style={{ visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            }
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.humidity3AVG) {
                                                                        return Math.round(this.state.humidity3AVG * 10) / 10 + '%'
                                                                    }
                                                                })()}
                                                            </div>




                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#c77725', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time" >
                                                                    {(() => {
                                                                        if (this.state.highHumi3) {
                                                                            var m = moment(this.state.highHumi3[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.highHumi3) {
                                                                        return Math.round(this.state.highHumi3[0] * 10) / 10 + '%'
                                                                    }
                                                                })()}
                                                            </div>

                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#2584c7', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time">
                                                                    {(() => {
                                                                        if (this.state.lowHumi3) {
                                                                            var m = moment(this.state.lowHumi3[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.lowHumi3) {
                                                                        return Math.round(this.state.lowHumi3[0] * 10) / 10 + '%'
                                                                    }
                                                                })()}
                                                            </div>

                                                        </div>

                                                    )
                                                }
                                            })()}

                                            {(() => {
                                                if (this.state.liveData.fanSpeed) {
                                                    return (


                                                        <div className="Grow-Details-Main-Data-Display-Row">

                                                            <div style={{ width: '100px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                Fan <WiHurricane style={{ color: '#FFF', fontSize: '30px' }} />
                                                            </div>
                                                            <div className="Grow-Details-Main-Data-Current-Data">
                                                                {(() => {
                                                                    if (this.state.liveData.fanSpeed > this.state.lastLiveData.fanSpeed) {
                                                                        return <div style={{ fontSize: '14px', color: '#a02525' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                    } else if (this.state.liveData.fanSpeed < this.state.lastLiveData.fanSpeed) {
                                                                        return <div style={{ fontSize: '14px', color: '#242490' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    } else {
                                                                        return <div style={{ fontSize: '14px', visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    }
                                                                })()}
                                                                {this.state.liveData.fanSpeed}%
                                                        </div>

                                                            <div className="Grow-Details-Main-Data-Data" style={{ marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Yest-Data" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    {(() => {
                                                                        if (this.state.yestFanAVG) {
                                                                            return Math.round(this.state.yestFanAVG * 10) / 10 + '%'
                                                                        }
                                                                    })()}

                                                                    {(() => {
                                                                        if (this.state.fanAVG && this.state.yestFanAVG) {
                                                                            if (this.state.fanAVG > this.state.yestFanAVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                            } else if (this.state.fanAVG < this.state.yestFanAVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            } else {
                                                                                return <div style={{ visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            }
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.fanAVG) {
                                                                        return Math.round(this.state.fanAVG * 10) / 10 + '%'
                                                                    }
                                                                })()}
                                                            </div>




                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#c77725', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time" >
                                                                    {(() => {
                                                                        if (this.state.highFan) {
                                                                            var m = moment(this.state.highFan[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.highFan) {
                                                                        return this.state.highFan[0] + '%'
                                                                    }
                                                                })()}
                                                            </div>

                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#2584c7', marginBottom: '1px' }}>

                                                                <div className="Grow-Details-Main-Data-Time">
                                                                    {(() => {
                                                                        if (this.state.lowFan) {
                                                                            var m = moment(this.state.lowFan[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.lowFan) {
                                                                        return this.state.lowFan[0] + '%'
                                                                    }
                                                                })()}
                                                            </div>

                                                        </div>

                                                    )
                                                }
                                            })()}



                                            {(() => {
                                                if (this.state.liveData.humiPower) {
                                                    return (
                                                        <div className="Grow-Details-Main-Data-Display-Row">

                                                            <div style={{ width: '100px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                Hmdfr <WiSprinkle style={{ color: '#FFF', fontSize: '30px' }} />
                                                            </div>
                                                            <div className="Grow-Details-Main-Data-Current-Data">
                                                                {(() => {
                                                                    if (this.state.liveData.humiPower > this.state.lastLiveData.humiPower) {
                                                                        return <div style={{ fontSize: '14px', color: '#a02525' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                    } else if (this.state.liveData.humiPower < this.state.lastLiveData.humiPower) {
                                                                        return <div style={{ fontSize: '14px', color: '#242490' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    } else {
                                                                        return <div style={{ fontSize: '14px', visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                    }
                                                                })()}
                                                                {this.state.liveData.humiPower}%
                                                        </div>



                                                            <div className="Grow-Details-Main-Data-Data" style={{ marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Yest-Data" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    {(() => {
                                                                        if (this.state.yestHumidifierAVG) {
                                                                            return Math.round(this.state.yestHumidifierAVG * 10) / 10 + '%'
                                                                        }
                                                                    })()}
                                                                    {(() => {
                                                                        if (this.state.humidifierAVG && this.state.yestHumidifierAVG) {
                                                                            if (this.state.humidifierAVG > this.state.yestHumidifierAVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="higher value">&#9650;</span></div>
                                                                            } else if (this.state.humidifierAVG < this.state.yestHumidifierAVG) {
                                                                                return <div style={{ color: '#FFF' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            } else {
                                                                                return <div style={{ visibility: 'hidden' }}><span role="img" aria-label="lower value">&#9660;</span></div>
                                                                            }
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.humidifierAVG) {
                                                                        return Math.round(this.state.humidifierAVG * 10) / 10 + '%'
                                                                    }
                                                                })()}
                                                            </div>



                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#c77725', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time">
                                                                    {(() => {
                                                                        if (this.state.highHumidifier) {
                                                                            var m = moment(this.state.highHumidifier[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.highHumidifier) {
                                                                        return this.state.highHumidifier[0] + '%'
                                                                    }
                                                                })()}
                                                            </div>

                                                            <div className="Grow-Details-Main-Data-Data" style={{ backgroundColor: '#2584c7', marginBottom: '1px' }}>
                                                                <div className="Grow-Details-Main-Data-Time" >
                                                                    {(() => {
                                                                        if (this.state.lowHumidifier) {
                                                                            var m = moment(this.state.lowHumidifier[1])
                                                                            return m.format('HH:mm')
                                                                        }
                                                                    })()}
                                                                </div>

                                                                {(() => {
                                                                    if (this.state.lowHumidifier) {
                                                                        return this.state.lowHumidifier[0] + '%'
                                                                    }
                                                                })()}
                                                            </div>

                                                        </div>

                                                    )
                                                }
                                            })()}


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
