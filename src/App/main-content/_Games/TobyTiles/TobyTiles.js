import React, { Component } from 'react';
import '../../../../styles/App.css';

import TobyTileRow from './TobyTileRow.js'

// CARDS
// 100 POINTS
import { ReactComponent as TobyFace } from '../../../../assets/tobyface.svg';

import {
	GiSpellBook, GiFuji, GiLindenLeaf, GiLockedChest, GiFullMotorcycleHelmet, GiEgyptianBird, GiSpadeSkull, GiSnowman,
	GiRaiseSkeleton, GiDuck, GiDrakkar, GiCurlingStone, GiCaravan, GiBullyMinion, GiPegasus, GiSnowBottle
} from 'react-icons/gi';
import { GoSquirrel, GoPaintcan, GoPackage, GoThumbsup, GoThumbsdown } from 'react-icons/go';
import { AiOutlineConsoleSql } from 'react-icons/ai';


class TobyTiles extends Component {

	constructor(props) {
		super(props);
		this.state = {
			level: 0
		};
	}

	componentDidMount() {
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

		console.log(ACTIVE_DECK)
		// SHUFFLE
		var SHUFFLED_DECK = []
		while (ACTIVE_DECK.length !== 0) {
			var cIndex = Math.round(Math.random() * (ACTIVE_DECK.length - 1))
			SHUFFLED_DECK[SHUFFLED_DECK.length] = ACTIVE_DECK[cIndex]
			ACTIVE_DECK.splice(cIndex, 1)
		}

		this.setState({ shuffledDeck: SHUFFLED_DECK })
	}

	startGame = () => {
		console.log("START GAME!")
		this.setState({ level: 1 })
		this.initializeLevel(1)
	}

	render() {

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

			renderTobyRows = rowList.map((row, index) => {
				return (
					<TobyTileRow key={index} row={row} />
				)
			})
		}



		return (

			<div style={{ minHeight: "100%", maxHeight: '100%', minWidth: '100%', justifyContent: 'center', userSelect: 'none', display: 'flex' }}>
				<div id={"TobyTiles-Main"} style={{ backgroundColor: '#243124', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '90vh', height: '100%', maxHeight: '100vw' }}>
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
