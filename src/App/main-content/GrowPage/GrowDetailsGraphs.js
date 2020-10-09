import React, { Component } from 'react';
import '../../../styles/App.css';

import GraphSensors from '../Graphs/GraphSensors.js'


class GrowDetailsGraphs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            elementSize: [],
        };

        this.graphSizeUpdated = 0
    }

    componentDidMount() {
        this._ismounted = true;
    }

    componentDidUpdate() {
        if (this._ismounted === false) {
            return;
        }

        var dateNow = new Date()
        if (((this.state.elementSize !== [this.divRef.clientWidth, this.divRef.clientHeight]) && ((dateNow.getTime() - this.graphSizeUpdated) > 500))) {
            var tempSize = [this.divRef.clientWidth, this.divRef.clientHeight]

            if (tempSize !== this.state.elementSize) {
                this.setState({ elementSize: tempSize });
                this.graphSizeUpdated = dateNow.getTime();
            }
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (

            <div id="Grow-Details-Graphs-Page" ref={element => this.divRef = element}>
                <GraphSensors activeLines={this.props.activeLines} parentSize={this.state.elementSize} rawGrowData={this.props.rawGrowData} grow={this.props.grow} />
            </div>

        );
    }
}

export default GrowDetailsGraphs;
