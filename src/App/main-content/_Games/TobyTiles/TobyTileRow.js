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
		alert("TODO! " + e.currentTarget.getAttribute('data-value'))
	}

	render() {

		var renderTobyTiles = null
		if (this.props.row) {

			renderTobyTiles = this.props.row.map((tile, index) => {

				var tileKey = tile + "^" + index
				var backgroundColor = "#158a8a"

				if (tile === "GoldenBindy") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ background: '#99a72b', flex: 1, margin: '2px' }}>
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1 }}>
								<TobyFace
									viewBox="0 0 110 110"
									style={{ flex: 1, height: "30%", padding: '30%' }} />
							</div>

						</div>
					)
				} else if (tile === "Scoby") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ background: backgroundColor, flex: 1, margin: '2px' }}>
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1 }}>
								<TobyFace
									viewBox="0 0 110 110"
									style={{ flex: 1, height: "30%", padding: '30%' }} />
							</div>
						</div>
					)
				} else if (tile === "GoThumbsdown") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GoThumbsdown style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GoThumbsup") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GoThumbsup style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GoPackage") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GoPackage style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GoPaintcan") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GoPaintcan style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GoSquirrel") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GoSquirrel style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiSnowBottle") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiSnowBottle style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiBullyMinion") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiBullyMinion style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiPegasus") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiPegasus style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiCaravan") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiCaravan style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiCurlingStone") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiCurlingStone style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiDrakkar") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiDrakkar style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiDuck") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiDuck style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiRaiseSkeleton") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiRaiseSkeleton style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiSnowman") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiSnowman style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiSpadeSkull") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiSpadeSkull style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiEgyptianBird") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiEgyptianBird style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiFullMotorcycleHelmet") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiFullMotorcycleHelmet style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiLockedChest") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiLockedChest style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiLindenLeaf") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiLindenLeaf style={{ flex: 1, height: '30%', color: '#000' }} />
						</div>
					)
				} else if (tile === "GiFuji") {
					return (
						<div onClick={this.clickTile} key={tileKey} data-value={tileKey} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: backgroundColor, margin: '2px' }}>
							<GiFuji style={{ flex: 1, height: '30%', color: '#000' }} />
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
