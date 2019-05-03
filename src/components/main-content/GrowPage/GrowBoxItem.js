import React, { Component } from 'react';
import '../../../styles/App.css';


import Firebase from '../../../config/firebaseConfig.js'

class GrowBoxItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            grow: this.props.grow,
            liveData: [],
            piCamImageUrl: null,
            lastPiCamUpdate: 0
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

        if (this.props.grow.urls.cam === 'http://96.52.249.69:300/html/') {
            this.watchPiCamFeed()
        } else {
            this.setState({
                piCamImageUrl: this.props.grow.urls.cam,
            });
        }

    }


    getLiveData = () => {
        // TODO: change path
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('sensors_live').child('flower')

        ref.on('value', (snapshot) => {

            var growData = snapshot.val()

            this.setState({
                liveData: growData
            });

        }, function (errorObject) {
            console.log("grow box get live data failed: " + errorObject.code);
        });

    }

    getVeggerData = () => {
        // TODO: REMOVE function
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('sensors_live').child('vegger')

        ref.on('value', (snapshot) => {

            var growData = snapshot.val()

            this.setState({
                liveData: growData
            });

        }, function (errorObject) {
            console.log("grow box get live data failed: " + errorObject.code);
        });
    }

    openMainPage = (ev) => {
        this.props.openMainPage(ev.target.dataset.value)
    }

    watchPiCamFeed = () => {

        setInterval(() => {

            this.updatePiCamState()

        }, 5000);
    }

    updatePiCamState = () => {
        var millis = new Date();
        var reducedMillis = millis - 5000;
        var tempURL = "http://96.52.249.69:300/html/cam_pic.php?time=" + reducedMillis
        this.setState({
            piCamImageUrl: tempURL,
            lastPiCamUpdate: millis
        });
    }



    render() {

        var cTemp = null;
        var fanSpeed = null;
        var humiPower = null;
        var humidity = null;
        var lastUpdate = null;
        if (this.state.liveData) {
            cTemp = this.state.liveData.cTemp
            cTemp = Math.round(cTemp * 10) / 10;
            fanSpeed = this.state.liveData.fanSpeed
            humiPower = this.state.liveData.humiPower
            humidity = this.state.liveData.humidity
            humidity = Math.round(humidity * 10) / 10;

            // TODO... simplify below.
            var updatedAtDate = new Date(this.state.liveData.time)
            var updatedAtHoursString = updatedAtDate.getHours().toString()
            if (updatedAtHoursString.length === 1) {
                updatedAtHoursString = "0" + updatedAtHoursString
            }
            var updatedAtMinutesString = updatedAtDate.getMinutes().toString()
            if (updatedAtMinutesString.length === 1) {
                updatedAtMinutesString = "0" + updatedAtMinutesString
            }
            lastUpdate = updatedAtDate.toDateString() + " - " + updatedAtHoursString + ":" + updatedAtMinutesString

        }

        return (
            <div className="Grow-Box-Item">

                <div className="Grow-Box-Cam-Div">
                    <div className="Grow-Box-Cam-Full-Btn" data-value={this.props.grow.urls.cam} onClick={this.openMainPage}>&#9974;</div>

                    {/* TODO: Just get the actual image location for the Ganja Grove cam[not static..].. */}
                    {(() => {
                        if (this.state.piCamImageUrl !== null) {
                            return (
                                <img className="Grow-Box-Cam" alt="cam" src={this.state.piCamImageUrl} width="100%" height="100%" style={{ objectFit: 'contain' }} />
                            )
                        }
                    })()}

                </div>

                <div className="Grow-Box-Item-Main">
                    <div className="Grow-Box-Item-Header">

                        <div className="Grow-Box-Grow-Name">
                            {this.props.grow.name}
                        </div>
                        <div className="Grow-Box-Updated">
                            updt: <i><b>{lastUpdate}</b></i>
                        </div>
                    </div>
                    <div className="Grow-Box-Function-Btns">
                        <button className="Grow-Box-Function-Btn" data-value={this.props.grow.urls.plotly} onClick={this.openMainPage} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
                        <button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openMainPage} >CONFIG <span role="img" aria-label="grow config icon">&#128187;</span></button>
                        <button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openMainPage} >FEED &#9619;&#9619;</button>
						<button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openMainPage} >&#9998;</button>
					</div>

                    <div className="Grow-Box-Info">
                        <div className="Grow-Box-Info-Text-Area">
                            {(() => {
                                if (cTemp) {
                                    return (
                                        <div className="Grow-Box-Info-Section">
                                            <div className="Grow-Box-Info-Type">TEMP</div>
                                            <div className="Grow-Box-Dot-Lead"><div className="Grow-Box-Dot-Lead-Dots" /></div>
                                            <div className="Grow-Box-Info-Data"><b>{cTemp}°C</b></div>
                                        </div>
                                    )
                                }
                            })()}

                            {(() => {
                                if (fanSpeed) {
                                    return (
                                        <div className="Grow-Box-Info-Section">
                                            <div className="Grow-Box-Info-Type">FAN SPEED</div>
                                            <div className="Grow-Box-Dot-Lead"><div className="Grow-Box-Dot-Lead-Dots" /></div>
                                            <div className="Grow-Box-Info-Data"><b>{fanSpeed}%</b></div>
                                        </div>
                                    )
                                }
                            })()}

                            {(() => {
                                if (humidity) {
                                    return (
                                        <div className="Grow-Box-Info-Section">
                                            <div className="Grow-Box-Info-Type">HUMIDITY</div>
                                            <div className="Grow-Box-Dot-Lead"><div className="Grow-Box-Dot-Lead-Dots" /></div>
                                            <div className="Grow-Box-Info-Data"><b>{humidity}%RH</b></div>
                                        </div>
                                    )
                                }
                            })()}

                            {(() => {
                                if (humiPower) {
                                    return (
                                        <div className="Grow-Box-Info-Section">
                                            <div className="Grow-Box-Info-Type">HUMIDIFIER</div>
                                            <div className="Grow-Box-Dot-Lead"><div className="Grow-Box-Dot-Lead-Dots" /></div>
                                            <div className="Grow-Box-Info-Data"><b>{humiPower}%</b></div>
                                        </div>
                                    )
                                }
                            })()}

                        </div>

                        <img alt="preview" src={this.props.grow.previewImage} className="Grow-Box-Preview-Image" />
                    </div>



                </div>

            </div>
        );
    }
}

export default GrowBoxItem;
