import React, { Component } from 'react';
import './styles/App.css';
import Firebase from './config/firebaseConfig.js'

// Assets
import cornerLogo from './assets/corner-logo.png'
import menuHandle from './assets/menu-handle.png'

// Auth
import SignIn from './components/auth/SignIn.js'
import SignUp from './components/auth/SignUp.js'

// Main Content
import EditProfile from './components/main-content/EditProfile.js'
import FeedChart from './components/main-content/FeedChart/FeedChart.js'
import GrowConfig from './components/main-content/GrowConfig/GrowConfig.js'
import GrowJournal from './components/main-content/GrowJournal/GrowJournal.js'
import GrowPage from './components/main-content/GrowPage/GrowPage.js'
import ResizeDraggableView from './components/main-content/ResizeDraggableView.js'

// QuickBar Indicator Colors (green/orange/red)
const optimalIndication = '#91eebb';
const warningIndication = '#FFA500';
const dangerIndication = '#FF0000';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mainContent: 'signin', // signin, signup, main, editprofile, chart, config, journal, grows, etc.
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
				this.watchSensorsLive();
			}
		});

		this.flowerTempRef = React.createRef()
		this.flowerHumidityRef = React.createRef()
		this.veggerTempRef = React.createRef()
		this.veggerHumidityRef = React.createRef()

		this.leftMenuRef = React.createRef()
	}

	watchSensorsLive = () => {
		this.watchFlowerLiveData();
		this.watchVeggerLiveData();
	}

	watchFlowerLiveData = () => {
		// Sensor data in firebase
		var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('sensors_live').child('flower')

		ref.on('value', (snapshot) => {
			let flowerTemp = Math.round(snapshot.val().cTemp * 10) / 10;
			let flowerHumidity = Math.round(snapshot.val().humidity * 10) / 10;

			console.log(`Flower cTemp: ${flowerTemp} // Flower Humidity ${flowerHumidity} `);

			// SET safe ranges here 
			if (flowerTemp > 20 && flowerTemp < 27) {
				this.flowerTempRef.current.style.background = optimalIndication;
			} else if (flowerTemp < 19 || flowerTemp > 28) {
				this.flowerTempRef.current.style.background = dangerIndication;
			} else {
				this.flowerTempRef.current.style.background = warningIndication;
			}

			if (flowerHumidity > 30 && flowerHumidity < 43) {
				this.flowerHumidityRef.current.style.background = optimalIndication;
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
			console.log("follow flower hour failed: " + errorObject.code);
		});

	}

	watchVeggerLiveData = () => {
		// Sensor data in firebase
		var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('sensors_live').child('vegger')


		ref.on('value', (snapshot) => {
			let veggerTemp = Math.round(snapshot.val().cTemp * 10) / 10;
			let veggerHumidity = Math.round(snapshot.val().humidity * 10) / 10;

			console.log(`Vegger cTemp: ${veggerTemp} // Vegger Humidity ${veggerHumidity} `);

			// SET safe ranges here 
			if (veggerTemp > 22 && veggerTemp < 29) {
				this.veggerTempRef.current.style.background = optimalIndication;
			} else if (veggerTemp < 20 || veggerTemp > 30) {
				this.veggerTempRef.current.style.background = dangerIndication;
			} else {
				this.veggerTempRef.current.style.background = warningIndication;
			}

			if (veggerHumidity > 40 && veggerHumidity < 80) {
				this.veggerHumidityRef.current.style.background = optimalIndication;
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
				//mainContent: 'journal'
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
		// ??
		// set UID, page to plotly
		// this.setState({
		// 	mainContent: 'resizeview'
		// });
	}

	handleMenuHandle = () => {
		if (this.leftMenuRef.current.style.left !== "-240px") {
			this.leftMenuRef.current.style.left = '-240px';
		} else {
			this.leftMenuRef.current.style.left = '0';
		}
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

	openChart = () => {
		if (this.state.mainContent !== 'chart') {
			this.setState({ mainContent: 'chart' });
		}
	}

	editChart = () => {
		window.open('https://docs.google.com/spreadsheets/d/1i7EDfBIwj4eYU2LxyS02YwDDeNROcdgXjROKfzCtp60/edit?usp=sharing', 'sharer', 'toolbar=0,status=0,width=548,height=325');
	}

	openConfig = () => {
		if (this.state.mainContent !== 'config') {
			this.setState({ mainContent: 'config' });
		}
	}

	openJournal = () => {
		if (this.state.mainContent !== 'journal') {
			this.setState({ mainContent: 'journal' });
		}
	}

	openGrows = () => {
		if (this.state.mainContent !== 'grows') {
			this.setState({ mainContent: 'grows' });
		}
	}

	render() {
		return (
			<div className="App">
				<header className="App-body">
					<div id="App-Inner-Body">
						<div id="App-Body-Content">

							{(() => {
								if (this.state.UID) {
									switch (this.state.mainContent) {
										case 'editprofile':
											return <EditProfile UID={this.state.UID} username={this.state.username} />;
										case 'resizeview':
											return <ResizeDraggableView urls={this.state.urls} />
										case 'journal':
											return <GrowJournal />
										case 'grows':
											return <GrowPage />
										case 'chart':
											return <FeedChart />
										case 'config':
											return <GrowConfig />
										case 'maincontent':
											return (
												<div id="Main-Content">
													<object className="Site-View-Update" style={{ zIndex: this.state.zPlotly }} type="text/html" data={this.state.URL_plotly} width="100%" height="100%" aria-label="plotly" />
													<object className="Site-View-Update" style={{ zIndex: this.state.zLivecam }} type="text/html" data={this.state.URL_livecam} width="100%" height="100%" aria-label="live cam" />
													<object className="Site-View-Update" style={{ zIndex: this.state.zVeggerPlotly }} type="text/html" data={this.state.URL_vegger_plotly} width="100%" height="100%" aria-label="vegger plotly" />
													<img className="Site-View-Update" alt="cam" style={{ zIndex: this.state.zVeggerLivecam, objectFit: 'contain' }} src={this.state.URL_vegger_livecam} width="100%" height="100%" />										
												</div>
											);
										default:
											return <GrowPage />
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

							{(() => {
								if (this.state.UID) {
									return (
										<div id="Main-Left-Wrapper" ref={this.leftMenuRef}>
											<div id="Main-Left">
												<div id="Home-Div">
													<img src={cornerLogo} id="Grovv-Logo" alt="grovv logo" />
												</div>
												<div id="Main-Left-Menu">

													<div id="Footer-Btns">
														<button id="Profile-Btn" onClick={this.openEditProfile}>Profile</button>
														<button id="Logout-Btn" onClick={this.handleSignOut}>Logout</button>
													</div>


													<div className="QuickTemp-Row">
														<button className="Grow-Area-Btn" onClick={this.openLiveCam}>GG <span role="img" aria-label="live cam">&#128250;</span></button>
														<button className="Temp-Gauge-Btn" onClick={this.openPlotly} ref={this.flowerTempRef}>{this.state.sFlowerTemp}°C</button>
														<button className="Humid-Gauge-Btn" onClick={this.openPlotly} ref={this.flowerHumidityRef}>{this.state.sFlowerHumidity}%</button>
													</div>
													<div className="QuickTemp-Row">
														<button className="Grow-Area-Btn" onClick={this.openVeggerLiveCam}>VG <span role="img" aria-label="live cam">&#128250;</span></button>
														<button className="Temp-Gauge-Btn" onClick={this.openVeggerPlotly} ref={this.veggerTempRef}>{this.state.sVeggerTemp}°C</button>
														<button className="Humid-Gauge-Btn" onClick={this.openVeggerPlotly} ref={this.veggerHumidityRef}>{this.state.sVeggerHumidity}%</button>
													</div>

													<button className="Left-Menu-Btn" onClick={this.openConfig}>CONFIG <b>&#9881;</b></button>
													<button className="Left-Menu-Btn" onClick={this.openResizeView}>MULTI <span role="img" aria-label="multi cam">&#128200;&#128250;</span></button>
													<button className="Left-Menu-Btn" onClick={this.openJournal}>JOURNALS <span role="img" aria-label="journal">&#128214;</span></button>
													<button className="Left-Menu-Btn" onClick={this.openGrows}>GROWS <span role="img" aria-label="journal">&#127809;</span></button>
													<div id="Left-Chart-Btns">
														<button className="EditChart-Menu-Btn" onClick={this.editChart}>EDIT &#9998; CHART</button>
														<button className="Left-Menu-Btn" onClick={this.openChart}>CHART &#9619;&#9619;</button>
													</div>
													
												</div>

											</div>
											<div onClick={this.handleMenuHandle}>
												<img src={menuHandle} id="Menu-Handle" alt="menu handle" />
											</div>
										</div>
									);
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
