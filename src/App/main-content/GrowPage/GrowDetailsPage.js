import React, { Component } from 'react';
import '../../../styles/App.css';


import GrowDetailsConfig from './GrowDetailsConfig'
import GrowDetailsGraphs from './GrowDetailsGraphs'

import JournalBoxItem from '../GrowJournal/JournalBoxItem'


import DbHelper from '../../_utils/DbHelper.js'


import moment from 'moment'





class GrowDetailsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayBottom: 'data', // data, config, feed, edit-feed, journals
            activeIndicatorStyle: 'Grow-Active-Indicator-Circle',
            linkedJournals: [],
            camURL: null,
            growDeprecate: null // TODO Remove
        };

        this.dbHelper = new DbHelper(); // Need for linked journals

    }

    componentDidMount() {
        this._ismounted = true;

        //TODO: Remove condition
        if (this.props.grow.id === '-LdtfBTlG6Fgg-ADD8-b') {
            // todo remove
            this.watchPiCam()

            if (this._ismounted) {
                this.setState({ growDeprecate: 'flower' });
            }
        } else {
            // todo remove
            if (this._ismounted) {
                this.setState({ growDeprecate: 'vegger' });
            }
        }

        if (this.props.grow.urls.cam) {
            if (this._ismounted) {
                this.setState({ camURL: this.props.grow.urls.cam });
            }
        }

        if (this.props.rawGrowData) {
            this.processGrowData(this.props.rawGrowData)
        }

        this.getLinkedJournals(this.props.grow.id, this.props.grow.journals, this.setLinkedJournals)
    }

    componentWillUnmount = () => {
        this._ismounted = false;
    }

    processGrowData = (growData) => {
        console.log("PROCESS GROW DATA!")
        console.log(growData[this.props.grow.id])

        var concatData = []
        growData[this.props.grow.id].forEach((list) => {
            concatData = concatData.concat(list)
        })

        concatData.sort((a, b) => (a.time > b.time) ? 1 : -1)

        this.setState({ liveData: concatData[concatData.length - 1] })

        console.log("concatData")

        console.log(concatData)


        var highTemp = []
        var lowTemp = []
        var highHumidity = []
        var lowHumidity = []
        var highFan = []
        var lowFan = []
        var highHumidifier = []
        var lowHumidifier = []

        var now = new Date().getTime()


        var lastDayData = []
        concatData.forEach((dataPoint) => {
            if (now - dataPoint.time < 86400000) {
                lastDayData[lastDayData.length] = dataPoint
                if (dataPoint.cTemp) {
                    if (!highTemp[0] || dataPoint.cTemp >= highTemp[0]) {
                        highTemp[0] = dataPoint.cTemp
                        highTemp[1] = dataPoint.time
                    }

                    if (!lowTemp[0] || dataPoint.cTemp <= lowTemp[0]) {
                        lowTemp[0] = dataPoint.cTemp
                        lowTemp[1] = dataPoint.time
                    }
                }
                if (dataPoint.humidity) {
                    if (!highHumidity[0] || dataPoint.humidity >= highHumidity[0]) {
                        highHumidity[0] = dataPoint.humidity
                        highHumidity[1] = dataPoint.time
                    }

                    if (!lowHumidity[0] || dataPoint.humidity <= lowHumidity[0]) {
                        lowHumidity[0] = dataPoint.humidity
                        lowHumidity[1] = dataPoint.time
                    }
                }
                if (dataPoint.fanSpeed) {
                    if (!highFan[0] || dataPoint.fanSpeed >= highFan[0]) {
                        highFan[0] = dataPoint.fanSpeed
                        highFan[1] = dataPoint.time
                    }

                    if (!lowFan[0] || dataPoint.fanSpeed <= lowFan[0]) {
                        lowFan[0] = dataPoint.fanSpeed
                        lowFan[1] = dataPoint.time
                    }
                }
                if (dataPoint.humiPower) {
                    if (!highHumidifier[0] || dataPoint.humiPower >= highHumidifier[0]) {
                        highHumidifier[0] = dataPoint.humiPower
                        highHumidifier[1] = dataPoint.time
                    }

                    if (!lowHumidifier[0] || dataPoint.humiPower <= lowHumidifier[0]) {
                        lowHumidifier[0] = dataPoint.humiPower
                        lowHumidifier[1] = dataPoint.time
                    }
                }
            }

        })

        this.setState({
            highTemp: highTemp,
            lowTemp: lowTemp,
            highFan: highFan,
            lowFan: lowFan,
            highHumidity: highHumidity,
            lowHumidity: lowHumidity,
            highHumidifier: highHumidifier,
            lowHumidifier: lowHumidifier
        })

        console.log("lastDayData")
        console.log(lastDayData)

    }

    // TODO: remove function
    watchPiCam = () => {
        var tempURL = 'http://96.52.249.69:300/html/cam_pic.php?time='
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

            // if (difference >= 3000000) {
            //     this.setState({
            //         activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Neutral-Background'
            //     });
            // }

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

                    <div className="Grow-Details-Content-Cam">
                        <div className="Grow-Details-Cam-Full-Btn" data-value={this.props.grow.urls.cam} onClick={this.openFullCam}>&#9974;</div>
                        <img alt="cam" style={{ objectFit: 'contain' }} src={this.state.camURL} width="100%" height="100%" />
                    </div>

                    <div className="Grow-Details-Page-Panel">
                        <div className="Grow-Details-Header">
                            <div id="Grow-Header-Text">{this.props.grow.name}</div>
                            <div className={this.state.activeIndicatorStyle} />
                        </div>


                        <div id="Grow-Details-Data-Display">

                            {(() => {
                                if (this.state.liveData) {
                                    return (<div id="Grow-Details-Main-Data-Display">
                                        <div className="Grow-Details-Main-Data-Display-Column">
                                            <div>
                                                *
                                            </div>
                                            <div style={{ fontSize: '28px' }}>
                                                cur
                                            </div>
                                            <div>
                                                24h&#8593;
                                            </div>
                                            <div>
                                                at...
                                            </div>
                                            <div>
                                                24h&#8595;
                                            </div>
                                            <div>
                                                at...
                                            </div>
                                        </div>
                                        {(() => {
                                            if (this.state.liveData.cTemp) {
                                                return (
                                                    <div className="Grow-Details-Main-Data-Display-Column">
                                                        <div>
                                                            TEMP
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Current-Data">
                                                            {Math.round(this.state.liveData.cTemp * 10) / 10}°C
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Data">
                                                            {(() => {
                                                                if (this.state.highTemp) {
                                                                    return Math.round(this.state.highTemp[0] * 10) / 10 + '°C'
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Time">
                                                            {(() => {
                                                                if (this.state.highTemp) {
                                                                    var m = moment(this.state.highTemp[1])
                                                                    return m.format('HH:mm')
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Data">
                                                            {(() => {
                                                                if (this.state.lowTemp) {
                                                                    return Math.round(this.state.lowTemp[0] * 10) / 10 + '°C'
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Time">
                                                            {(() => {
                                                                if (this.state.lowTemp) {
                                                                    var m = moment(this.state.lowTemp[1])
                                                                    return m.format('HH:mm')
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


                                                    <div className="Grow-Details-Main-Data-Display-Column">
                                                        <div>
                                                            Fan
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Current-Data">
                                                            {this.state.liveData.fanSpeed}%
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Data">
                                                            {(() => {
                                                                if (this.state.highFan) {
                                                                    return this.state.highFan[0] + '%'
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Time">
                                                            {(() => {
                                                                if (this.state.highFan) {
                                                                    var m = moment(this.state.highFan[1])
                                                                    return m.format('HH:mm')
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Data">
                                                            {(() => {
                                                                if (this.state.lowFan) {
                                                                    return this.state.lowFan[0] + '%'
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Time">
                                                            {(() => {
                                                                if (this.state.lowFan) {
                                                                    var m = moment(this.state.lowFan[1])
                                                                    return m.format('HH:mm')
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


                                                    <div className="Grow-Details-Main-Data-Display-Column">
                                                        <div>
                                                            HUMID
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Current-Data">
                                                            {Math.round(this.state.liveData.humidity * 10) / 10}%
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Data">
                                                            {(() => {
                                                                if (this.state.highHumidity) {
                                                                    return Math.round(this.state.highHumidity[0] * 10) / 10 + '%'
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Time">
                                                            {(() => {
                                                                if (this.state.highHumidity) {
                                                                    var m = moment(this.state.highHumidity[1])
                                                                    return m.format('HH:mm')
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Data">
                                                            {(() => {
                                                                if (this.state.lowHumidity) {
                                                                    return Math.round(this.state.lowHumidity[0] * 10) / 10 + '%'
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Time">
                                                            {(() => {
                                                                if (this.state.lowHumidity) {
                                                                    var m = moment(this.state.lowHumidity[1])
                                                                    return m.format('HH:mm')
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
                                                    <div className="Grow-Details-Main-Data-Display-Column">
                                                        <div>
                                                            Hmdfier
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Current-Data">
                                                            {this.state.liveData.humiPower}%
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Data">
                                                            {(() => {
                                                                if (this.state.highHumidifier) {
                                                                    return this.state.highHumidifier[0] + '%'
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Time">
                                                            {(() => {
                                                                if (this.state.highHumidifier) {
                                                                    var m = moment(this.state.highHumidifier[1])
                                                                    return m.format('HH:mm')
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Data">
                                                            {(() => {
                                                                if (this.state.lowHumidifier) {
                                                                    return this.state.lowHumidifier[0] + '%'
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="Grow-Details-Main-Data-Time">
                                                            {(() => {
                                                                if (this.state.lowHumidifier) {
                                                                    var m = moment(this.state.lowHumidifier[1])
                                                                    return m.format('HH:mm')
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


                    <div className="Grow-Details-Content-Bottom">

                        <div className="Grow-Details-Bottom-Item" style={journalsStyle} >
                            <div className="Grow-Details-Journals">
                                {/* TODO: Make Component */}
                                <div className="Grow-Details-Bottom-Btns">
                                    <button className="Grow-Box-Function-Btn" data-value={'data'} onClick={this.openData} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
                                    <button className="Grow-Box-Function-Btn" data-value={'journals'} onClick={this.openJournals} >JRNLS <span role="img" aria-label="journal">&#128214;</span></button>
                                    <button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openConfig} >CNFG <span role="img" aria-label="grow config icon">&#128187;</span></button>
                                    <button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openFeed} >FEED &#9619;&#9619;</button>
                                    <button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openEditFeed} >&#9998;</button>
                                </div>
                                <div className="Grow-Details-Journals-Header">Connected Journals</div>
                                {renderedLinkedJournals}

                            </div>
                        </div>

                        <div className="Grow-Details-Bottom-Item" style={graphsStyle} >
                            {/* TODO: Make Component */}
                            <div className="Grow-Details-Bottom-Btns">
                                <button className="Grow-Box-Function-Btn" data-value={'data'} onClick={this.openData} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
                                <button className="Grow-Box-Function-Btn" data-value={'journals'} onClick={this.openJournals} >JRNLS <span role="img" aria-label="journal">&#128214;</span></button>
                                <button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openConfig} >CNFG <span role="img" aria-label="grow config icon">&#128187;</span></button>
                                <button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openFeed} >FEED &#9619;&#9619;</button>
                                <button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openEditFeed} >&#9998;</button>
                            </div>
                            <GrowDetailsGraphs growDeprecate={this.state.growDeprecate} growID={this.props.grow.id} rawGrowData={this.props.rawGrowData} />

                        </div>

                        <div className="Grow-Details-Bottom-Item" style={feedStyle} >
                            {/* TODO: Make Component */}
                            <div className="Grow-Details-Bottom-Btns">
                                <button className="Grow-Box-Function-Btn" data-value={'data'} onClick={this.openData} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
                                <button className="Grow-Box-Function-Btn" data-value={'journals'} onClick={this.openJournals} >JRNLS <span role="img" aria-label="journal">&#128214;</span></button>
                                <button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openConfig} >CNFG <span role="img" aria-label="grow config icon">&#128187;</span></button>
                                <button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openFeed} >FEED &#9619;&#9619;</button>
                                <button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openEditFeed} >&#9998;</button>
                            </div>
                            <iframe id="Food-Chart" title="FoodChart" src={this.props.grow.urls.feed_chart} />

                        </div>

                        <div className="Grow-Details-Bottom-Item" style={editFeedStyle} >
                            {/* TODO: Make Component */}
                            <div className="Grow-Details-Bottom-Btns">
                                <button className="Grow-Box-Function-Btn" data-value={'data'} onClick={this.openData} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
                                <button className="Grow-Box-Function-Btn" data-value={'journals'} onClick={this.openJournals} >JRNLS <span role="img" aria-label="journal">&#128214;</span></button>
                                <button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openConfig} >CNFG <span role="img" aria-label="grow config icon">&#128187;</span></button>
                                <button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openFeed} >FEED &#9619;&#9619;</button>
                                <button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openEditFeed} >&#9998;</button>
                            </div>
                            <object id="Edit-Food-Chart" type="text/html" data={this.props.grow.urls.feed_edit} width="100%" height="100%" aria-label="edit food chart" />

                        </div>

                        <div className="Grow-Details-Bottom-Item" style={configStyle} >
                            {/* TODO: Make Component */}
                            <div className="Grow-Details-Bottom-Btns">
                                <button className="Grow-Box-Function-Btn" data-value={'data'} onClick={this.openData} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
                                <button className="Grow-Box-Function-Btn" data-value={'journals'} onClick={this.openJournals} >JRNLS <span role="img" aria-label="journal">&#128214;</span></button>
                                <button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openConfig} >CNFG <span role="img" aria-label="grow config icon">&#128187;</span></button>
                                <button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openFeed} >FEED &#9619;&#9619;</button>
                                <button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openEditFeed} >&#9998;</button>
                            </div>
                            <GrowDetailsConfig growID={this.props.grow.id} />

                        </div>

                    </div>

                </div>

            </div>
        );
    }
}

export default GrowDetailsPage;
