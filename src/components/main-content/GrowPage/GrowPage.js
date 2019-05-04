import React, { Component } from 'react';
import '../../../styles/App.css';

import GrowBoxItem from './GrowBoxItem'
import GrowDetailsPage from './GrowDetailsPage'


import Firebase from '../../../config/firebaseConfig.js'


class GrowPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			displayContent: "main",
			userGrows: [],
			grow: this.props.grow
		};

		this.firebase = new Firebase();

	}

	componentDidMount() {
		this._ismounted = true;
		this.getUserGrows = this.getUserGrowIDs();

		if (this.props.grow) {
			console.log("SETGROWID")
			console.log(this.props.grow)
		}
	}

	componentWillUnmount() {
		this._ismounted = false;
	}

	getUserGrowIDs = () => {
		var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows')

		ref.on('value', (snapshot) => {

			var userGrowIDs = [];

			console.log("TODO: remove filter.")
			snapshot.forEach((child) => {
				if (!child.val().sensors_live) {
					userGrowIDs[child.key] = child.val()
				}
			});

			// TODO: make own function...?
			var setUserGrows = []
			for (var key of Object.keys(userGrowIDs)) {
				var growRef = this.firebase.db.ref().child('grows').child(key)

				growRef.on('value', (snapshot) => {
					if (!setUserGrows.includes(snapshot.val())) {
						setUserGrows[setUserGrows.length] = snapshot.val()
					}

					setUserGrows.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : -1)

					this.setState({
						userGrows: setUserGrows
					});

				}, function (errorObject) {
					console.log("watch grow failed: " + errorObject.code);
				});
			}

		}, function (errorObject) {
			console.log("watch user grows failed: " + errorObject.code);
		});
	}

	closeModal = (key) => {
		if (!key || key === '') {
			this.setState({ displayContent: "main" });
			return;
		}

		this.setState({ displayContent: "main" });
	}

	openMainPage = (page) => {
		this.props.openMainPage(page)
	}

	openCreateGrowModal = () => {
		alert("GrowPage.js openCreateGrowModal() TODO")
	}

	openGrow = (grow) => {	
		if (!grow) {
			this.props.setGrowID(null)
		}

		this.props.setGrow(grow)
	}

	render() {

		var renderedGrowBoxes = null;
		if (this.state.grow === null && this.state.userGrows) {
			renderedGrowBoxes = this.state.userGrows.map((grow) =>
				<div key={grow.id} className="Grow-Box-Item-Container">
					<GrowBoxItem grow={grow} openGrow={this.openGrow} openMainPage={this.openMainPage} />
				</div>
			)
		}

		return (

			<div id="Grow-Page">
				<div id="Grow-Main">
					<div id="Grow-Main-Area">

						{(() => {
							if (this.props.grow === null) {
								return (
									<div id="Grow-List-Main-Area">
										<div id="Grow-Header-Area">
											<div id="Grow-Header-Text">Grows</div>
											<button className="New-Grow-Btn" onClick={this.openCreateGrowModal}>
												+
											</button>
										</div>

										{(() => {
											if (renderedGrowBoxes) {
												return (
													<div id="Grow-Box-Area-Scroll">
														<div id="Grow-Box-Area">
															{renderedGrowBoxes}
														</div>
													</div>
												)
											}
										})()}
									</div>
								)
							}
						})()}

						{(() => {
							if (this.props.grow) {
								return (
										<GrowDetailsPage grow={this.props.grow} />
								)
							}
						})()}



					</div>
				</div>
			</div>
		);
	}
}

export default GrowPage;
