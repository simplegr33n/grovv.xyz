import React, { Component } from 'react'
import '../styles/App.css'


import Firebase from '../config/firebaseConfig.js'

import DbHelper from './_utils/DbHelper.js'
import ProcessingFunctions from './_utils/ProcessingFunctions.js'


// Auth
import SignIn from './_auth/SignIn.js'
import SignUp from './_auth/SignUp.js'

// Main Content
import GrowPage from './Pages/GrowPage.js'
import AllPage from './Pages/AllPage.js'
import LifetimePage from './Pages/LifetimePage.js'
import FeedPage from './Pages/FeedPage.js'

// Top Bar
import AppBar from './Components/AppBar/AppBar.js'

// GAMES
import TobyTiles from './Components/_Games/TobyTiles/TobyTiles.js'


class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mainContent: 'signin', // signin, signup, main, journal, grows, etc.
			UID: null,
			username: '',
			currentGrow: null,
			displayWindow: 259200000, // 1800000, 10800000, 43200000, 86400000, 259200000

			liveGrowData: [],

			threeDayData: [],
			combinedProcessedData: []
		};

		this.processingFunctions = new ProcessingFunctions()
		this.dbHelper = new DbHelper()
		this.firebase = new Firebase()

		this.concatAllData = []
		this.dataCheckLengths = []

		this.firebase.auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({ UID: user.uid })
				this.getUsername()

				this.dbHelper.getLifetimeData(user.uid, this.setLifetimeData)

				this.dbHelper.getUser(user.uid, this.setUser)
				this.dbHelper.getUserGrows(this.setUserGrows) // currently grabbing B's hardcoded
			}
		});

	}

	// //////////////
	// State setting
	// //////////////
	setUser = (u) => {
		this.setState({
			user: u,
			displayWindow: u.PREFS.GRAPHS.AllGraph.timeWindow
		});
	}

	setLifetimeData = (lifetimeData) => {
		this.setState({ lifetimeData: lifetimeData });

		this.processingFunctions.normalizeLifetimeData(lifetimeData, this.setNormalizedLifetimeData)
	}

	setUserGrows = (userGrows) => {
		userGrows.forEach((grow) => {
			this.dbHelper.getThreeDayData(grow.id, this.setThreeDayData)
		})

		this.setState({ userGrows: userGrows });

		this.dbHelper.getLiveGrowData(userGrows, this.setLiveGrowData)
	}

	refreshGrows = (newGrowConfig) => { // For config settings changes..
		var tempGrow = this.state.currentGrow
		tempGrow.config = newGrowConfig

		this.setState({ currentGrow: tempGrow });

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
		var tempData = this.state.threeDayData

		var tempThreeDayData = []

		day = parseInt(day)

		if (tempData[growDeprecate]) {
			tempThreeDayData = tempData[growDeprecate]
		}

		if (tempThreeDayData[day]) {
			tempThreeDayData[day] = null
		}

		tempThreeDayData[day] = data

		tempData[growDeprecate] = tempThreeDayData

		this.setState({ threeDayData: tempData });

		this.processingFunctions.concatAllGrowsData(this.concatAllData, tempData, this.state.userGrows, this.dataCheckLengths, this.setAllGrowsConcat)
	}

	setAllGrowsConcat = (concatData, newCheckLengths) => {
		this.dataCheckLengths = newCheckLengths
		this.concatAllData = concatData

		this.processingFunctions.processAllGrowsData(this.concatAllData, this.state.userGrows, this.setAllGrowsProcessed, this.state.displayWindow)
	}

	setAllGrowsProcessed = (combinedProcessedData, processedData) => {
		this.setState({
			combinedProcessedData: combinedProcessedData,
			processedData: processedData
		});
	}

	setDisplayWindow = (displayWindow) => {
		this.setState({
			displayWindow: displayWindow
		});

		this.processingFunctions.processAllGrowsData(this.concatAllData, this.state.userGrows, this.setAllGrowsProcessed, this.state.displayWindow)

		var tempUser = this.state.user
		tempUser.PREFS.GRAPHS.AllGraph.timeWindow = displayWindow
		this.postFirebaseUser(tempUser)
	}

	setNormalizedLifetimeData = (allSensorsList, normalizedLifetimeData, sampleHighs) => {
		// setState
		this.setState({
			allSensorsList: allSensorsList,
			normalizedLifetimeData: normalizedLifetimeData,
			sampleHighs: sampleHighs
		})
	}

	setMainContent = (setValue) => {
		this.setState({
			mainContent: setValue,
			journalID: null
		});
	}

	setGrow = (grow) => {
		this.setState({
			currentGrow: grow,
			mainContent: 'grows'
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


	// ////////////////
	// Firebase Posting
	// ////////////////
	postFirebaseUser = (u) => {
		this.setState({ user: u });

		this.dbHelper.setUser(u)
	}
	postLifetimeData = (lifetimeObject, growID, year, month, day) => {
		// this.setState({ user: u }); // -- set liftime data eventually

		console.log("chunky post LifetimeData", lifetimeObject)
		this.dbHelper.postLifetimeData(lifetimeObject, growID, year, month, day)
	}

	// ////////////////
	// Firebase Getting
	// ////////////////
	getUsername = () => {
		// Users location in tree
		var ref = this.firebase.db.ref().child('users').child(this.state.UID)

		ref.on("value", (snapshot) => {
			this.setState({ username: snapshot.val().username });
		}, function (errorObject) {
			console.log("The username read failed: " + errorObject.code);
		});
	}
	getMonthChunkData = (growID, year, month, setData) => {
		this.dbHelper.getMonthChunk(growID, year, month, setData)
	}

	// ////////////////
	// PROCESSING 
	// ////////////////



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
											return <GrowPage setDisplayWindow={this.setDisplayWindow} displayWindow={this.state.displayWindow} grow={this.state.currentGrow} refreshGrows={this.refreshGrows} processedData={this.state.processedData[this.state.currentGrow.id]} openMainPage={this.props.openMainPage} threeDayData={this.state.threeDayData} liveGrowData={this.state.liveGrowData} user={this.state.user} userGrows={this.state.userGrows} />
										case 'lifetime':
											return <LifetimePage postLifetimeData={this.postLifetimeData} updateLifetimeDisplayWindow={this.updateLifetimeDisplayWindow} getMonthChunkData={this.getMonthChunkData} user={this.state.user} lifetimeData={this.state.lifetimeData} userGrows={this.state.userGrows} allSensorsList={this.state.allSensorsList} normalizedLifetimeData={this.state.normalizedLifetimeData} sampleHighs={this.state.sampleHighs} displayWindow={this.state.lifetimeDisplayWindow} />
										case 'feed':
											return <FeedPage user={this.state.user} />
										case 'graphs':
											return <AllPage postFirebaseUser={this.postFirebaseUser} setDisplayWindow={this.setDisplayWindow} displayWindow={this.state.displayWindow} combinedProcessedData={this.state.combinedProcessedData} userGrows={this.state.userGrows} user={this.state.user} threeDayData={this.state.threeDayData} liveGrowData={this.state.liveGrowData} />
										case 'tobytiles':
											return <TobyTiles />
										// todo: return to graphs when possible.
										default:
											return <LifetimePage postLifetimeData={this.postLifetimeData} updateLifetimeDisplayWindow={this.updateLifetimeDisplayWindow} getMonthChunkData={this.getMonthChunkData} user={this.state.user} lifetimeData={this.state.lifetimeData} userGrows={this.state.userGrows} allSensorsList={this.state.allSensorsList} normalizedLifetimeData={this.state.normalizedLifetimeData} sampleHighs={this.state.sampleHighs} displayWindow={this.state.lifetimeDisplayWindow} />

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