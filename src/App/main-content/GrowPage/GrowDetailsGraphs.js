import React, { Component } from 'react';
import '../../../styles/App.css';

import GraphSensors from '../Graphs/GraphSensors.js'


class GrowDetailsGraphs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            elementSize: []
        };

        this.sizeUpdated = 0
    }

    componentDidMount() {
        this._ismounted = true;

        // var tempSize = [this.divRef.clientWidth, this.divRef.clientHeight]
        // console.log("TEMPSIZE")       
        // console.log(tempSize)
        // var dateNow = new Date()
        // this.sizeUpdated = dateNow.getTime()
        // this.setState({ 
        //     elementSize: tempSize,
        //  });

    }

    componentDidUpdate() {
        var dateNow = new Date()
        if ((dateNow.getTime() - this.sizeUpdated) > 5000) {
            var tempSize = [this.divRef.clientWidth, this.divRef.clientHeight]
            console.log("TEMPSIZE UPDATE")       
            console.log(tempSize)

            if (tempSize !== this.state.elementSize) {
                this.setState({ elementSize: tempSize });
                this.sizeUpdated = dateNow.getTime();
            }
        }
    }

    componentDidCatch() {

    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    render() {
        return (

            <div id="Grow-Details-Graphs-Page" ref={element => this.divRef = element}>
                <GraphSensors parentSize={this.state.elementSize} />
            </div>

        );
    }
}

export default GrowDetailsGraphs;
