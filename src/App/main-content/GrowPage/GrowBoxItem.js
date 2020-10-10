import React, { Component } from 'react';
import '../../../styles/App.css';

import GrowDataDisplay from './GrowDataDisplay'

import GraphSensorsBox from '../Graphs/GraphSensorsBox'

import moment from 'moment'


class GrowBoxItem extends Component {

	constructor(props) {
		super(props);
		this.state = {
			grow: this.props.grow,
			activeIndicatorStyle: 'Grow-Active-Indicator-Circle',
			graphElementSize: [150, 150],
			graphSizeUpdated: 0 // init at 0
		};

	}

	componentDidMount = () => {
		this._ismounted = true;

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

			var tempSize = [this.divRef.clientWidth + (this.divRef.clientWidth / 100) * 10, this.divRef.clientHeight + 55]

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

			var tempSize = [this.divRef.clientWidth + (this.divRef.clientWidth / 100) * 10, this.divRef.clientHeight + 55]

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

	openGrow = () => {
		this.props.openGrow(this.props.grow)
	}

	checkActive = (lastUpdateTime) => {

		if (lastUpdateTime) {
			var now = new Date().getTime();

			var difference = now - lastUpdateTime

			if (this._ismounted) {

				if (difference >= 120000 && difference < 24000) {
					if (this.activeIndicatorStyle !== 'Grow-Active-Indicator-Circle Data-Warning-Background') {
						this.activeIndicatorStyle = 'Grow-Active-Indicator-Circle Data-Warning-Background'

						this.setState({
							activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Warning-Background'
						});
					}

				}

				if (difference >= 240000) {
					if (this.activeIndicatorStyle !== 'Grow-Active-Indicator-Circle Data-Danger-Background') {
						this.activeIndicatorStyle = 'Grow-Active-Indicator-Circle Data-Danger-Background'

						this.setState({
							activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Danger-Background'
						});
					}
				}

				if (difference < 120000) {
					if (this.activeIndicatorStyle !== 'Grow-Active-Indicator-Circle Data-Optimal-Background') {
						this.activeIndicatorStyle = 'Grow-Active-Indicator-Circle Data-Optimal-Background'

						this.setState({
							activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Optimal-Background'
						});
					}
				}
			}

		} else {
			console.log("NO LAST UPDATE ERROR")
		}

	}

	render() {

		var lastUpdate = null;
		if (this.props.liveGrowData[this.props.grow.id]) {

			var updatedAtDate = new Date(this.props.liveGrowData[this.props.grow.id].time * 1000)

			if (updatedAtDate !== this.updatedAtDate) {
				this.updatedAtDate = updatedAtDate
				this.checkActive(updatedAtDate.getTime())
			}

			lastUpdate = moment(updatedAtDate).fromNow()
		}


		return (
			<div className="Grow-Box-Item">

				<div className="Grow-Box-Item-Main">
					<div className="Grow-Box-Item-Header">

						<div className="Grow-Box-Grow-Name" onClick={this.openGrow}>
							{this.props.grow.name}
						</div>
						<div className="Grow-Box-Updated">
							update<i><b>: {lastUpdate}</b></i>
							<div className={this.state.activeIndicatorStyle} />
						</div>
					</div>

					<div className="Grow-Box-Info">
						<div className="Grow-Box-Info-Text-Area">

							{(() => {
								if (this.props.liveGrowData) {
									return <GrowDataDisplay liveData={this.props.liveGrowData[this.props.grow.id]} />
								}
							})()}

						</div>

						<div className="Grow-Box-Info-Graph-Area" ref={element => this.divRef = element}>
							<GraphSensorsBox parentSize={this.state.graphElementSize} grow={this.props.grow} rawGrowData={this.props.rawGrowData} />
						</div>
					</div>

				</div>

			</div>
		);
	}
}

export default GrowBoxItem;
