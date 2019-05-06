import React, { Component } from 'react';
import '../../../styles/App.css';

import Firebase from '../../../config/firebaseConfig.js'

import GrowDataDisplay from './GrowDataDisplay'
import GrowDetailsConfig from './GrowDetailsConfig'

import JournalBoxItem from '../GrowJournal/JournalBoxItem'





class GrowDetailsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayBottom: 'journals', // data, config, feed, edit-feed, journals
            liveData: [],
            activeIndicatorStyle: 'Grow-Active-Indicator-Circle',
            linkedJournals: []
        };

        this.firebase = new Firebase();

    }

    componentDidMount() {
        //TODO: Remove condition
        if (this.props.grow.id === '-LdtfBTlG6Fgg-ADD8-b') {
            this.getLiveData()
        } else {
            this.getVeggerData()
        }

        this.getJournalsInfo = this.getJournalsInfo()

    }

    getJournalsInfo = () => {

        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('journals')

        ref.on('value', (snapshot) => {

            var journalsList = [];

            snapshot.forEach((child) => {
                if (this.props.grow.journals) {
                    Object.keys(this.props.grow.journals).forEach(function (key) {
                        if (child.val().id === key) {
                            journalsList.push(child.val())
                        }
                    });
                }
            });

            journalsList.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : -1)

            this.setState({
                linkedJournals: journalsList
            });

        }, function (errorObject) {
            console.log("GrowDetails watch user journals failed: " + errorObject.code);
        });

    }


    getLiveData = () => {
        // TODO: change path
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('sensors_live').child('flower')

        ref.on('value', (snapshot) => {

            var tempLiveData = snapshot.val()

            this.setState({
                liveData: tempLiveData
            });

            this.checkActive(tempLiveData.time)

        }, function (errorObject) {
            console.log("grow box get live data failed: " + errorObject.code);
        });

    }

    getVeggerData = () => {
        // TODO: REMOVE function
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('sensors_live').child('vegger')

        ref.on('value', (snapshot) => {

            var tempLiveData = snapshot.val()

            this.setState({
                liveData: tempLiveData
            });

            this.checkActive(tempLiveData.time)

        }, function (errorObject) {
            console.log("grow box get live data failed: " + errorObject.code);
        });
    }

    checkActive = (lastUpdateTime) => {

        if (lastUpdateTime) {
            var now = new Date();
            var difference = now - (new Date(lastUpdateTime).getTime())

            if (difference >= 3000000) {
                this.setState({
                    activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Neutral-Background'
                });
            }

            if (difference >= 240000) {
                this.setState({
                    activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Danger-Background'
                });
            }

            if (difference >= 120000) {
                this.setState({
                    activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Warning-Background'
                });
            }

            if (difference < 120000) {
                this.setState({
                    activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Optimal-Background'
                });
            }

        } else {
            console.log("NO LAST UPDATE ERROR")
        }

    }

    openJournals = () => {
        console.log("GROWDETAILS OPEN JOURNALS!")
        this.setState({
            displayBottom: 'journals'
        });
    }
    openData = () => {
        console.log("GROWDETAILS OPEN DATA")
        this.setState({
            displayBottom: 'data'
        });
    }
    openConfig = () => {
        console.log("GROWDETAILS OPEN CONFIG")
        this.setState({
            displayBottom: 'config'
        });
    }
    openFeed = () => {
        console.log("GROWDETAILS OPEN FEED")
        this.setState({
            displayBottom: 'feed'
        });

    }
    openEditFeed = () => {
        console.log("GROWDETAILS OPEN EDIT FEED")
        this.setState({
            displayBottom: 'edit-feed'
        });

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
        //TODO: below in less code... or get rid of zIndex after removing Plotly
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
            console.log("GDP linked journals")
            console.log(this.state.linkedJournals)
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
                        <img alt="cam" style={{ objectFit: 'contain' }} src={this.props.grow.urls.cam} width="100%" height="100%" />
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
                        <div className="Grow-Details-Main-Btns">
                            <button className="Grow-Box-Function-Btn" data-value={'journals'} onClick={this.openJournals} >JRNLS <span role="img" aria-label="journal">&#128214;</span></button>
                            <button className="Grow-Box-Function-Btn" data-value={'data'} onClick={this.openData} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
                            <button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openConfig} >CONFIG <span role="img" aria-label="grow config icon">&#128187;</span></button>
                            <button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openFeed} >FEED &#9619;&#9619;</button>
                            <button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openEditFeed} >&#9998;</button>
                        </div>
                    </div>


                    <div className="Grow-Details-Content-Bottom">

                        <div className="Grow-Details-Bottom-Item" style={journalsStyle} >
                            <div className="Grow-Details-Journals">
                                <div className="Grow-Details-Journals-Header">Connected Journals</div>
                                {renderedLinkedJournals}

                            </div>
                        </div>

                        <div className="Grow-Details-Bottom-Item" style={graphsStyle} >
                            <object type="text/html" data={this.props.grow.urls.plotly} width="100%" height="100%" aria-label="plotly" />
                        </div>

                        <div className="Grow-Details-Bottom-Item" style={feedStyle} >
                            <iframe id="Food-Chart" title="FoodChart" src={this.props.grow.urls.feed_chart} />
                        </div>

                        <div className="Grow-Details-Bottom-Item" style={editFeedStyle} >
                            <object type="text/html" data={this.props.grow.urls.feed_edit} width="100%" height="100%" aria-label="edit food chart" />
                        </div>

                        <div className="Grow-Details-Bottom-Item" style={configStyle} >
                            <GrowDetailsConfig />
                        </div>

                    </div>


                </div>




            </div>
        );
    }
}

export default GrowDetailsPage;
