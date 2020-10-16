import React, { Component } from 'react';
import '../../styles/App.css';

import LifetimeGraph from './Graphs/LifetimeGraph'

import moment from 'moment' // for datetime...


class LifetimeGraphs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            graphElementSize: [150, 150], // needs init
            graphSizeUpdated: 0 // init at 0
        };

    }

    componentDidMount = () => {
        this._ismounted = true;

        this.initGraphDimensions()
    }

    componentWillUnmount = () => {
        this._ismounted = false;
    }

    componentDidUpdate() {
        this.calcGraphDimensions()
    }

    initGraphDimensions() {
        var dateNow = new Date()

        if (((this.state.graphElementSize !== [this.divRef.clientWidth, this.divRef.clientHeight]))) {

            var tempSize = [this.divRef.clientWidth + (this.divRef.clientWidth / 100) * 10, 500]

            if (tempSize !== this.state.graphElementSize) {
                if (this._ismounted) {
                    this.setState({
                        graphElementSize: tempSize,
                        graphSizeUpdated: dateNow.getTime()
                    });
                }
            }
        }
    }

    calcGraphDimensions() {
        var dateNow = new Date()

        if (((this.state.graphElementSize !== [this.divRef.clientWidth, this.divRef.clientHeight]) && ((dateNow.getTime() - this.state.graphSizeUpdated) > 500))) {

            var tempSize = [this.divRef.clientWidth + (this.divRef.clientWidth / 100) * 10, 500]

            if (tempSize !== this.state.graphElementSize) {
                if (this._ismounted) {
                    this.setState({
                        graphElementSize: tempSize,
                        graphSizeUpdated: dateNow.getTime()
                    });
                }
            }
        }
    }


    render() {

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: "100vw" }} ref={element => this.divRef = element} >
                    <div className="AllGraphs-Graph-Item">
                        <div className="AllGraphs-Graph-Main">
                            <div className="AllGraphs-Info">
                                <div className="Grow-Box-Info-Graph-Area" >
                                    <LifetimeGraph parentSize={this.state.graphElementSize} rawGrowData={this.props.threeDayData} groupedSensors={this.state.groupedSensors} userGrows={this.props.userGrows} growIDs={this.state.growIDs} toggleWindow={this.toggleWindow} user={this.props.user} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                <div className="Grow-Details-Page-Panel">

                </div>
            </div>

        );
    }
}

export default LifetimeGraphs;
