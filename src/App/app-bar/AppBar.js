import React, { Component } from 'react';
import '../../styles/App.css';

import Firebase from '../../config/firebaseConfig.js'

// QuickBar Indicator Colors (green/orange/red)
const optimalIndication = '#91eebb';
const warningIndication = '#FFA500';
const dangerIndication = '#FF0000';

class AppBar extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

        this.firebase = new Firebase()

        this.flowerTempRef = React.createRef()
        this.flowerHumidityRef = React.createRef()
        this.veggerTempRef = React.createRef()
        this.veggerHumidityRef = React.createRef()

        this.watchSensorsLive();
    }


    watchSensorsLive = () => {
        this.watchFlowerLiveData();
        this.watchVeggerLiveData();
    }

    watchFlowerLiveData = () => {
        // Sensor data in firebase
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('sensors_live').child('flower')

        ref.on('value', (snapshot) => {
            let flowerTemp = Math.round(snapshot.val().cTemp * 10) / 10;
            let flowerHumidity = Math.round(snapshot.val().humidity * 10) / 10;

            console.log(`Flower cTemp: ${flowerTemp} // Flower Humidity ${flowerHumidity} `);

            // SET safe ranges here 
            if (flowerTemp > 20 && flowerTemp < 27) {
                this.flowerTempRef.current.style.background = optimalIndication;
            } else if (flowerTemp < 19 || flowerTemp > 28) {
                this.flowerTempRef.current.style.background = dangerIndication;
            } else {
                this.flowerTempRef.current.style.background = warningIndication;
            }

            if (flowerHumidity > 30 && flowerHumidity < 43) {
                this.flowerHumidityRef.current.style.background = optimalIndication;
            } else if (flowerHumidity < 27 || flowerHumidity > 45) {
                this.flowerHumidityRef.current.style.background = dangerIndication;
            } else {
                this.flowerHumidityRef.current.style.background = warningIndication;
            }

            this.setState({
                sFlowerTemp: flowerTemp,
                sFlowerHumidity: flowerHumidity
            });

        }, function (errorObject) {
            console.log("follow flower hour failed: " + errorObject.code);
        });

    }

    watchVeggerLiveData = () => {
        // Sensor data in firebase
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('sensors_live').child('vegger')


        ref.on('value', (snapshot) => {
            let veggerTemp = Math.round(snapshot.val().cTemp * 10) / 10;
            let veggerHumidity = Math.round(snapshot.val().humidity * 10) / 10;

            console.log(`Vegger cTemp: ${veggerTemp} // Vegger Humidity ${veggerHumidity} `);

            // SET safe ranges here 
            if (veggerTemp > 22 && veggerTemp < 29) {
                this.veggerTempRef.current.style.background = optimalIndication;
            } else if (veggerTemp < 20 || veggerTemp > 30) {
                this.veggerTempRef.current.style.background = dangerIndication;
            } else {
                this.veggerTempRef.current.style.background = warningIndication;
            }

            if (veggerHumidity > 40 && veggerHumidity < 80) {
                this.veggerHumidityRef.current.style.background = optimalIndication;
            } else if (veggerHumidity < 35 || veggerHumidity > 85) {
                this.veggerHumidityRef.current.style.background = dangerIndication;
            } else {
                this.veggerHumidityRef.current.style.background = warningIndication;
            }

            this.setState({
                sVeggerTemp: veggerTemp,
                sVeggerHumidity: veggerHumidity
            });

        }, function (errorObject) {
            console.log("follow vegger failed: " + errorObject.code);
        });
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

                <div className="App-Bar-Button-Grow" onClick={this.openGanjaGrove}>
                    <div className="App-Bar-Button-Grow-Name">
                        GG
                    </div>
                    <div ref={this.flowerTempRef} className="App-Bar-Button-Grow-Temp">
                        {this.state.sFlowerTemp}°C
                    </div>
                    <div ref={this.flowerHumidityRef} className="App-Bar-Button-Grow-Humidity">
                        {this.state.sFlowerHumidity}%
                    </div>
                </div>

                <div className="App-Bar-Button-Grow" onClick={this.openVegger}>
                    <div className="App-Bar-Button-Grow-Name">
                        VG
                    </div>
                    <div ref={this.veggerTempRef} className="App-Bar-Button-Grow-Temp">
                        {this.state.sVeggerTemp}°C
                    </div>
                    <div ref={this.veggerHumidityRef} className="App-Bar-Button-Grow-Humidity">
                        {this.state.sVeggerHumidity}%
                    </div>
                </div>

                <div className="App-Bar-Filler-Div"></div>
                <div className="App-Bar-Logout-Button" onClick={this.handleSignOut}>
                    &#10162;
                </div>
            </div>

        );
    }
}

export default AppBar;
