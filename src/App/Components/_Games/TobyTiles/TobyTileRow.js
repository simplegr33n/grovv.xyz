import React, { Component } from 'react';
import '../../../../styles/App.css';


// CARDS
// 100 POINTS
import { ReactComponent as TobyFace } from '../../../../assets/tobyface.svg';

import {
	GiSpellBook, GiFuji, GiLindenLeaf, GiLockedChest, GiFullMotorcycleHelmet, GiEgyptianBird, GiSpadeSkull, GiSnowman,
	GiRaiseSkeleton, GiDuck, GiDrakkar, GiCurlingStone, GiCaravan, GiBullyMinion, GiPegasus, GiSnowBottle
} from 'react-icons/gi';
import { GoSquirrel, GoPaintcan, GoPackage, GoThumbsup, GoThumbsdown } from 'react-icons/go';
import { AiOutlineConsoleSql } from 'react-icons/ai';


class TobyTileRow extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}

	// Click tile
	clickTile = (e) => {
		this.props.clickTile(e.currentTarget.getAttribute('data-value'))
	}

	render() {

		var renderTobyTiles = null
		if (this.props.row) {

			renderTobyTiles = this.props.row.map((tile, index) => {

				var tileKey = tile + "^" + this.props.rowIndex + "^" + index
				var cardBackground = "#317b8c"
				var cardOpacity = 1
				var cardCursor = "pointer"
				var imageOpacity = 0

				if ((this.props.selectedTiles && (this.props.selectedTiles.includes(tileKey)))) {
					imageOpacity = 1
					cardBackground = "#a7b7bb"
					if (tile === "GoldenBindy") {
						cardBackground = "#b0b927"
					}
				}

				if ((this.props.foundTiles && (this.props.foundTiles.includes(tileKey)))) {
					imageOpacity = 1
					cardOpacity = 0.2
					if (tile === "GoldenBindy") {
						cardBackground = "#b0b927"
					}
				}

				if (tile === "GoldenBindy") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ background: cardBackground, flex: 1, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, opacity: imageOpacity }}>
								<TobyFace
									viewBox="0 0 110 110"
									style={{ flex: 1, height: "40%", padding: '20%' }} />
							</div>
						</div>
					)
				} else if (tile === "Scoby") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ background: cardBackground, flex: 1, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, opacity: imageOpacity }}>
								<TobyFace
									viewBox="0 0 110 110"
									style={{ flex: 1, height: "40%", padding: '20%' }} />
							</div>
						</div>
					)
				} else if (tile === "GiSpellBook") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiSpellBook style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GoThumbsdown") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GoThumbsdown style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GoThumbsup") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GoThumbsup style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GoPackage") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GoPackage style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GoPaintcan") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GoPaintcan style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GoSquirrel") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GoSquirrel style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiSnowBottle") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiSnowBottle style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiBullyMinion") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiBullyMinion style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiPegasus") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiPegasus style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiCaravan") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiCaravan style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiCurlingStone") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiCurlingStone style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiDrakkar") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiDrakkar style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiDuck") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiDuck style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiRaiseSkeleton") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiRaiseSkeleton style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiSnowman") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiSnowman style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiSpadeSkull") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiSpadeSkull style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiEgyptianBird") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiEgyptianBird style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiFullMotorcycleHelmet") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiFullMotorcycleHelmet style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiLockedChest") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiLockedChest style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiLindenLeaf") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiLindenLeaf style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				} else if (tile === "GiFuji") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: cardBackground, margin: '2px', cursor: cardCursor, opacity: cardOpacity, maxWidth: this.props.tileWidth, maxHeight: this.props.tileWidth }}>
							<GiFuji style={{ flex: 1, height: '40%', color: '#000', opacity: imageOpacity }} />
						</div>
					)
				}
			})
		}


		return (
			<div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
				{ renderTobyTiles}
			</div>
		);
	}
}

export default TobyTileRow;
