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
			camURL: null,
			growDeprecate: '',
			graphElementSize: [150, 150],
		};

		this.graphSizeUpdated = 0;
	}

	componentDidMount = () => {
		this._ismounted = true;

		//TODO: Remove condition
		if (this.props.grow.id === '-LdtfBTlG6Fgg-ADD8-b' || this.props.grow.id === '-Lg5uudAktkyqOauRjY-') {

			this.getLiveCam = this.watchPiCam()

			if (this._ismounted) {
				this.setState({ growDeprecate: 'flower' });
				this.setState({ camURL: this.props.grow.urls.cam + 'cam_pic.php?time=' });

			}

		} else {

			if (this._ismounted) {
				this.setState({ growDeprecate: 'vegger' });
			}
		}

		if (this.props.grow.urls.cam && !(this.props.grow.id === '-LdtfBTlG6Fgg-ADD8-b' || this.props.grow.id === '-Lg5uudAktkyqOauRjY-')) {

			if (this._ismounted) {
				this.setState({ camURL: this.props.grow.urls.cam });
			}

		}
	}

	componentWillUnmount = () => {
		this._ismounted = false;
	}

	componentDidUpdate() {
		var dateNow = new Date()

		if (((this.state.graphElementSize !== [this.divRef.clientWidth, this.divRef.clientHeight]) && ((dateNow.getTime() - this.graphSizeUpdated) > 500))) {

			// tODO: remove, hacky
			if ((this.divRef.clientWidth - this.state.graphElementSize[0]) < 30) {
				return;
			}


			var tempSize = [this.divRef.clientWidth, this.divRef.clientHeight]

			if (tempSize !== this.state.graphElementSize) {
				if (this._ismounted) {
					this.setState({ graphElementSize: tempSize });
				}
				this.graphSizeUpdated = dateNow.getTime();
			}
		}

	}

	// TODO: remove function
	watchPiCam = () => {
		var tempURL = this.props.grow.urls.cam + 'cam_pic.php?time='
		var i = 0
		setInterval(() => {
			i++
			var tempCamURL = tempURL + i.toString()
			if (this._ismounted) {
				this.setState({ camURL: tempCamURL });
			}
		}, 5000);
	}

	openFullCam = (ev) => {
		this.props.openFullCam(ev.target.dataset.value)
	}

	openGrow = () => {
		this.props.openGrow(this.props.grow)
	}

	openMainPage = (ev) => {
		this.props.openMainPage(ev.target.dataset.value, this.props.grow.id)
	}

	checkActive = (lastUpdateTime) => {

		if (lastUpdateTime) {
			var now = new Date().getTime();

			var difference = now - lastUpdateTime


			// if (difference >= 3000000) {
			// 	this.setState({
			// 		activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Neutral-Background'
			// 	});
			// }

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
			// console.log(this.props.liveGrowData[this.props.grow.id])

			var updatedAtDate = new Date(this.props.liveGrowData[this.props.grow.id].time * 1000)

			if (updatedAtDate !== this.updatedAtDate) {
				this.updatedAtDate = updatedAtDate
				this.checkActive(updatedAtDate.getTime())
			}

			lastUpdate = moment(updatedAtDate).fromNow()
		}





		return (
			<div className="Grow-Box-Item">

				<div className="Grow-Box-Cam-Div">
					<div className="Grow-Box-Cam-Full-Btn" data-value={this.props.grow.urls.cam} onClick={this.openFullCam}>&#9974;</div>
					<img className="Grow-Box-Cam" alt="cam" src={this.state.camURL} width="100%" height="100%" style={{ objectFit: 'contain', cursor: 'pointer' }} onClick={this.openGrow} />
				</div>

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
					<div className="Grow-Box-Function-Btns">
						<button className="Grow-Box-Function-Btn" data-value={'graphs'} onClick={this.openMainPage} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
						{/* <button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openMainPage} >CONFIG <span role="img" aria-label="grow config icon">&#128187;</span></button> */}
						<button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openMainPage} >FEED &#9619;&#9619;</button>
						<button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openMainPage} >&#9998;</button>
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
							<GraphSensorsBox parentSize={this.state.graphElementSize} growID={this.props.grow.id} rawGrowData={this.props.rawGrowData} />
						</div>


						{/* <img alt="preview" src={this.props.grow.previewImage} className="Grow-Box-Preview-Image" /> */}
					</div>



				</div>

			</div>
		);
	}
}

export default GrowBoxItem;
