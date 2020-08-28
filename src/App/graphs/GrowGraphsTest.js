import React, { Component } from 'react';
import '../../styles/App.css';

import GraphSensorsTest from '../main-content/Graphs/GraphSensorsTest.js'


class GrowGraphsTest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            elementSize: [800, 400],
            growDeprecate: null
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

        if (this.props.growDeprecate) {
            if (this.state.growDeprecate !== this.props.growDeprecate) {
                this.setState({ growDeprecate: this.props.growDeprecate });

            }
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (

            <div id="Grow-Details-Graphs-Page" ref={element => this.divRef = element}>
                <GraphSensorsTest parentSize={this.state.elementSize} growDeprecate={this.props.growDeprecate} />
            </div>

        );
    }
}

export default GrowGraphsTest;