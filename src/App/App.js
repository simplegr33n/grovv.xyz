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

				this.dbHelper.getUserGrows(this.setUserGrows)
				this.dbHelper.getUserJournals(this.setUserJournals)

			}
		});

	}

	refreshGrows = (newGrowConfig) => {
		var tempGrow = this.state.currentGrow
		tempGrow.config = newGrowConfig

		this.setState({ currentGrow: tempGrow });
	}

	setUserGrows = (userGrows) => {
		console.log("USER GROWS!")
		console.log(userGrows)

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

	setGrowByID = (growID) => {
		// TODO: Send actual grow
		this.setState({
			mainContent: 'grows',
			currentGrow: null,
			growID: growID
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
		console.log("APP Setgrow")
		console.log(grow)
		this.setState({
			growID: null,
			currentGrow: grow
		});
	}

	setJournalID = (journalID) => {
		console.log("APP SetJournalID")
		console.log(journalID)
		this.setState({
			mainContent: 'journals',
			journalID: journalID
		});
	}


	openMainPageFromExternal = (page, id) => {
		console.log("todo: get rid of this system...")
		console.log(page)
		switch (page) {
			case 'config':
				this.configGrowID = id;
				this.openConfig()
				break;
			case 'feed':
				this.openChart()
				break;
			case 'edit-feed':
				this.editChart()
				break;
			default:
				break;
		}
	}

	render() {

		return (
			<div className="App">
				<header className="App-body">

					{(() => {
						if (this.state.UID) {
							return <AppBar mainContent={this.state.mainContent} setGrowByID={this.setGrowByID} setMainContent={this.setMainContent} handleSignOut={this.handleSignOut} liveGrowData={this.state.liveGrowData} userGrows={this.state.userGrows} />
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
											return <AllGraphs userGrows={this.state.userGrows} threeDayData={this.state.threeDayData} />
										default:
											return <GrowPage refreshGrows={this.refreshGrows} openMainPage={this.openMainPageFromExternal} setJournalID={this.setJournalID} setGrow={this.setGrow} grow={this.state.currentGrow} growID={this.state.growID} userGrows={this.state.userGrows} liveGrowData={this.state.liveGrowData} rawGrowData={this.state.threeDayData} />
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