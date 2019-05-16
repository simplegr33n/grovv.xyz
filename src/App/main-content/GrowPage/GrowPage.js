import React, { Component } from 'react';
import '../../../styles/App.css';

import GrowBoxItem from './GrowBoxItem'
import GrowDetailsPage from './GrowDetailsPage'
import GrowCamFull from './GrowCamFull'


import DbHelper from '../../_utils/DbHelper.js'



class GrowPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			displayContent: "main", // main, full-cam
			userGrows: [],
			grow: this.props.grow,
			camURL: null
		};


		this.dbHelper = new DbHelper();

	}

	componentDidMount() {
		this._ismounted = true;
		this.getUserGrows(this.setUserGrows);
	}

	componentWillUnmount() {
		this._ismounted = false;
		this.getUserGrows = null;
	}

	componentDidUpdate = () => {
		if (!this._ismounted) {
			return;
		}
	}

	getUserGrows = (setData) => {
		this.dbHelper.getUserGrows(setData)
	}

	setUserGrows = (grows) => {
		if (this._ismounted) {
			this.setState({
				userGrows: grows
			});
		}
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
			this.props.setGrow(null)
		}

		this.props.setGrow(grow)
	}

	openFullCam = (url) => {
		this.setState({
			displayContent: "full-cam",
			camURL: url
		});
	}

	closeFullCam = () => {
		this.setState({
			displayContent: "main",
			camURL: null
		});
	}

	setJournalID = (journalID) => {
		console.log("GROW PAGE!")
		console.log(journalID)
		this.props.setJournalID(journalID)
	}

	render() {

		if (this.props.growID) {
			this.state.userGrows.forEach((grow) => {
				if (grow.id === this.props.growID) {
					this.props.setGrow(grow)
				}
			})
		}

		var renderedGrowBoxes = null;
		if (this.props.grow === null && this.state.userGrows) {
			renderedGrowBoxes = this.state.userGrows.map((grow) =>
				<div key={grow.id} className="Grow-Box-Item-Container">
					<GrowBoxItem grow={grow} openGrow={this.openGrow} openFullCam={this.openFullCam} openMainPage={this.openMainPage} />
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

										{(() => {
											if (renderedGrowBoxes) {
												return (
													<div id="Grow-Box-Area-Scroll">
														<div id="Grow-Header-Area">
															<div id="Grow-Header-Text">Grows</div>
															<button className="New-Grow-Btn" onClick={this.openCreateGrowModal}>
																+
															</button>
														</div>

														<div id="Grow-Box-Area">
															{renderedGrowBoxes}
														</div>
													</div>
												)
											} else {
												return (
													<div id="Grow-Header-Area">
														<div id="Grow-Header-Text">Grows</div>
														<button className="New-Grow-Btn" onClick={this.openCreateGrowModal}>
															+
														</button>
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
									<GrowDetailsPage grow={this.props.grow} openFullCam={this.openFullCam} openMainPage={this.openMainPage} setJournalID={this.setJournalID} />
								)
							}
						})()}



					</div>




				</div>
				{(() => {
					if (this.state.displayContent === 'full-cam') {
						return (
							<GrowCamFull closeFullCam={this.closeFullCam} camURL={this.state.camURL} />
						)
					}
				})()}
			</div>
		);
	}
}

export default GrowPage;
