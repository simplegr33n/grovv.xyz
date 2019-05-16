import React, { Component } from 'react';
import '../../../styles/App.css';


import DbHelper from '../../_utils/DbHelper.js'


import GrowDataDisplay from './GrowDataDisplay'

import GrowDetailsConfig from './GrowDetailsConfig'
import GrowDetailsGraphs from './GrowDetailsGraphs'

import JournalBoxItem from '../GrowJournal/JournalBoxItem'





class GrowDetailsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayBottom: 'data', // data, config, feed, edit-feed, journals
            liveData: [],
            activeIndicatorStyle: 'Grow-Active-Indicator-Circle',
            linkedJournals: [],
            camURL: null,
            growDeprecate: null // TODO Remove

        };


        this.dbHelper = new DbHelper()


    }

    componentDidMount() {
        this._ismounted = true;

        //TODO: Remove condition
        if (this.props.grow.id === '-LdtfBTlG6Fgg-ADD8-b') {
            this.getLiveData('flower', this.setLiveData);
            // this.getLiveData()
            this.watchPiCam()

            // todo remove
            if (this._ismounted) {
                this.setState({ growDeprecate: 'flower' });
            }
        } else {
            this.getLiveData('vegger', this.setLiveData);
            // this.getVeggerData()
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

        this.getLinkedJournals(this.props.grow.id, this.props.grow.journals, this.setLinkedJournals)
    }


    componentWillUnmount = () => {
        this._ismounted = false;
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
    

    getLiveData = async (growDeprecate, setData) => {
        try {
            await this.dbHelper.getLiveData(growDeprecate, setData)
        } catch (e) {
            console.log(e);
            return 'caught ' + e
        }
    }


    setLiveData = (data) => {
        if (this._ismounted) {
            this.setState({
                liveData: data
            });
        }
    }

    getLinkedJournals = async (key, journals, setData) => {
        try {
            await this.dbHelper.getLinkedJournals(key, journals, setData)
        } catch (e) {
            console.log(e);
            return 'caught ' + e
        }
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
                                    return <GrowDataDisplay liveData={this.state.liveData} />
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
                            <GrowDetailsGraphs growDeprecate={this.state.growDeprecate} />

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
                            <GrowDetailsConfig />

                        </div>

                    </div>

                </div>

            </div>
        );
    }
}

export default GrowDetailsPage;
