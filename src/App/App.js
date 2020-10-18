import React, { Component } from 'react';
import '../styles/App.css';


import Firebase from '../config/firebaseConfig.js'

import DbHelper from './_utils/DbHelper.js'


// Auth
import SignIn from './auth/SignIn.js'
import SignUp from './auth/SignUp.js'

// Main Content
import GrowJournal from './main-content/GrowJournal/GrowJournal.js'
import GrowPage from './main-content/GrowPage/GrowPage.js'
import AllGraphs from './main-content/AllGraphs/AllGraphs.js'
import LifetimeGraphs from './main-content/LifetimeGraphs/LifetimeGraphs.js'

// Top Bar
import AppBar from './app-bar/AppBar.js'

// GAMES
import TobyTiles from './main-content/_Games/TobyTiles/TobyTiles.js'


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

				this.dbHelper.getLifetimeData(user.uid, this.stateSetLifetimeData)

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

		this.dbHelper.setUser(u)
	}

	// To add lifetime data to components...
	postLifetimeData = (lifetimeObject, growID, year, month, day) => {
		// this.setState({ user: u }); // -- set liftime data eventually

		console.log("chunky post LifetimeData", lifetimeObject)
		this.dbHelper.postLifetimeData(lifetimeObject, growID, year, month, day)
	}

	stateSetLifetimeData = (lifetimeData) => {
		this.setState({ lifetimeData: lifetimeData });
	}

	getMonthChunkData = (growID, year, month, setData) => {
		this.dbHelper.getMonthChunk(growID, year, month, setData)
	}

	// when config settings change...
	refreshGrows = (newGrowConfig) => {
		var tempGrow = this.state.currentGrow
		tempGrow.config = newGrowConfig

		this.setState({ currentGrow: tempGrow });
	}

	setUserGrows = (userGrows) => {
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
								if (this.state.UID && this.state.userGrows && this.state.user && this.state.threeDayData && this.state.liveGrowData) {
									switch (this.state.mainContent) {
										case 'grows':
											return <GrowPage refreshGrows={this.refreshGrows} setJournalID={this.setJournalID} setGrow={this.setGrow} user={this.state.user} grow={this.state.currentGrow} growID={this.state.growID} userGrows={this.state.userGrows} liveGrowData={this.state.liveGrowData} rawGrowData={this.state.threeDayData} />
										case 'journals':
											return <GrowJournal setJournalID={this.setJournalID} journalID={this.state.journalID} userJournals={this.state.userJournals} />
										case 'lifetime':
											return <LifetimeGraphs postLifetimeData={this.postLifetimeData} getMonthChunkData={this.getMonthChunkData} user={this.state.user} lifetimeData={this.state.lifetimeData} userGrows={this.state.userGrows} />
										case 'tobytiles':
											return <TobyTiles />
										default:
											return <AllGraphs setFirebaseUser={this.setFirebaseUserPrefs} userGrows={this.state.userGrows} user={this.state.user} threeDayData={this.state.threeDayData} liveGrowData={this.state.liveGrowData} />

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