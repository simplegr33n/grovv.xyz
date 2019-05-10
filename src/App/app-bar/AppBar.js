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
                <div id="App-Bar-Logo">
                    growbase
                </div>
                <div className="App-Bar-Button">
                    GROWS
                </div>
                <div className="App-Bar-Button-Grow">
                    <div className="App-Bar-Button-Grow-Name">
                        GG
                    </div>

                    <div className="App-Bar-Button-Grow-Temp">
                        22C
                        </div>
                    <div className="App-Bar-Button-Grow-Humidity">
                        34RH
                        </div>

                </div>
                <div className="App-Bar-Button-Grow">
                    <div className="App-Bar-Button-Grow-Name">
                        VG
                    </div>

                    <div className="App-Bar-Button-Grow-Temp">
                        27C
                        </div>
                    <div className="App-Bar-Button-Grow-Humidity">
                        54RH
                        </div>

                </div>
                <div className="App-Bar-Button">
                    JRNLS
                </div>
                <div className="App-Bar-Filler-Div"></div>
                <div className="App-Bar-Logout-Button">
                    &#10162;
                </div>
            </div>

        );
    }
}

export default AppBar;
