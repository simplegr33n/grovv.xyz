import React, { Component } from 'react';
import '../../../styles/App.css';

import GraphAllGrows from '../_Graphs/GraphAllGrows.js'
import GrowDataDisplay from '../GrowPage/GrowDataDisplay.js'


class AllGraphs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            grow: this.props.grow,
            graphElementSize: [150, 150], // needs init
            graphSizeUpdated: 0 // init at 0
        };

    }

    componentDidMount = () => {
        this._ismounted = true;

        if (this.props.user) {
            this.setState({
                user: this.props.user,
                activeLines: this.props.user.PREFS.GRAPHS.AllGraph.showSensors
            })
        }

        if (this.props.userGrows && this.props.user) {
            if (this.props.userGrows === this.userGrows) {
                return
            }
            this.userGrows = this.props.userGrows

            var activeLines = []

            for (const [key] of Object.entries(this.props.userGrows)) {

                var grow = this.props.userGrows[key]

                // add all sensors to active lines
                var growActiveLines = []
                this.props.userGrows[key].config.SENSORS.forEach((sensor, key) => {

                    if (growActiveLines[key] !== sensor.PID) {

                        var tempIdentifier = sensor.PID + "^" + grow.id

                        if (this.props.user.PREFS) {
                            if (this.props.user.PREFS.GRAPHS) {
                                if (this.props.user.PREFS.GRAPHS.AllGraph) {
                                    if (this.props.user.PREFS.GRAPHS.AllGraph.showSensors) {
                                        if (this.props.user.PREFS.GRAPHS.AllGraph.showSensors[tempIdentifier] === false) {
                                            return
                                        }
                                    }
                                }
                            }
                        }

                        growActiveLines[growActiveLines.length] = tempIdentifier

                    }
                });

                activeLines[grow.id] = growActiveLines
            }


            this.setState({
                groupedSensors: activeLines
            });
        }

        this.calcGraphDimensions()
    }

    componentWillUnmount = () => {
        this._ismounted = false;
    }

    componentDidUpdate() {
        this.calcGraphDimensions()

        if (!this.state.growIDs) {
            // continue     
        } else if (this.state.growIDs.length !== this.props.userGrows.length) {
            // continue
        } else {
            return
        }

        if (this.props.userGrows && (!this.state.growIDs || (this.state.growIDs && (this.state.growIDs.length !== this.props.userGrows.length)))) {
            var growIDs = this.state.growIDs
            if (!growIDs) {
                growIDs = []
            }

            for (const [key] of Object.entries(this.props.userGrows)) {
                if (!growIDs || !growIDs.includes(this.props.userGrows[key].id)) {
                    growIDs[growIDs.length] = this.props.userGrows[key].id
                }
            }

            this.setState({
                growIDs: growIDs
            });
        }
    }

    calcGraphDimensions() {
        var dateNow = new Date()

        if (((this.state.graphElementSize !== [this.divRef.clientWidth, this.divRef.clientHeight]) && ((dateNow.getTime() - this.state.graphSizeUpdated) > 500))) {

            var tempSize = [this.divRef.clientWidth + (this.divRef.clientWidth / 100) * 12, this.divRef.clientHeight + (this.divRef.clientHeight / 100) * 14]

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

    toggleLine = (data) => {
        // // update firebase data
        var tempUser = this.props.user

        if (tempUser.PREFS) {
            if (tempUser.PREFS.GRAPHS) {
                if (tempUser.PREFS.GRAPHS.AllGraph) {
                    if (tempUser.PREFS.GRAPHS.AllGraph.showSensors) {
                        if (tempUser.PREFS.GRAPHS.AllGraph.showSensors[data] === false) {
                            tempUser.PREFS.GRAPHS.AllGraph.showSensors[data] = true
                            this.setUserPrefs(tempUser)
                            this.setState({ user: tempUser })
                            return
                        }
                    }
                }
            }
        }
        tempUser.PREFS.GRAPHS.AllGraph.showSensors[data] = false
        this.setUserPrefs(tempUser)
        this.setState({ user: tempUser })
    }

    toggleWindow = (tWindow) => {
        // update firebase data
        var tempUser = this.props.user
        tempUser.PREFS.GRAPHS.AllGraph.timeWindow = tWindow
        this.setUserPrefs(tempUser)
    }

    setUserPrefs = (data) => {
        this.props.setFirebaseUser(data)
    }


    render() {

        var sensorInfoColumns = []
        if (this.state.growIDs && this.props.userGrows) {

            sensorInfoColumns = this.props.userGrows.map((grow) => {
                return (
                    <GrowDataDisplay grow={grow} key={grow.id} toggleLine={this.toggleLine} threeDayData={this.props.threeDayData} liveGrowData={this.props.liveGrowData} user={this.state.user} />
                )
            })

        }


        return (
            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden' }}>
                <div style={{ width: "100vw", height: "60vh", minHeight: "60vh" }} ref={element => this.divRef = element} >
                    {(() => {
                        if (this.state.growIDs && this.state.graphElementSize && this.state.groupedSensors) {
                            return <GraphAllGrows parentSize={this.state.graphElementSize} rawGrowData={this.props.threeDayData} groupedSensors={this.state.groupedSensors} userGrows={this.props.userGrows} growIDs={this.state.growIDs} toggleWindow={this.toggleWindow} user={this.state.user} />
                        }
                    })()}
                </div >
                <div className="Grow-Details-Page-Panel" style={{ zIndex: 99 }}>
                    <div id="Grow-Details-Data-Display">

                        <div id="All-Graphs-Buttons">

                            {sensorInfoColumns}

                        </div>

                    </div>
                </div>
            </div>

        );
    }
}

export default AllGraphs;
