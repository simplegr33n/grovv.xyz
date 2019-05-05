import React, { Component } from 'react';
import '../../../styles/App.css';

import Firebase from '../../../config/firebaseConfig.js'

import GrowDataDisplay from './GrowDataDisplay'
import GrowDetailsConfig from './GrowDetailsConfig'


class GrowDetailsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayBottom: 'data', // data, config, feed, edit-feed, journals
            liveData: [],
            activeIndicatorStyle: 'Grow-Active-Indicator-Circle'
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


    render() {

        return (
            <div className="Grow-Details-Page">

                <div className="Grow-Details-Page-Content">
                   
                        <div className="Grow-Details-Content-Cam">
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
                                <button className="Grow-Box-Function-Btn" data-value={'data'} onClick={this.openData} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
                                <button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openConfig} >CONFIG <span role="img" aria-label="grow config icon">&#128187;</span></button>
                                <button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openFeed} >FEED &#9619;&#9619;</button>
                                <button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openEditFeed} >&#9998;</button>
                            </div>
                        </div>

                        <div className="Grow-Details-Content-Bottom">
                            {(() => {
                                switch (this.state.displayBottom) {
                                    case 'data':
                                        return <object type="text/html" data={this.props.grow.urls.plotly} width="100%" height="100%" aria-label="plotly" />
                                    case 'feed':
                                        return <iframe id="Food-Chart" title="FoodChart" src={this.props.grow.urls.feed_chart} />
                                    case 'edit-feed':
                                        return <object type="text/html" data={this.props.grow.urls.feed_edit} width="100%" height="100%" aria-label="edit food chart" />
                                    case 'config':
                                        return <GrowDetailsConfig />
                                    default:
                                        break;
                                }
                            })()}
                        </div>




                </div>



            </div>
        );
    }
}

export default GrowDetailsPage;
