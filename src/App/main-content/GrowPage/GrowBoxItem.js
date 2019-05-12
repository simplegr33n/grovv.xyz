import React, { Component } from 'react';
import '../../../styles/App.css';

import GrowDataDisplay from './GrowDataDisplay'

import GraphSensorsBox from '../Graphs/GraphSensorsBox'


import Firebase from '../../../config/firebaseConfig.js'

class GrowBoxItem extends Component {

	constructor(props) {
		super(props);
		this.state = {
			grow: this.props.grow,
			liveData: [],
			activeIndicatorStyle: 'Grow-Active-Indicator-Circle',
			camURL: null,
			growDeprecate: ''
		};


		this.firebase = new Firebase();



	}

	componentDidMount() {
		//TODO: Remove condition
		if (this.props.grow.id === '-LdtfBTlG6Fgg-ADD8-b') {
			this.getLiveData()
			this.watchPiCam()

			this.setState({ growDeprecate: 'flower' });
		} else {
			this.getVeggerData()

			this.setState({ growDeprecate: 'vegger' });
		}

		if(this.props.grow.urls.cam) {
			this.setState({
				camURL: this.props.grow.urls.cam
			});
		}

		
	}

	// TODO: remove function
	watchPiCam = () => {
		var tempURL = 'http://96.52.249.69:300/html/cam_pic.php?time='
		var i = 0
		setInterval(() => {
			i++
			var tempCamURL = tempURL + i.toString()
			this.setState({
				camURL: tempCamURL
			});
		}, 5000);
	}


	getLiveData = () => {
		// TODO: change path
		var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('sensors_live').child('flower')

		ref.on('value', (snapshot) => {

			var tempLiveData = snapshot.val()

			this.setState({
				liveData: tempLiveData
			});

			this.checkActive(tempLiveData.time)

		}, function (errorObject) {
			console.log("grow box get live data failed: " + errorObject.code);
		});

	}

	getVeggerData = () => {
		// TODO: REMOVE function
		var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('sensors_live').child('vegger')

		ref.on('value', (snapshot) => {

			var tempLiveData = snapshot.val()

			this.setState({
				liveData: tempLiveData
			});

			this.checkActive(tempLiveData.time)

		}, function (errorObject) {
			console.log("grow box get live data failed: " + errorObject.code);
		});
	}



	openFullCam = (ev) => {
		this.props.openFullCam(ev.target.dataset.value)
	}

	openGrow = () => {
		this.props.openGrow(this.props.grow)
	}

	openMainPage = (ev) => {
		console.log("openMainPage")
		console.log(ev.target.dataset.value)
		this.props.openMainPage(ev.target.dataset.value)
	}

	checkActive = (lastUpdateTime) => {

		if (lastUpdateTime) {
			var now = new Date();
			var difference = now - (new Date(lastUpdateTime).getTime())

			// if (difference >= 3000000) {
			// 	this.setState({
			// 		activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Neutral-Background'
			// 	});
			// }

			if (difference >= 120000) {
				this.setState({
					activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Warning-Background'
				});
			}

			if (difference >= 240000) {
				this.setState({
					activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Danger-Background'
				});
			}

			if (difference < 120000) {
				this.setState({
					activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Optimal-Background'
				});
			}

		} else {
			console.log("NO LAST UPDATE ERROR")
		}

	}

	render() {

		var lastUpdate = null;
		if (this.state.liveData) {
			// TODO... simplify below.
			var updatedAtDate = new Date(this.state.liveData.time)
			var updatedAtHoursString = updatedAtDate.getHours().toString()
			if (updatedAtHoursString.length === 1) {
				updatedAtHoursString = "0" + updatedAtHoursString
			}
			var updatedAtMinutesString = updatedAtDate.getMinutes().toString()
			if (updatedAtMinutesString.length === 1) {
				updatedAtMinutesString = "0" + updatedAtMinutesString
			}
			lastUpdate = updatedAtDate.toDateString() + " - " + updatedAtHoursString + ":" + updatedAtMinutesString
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
							updt: <i><b>{lastUpdate}</b></i>
							<div className={this.state.activeIndicatorStyle} />
						</div>
					</div>
					<div className="Grow-Box-Function-Btns">
						<button className="Grow-Box-Function-Btn" data-value={'graphs'} onClick={this.openMainPage} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
						<button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openMainPage} >CONFIG <span role="img" aria-label="grow config icon">&#128187;</span></button>
						<button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openMainPage} >FEED &#9619;&#9619;</button>
						<button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openMainPage} >&#9998;</button>
					</div>

					<div className="Grow-Box-Info">
						<div className="Grow-Box-Info-Text-Area">

							{(() => {
								if (this.state.liveData) {
									return <GrowDataDisplay liveData={this.state.liveData} />
								}
							})()}

						</div>

						<GraphSensorsBox parentSize={[150, 75]} growDeprecate={this.state.growDeprecate} />

						<img alt="preview" src={this.props.grow.previewImage} className="Grow-Box-Preview-Image" />
					</div>



				</div>

			</div>
		);
	}
}

export default GrowBoxItem;
