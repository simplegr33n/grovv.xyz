import React, { Component } from 'react';

import '../../styles/App.css';


class AppBar extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    openJournals = () => {
        this.props.setMainContent('journals')
    }

    openGrows = () => {
        this.props.setMainContent('grows')
    }

    // Replace with a setGrow 
    openGanjaGrove = () => {
        this.props.openGanjaGrove()
    }
    openVegger = () => {
        this.props.openVegger()
    }

    setGrow = (ev) => {
        this.props.setGrowByID(ev.target.dataset.value)
    }

    //TODO: why is this here (also in App.js)?
    handleSignOut = () => {
        this.firebase.auth.signOut().then(function () {
            // Sign-out successful.
            console.log(`signed out`)
            window.location.reload();
        }).catch(function (error) {
            // An error happened.
            console.log(`Error signing out: ${error}`)
        });
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
                brokenName.forEach((piece) => {
                    acroName += piece.charAt(0)
                })

                return (
                    <div className="App-Bar-Button-Grow" key={grow.id} onClick={this.setGrow} data-value={grow.id}>
                        <div className="App-Bar-Button-Grow-Name" data-value={grow.id}>
                            {acroName}
                        </div>
                        {(() => {
                            if (liveButtonData) {
                                return (
                                    <div ref={this.flowerTempRef} className="App-Bar-Button-Grow-Temp" data-value={grow.id}>
                                        {Math.round(liveButtonData.cTemp * 10) / 10}°C
                                </div>
                                )
                            }
                        })()}


                        {(() => {
                            if (liveButtonData) {
                                return (
                                    <div ref={this.flowerHumidityRef} className="App-Bar-Button-Grow-Humidity" data-value={grow.id}>
                                        {Math.round(liveButtonData.humidity * 10) / 10}%
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
                    grovv
                </div>

                {renderedLiveGrowButtons}

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