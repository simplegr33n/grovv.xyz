import React, { Component } from 'react';
import '../../styles/App.css';

import GrowBoxItem from './GrowPage/GrowBoxItem'
import GrowDetailsPage from './GrowPage/GrowDetailsPage'


class GrowPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			displayContent: "main", // main
			grow: this.props.grow
		};
	}

	componentDidMount() {
		this._ismounted = true;
	}

	componentWillUnmount() {
		this._ismounted = false;
	}

	componentDidUpdate = () => {
		if (!this._ismounted) {
			return;
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
										<iframe id="Food-Chart" title="FoodChart" src="https://docs.google.com/spreadsheets/d/1P5X98doJf2eJsbkW502PaO9aZghInk86H-kHPO4mV88/edit?usp=sharing">
										</iframe>
									</div>
								)
							}
						})()}

						{(() => {
							if (this.props.grow) {
								return (
									<GrowDetailsPage grow={this.props.grow} refreshGrows={this.props.refreshGrows} openMainPage={this.openMainPage} setJournalID={this.setJournalID} rawGrowData={this.props.rawGrowData} user={this.props.user} />
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
