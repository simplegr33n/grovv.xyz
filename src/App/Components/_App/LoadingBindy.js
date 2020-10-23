import React, { Component } from 'react';
import '../../../styles/App.css';

import { ReactComponent as TobyFace } from '../../../assets/tobyface.svg';


class LoadingBindy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            SHOWFIELDS: false
        };
    }


    render() {
        return (
            <div className="Loading-Screensaver">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: "#c3e7c340", borderRadius: '50%', marginTop: '30px', marginLeft: '60px', marginRight: '60px' }}>
                    <div style={{ maxHeight: '100vw', maxWidth: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: "#c3e7c340", borderRadius: '50%' }}>
                        < TobyFace
                            className="Flying-toby"
                            viewBox="0 0 110 110"
                            style={{ flex: 1, height: "10%", paddingLeft: "30%", paddingRight: "30%", paddingTop: "10%" }} />

                        <div style={{ color: "#000", fontWeight: 800, position: 'absolute', color: "#5da55d", top: '60px', fontSize: '50px' }}>
                            LOADING...
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default LoadingBindy;
