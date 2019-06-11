import React, { Component } from 'react';
import '../../../styles/App.css';

import GrowVisualEditor from './GrowVisualEditor'


class GrowSetUp extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }

    componentDidMount() {
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
    }



    render() {
        return (

            <div id="Grow-Set-Up-Page">
                <GrowVisualEditor baseDimensions={[900,600]}/>
                <div id="Grow-Items-List">
                    list
                </div>
            </div>

        );
    }
}

export default GrowSetUp;
