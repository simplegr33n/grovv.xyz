import React, { Component } from 'react';
import '../../../styles/App.css';

import Firebase from '../../../config/firebaseConfig.js'

import GrowDataDisplay from './GrowDataDisplay'


class GrowDetailsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
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


    render() {

        return (
            <div className="Grow-Details-Page">

                <div className="Grow-Details-Page-Content">
                    <div className="Grow-Details-Content-Cam">
                        <img alt="cam" style={{ objectFit: 'contain' }} src={this.props.grow.urls.cam} width="100%" height="100%" />
                    </div>
                    <div className="Grow-Details-Content-Plotly">
                        <object type="text/html" data={this.props.grow.urls.plotly} width="100%" height="100%" aria-label="plotly" />
                    </div>
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
            </div>
        );
    }
}

export default GrowDetailsPage;
