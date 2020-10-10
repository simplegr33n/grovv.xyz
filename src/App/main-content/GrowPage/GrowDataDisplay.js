import React, { Component } from 'react';
import '../../../styles/App.css';


class GrowDataDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };


    }

    render() {

        var cTemp = null;
        var humidity = null;

        if (this.props.liveData) {
            cTemp = this.props.liveData.sA1_Temp
            cTemp = Math.round(cTemp * 10) / 10;

            humidity = this.props.liveData.sA1_Humi
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
                                        <div className="Grow-Box-Data-Unit">%</div>
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
