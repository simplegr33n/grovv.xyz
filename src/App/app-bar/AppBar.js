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

        return (

            <div id="App-Bar">
                <div id="App-Bar-Logo" onClick={this.openGrows}>
                    grovv
                </div>

                <div className="App-Bar-Button" onClick={this.openJournals}>
                    JRNLS
                </div>

                <div className="App-Bar-Button" onClick={this.openGrows}>
                    GROWS
                </div>

                {(() => {
                    if (this.props.liveGrowData.flower) {
                        return (
                            <div className="App-Bar-Button-Grow" onClick={this.openGanjaGrove}>
                                <div className="App-Bar-Button-Grow-Name">
                                    GG
                                </div>
                                <div ref={this.flowerTempRef} className="App-Bar-Button-Grow-Temp">
                                    {Math.round(this.props.liveGrowData.flower.cTemp * 10) / 10}°C
                                </div>
                                <div ref={this.flowerHumidityRef} className="App-Bar-Button-Grow-Humidity">
                                    {Math.round(this.props.liveGrowData.flower.humidity * 10) / 10}%
                                </div>
                            </div>
                        )

                    }
                })()}

                {(() => {
                    if (this.props.liveGrowData.vegger) {
                        return (
                            <div className="App-Bar-Button-Grow" onClick={this.openVegger}>
                                <div className="App-Bar-Button-Grow-Name">
                                    VG
                                </div>
                                <div ref={this.veggerTempRef} className="App-Bar-Button-Grow-Temp">
                                    {Math.round(this.props.liveGrowData.vegger.cTemp * 10) / 10}°C
                                </div>
                                <div ref={this.veggerHumidityRef} className="App-Bar-Button-Grow-Humidity">
                                    {Math.round(this.props.liveGrowData.vegger.humidity * 10) / 10}%
                                </div>
                            </div>
                        )
                    }
                })()}

                <div className="App-Bar-Filler-Div"></div>
                <div className="App-Bar-Logout-Button" onClick={this.handleSignOut}>
                    &#10162;
                </div>
            </div>

        );
    }
}

export default AppBar;
