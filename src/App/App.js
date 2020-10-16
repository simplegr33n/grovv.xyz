import React, { Component } from 'react';
import '../styles/App.css';


import Firebase from '../config/firebaseConfig.js'

import DbHelper from './_utils/DbHelper.js'


// Auth
import SignIn from './auth/SignIn.js'
import SignUp from './auth/SignUp.js'

// Main Content
import GrowJournal from './main-content/GrowJournal/GrowJournal.js'
import GrowPage from './main-content/GrowPage.js'
import AllGraphs from './main-content/AllGraphs.js'


// Top Bar
import AppBar from './app-bar/AppBar.js'


class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mainContent: 'signin', // signin, signup, main, journal, grows, etc.
			UID: null,
			username: '',
			journalID: null,
			currentGrow: null,
			growID: null, //todo: remove, use currentGrow

			userGrows: [],
			userJournals: [],
			liveGrowData: [],

			threeDayData: []
		};

		this.dbHelper = new DbHelper();

		this.firebase = new Firebase();

		this.firebase.auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({ UID: user.uid });
				this.getUsername();

				this.dbHelper.getUser(user.uid, this.setUser)
				this.dbHelper.getUserGrows(this.setUserGrows) // currently grabbing B's hardcoded
				this.dbHelper.getUserJournals(this.setUserJournals)

			}
		});

	}

	setUser = (u) => {
		this.setState({ user: u });
	}

	// To pass to components...
	setFirebaseUserPrefs = (u) => {
		this.setState({ user: u });

		console.log("temp user GONNASET", u)

		this.dbHelper.setUser(u)
	}

	// when config settings change...
	refreshGrows = (newGrowConfig) => {
		var tempGrow = this.state.currentGrow
		tempGrow.config = newGrowConfig

		this.setState({ currentGrow: tempGrow });
	}

	setUserGrows = (userGrows) => {
		console.log("USER GROWS!", userGrows)

		userGrows.forEach((grow) => {
			this.dbHelper.getThreeDayData(grow.id, this.setThreeDayData)
		})

		this.setState({ userGrows: userGrows });

		this.dbHelper.getLiveGrowData(userGrows, this.setLiveGrowData)
	}

	setUserJournals = (userJournals) => {
		this.setState({ userJournals: userJournals });
	}

	setLiveGrowData = (dataID, newGrowData) => {
		if (newGrowData === null) {
			return;
		}
		var currentData = this.state.liveGrowData
		currentData[dataID.toString()] = newGrowData

		this.setState({ liveGrowData: currentData });
	}

	setThreeDayData = (growDeprecate, day, data) => {
		var previousData = this.state.threeDayData

		var tempThreeDayData = []

		day = parseInt(day)

		if (previousData[growDeprecate]) {
			tempThreeDayData = previousData[growDeprecate]
		}

		if (tempThreeDayData[day]) {
			tempThreeDayData[day] = null
		}

		tempThreeDayData[day] = data

		previousData[growDeprecate] = tempThreeDayData

		this.setState({ threeDayData: previousData });

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

	handleSignOut = () => {
		this.setState({
			UID: null
		});
		this.firebase.auth.signOut().then(function () {
			// Sign-out successful.
			console.log(`signed out`)
			window.location.reload()
		}).catch(function (error) {
			// An error happened.
			console.log(`Error signing out: ${error}`)
		});
	}

	setMainContent = (setValue, id) => {
		this.setState({
			mainContent: setValue,
			currentGrow: null,
			growID: id,
			journalID: null
		});
	}

	openJournals = () => {
		if (this.state.mainContent !== 'journals') {
			this.setState({
				mainContent: 'journals',
				journalID: null
			});
		} else {
			this.setState({
				journalID: null
			});
		}
	}

	openGrows = () => {
		if (this.state.mainContent !== 'grows') {
			this.setState({
				mainContent: 'grows',
				currentGrow: null
			});
		} else {
			this.setState({
				currentGrow: null
			});
		}
	}


	setGrow = (grow) => {
		console.log("APP Setgrow", grow)
		this.setState({
			currentGrow: grow,
			mainContent: 'grows'
		});
	}

	setJournalID = (journalID) => {
		console.log("APP SetJournalID", journalID)
		this.setState({
			mainContent: 'journals',
			journalID: journalID
		});
	}

	render() {

		return (
			<div className="App">
				<header className="App-body">

					{(() => {
						if (this.state.UID) {
							return <AppBar mainContent={this.state.mainContent} setMainContent={this.setMainContent} setGrow={this.setGrow} handleSignOut={this.handleSignOut} liveGrowData={this.state.liveGrowData} userGrows={this.state.userGrows} />
						}
					})()}

					<div id="App-Inner-Body">


						<div id="App-Body-Content">
							{(() => {
								if (this.state.UID) {
									switch (this.state.mainContent) {
										case 'journals':
											return <GrowJournal setJournalID={this.setJournalID} journalID={this.state.journalID} userJournals={this.state.userJournals} />
										case 'graphs':
											return <AllGraphs userGrows={this.state.userGrows} setFirebaseUser={this.setFirebaseUserPrefs} user={this.state.user} threeDayData={this.state.threeDayData} liveGrowData={this.state.liveGrowData} />
										default:
											return <GrowPage refreshGrows={this.refreshGrows} setJournalID={this.setJournalID} setGrow={this.setGrow} user={this.state.user} grow={this.state.currentGrow} growID={this.state.growID} userGrows={this.state.userGrows} liveGrowData={this.state.liveGrowData} rawGrowData={this.state.threeDayData} />
									}
								} else {
									switch (this.state.mainContent) {
										case 'signin':
											return <SignIn gotoSignUp={this.setMainContent} />;
										case 'signup':
											return <SignUp gotoSignIn={this.setMainContent} />;
										default:
											return <SignIn gotoSignUp={this.setMainContent} />;
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