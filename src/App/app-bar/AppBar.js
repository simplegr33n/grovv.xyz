import React, { Component } from 'react';

import moment from 'moment'

import '../../styles/App.css';

import cornerLogo from '../../assets/corner-logo.png'

import { AiOutlineLineChart } from 'react-icons/ai';


class AppBar extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }

    openJournals = () => {
        this.props.setMainContent('journals')
    }

    openGraphs = () => {
        this.props.setMainContent('graphs')
    }

    openGrows = () => {
        this.props.setMainContent('grows')
    }

    setGrow = (ev) => {
        this.props.userGrows.forEach((grow) => {
            if (grow.id === ev.target.dataset.value) {
                this.props.setGrow(grow)
            }
        })
    }

    handleSignOut = () => {
        this.props.handleSignOut()
    }



    render() {

        var renderedLiveGrowButtons = null;
        if (this.props.userGrows !== null) {
            renderedLiveGrowButtons = this.props.userGrows.map((grow) => {

                var liveButtonData = null
                if (this.props.liveGrowData[grow.id]) {
                    liveButtonData = this.props.liveGrowData[grow.id]
                }

                var brokenName = grow.name.split(" ")
                var acroName = ""

                if (grow.name.length >= 4) {
                    brokenName.forEach((piece) => {
                        acroName += piece.charAt(0)
                    })
                } else {
                    acroName = grow.name
                }

                var indicatorColor = "#FF0000"
                var lastUpdate = null;
                if (this.props.liveGrowData[grow.id]) {
                    var now = new Date().getTime();
                    var updatedAtDate = new Date(this.props.liveGrowData[grow.id].time * 1000)

                    if (this.updatedAtDate && (updatedAtDate !== this.updatedAtDate[grow.id])) {
                        this.updatedAtDate[grow.id] = updatedAtDate
                    }



                    var difference = now - this.props.liveGrowData[grow.id].time * 1000
                    if (difference > 10000000) {
                        indicatorColor = "#989e98"
                    } else if (difference > 300000) {
                        indicatorColor = "#fa360a"
                    } else if (difference > 60000) {
                        indicatorColor = "#facb23"
                    } else if (difference < 60000) {
                        indicatorColor = "#27d927"
                    }



                    lastUpdate = moment(updatedAtDate).fromNow()
                }



                return (
                    <div className="App-Bar-Button-Grow" key={grow.id} onClick={this.setGrow} data-value={grow.id}>
                        <div className="App-Bar-Button-Updated" data-value={grow.id}>
                            <div style={{ paddingBottom: '15px' }}>
                                {lastUpdate}
                            </div>
                            <div style={{ color: indicatorColor, marginLeft: '1px' }}>
                                ⬤
                            </div>
                        </div>
                        <div className="App-Bar-Button-Grow-Name" data-value={grow.id}>
                            {acroName}
                        </div>
                        {(() => {
                            if (liveButtonData && liveButtonData.sA1_Temp) {
                                return (
                                    <div ref={this.flowerTempRef} className="App-Bar-Button-Grow-Temp" data-value={grow.id}>
                                        {Math.round(liveButtonData.sA1_Temp * 10) / 10}°C
                                    </div>
                                )
                            }
                        })()}


                        {(() => {
                            if (liveButtonData && liveButtonData.sA1_Humi) {
                                return (
                                    <div ref={this.flowerHumidityRef} className="App-Bar-Button-Grow-Humidity" data-value={grow.id}>
                                        {Math.round(liveButtonData.sA1_Humi * 10) / 10}%
                                    </div>
                                )
                            }
                        })()}

                    </div>
                )
            })
        }

        return (

            <div id="App-Bar" >
                <div id="App-Bar-Logo" onClick={this.openGrows}>
                    <img src={cornerLogo} alt="App Logo" style={{ maxWidth: "100px" }} />
                </div>

                {renderedLiveGrowButtons}

                <div className="App-Bar-Button-Grow" style={{ background: '#000' }} onClick={this.openGraphs}>
                    <AiOutlineLineChart style={{ color: '#FFF', fontSize: '30px', paddingTop: '5px' }} />
                </div>

                <div className="App-Bar-Button" onClick={this.openJournals}>
                    JRNLS
                </div>

                <div className="App-Bar-Filler-Div"></div>
                <div className="App-Bar-Logout-Button" onClick={this.handleSignOut}>
                    &#10162;
                </div>
            </div >

        );
    }
}

export default AppBar;
