import React, { Component } from 'react';
import '../../styles/App.css';

import GraphAllPage from '../Components/_Pages/AllPage/GraphAllPage.js'
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

    toggleSensor = (data) => {
        console.log("button not connected", data)
    }

    render() {

        var renderGrowDataDisplays = []
        if (this.props.userGrows && this.state.sensorPIDS) {
            renderGrowDataDisplays = this.props.userGrows.map((grow) => {
                return <GrowDataDisplay key={grow.id} toggleLine={this.toggleSensor} processedData={this.props.processedData[grow.id]} grow={grow} user={this.state.user} activeLines={this.state.activeLines} sensorPIDS={this.state.sensorPIDS[grow.id]} />
            })
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', minWidth: '100%' }}>
                <div style={{ width: "100%", height: "60vh", minHeight: "60vh", background: "#000" }} ref={element => this.divRef = element} >



                    {/* {(() => {
                        if (this.state.growIDs && this.state.groupedSensors) {
                            return <GraphAllPage processedData={this.props.processedData} groupedSensors={this.state.groupedSensors} userGrows={this.props.userGrows} user={this.state.user} />
                        }
                    })()} */}



                </div >
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
