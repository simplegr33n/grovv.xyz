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


class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mainContent: 'signin', // signin, signup, main, editprofile, etc.
			UID: null,
			username: '',
			URL_livecam: null,
			URL_plotly: null,
			zPlotly: 0,
			zLivecam: 0
		};

		this.firebase = new Firebase()
		this.firebase.auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(`UID: ${user.uid}`);
				this.setState({ UID: user.uid });
				this.getUrls();
				this.getUsername();
			}
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
		var ref = this.firebase.db.ref().child('urls')

		ref.on("value", (snapshot) => {
			this.setState({
				URL_livecam: snapshot.val().livecam,
				URL_plotly: snapshot.val().plotly
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
		this.setState({
			mainContent: 'maincontent'
		});

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
			zLivecam: 0
		});
	}

	openLiveCam = () => {
		if (this.state.mainContent !== 'maincontent') {
			this.setState({ mainContent: 'maincontent' });
		}
		this.setState({
			zPlotly: 0,
			zLivecam: 1
		});
	}

	openEditProfile = () => {
		if (this.state.mainContent !== 'editprofile') {
			this.setState({ mainContent: 'editprofile' });
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
												<div id="Header-Btns">
													<button id="Profile-Btn" onClick={this.openEditProfile}>Profile</button>
													<button id="Logout-Btn" onClick={this.handleSignOut}>Logout</button>
												</div>
												<button className="Left-Menu-Btn" onClick={this.openLiveCam}>GanjaGrove Live</button>
												<button className="Left-Menu-Btn" onClick={this.openPlotly}>Plotly</button>
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
										default:
											return (
												<div id="Main-Content">
													<object className="Site-View-Update" style={{zIndex: this.state.zPlotly}} type="text/html" data={this.state.URL_plotly} width="100%" height="100%" aria-label="plotly" />
													<object className="Site-View-Update" style={{zIndex: this.state.zLivecam}} type="text/html" data={this.state.URL_livecam} width="100%" height="100%" aria-label="live cam" />
												</div>
											);
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
