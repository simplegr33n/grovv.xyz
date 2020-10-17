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
            var tempSize = [this.divRef.clientWidth + (this.divRef.clientWidth / 100) * 10, this.divRef.clientHeight + (this.divRef.clientHeight / 100) * 14]

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
            <div style={{ position: 'relative', width: "100vw", height: "80vh", minHeight: "80vh", background: "#000" }} ref={element => this.divRef = element}>
                <GraphSensors activeLines={this.props.activeLines} parentSize={this.state.elementSize} rawGrowData={this.props.rawGrowData} grow={this.props.grow} />
            </div>
        );
    }
}

export default GrowDetailsGraphs;
