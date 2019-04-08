import React, { Component } from 'react';
import '../../styles/resizeableView.css';

import { Rnd } from 'react-rnd';



class ResizeDraggableView extends Component {

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
            <div id="Resizeable-Console-Page">

                <div className="Resizeable-Row">
                    <div className="Resizeable-Plotly">
                        <Rnd
                            className="RND-Plotly"
                            default={{
                                x: 0,
                                y: 0,
                                width: "100%",
                                height: "100%",
                            }}>
                            <div className="moveHandle">&#10500;</div>
                            <object className="Rnd-View" style={{ zIndex: this.state.zPlotly }} type="text/html" data={this.props.urls.plotly} width="100%" height="100%" aria-label="plotly" />
                        </Rnd>
                    </div>

                    <div className="Resizeable-Cam">
                        <Rnd
                            className="RND-Cam"
                            default={{
                                x: 0,
                                y: 0,
                                width: "100%",
                                height: "100%",
                            }}>
                            <div className="moveHandle">&#10500;</div>
                            <object className="Rnd-View" style={{ zIndex: this.state.zLivecam }} type="text/html" data={this.props.urls.livecam} width="100%" height="100%" aria-label="live cam" />
                        </Rnd>
                    </div>

                </div>


                <div className="Resizeable-Row">
                    <div className="Resizeable-Plotly">
                        <Rnd
                            className="RND-Plotly"
                            default={{
                                x: 0,
                                y: 0,
                                width: "100%",
                                height: "100%",
                            }} >
                            <div className="moveHandle">&#10500;</div>
                            <object className="Rnd-View" style={{ zIndex: this.state.zVeggerPlotly }} type="text/html" data={this.props.urls.vegger_plotly} width="100%" height="100%" aria-label="vegger plotly" />

                        </Rnd>
                    </div>


                    <div className="Resizeable-Cam">
                        <Rnd
                            className="RND-Cam"
                            default={{
                                x: 0,
                                y: 0,
                                width: "100%",
                                height: "100%",
                            }}>
                            <div className="moveHandle">&#10500;</div>
                            <object className="Rnd-View-Vegger" style={{ zIndex: this.state.zVeggerLivecam }} type="text/html" data={this.props.urls.vegger_livecam} width="100%" height="100%" aria-label="vegger live cam" />

                        </Rnd>
                    </div>
                </div>

            </div>
        );
    }
}

export default ResizeDraggableView;
