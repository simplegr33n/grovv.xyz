import React, { Component } from 'react';
import '../../styles/App.css';

import GraphSensors from './Graphs/GraphSensors'

import moment from 'moment'


class AllGraphs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            grow: this.props.grow,
            activeIndicatorStyle: 'Grow-Active-Indicator-Circle',
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

            var tempSize = [this.divRef.clientWidth + (this.divRef.clientWidth / 100) * 10, 300]

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

            var tempSize = [this.divRef.clientWidth + (this.divRef.clientWidth / 100) * 10, 400]

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

        const graphs = this.props.userGrows.map((grow) => {

            // add all sensors to active lines
            var activeLines = []
            grow.config.SENSORS.forEach((sensor, key) => {
                if (activeLines[key] !== sensor.PID) {
                    activeLines[key] = sensor.PID
                }
            });

            return (
                <div key={grow.id} className="AllGraphs-Graph-Item">
                    <div className="AllGraphs-Graph-Main">
                        <div className="AllGraphs-Graph-Name" >
                            {grow.name}
                        </div>
                        <div className="AllGraphs-Info">
                            <div className="Grow-Box-Info-Graph-Area" >
                                <GraphSensors parentSize={this.state.graphElementSize} rawGrowData={this.props.threeDayData} grow={grow} activeLines={activeLines} />
                            </div>
                        </div>
                    </div>
                </div>
            )
        });



        return (
            <div style={{ width: "100%" }} ref={element => this.divRef = element} >
                { graphs}
            </div >
        );
    }
}

export default AllGraphs;
