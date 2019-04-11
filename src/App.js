import React, { Component } from 'react';
import './styles/App.css';
import Firebase from './config/firebaseConfig.js'

// Assets
import cornerLogo from './assets/corner-logo.png'

// Auth
import SignIn from './components/auth/SignIn.js'
import SignUp from './components/auth/SignUp.js'

// Main Content
import EditProfile from './components/main-content/EditProfile.js'
import ResizeDraggableView from './components/main-content/ResizeDraggableView.js'

const mediumIndication = '#91eebb';
const warningIndication = '#FFA500';
const dangerIndication = '#FF0000';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mainContent: 'signin', // signin, signup, main, editprofile, etc.
			UID: null,
			username: '',
			URL_livecam: null,
			URL_plotly: null,
			URL_vegger_livecam: null,
			URL_vegger_plotly: null,
			zPlotly: 0,
			zLivecam: 0,
			zVeggerLivecam: 0,
			zVeggerPlotly: 0,
			sFlowerTemp: '',
			sFlowerHumidity: '',
			sVeggerTemp: '',
			sVeggerHumidity: ''
		};

		this.firebase = new Firebase()
		this.firebase.auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({ UID: user.uid });
				this.getUrls();
				this.getUsername();
				this.watchSensors();
			}
		});

		this.flowerTempRef = React.createRef()
		this.flowerHumidityRef = React.createRef()
		this.veggerTempRef = React.createRef()
		this.veggerHumidityRef = React.createRef()
	}

	watchSensors = () => {
		// Sensor data in firebase
		var ref = this.firebase.db.ref().child('sensor_data')

		ref.child("flower").limitToLast(1).on('child_added', (snapshot) => {
			console.log("new flower data key: " + snapshot.key);
			this.followFlower(snapshot.key);
		}, function (errorObject) {
			console.log("sensorwatch flower failed: " + errorObject.code);
		});

		ref.child("vegger").limitToLast(1).on('child_added', (snapshot) => {
			console.log("new vegger data key: " + snapshot.key);
			this.followVegger(snapshot.key);
		}, function (errorObject) {
			console.log("sensorwatch vegger failed: " + errorObject.code);
		});
	}

	followFlower = (key) => {
		// Flower data in firebase
		var ref = this.firebase.db.ref().child('sensor_data').child('flower').child(key)

		ref.on('child_added', (snapshot) => {
			let flowerTemp = Math.round(snapshot.val().cTemp * 10) / 10;
			let flowerHumidity = Math.round(snapshot.val().humidity * 10) / 10;

			// console.log(`Flower cTemp: ${flowerTemp} // Flower Humidity ${flowerHumidity} `);

			// SET safe ranges here 
			if (flowerTemp > 20 && flowerTemp < 27) {
				this.flowerTempRef.current.style.background = mediumIndication;
			} else if (flowerTemp < 19 || flowerTemp > 28) {
				this.flowerTempRef.current.style.background = dangerIndication;
			} else {
				this.flowerTempRef.current.style.background = warningIndication;
			}

			if (flowerHumidity > 30 && flowerHumidity < 43) {
				this.flowerHumidityRef.current.style.background = mediumIndication;
			} else if (flowerHumidity < 27 || flowerHumidity > 45) {
				this.flowerHumidityRef.current.style.background = dangerIndication;
			} else {
				this.flowerHumidityRef.current.style.background = warningIndication;
			}

			this.setState({
				sFlowerTemp: flowerTemp,
				sFlowerHumidity: flowerHumidity
			});

		}, function (errorObject) {
			console.log("follow flower failed: " + errorObject.code);
		});
	}

	followVegger = (key) => {
		// Vegger data in firebase
		var ref = this.firebase.db.ref().child('sensor_data').child('vegger').child(key)

		ref.on('child_added', (snapshot) => {
			let veggerTemp = Math.round(snapshot.val().cTemp * 10) / 10;
			let veggerHumidity = Math.round(snapshot.val().humidity * 10) / 10;

			// console.log(`Vegger cTemp: ${veggerTemp} // Vegger Humidity ${veggerHumidity} `);

			// SET safe ranges here 
			if (veggerTemp > 22 && veggerTemp < 29) {
				this.veggerTempRef.current.style.background = mediumIndication;
			} else if (veggerTemp < 20 || veggerTemp > 30) {
				this.veggerTempRef.current.style.background = dangerIndication;
			} else {
				this.veggerTempRef.current.style.background = warningIndication;
			}

			if (veggerHumidity > 40 && veggerHumidity < 80) {
				this.veggerHumidityRef.current.style.background = mediumIndication;
			} else if (veggerHumidity < 35 || veggerHumidity > 85) {
				this.veggerHumidityRef.current.style.background = dangerIndication;
			} else {
				this.veggerHumidityRef.current.style.background = warningIndication;
			}

			this.setState({
				sVeggerTemp: veggerTemp,
				sVeggerHumidity: veggerHumidity
			});

		}, function (errorObject) {
			console.log("follow vegger failed: " + errorObject.code);
		});
	}

	getUsername = () => {
		// Users location in tree
		var ref = this.firebase.db.ref().child('users').child(this.state.UID)

		ref.on("value", (snapshot) => {
			this.setState({ username: snapshot.val().username });
		}, function (errorObject) {
			console.log("The username read failed: " + errorObject.code);
		});

	}


	getUrls = () => {
		// Urls location in tree
		var ref = this.firebase.db.ref().child('users').child(this.state.UID).child('urls')

		ref.on("value", (snapshot) => {
			this.setState({
				URL_livecam: snapshot.val().livecam,
				URL_plotly: snapshot.val().plotly,
				URL_vegger_livecam: snapshot.val().vegger_livecam,
				URL_vegger_plotly: snapshot.val().vegger_plotly,
				urls: snapshot.val(),
				mainContent: 'resizeview'
			});
		}, function (errorObject) {
			console.log("The url read failed: " + errorObject.code);
		});

	}

	handleSignOut = () => {
		this.setState({
			UID: null,
			URL_livecam: null,
			URL_plotly: null
		});
		this.firebase.auth.signOut().then(function () {
			// Sign-out successful.
			console.log(`signed out`)
		}).catch(function (error) {
			// An error happened.
			console.log(`Error signing out: ${error}`)
		});
	}

	handleSignIn = () => {
		// set UID, page to plotly
		// this.setState({
		// 	mainContent: 'resizeview'
		// });
	}

	setMainContent = (setValue) => {
		this.setState({ mainContent: setValue });
	}

	openPlotly = () => {
		if (this.state.mainContent !== 'maincontent') {
			this.setState({ mainContent: 'maincontent' });
		}
		this.setState({
			zPlotly: 1,
			zLivecam: 0,
			zVeggerLivecam: 0,
			zVeggerPlotly: 0
		});
	}

	openLiveCam = () => {
		if (this.state.mainContent !== 'maincontent') {
			this.setState({ mainContent: 'maincontent' });
		}
		this.setState({
			zPlotly: 0,
			zLivecam: 1,
			zVeggerLivecam: 0,
			zVeggerPlotly: 0
		});
	}

	openVeggerPlotly = () => {
		if (this.state.mainContent !== 'maincontent') {
			this.setState({ mainContent: 'maincontent' });
		}
		this.setState({
			zPlotly: 0,
			zLivecam: 0,
			zVeggerLivecam: 0,
			zVeggerPlotly: 1
		});
	}

	openVeggerLiveCam = () => {
		if (this.state.mainContent !== 'maincontent') {
			this.setState({ mainContent: 'maincontent' });
		}
		this.setState({
			zPlotly: 0,
			zLivecam: 0,
			zVeggerLivecam: 1,
			zVeggerPlotly: 0
		});
	}

	openEditProfile = () => {
		if (this.state.mainContent !== 'editprofile') {
			this.setState({ mainContent: 'editprofile' });
		}
	}

	openResizeView = () => {
		if (this.state.mainContent !== 'resizeview') {
			this.setState({ mainContent: 'resizeview' });
		}
	}


	render() {
		return (
			<div className="App">
				<header className="App-body">
					<div id="App-Inner-Body">
						<div id="App-Body-Content">
							<div id="Main-Left">
								<div id="Home-Div">
									<img src={cornerLogo} className="Grovv-logo" alt="grovv logo" />
								</div>

								{(() => {
									if (this.state.UID) {
										return (
											<div id="Main-Left-Menu">

												<div id="Footer-Btns">
													<button id="Profile-Btn" onClick={this.openEditProfile}>Profile</button>
													<button id="Logout-Btn" onClick={this.handleSignOut}>Logout</button>
												</div>


												<div className="QuickTemp-Row">
													<button className="Sensor-Area" onClick={this.ll33}>GG</button>
													<button className="Temp-Guage" ref={this.flowerTempRef} onClick={this.ll33}>{this.state.sFlowerTemp}°C</button>
													<button className="Humid-Guage" ref={this.flowerHumidityRef} onClick={this.ll33}>{this.state.sFlowerHumidity}%</button>
												</div>
												<div className="QuickTemp-Row">
													<button className="Sensor-Area" onClick={this.ll33}>VG</button>
													<button className="Temp-Guage" ref={this.veggerTempRef} onClick={this.ll33}>{this.state.sVeggerTemp}°C</button>
													<button className="Humid-Guage" ref={this.veggerHumidityRef} onClick={this.ll33}>{this.state.sVeggerHumidity}%</button>
												</div>

												<button className="Left-Menu-Btn" onClick={this.openResizeView}>MULTI</button>
												<button className="Left-Menu-Btn" onClick={this.openLiveCam}>GanjaGrove Live</button>
												<button className="Left-Menu-Btn" onClick={this.openPlotly}>GanjaGrove Plotly</button>
												<button className="Left-Menu-Btn" onClick={this.openVeggerLiveCam}>Vegger Live</button>
												<button className="Left-Menu-Btn" onClick={this.openVeggerPlotly}>Vegger Plotly</button>


											</div>
										);
									}
								})()}
							</div>
							{(() => {
								if (this.state.UID) {
									switch (this.state.mainContent) {
										case 'editprofile':
											return <EditProfile UID={this.state.UID} username={this.state.username} />;
										case 'resizeview':
											return <ResizeDraggableView urls={this.state.urls} />
										case 'maincontent':
											return (
												<div id="Main-Content">
													<object className="Site-View-Update" style={{ zIndex: this.state.zPlotly }} type="text/html" data={this.state.URL_plotly} width="100%" height="100%" aria-label="plotly" />
													<object className="Site-View-Update" style={{ zIndex: this.state.zLivecam }} type="text/html" data={this.state.URL_livecam} width="100%" height="100%" aria-label="live cam" />
													<object className="Site-View-Update" style={{ zIndex: this.state.zVeggerPlotly }} type="text/html" data={this.state.URL_vegger_plotly} width="100%" height="100%" aria-label="vegger plotly" />
													<object className="Site-View-Update" style={{ zIndex: this.state.zVeggerLivecam }} type="text/html" data={this.state.URL_vegger_livecam} width="100%" height="100%" aria-label="vegger live cam" />
												</div>
											);
										default:
										// return <ResizeDraggableView urls={this.state.urls} />
									}
								} else {
									switch (this.state.mainContent) {
										case 'signin':
											return <SignIn gotoSignUp={this.setMainContent} signIn={this.handleSignIn} />;
										case 'signup':
											return <SignUp gotoSignIn={this.setMainContent} />;
										default:
											return <SignIn gotoSignUp={this.setMainContent} signIn={this.handleSignIn} />;
									}
								}
							})()}
						</div>
					</div>
				</header>
			</div>
		);
	}
}

export default App;
