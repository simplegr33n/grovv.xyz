import React, { Component } from 'react';
import '../styles/App.css';


import Firebase from '../config/firebaseConfig.js'

import DbHelper from './_utils/DbHelper.js'


// Auth
import SignIn from './auth/SignIn.js'
import SignUp from './auth/SignUp.js'

// Main Content
import FeedChart from './main-content/FeedChart/FeedChart.js'
import GrowConfig from './main-content/GrowConfig/GrowConfig.js'
import GrowJournal from './main-content/GrowJournal/GrowJournal.js'
import GrowPage from './main-content/GrowPage/GrowPage.js'
//import GraphSensors from './main-content/Graphs/GraphSensors.js'
import GrowGraphsTest from './graphs/GrowGraphsTest.js'


// Top Bar
import AppBar from './app-bar/AppBar.js'


class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mainContent: 'signin', // signin, signup, main, chart, config, journal, grows, graphs, etc.
			UID: null,
			username: '',
			URL_livecam: null,
			URL_vegger_livecam: null,
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
				this.getUrls();
				this.getUsername();

				this.dbHelper.getUserGrows(this.setUserGrows)
				this.dbHelper.getUserJournals(this.setUserJournals)

				// this.dbHelper.getThreeDayData('flower', this.setThreeDayData)
				// this.dbHelper.getThreeDayData('vegger', this.setThreeDayData)

			}
		});

	}

	setUserGrows = (userGrows) => {
		console.log("USER GROWS!")
		console.log(userGrows)

		userGrows.forEach((grow) => {
			this.dbHelper.getThreeDayData(grow.id, this.setThreeDayData)
		})

		this.setState({ userGrows: userGrows });

		this.dbHelper.getLiveGrowDatas(userGrows, this.setLiveGrowData)
	}

	setUserJournals = (userJournals) => {
		this.setState({ userJournals: userJournals });
	}

	setLiveGrowData = (dataID, newGrowData) => {
		var currentData = this.state.liveGrowData
		currentData[dataID.toString()] = newGrowData

		this.setState({ liveGrowData: currentData });
	}

	setThreeDayData = (growDeprecate, day, data) => {
		var previousData = this.state.threeDayData

		var tempThreeDayData = []

		if (previousData[growDeprecate]) {
			tempThreeDayData = previousData[growDeprecate]
		}

		if (tempThreeDayData[day]) {
			tempThreeDayData[day] = null
		}

		console.log("set 3day DATA length!")
		console.log(data.length)

		tempThreeDayData[day] = data

		previousData[growDeprecate] = tempThreeDayData

		console.log("Set3Day ########################### ")
		console.log(previousData)

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


	getUrls = () => {
		// Urls location in tree
		var ref = this.firebase.db.ref().child('users').child(this.state.UID).child('urls')

		ref.on("value", (snapshot) => {
			this.setState({
				URL_livecam: snapshot.val().livecam,
				URL_vegger_livecam: snapshot.val().vegger_livecam,
				urls: snapshot.val(),
				//mainContent: 'journals'
			});
		}, function (errorObject) {
			console.log("The url read failed: " + errorObject.code);
		});
	}

	handleSignOut = () => {
		this.setState({
			UID: null,
			URL_livecam: null,
		});
		this.firebase.auth.signOut().then(function () {
			// Sign-out successful.
			console.log(`signed out`)
		}).catch(function (error) {
			// An error happened.
			console.log(`Error signing out: ${error}`)
		});
	}

	setMainContent = (setValue) => {
		this.setState({
			mainContent: setValue,
			currentGrow: null,
			growID: null,
			journalID: null
		});
	}

	// TODO: consolidate functions into setGrow()
	// openGanjaGrove = () => {
	// 	// TODO: Send actual grow
	// 	this.setState({
	// 		mainContent: 'grows',
	// 		currentGrow: null, // until we can pass actual grow instead of ID
	// 		growID: '-LdtfBTlG6Fgg-ADD8-b'
	// 	});

	// }
	// openVegger = () => {
	// 	// TODO: Send actual grow
	// 	this.setState({
	// 		mainContent: 'grows',
	// 		currentGrow: null, // until we can pass actual grow instead of ID
	// 		growID: '-LdtkOvSXRrm1zIZ6EOx'
	// 	});

	// }

	setGrowByID = (growID) => {
		// TODO: Send actual grow
		this.setState({
			mainContent: 'grows',
			currentGrow: null,
			growID: growID
		});

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


	openMainPageFromExternal = (page) => {
		console.log("todo: get rid of this system...")
		console.log(page)
		switch (page) {
			case 'config':
				this.openConfig()
				break;
			case 'feed':
				this.openChart()
				break;
			case 'edit-feed':
				this.editChart()
				break;
			case 'graphs':
				this.openGraphs()
				break;
			default:
				this.openGraphs()
				break;
		}
	}

	openGraphs = () => {
		this.setState({
			mainContent: 'graphs',
		});
	}

	render() {

		return (
			<div className="App">
				<header className="App-body">

					{(() => {
						if (this.state.UID) {
							return <AppBar mainContent={this.state.mainContent} setGrowByID={this.setGrowByID} setMainContent={this.setMainContent} liveGrowData={this.state.liveGrowData} userGrows={this.state.userGrows} />
						}
					})()}

					<div id="App-Inner-Body">


						<div id="App-Body-Content">
							{(() => {
								if (this.state.UID) {
									switch (this.state.mainContent) {
										case 'journals':
											return <GrowJournal setJournalID={this.setJournalID} journalID={this.state.journalID} userJournals={this.state.userJournals} />
										case 'grows':
											return <GrowPage openMainPage={this.openMainPageFromExternal} setJournalID={this.setJournalID} setGrow={this.setGrow} grow={this.state.currentGrow} growID={this.state.growID} userGrows={this.state.userGrows} />
										case 'chart':
											return <FeedChart />
										case 'config':
											return <GrowConfig />
										case 'graphs':
											return (
												<div className="Chart-Page">
													flower 3 day
													<GrowGraphsTest growDeprecate={'flower'} />

													vegger 3 day
													<GrowGraphsTest growDeprecate={'vegger'} />
												</div>
											)
										default:
											return <GrowPage openMainPage={this.openMainPageFromExternal} setJournalID={this.setJournalID} setGrow={this.setGrow} grow={this.state.currentGrow} growID={this.state.growID} userGrows={this.state.userGrows} />
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