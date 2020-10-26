import React, { Component } from 'react';
import '../../styles/App.css';

import GrowDataDisplay from '../Components/_Pages/GrowPage/GrowDataDisplay.js'


class AllPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.sensorAndLineUpdate()
    }

    componentDidUpdate = () => {
        if (this.state.ACTIVE_INIT !== this.props.grow) {
            this.setState({ ACTIVE_INIT: this.props.grow });
            this.sensorAndLineUpdate()
        }
    }

    sensorAndLineUpdate = () => {
        var sensorPIDS = []

        this.props.userGrows.forEach((grow) => {
            sensorPIDS[grow.id] = []
            grow.config.SENSORS.forEach((sensor, key) => {
                sensorPIDS[grow.id][key] = sensor.PID
            });
        })

        this.setState({
            sensorPIDS: sensorPIDS
        });
    }

    setGrow = (e) => {
        this.props.userGrows.forEach((grow) => {
            if (grow.id === e.currentTarget.getAttribute('data-value')) {
                this.props.setGrow(grow)
            }
        })
    }

    render() {

        var renderGrowDataDisplays = []
        if (this.props.userGrows && this.state.sensorPIDS) {
            renderGrowDataDisplays = this.props.userGrows.map((grow) => {
                return (
                    < div onClick={this.setGrow} data-value={grow.id} key={grow.id} style={{ cursor: 'pointer' }} >
                        <GrowDataDisplay key={grow.id} processedData={this.props.processedData[grow.id]} grow={grow} user={this.state.user} activeLines={this.state.activeLines} sensorPIDS={this.state.sensorPIDS[grow.id]} />
                    </div >
                )
            })
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', minWidth: '100%' }}>
                <div className="Grow-Details-Page-Panel">
                    <div style={{ width: "100%", display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {renderGrowDataDisplays}
                    </div>
                </div>
            </div>

        );
    }
}

export default AllPage;
