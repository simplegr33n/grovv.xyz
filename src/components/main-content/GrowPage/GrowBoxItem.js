import React, { Component } from 'react';
import '../../../styles/App.css';


import Firebase from '../../../config/firebaseConfig.js'

class GrowBoxItem extends Component {

	constructor(props) {
		super(props);
		this.state = {
			grow: this.props.grow,
			liveData: [],
			activeIndicatorStyle: 'Grow-Active-Indicator-Circle'
		};


		this.firebase = new Firebase();

	}

	componentDidMount() {
		//TODO: Remove condition
		if (this.props.grow.id === '-LdtfBTlG6Fgg-ADD8-b') {
			this.getLiveData()
		} else {
			this.getVeggerData()
		}

		if (this.props.grow.urls.cam) {
			this.setState({
				piCamImageUrl: this.props.grow.urls.cam,
			});
		}

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

	openMainPage = (ev) => {
		this.props.openMainPage(ev.target.dataset.value)
	}

	checkActive = (lastUpdateTime) => {
		var now = new Date();
		console.log("COMPARE ACTIVE TIME")

		if (lastUpdateTime) {
			console.log("DIFFERENCE!")
			var difference = now - (new Date(lastUpdateTime).getTime())
			console.log(difference)

			
				if (difference >= 3000000){
					this.setState({
						activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Neutral-Background'
					});
				}

				if (difference >= 240000){
					this.setState({
						activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Danger-Background'
					});
				}

				if (difference >= 120000){
					this.setState({
						activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Warning-Background'
					});
				}

				if (difference < 120000){
					this.setState({
						activeIndicatorStyle: 'Grow-Active-Indicator-Circle Data-Optimal-Background'
					});
				}

			

		
		} else {
			console.log("NO LAST UPDATE ERROR")
		}

	}

	render() {

		var cTemp = null;
		var fanSpeed = null;
		var humiPower = null;
		var humidity = null;
		var lastUpdate = null;
		if (this.state.liveData) {
			cTemp = this.state.liveData.cTemp
			cTemp = Math.round(cTemp * 10) / 10;
			fanSpeed = this.state.liveData.fanSpeed
			humiPower = this.state.liveData.humiPower
			humidity = this.state.liveData.humidity
			humidity = Math.round(humidity * 10) / 10;

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
					<div className="Grow-Box-Cam-Full-Btn" data-value={this.props.grow.urls.cam} onClick={this.openMainPage}>&#9974;</div>

					{/* TODO: Just get the actual image location for the Ganja Grove cam[not static..].. */}
					{(() => {
						if (this.state.piCamImageUrl !== null) {
							return (
								<img className="Grow-Box-Cam" alt="cam" src={this.props.grow.urls.cam} width="100%" height="100%" style={{ objectFit: 'contain' }} />
							)
						}
					})()}

				</div>

				<div className="Grow-Box-Item-Main">
					<div className="Grow-Box-Item-Header">

						<div className="Grow-Box-Grow-Name">
							{this.props.grow.name}
						</div>
						<div className="Grow-Box-Updated">
							updt: <i><b>{lastUpdate}</b></i>
							<div className={this.state.activeIndicatorStyle} />
						</div>
					</div>
					<div className="Grow-Box-Function-Btns">
						<button className="Grow-Box-Function-Btn" data-value={this.props.grow.urls.plotly} onClick={this.openMainPage} >DATA <span role="img" aria-label="grow data icon">&#128200;</span></button>
						<button className="Grow-Box-Function-Btn" data-value={'config'} onClick={this.openMainPage} >CONFIG <span role="img" aria-label="grow config icon">&#128187;</span></button>
						<button className="Grow-Box-Function-Btn-Feed" data-value={'feed'} onClick={this.openMainPage} >FEED &#9619;&#9619;</button>
						<button className="Grow-Box-Function-Btn-Edit-Feed" data-value={'edit-feed'} onClick={this.openMainPage} >&#9998;</button>
					</div>

					<div className="Grow-Box-Info">
						<div className="Grow-Box-Info-Text-Area">
							{(() => {
								if (cTemp) {
									var backgroundIndicator = null
									if (cTemp > 20 && cTemp < 27) {
										backgroundIndicator = "Data-Optimal-Background"
									} else if (cTemp <= 19 && cTemp > 28) {
										backgroundIndicator = "Data-Danger-Background"
									} else {
										backgroundIndicator = "Data-Warning-Background"
									}

									return (
										<div className="Grow-Box-Info-Section">
											<div className="Grow-Box-Info-Type">TEMP</div>
											<div className="Grow-Box-Dot-Lead"><div className="Grow-Box-Dot-Lead-Dots" /></div>
											<div className={backgroundIndicator}>
												<div className="Grow-Box-Info-Data">
													<div className="Grow-Box-Data-Raw">{cTemp}</div >
													<div className="Horizontal-20px-Gap"></div>
													<div className="Grow-Box-Data-Unit">°C</div>
												</div>
											</div>
										</div>
									)
								}
							})()}

							{(() => {
								if (fanSpeed) {
									return (
										<div className="Grow-Box-Info-Section">
											<div className="Grow-Box-Info-Type">FAN SPEED</div>
											<div className="Grow-Box-Dot-Lead"><div className="Grow-Box-Dot-Lead-Dots" /></div>
											<div className="Data-Neutral-Background">
												<div className="Grow-Box-Info-Data">
													<div className="Grow-Box-Data-Raw">{fanSpeed}</div >
													<div className="Horizontal-20px-Gap"></div>
													<div className="Grow-Box-Data-Unit">%</div>
												</div>
											</div>
										</div>
									)
								}
							})()}

							{(() => {
								if (humidity) {
									var backgroundIndicator = null
									if (humidity > 30 && humidity < 43) {
										backgroundIndicator = "Data-Optimal-Background"
									} else if (humidity <= 27 && humidity > 45) {
										backgroundIndicator = "Data-Danger-Background"
									} else {
										backgroundIndicator = "Data-Warning-Background"
									}

									return (
										<div className="Grow-Box-Info-Section">
											<div className="Grow-Box-Info-Type">HUMIDITY</div>
											<div className="Grow-Box-Dot-Lead"><div className="Grow-Box-Dot-Lead-Dots" /></div>
											<div className={backgroundIndicator}>
												<div className="Grow-Box-Info-Data">
													<div className="Grow-Box-Data-Raw">{humidity}</div >
													<div className="Horizontal-20px-Gap"></div>
													<div className="Grow-Box-Data-Unit">%RH</div>
												</div>
											</div>
										</div>
									)
								}
							})()}

							{(() => {
								if (humiPower) {
									return (
										<div className="Grow-Box-Info-Section">
											<div className="Grow-Box-Info-Type">HUMIDIFIER</div>
											<div className="Grow-Box-Dot-Lead"><div className="Grow-Box-Dot-Lead-Dots" /></div>
											<div className="Data-Neutral-Background">
												<div className="Grow-Box-Info-Data">
													<div className="Grow-Box-Info-Data">
														<div className="Grow-Box-Data-Raw">{humiPower}</div >
														<div className="Horizontal-20px-Gap"></div>
														<div className="Grow-Box-Data-Unit">%</div>
													</div>
												</div>

											</div>
										</div>
									)
								}
							})()}

						</div>

						<img alt="preview" src={this.props.grow.previewImage} className="Grow-Box-Preview-Image" />
					</div>



				</div>

			</div>
		);
	}
}

export default GrowBoxItem;
