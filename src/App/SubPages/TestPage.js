import React, { Component } from 'react';
import '../../styles/App.css';

import GraphTestPage from '../Components/_Pages/TestPage/GraphTestPage.js'
import GrowDataDisplay from '../Components/_Pages/GrowPage/GrowDataDisplay.js'


class TestPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    componentDidUpdate = () => {

    }

    toggleSensor = (data) => {
        console.log("button not connected", data)
    }

    fetchWeather = () => {
        fetch('https://api.openweathermap.org/data/2.5/weather?id=5946768&appid=4132b2c4cef7a9c193bac2021b8c0420')
            .then(response => response.json())
            .then(data => console.log(data));


        // unnauthorized for below unfortunately

        // fetch('http://history.openweathermap.org/data/2.5/history/city?id=2885679&type=hour&appid=4132b2c4cef7a9c193bac2021b8c0420')
        //     .then(response => response.json())
        //     .then(data => console.log(data));
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
                <div style={{ width: '100%', height: '60vh', minHeight: '60vh', background: '#000', overflow: 'hidden' }} ref={element => this.divRef = element} >
                    {(() => {
                        if (this.props.processedData) {
                            return <GraphTestPage processedData={this.props.processedData} groupedSensors={this.state.groupedSensors} userGrows={this.props.userGrows} user={this.state.user} />
                        }
                    })()}
                </div >

                {/* <div onClick={this.fetchWeather} style={{ width: '120px', height: '60px', maxHeight: '60px', background: '#FF0000', overflow: 'hidden' }}>
                    BIG BUTTON!
                </div > */}

                <div className="Grow-Details-Page-Panel">
                    <div style={{ width: "100%", display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {renderGrowDataDisplays}
                    </div>
                </div>
            </div>

        );
    }
}

export default TestPage;
