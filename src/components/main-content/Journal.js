import React, { Component } from 'react';
import '../../styles/App.css';

import Firebase from '../../config/firebaseConfig.js'


class Journal extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

        this.firebase = new Firebase();
    }

    saveConfig = () => {

    }

    watchConfig = () => {
		// Sensor data in firebase
		//var ref = this.firebase.db.ref().child('grow').child('-LdG6gTCNZxfu1wU5Xvx').child('config')
    }

    handleHumidifierMinChange = (event) => {
        this.setState({ humidifier_min: event.target.value });
    }

    handleHumidifierMaxChange = (event) => {
        this.setState({ humidifier_max: event.target.value });
    }



    render() {
        return (

            <div id="Journal-Page">
                JOURNAL
                <div id="Timeline-Container">
                    <div id="Timeline-Line" />
                    <div id="Timeline-Add-Dot">
                        +
                    </div>
                </div>
            </div>

        );
    }
}

export default Journal;
