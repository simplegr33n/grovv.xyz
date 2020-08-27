import React, { Component } from 'react';
import '../../../styles/App.css';


class GrowDataDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            journalName: '',
            journalID: this.props.journalID
        };


    }
   
    render() {

        var cTemp = null;
		var fanSpeed = null;
		var humiPower = null;
		var humidity = null;
		// var lastUpdate = null;
		if (this.props.liveData) {
			cTemp = this.props.liveData.cTemp
			cTemp = Math.round(cTemp * 10) / 10;
			fanSpeed = this.props.liveData.fanSpeed
			humiPower = this.props.liveData.humiPower
			humidity = this.props.liveData.humidity
            humidity = Math.round(humidity * 10) / 10;
        }

        return (
            <div id="Grow-Data-Display">
            {(() => {
                if (cTemp) {
                    var backgroundIndicator = null
                    if (cTemp > 20 && cTemp < 27) {
                        backgroundIndicator = "Data-Optimal-Background"
                    } else if (cTemp <= 19 && cTemp > 28) {
                        backgroundIndicator = "Data-Danger-Background"
                    } else {
                        backgroundIndicator = "Data-Warning-Background"
                    }

                    return (
                        <div className="Grow-Box-Info-Section">
                            <div className="Grow-Box-Info-Type">TEMP</div>
                            <div className="Grow-Box-Dot-Lead"><div className="Grow-Box-Dot-Lead-Dots" /></div>
                            <div className={backgroundIndicator}>
                                <div className="Grow-Box-Info-Data">
                                    <div className="Grow-Box-Data-Raw">{cTemp}</div >
                                    <div className="Horizontal-20px-Gap"></div>
                                    <div className="Grow-Box-Data-Unit">°C</div>
                                </div>
                            </div>
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
                            <div className="Data-Neutral-Background">
                                <div className="Grow-Box-Info-Data">
                                    <div className="Grow-Box-Data-Raw">{fanSpeed}</div >
                                    <div className="Horizontal-20px-Gap"></div>
                                    <div className="Grow-Box-Data-Unit">%</div>
                                </div>
                            </div>
                        </div>
                    )
                }
            })()}

            {(() => {
                if (humidity) {
                    var backgroundIndicator = null
                    if (humidity > 30 && humidity < 43) {
                        backgroundIndicator = "Data-Optimal-Background"
                    } else if (humidity <= 27 && humidity > 45) {
                        backgroundIndicator = "Data-Danger-Background"
                    } else {
                        backgroundIndicator = "Data-Warning-Background"
                    }

                    return (
                        <div className="Grow-Box-Info-Section">
                            <div className="Grow-Box-Info-Type">HUMIDITY</div>
                            <div className="Grow-Box-Dot-Lead"><div className="Grow-Box-Dot-Lead-Dots" /></div>
                            <div className={backgroundIndicator}>
                                <div className="Grow-Box-Info-Data">
                                    <div className="Grow-Box-Data-Raw">{humidity}</div >
                                    <div className="Horizontal-20px-Gap"></div>
                                    <div className="Grow-Box-Data-Unit">%RH</div>
                                </div>
                            </div>
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
                            <div className="Data-Neutral-Background">
                                <div className="Grow-Box-Info-Data">
                                    <div className="Grow-Box-Info-Data">
                                        <div className="Grow-Box-Data-Raw">{humiPower}</div >
                                        <div className="Horizontal-20px-Gap"></div>
                                        <div className="Grow-Box-Data-Unit">%</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )
                }
            })()}

            </div>
        );
    }
}

export default GrowDataDisplay;
