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
import TestPage from './SubPages/TestPage.js'
import NutrientInfo from './SubPages/NutrientInfo.js'

// Top Bar
import AppBar from './Components/_App/AppBar.js'

// GAMES
import TobyTiles from './Components/_Games/TobyTiles/TobyTiles.js'


class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mainContent: 'signin', // signin, signup, main, journal, grows, etc.
			UID: null,
			currentGrow: null,
			displayWindow: 259200000, // 1800000, 10800000, 43200000, 86400000, 259200000

			// processedData: []
		};

		this.processingFunctions = new ProcessingFunctions()
		this.dbHelper = new DbHelper()
		this.firebase = new Firebase()

		this.firebase.auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({ UID: user.uid })

				this.processingFunctions.initializeApp(user.uid, this.appInitFunction, this.appUpdateFunction)
			}
		});

		this.checkDataTime = new Date().getTime()

	}

	// //////////////
	// Initialize App
	// //////////////
	appInitFunction = (data) => {
		console.log("init App", data)

		this.setState({
			displayWindow: data.displayWindow,
			user: data.user,
			userGrows: data.userGrows,
			processedData: data.processedData,
			mainContent: 'graphs'
		})
	}

	appUpdateFunction = (data) => {
		// console.log("update App")

		this.setState({
			processedData: data.processedData
		})

	}


	// //////////////
	// State setting
	// //////////////
	setDisplayWindow = (displayWindow) => {
		this.setState({
			displayWindow: displayWindow
		});

		// this.processingFunctions.sendGrowData(this.state.userGrows, displayWindow)

		var tempUser = this.state.user
		tempUser.PREFS.GRAPHS.AllGraph.timeWindow = displayWindow
		this.setState({ user: tempUser });
		this.dbHelper.setUser(tempUser)
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
		this.setState({ UID: null });

		this.dbHelper.signOut()
	}

	refreshGrows = (newGrowConfig) => { // For config settings changes..
		var tempGrow = this.state.currentGrow
		tempGrow.config = newGrowConfig

		this.setState({ currentGrow: tempGrow });
	}



	render() {
		var date = new Date()


		// tODO: Datechecking mechanism of some kind
		if (this.state.processedData && this.state.userGrows && ((date.getTime() - this.checkDataTime) > 20000)) {
			this.checkDataTime = date.getTime()

			var refreshBool = false
			for (var [index, grow] of Object.entries(this.state.userGrows)) {
				if (this.state.processedData[grow.id] && (date.getTime() - this.state.processedData[grow.id][this.state.processedData[grow.id].length - 1].time) > 60000) {
					refreshBool = true
					console.log("recency try refresh:", grow.id)
				}
			}

			if (refreshBool === true) {
				console.log("attempt refresh? (currently doing nothing)")
				// this.processingFunctions.attemptRefresh()
			}
		}




		return (
			<div className="App">
				<header className="App-body">

					{(() => {
						if (this.state.UID && this.state.userGrows && this.state.user) {
							return <AppBar setMainContent={this.setMainContent} setGrow={this.setGrow} handleSignOut={this.handleSignOut} userGrows={this.state.userGrows} processedData={this.state.processedData} />
						}
					})()}

					<div id="App-Body-Content">
						{(() => {
							if (this.state.UID && this.state.userGrows && this.state.user && this.state.processedData) {
								switch (this.state.mainContent) {
									case 'grows':
										return <GrowPage setDisplayWindow={this.setDisplayWindow} refreshGrows={this.refreshGrows} userGrows={this.state.userGrows} processedData={this.state.processedData} displayWindow={this.state.displayWindow} grow={this.state.currentGrow} user={this.state.user} />
									case 'lifetime':
										return <LifetimePage user={this.state.user} userGrows={this.state.userGrows} />
									case 'feed':
										return <FeedPage user={this.state.user} />
									case 'graphs':
										return <AllPage setGrow={this.setGrow} setDisplayWindow={this.setDisplayWindow} displayWindow={this.state.displayWindow} processedData={this.state.processedData} userGrows={this.state.userGrows} user={this.state.user} />
									case 'tobytiles':
										return <TobyTiles />
									case 'nutes':
										return <NutrientInfo />
									case 'test':
										return <TestPage setDisplayWindow={this.setDisplayWindow} displayWindow={this.state.displayWindow} processedData={this.state.processedData} userGrows={this.state.userGrows} user={this.state.user} />

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

				</header>
			</div>
		);
	}
}

export default App;