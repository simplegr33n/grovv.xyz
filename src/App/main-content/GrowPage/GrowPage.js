import React, { Component } from 'react';
import '../../../styles/App.css';

import GrowDetailsPage from './GrowDetailsPage'


class GrowPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			displayContent: "main", // main
			grow: this.props.grow,
			processedData: this.props.processedData[this.props.grow.id]
		};
	}

	componentDidMount() {
		if (this.props.processedData && this.props.processedData[this.props.grow.id] !== this.state.processedData) {
			this.setState({ processedData: this.props.processedData[this.props.grow.id] });
		}
	}

	componentDidUpdate = () => {
		if (this.props.processedData && this.props.processedData[this.props.grow.id] !== this.state.processedData) {
			this.setState({ processedData: this.props.processedData[this.props.grow.id] });
		}
	}

	closeModal = (key) => {
		if (!key || key === '') {
			this.setState({ displayContent: "main" });
			return;
		}

		this.setState({ displayContent: "main" });
	}

	openMainPage = (page, id) => {
		this.props.openMainPage(page, id)
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

	setJournalID = (journalID) => {
		console.log("setJournalID: " + journalID)
		this.props.setJournalID(journalID)
	}


	render() {

		return (

			<div id="Grow-Page">
				<div id="Grow-Main">
					<div id="Grow-Main-Area">

						{(() => {
							if (this.props.grow === null) {
								return (
									<div style={{ height: "100%" }}>
										{/* nothing... used to be a grows display */}

										{/* <iframe id="Food-Chart" title="FoodChart" src="https://docs.google.com/spreadsheets/d/1P5X98doJf2eJsbkW502PaO9aZghInk86H-kHPO4mV88/edit?usp=sharing">
										</iframe> */}
									</div>
								)
							}
						})()}

						{(() => {
							if (this.props.grow) {
								return (
									<GrowDetailsPage setDisplayWindow={this.props.setDisplayWindow} displayWindow={this.props.displayWindow} grow={this.props.grow} refreshGrows={this.props.refreshGrows} processedData={this.state.processedData} openMainPage={this.openMainPage} setJournalID={this.setJournalID} threeDayData={this.props.threeDayData} liveGrowData={this.props.liveGrowData} user={this.props.user} userGrows={this.props.userGrows} />
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
