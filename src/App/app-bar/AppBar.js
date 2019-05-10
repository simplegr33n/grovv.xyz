import React, { Component } from 'react';
import '../../styles/App.css';

import Firebase from '../../config/firebaseConfig.js'


class AppBar extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

        this.firebase = new Firebase()
    }

    render() {
        return (

            <div id="App-Bar">

            </div>

        );
    }
}

export default AppBar;
