import React, { Component } from 'react';
import '../../../../styles/App.css';

import TobyTileRow from './TobyTileRow.js'


import { ReactComponent as TobyFace } from '../../../../assets/tobyface.svg';


class TobyTiles extends Component {

	constructor(props) {
		super(props);
		this.state = {
			playDimensions: [0, 0], // init

			clickTime: 2,
			level: 0,
			selectedTiles: [],
			foundTiles: []
		};

		this.startDisplayTimer = this.startDisplayTimer.bind(this)
		this.stopAndResetDisplayTimer = this.stopAndResetDisplayTimer.bind(this)
	}

	componentDidMount() {
		this.calcPlayDimensions()

		if (this.state.level !== 0) {
			this.initializeLevel(this.state.level)
		}
	}

	initializeLevel(level = this.state.level) {
		var WHOLE_DECK = ["GiSpellBook", "GiFuji", "GiLindenLeaf", "GiLockedChest", "GiFullMotorcycleHelmet", "GiEgyptianBird", "GiSpadeSkull", "GiSnowman",
			"GiRaiseSkeleton", "GiDuck", "GiDrakkar", "GiCurlingStone", "GiCaravan", "GiBullyMinion", "GiPegasus", "GiSnowBottle",
			"GoSquirrel", "GoPaintcan", "GoPackage", "GoThumbsup", "GoThumbsdown"]
		var ACTIVE_DECK = ['Scoby', 'Scoby']
		var rows = level + 2
		if (rows % 2 !== 0) {
			ACTIVE_DECK[ACTIVE_DECK.length] = 'GoldenBindy'
		}

		var totalAdditions = Math.floor(((rows * rows)) / 2) - 1;
		for (var i = 0; i < totalAdditions; i++) {
			var tIndex = Math.round(Math.random() * (WHOLE_DECK.length - 1))
			ACTIVE_DECK[ACTIVE_DECK.length] = WHOLE_DECK[tIndex]
			ACTIVE_DECK[ACTIVE_DECK.length] = WHOLE_DECK[tIndex]
		}

		// SHUFFLE
		var SHUFFLED_DECK = []
		while (ACTIVE_DECK.length !== 0) {
			var cIndex = Math.round(Math.random() * (ACTIVE_DECK.length - 1))
			SHUFFLED_DECK[SHUFFLED_DECK.length] = ACTIVE_DECK[cIndex]
			ACTIVE_DECK.splice(cIndex, 1)
		}

		this.setState({
			clickTime: 2,
			foundTiles: [],
			selectedTiles: [],
			shuffledDeck: SHUFFLED_DECK
		})
	}

	startDisplayTimer() {
		this.timer = setInterval(() =>
			this.setState({
				clickTime: this.state.clickTime - 1
			}), 1000)
	}

	stopAndResetDisplayTimer() {
		clearInterval(this.timer)

		this.setState({
			clickTime: 2,
			selectedTiles: []
		})

	}

	startGame = () => {
		console.log("START GAME!")
		this.setState({ level: 1 })
		this.initializeLevel(1)
	}

	clickTile = (tile) => {
		var tempSelectedTiles = this.state.selectedTiles
		var tempFoundTiles = this.state.foundTiles
		if (tempFoundTiles.includes(tile)) {
			return
		}
		if (tempSelectedTiles.length >= 2 || tile === tempSelectedTiles[0] || this.state.clickTime !== 2) {
			this.stopAndResetDisplayTimer()
			return
		}

		// Deal with GoldenBindy
		if (tile.split("^")[0] === "GoldenBindy") {
			this.setState({
				clickTime: 2
			})
			tempFoundTiles[tempFoundTiles.length] = tile
		} else {
			tempSelectedTiles[tempSelectedTiles.length] = tile
		}

		if (tempSelectedTiles.length >= 2) {
			var testA = tempSelectedTiles[0].split("^")[0]
			var testB = tempSelectedTiles[1].split("^")[0]

			// Matched Pair / else
			if (testA === testB) {
				tempFoundTiles[tempFoundTiles.length] = tempSelectedTiles[0]
				tempFoundTiles[tempFoundTiles.length] = tile

				tempSelectedTiles = []
			} else {
				this.startDisplayTimer()
			}
		}

		this.setState({
			foundTiles: tempFoundTiles,
			selectedTiles: tempSelectedTiles
		})

		if (tempFoundTiles.length === this.state.shuffledDeck.length) {
			console.log("WON!")
			var newLevel = this.state.level + 1
			this.setState({
				shuffledDeck: [],
				level: newLevel
			})
			this.initializeLevel(newLevel)
		}
	}

	calcPlayDimensions() {
		var tempSize = [this.divRef.clientWidth, this.divRef.clientHeight]
		if (tempSize !== this.state.playDimensions) {
			this.setState({
				playDimensions: tempSize
			});
		}
	}

	render() {
		// Show pair of cards after click for only so long (clickTime)
		if (this.state.clickTime === 0) {
			this.stopAndResetDisplayTimer()
		}

		var renderTobyRows = null
		if (this.state.shuffledDeck) {
			var rowsQuantity = this.state.level + 2
			var shuffledDeck = this.state.shuffledDeck.slice()

			var rowList = []
			var i = 0
			while (rowList.length !== rowsQuantity) {
				var newRow = []
				while (newRow.length !== rowsQuantity) {
					newRow[newRow.length] = shuffledDeck[i]
					i++
				}
				rowList[rowList.length] = newRow
			}

			var tileWidth = Math.floor(this.state.playDimensions[0] / rowsQuantity)

			renderTobyRows = rowList.map((row, index) => {
				return (
					<TobyTileRow clickTile={this.clickTile} key={index} row={row} rowIndex={index} tileWidth={tileWidth} foundTiles={this.state.foundTiles} selectedTiles={this.state.selectedTiles} />
				)
			})
		}



		return (

			<div style={{ minHeight: "100%", maxHeight: '100%', minWidth: '100%', justifyContent: 'center', userSelect: 'none', display: 'flex' }}>
				<div id={"TobyTiles-Main"} style={{ backgroundColor: '#243124', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100vh', height: '100%', maxHeight: '100vw' }} ref={element => this.divRef = element}>
					{renderTobyRows}
				</div>


				{(() => {
					if (this.state.level === 0) {
						return (
							<div onClick={this.startGame} style={{ background: "#9a2222", cursor: 'pointer', fontSize: '2.2em', fontWeight: '700', minWidth: '40%', minHeight: '10%', color: 'red', position: 'absolute', marginTop: '3%', zIndex: '99' }}>
								<TobyFace height="95%"
									preserveAspectRatio="xMinYMin slice"
									width="95%"
									viewBox="0 0 110 110" />
								<div>START!</div>
							</div>
						)
					}
				})()}

			</div>
		);
	}
}

export default TobyTiles;
