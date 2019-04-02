import React, { Component } from 'react';
import '../../styles/App.css';

import { Rnd } from 'react-rnd';



class TestResizeDraggable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 40,
            height: 40,
            x: 150,
            y: 200,
            URLS: this.props.urls
        };

        console.log(this.props.urls)
    }

    render() {
        return (
            <div id="Test-Resize-Draggable-Page">

                <Rnd
                    className="test1"
                    default={{
                        x: 0,
                        y: 0,
                        width: 320,
                        height: 200,
                    }}>
                    <div className="moveHandle">&#10500;</div>
                    <object className="Rnd-View" style={{ zIndex: this.state.zPlotly }} type="text/html" data={this.props.urls.plotly} width="100%" height="100%" aria-label="plotly" />
                </Rnd>

                <Rnd
                    className="test1"
                    default={{
                        x: 20,
                        y: 20,
                        width: 320,
                        height: 200,
                    }}>
                    <div className="moveHandle">&#10500;</div>
                    <object className="Rnd-View" style={{ zIndex: this.state.zLivecam }} type="text/html" data={this.props.urls.livecam} width="100%" height="100%" aria-label="live cam" />
                </Rnd>

                <Rnd
                    className="test1"
                    default={{
                        x: 40,
                        y: 40,
                        width: 320,
                        height: 200,
                    }} >
                    <div className="moveHandle">&#10500;</div>
                    <object className="Rnd-View" style={{ zIndex: this.state.zVeggerPlotly }} type="text/html" data={this.props.urls.vegger_plotly} width="100%" height="100%" aria-label="vegger plotly" />

                </Rnd>

                <Rnd
                    className="test1"
                    default={{
                        x: 60,
                        y: 60,
                        width: 320,
                        height: 200,
                    }}>
                    <div className="moveHandle">&#10500;</div>
                    <object className="Rnd-View" style={{ zIndex: this.state.zVeggerLivecam }} type="text/html" data={this.props.urls.vegger_livecam} width="100%" height="100%" aria-label="vegger live cam" />

                </Rnd>

            </div>
        );
    }
}

export default TestResizeDraggable;
