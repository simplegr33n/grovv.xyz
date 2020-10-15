import React, { Component } from 'react';
import '../../styles/App.css';

import AllGraph from './Graphs/AllGraph'

import moment from 'moment'

import { WiThermometer, WiHumidity, WiHurricane, WiCloudUp, WiThermometerExterior } from 'react-icons/wi';
import co2svg from '../../assets/co2svg.svg'
import tvocSvg from '../../assets/tvoc-svg.svg'



class AllGraphs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            grow: this.props.grow,
            activeIndicatorStyle: 'Grow-Active-Indicator-Circle',
            graphElementSize: [150, 150], // needs init
            graphSizeUpdated: 0, // init at 0
            growIDs: []
        };

    }

    componentDidMount = () => {
        this._ismounted = true;

        if (this.props.userGrows) {

            var activeLines = []
            var growIDs = []

            for (const [key, value] of Object.entries(this.props.userGrows)) {

                var grow = this.props.userGrows[key]

                // add all sensors to active lines
                var growActiveLines = []
                this.props.userGrows[key].config.SENSORS.forEach((sensor, key) => {
                    if (growActiveLines[key] !== sensor.PID) {
                        growActiveLines[key] = sensor.PID + "^" + grow.id
                        if (!growIDs.includes(grow.id)) {
                            growIDs[growIDs.length] = grow.id
                        }
                    }
                });

                activeLines[grow.id] = growActiveLines
            }


            this.setState({
                activeLines: activeLines, // same same for now.. to init
                groupedSensors: activeLines,
                growIDs: growIDs
            });
        }

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

    toggleLine = (e) => {
        var data = e.currentTarget.getAttribute('data-value')

        var tempActiveLines = this.state.activeLines[data.split("^")[1]]

        if (tempActiveLines.includes(data)) {
            const index = tempActiveLines.indexOf(data);
            if (index > -1) {
                tempActiveLines.splice(index, 1);
            }
        } else {
            tempActiveLines[tempActiveLines.length] = data
        }

        var tempAllActive = this.state.activeLines
        tempAllActive[data.split("^")[1]] = tempActiveLines

        this.setState({
            activeLines: tempAllActive
        });

    }


    render() {

        var sensorInfoRows = []
        if (this.state.activeLines) {
            sensorInfoRows = this.props.userGrows.map(grow => grow.config.SENSORS.map((sensor, key) => {
                return (
                    <div className="AllGraph-Main-Data-Display-Row" key={sensor.PID}>

                        {(() => {
                            var pid = sensor.PID
                            var tIndex = key
                            var curSensor = grow.config.SENSORS[tIndex]
                            var setOpacity = 0.3
                            var setPaddingTop = '3px'
                            var dataVal = pid + "^" + grow.id



                            if (!this.state.activeLines || this.state.activeLines[grow.id].includes(dataVal)) {
                                setOpacity = 1
                                setPaddingTop = '4px'
                            }

                            return (
                                <div data-value={dataVal} key={pid} onClick={this.toggleLine} style={{ width: '120px', maxHeight: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', fontSize: '0.65em', cursor: 'pointer', background: '#0c140d', opacity: setOpacity, color: grow.config.SENSORS[tIndex].color }}  >
                                    <div style={{ paddingTop: setPaddingTop }} > {curSensor.name}</div>

                                    {(() => {
                                        if (curSensor.type === "airTemp") {
                                            return <WiThermometer style={{ color: '#FFF', fontSize: '30px' }} />
                                        } else if (curSensor.type === "humidity") {
                                            return <WiHumidity style={{ color: '#FFF', fontSize: '30px' }} />
                                        } else if (curSensor.type === "fan") {
                                            return <WiHurricane style={{ color: '#FFF', fontSize: '30px' }} />
                                        } else if (curSensor.type === "humidifier") {
                                            return <WiCloudUp style={{ color: '#FFF', fontSize: '30px' }} />
                                        } else if (curSensor.type === "waterTemp") {
                                            return <WiThermometerExterior style={{ color: '#FFF', fontSize: '30px' }} />
                                        } else if (curSensor.type === "co2") {
                                            return <img src={co2svg} alt="CO2 Icon" style={{ position: 'relative', display: 'inline-block', maxHeight: '28px' }} />
                                        } else if (curSensor.type === "tvoc") {
                                            return <img src={tvocSvg} alt="TVOC Icon" style={{ position: 'relative', display: 'inline-block', maxHeight: '28px' }} />
                                        } else {
                                            return <div />
                                        }
                                    })()}

                                </div>
                            )
                        })()}
                        {(() => {
                            var pid = sensor.PID
                            var tIndex = key
                            var curSensor = grow.config.SENSORS[tIndex]
                            var setIndicatorColor = '#FFF'

                            if (this.props.liveGrowData && this.props.liveGrowData[grow.id] && (curSensor._mean || curSensor._mean === 0) && (curSensor._deviation || curSensor._deviation === 0)) {
                                if (((curSensor._mean + (curSensor._deviation * 2)) < this.props.liveGrowData[grow.id][pid]) || ((curSensor._mean - (curSensor._deviation * 2)) > this.props.liveGrowData[grow.id][pid])) {
                                    setIndicatorColor = '#FF0000' // BAD
                                } else if (((curSensor._mean + (curSensor._deviation)) < this.props.liveGrowData[grow.id][pid]) || ((curSensor._mean - (curSensor._deviation)) > this.props.liveGrowData[grow.id][pid])) {
                                    setIndicatorColor = '#ded954' // WARN
                                } else {
                                    setIndicatorColor = '#38c538' // GOOD
                                }
                            }

                            return (
                                <div className="Grow-Details-Main-Data-Current-Data" style={{ background: setIndicatorColor }}>

                                    {(() => {
                                        if (!this.props.liveGrowData[grow.id]) {
                                            return
                                        }
                                        var tIndex = key
                                        var curSensor = grow.config.SENSORS[tIndex]

                                        return <div>{Math.round(this.props.liveGrowData[grow.id][pid] * 10) / 10}{curSensor.unit}</div>
                                    })()}
                                </div>
                            )
                        })()}
                    </div>
                )
            }
            )
            );
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: "100vw" }} ref={element => this.divRef = element} >
                    <div className="AllGraphs-Graph-Item">
                        <div className="AllGraphs-Graph-Main">
                            <div className="AllGraphs-Info">
                                <div className="Grow-Box-Info-Graph-Area" >
                                    <AllGraph parentSize={this.state.graphElementSize} rawGrowData={this.props.threeDayData} activeLines={this.state.activeLines} groupedSensors={this.state.groupedSensors} userGrows={this.props.userGrows} growIDs={this.state.growIDs} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                <div className="Grow-Details-Page-Panel">
                    <div id="Grow-Details-Data-Display">

                        <div id="All-Graphs-Buttons">

                            {sensorInfoRows}

                        </div>

                    </div>
                </div>
            </div>

        );
    }
}

export default AllGraphs;
