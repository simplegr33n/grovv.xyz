import React, { Component } from 'react';
import '../../../styles/App.css';

import GraphGrow from './GraphGrow.js'


class GrowDetailsGraphs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            graphElementSize: [150, 150],
            graphSizeUpdated: 0
        };

        this.graphSizeUpdated = 0
    }

    componentDidMount() {
        this.calcGraphDimensions()
    }

    componentDidUpdate() {
        this.calcGraphDimensions()
    }

    calcGraphDimensions() {
        var dateNow = new Date()


        if (((this.state.graphElementSize !== [this.divRef.clientWidth, this.divRef.clientHeight]) && ((dateNow.getTime() - this.state.graphSizeUpdated) > 500))) {

            var tempSize = [this.divRef.clientWidth + (this.divRef.clientWidth / 100) * 10, this.divRef.clientHeight + (this.divRef.clientHeight / 100) * 14]

            if (tempSize !== this.state.graphElementSize) {
                this.setState({
                    graphElementSize: tempSize,
                    graphSizeUpdated: dateNow.getTime()
                });
            }
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (
            <div style={{ position: 'relative', width: "100vw", height: "80vh", minHeight: "80vh", background: "#000" }} ref={element => this.divRef = element}>
                <GraphGrow setDisplayWindow={this.props.setDisplayWindow} displayWindow={this.props.displayWindow} activeLines={this.props.activeLines} parentSize={this.state.graphElementSize} processedData={this.props.processedData} grow={this.props.grow} />
            </div>
        );
    }
}

export default GrowDetailsGraphs;
