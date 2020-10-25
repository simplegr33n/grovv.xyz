import React, { Component } from 'react'

import '../../../styles/App.css'

import DisplayFunctions from '../../_utils/DisplayFunctions.js'

import cornerLogo from '../../../assets/corner-logo.png'
import { ReactComponent as TobyFace } from '../../../assets/tobyface.svg'

import { AiOutlineLineChart } from 'react-icons/ai'
import { TiThMenu, TiCogOutline } from 'react-icons/ti'
import { FaPrescriptionBottle } from 'react-icons/fa'
import { FcLineChart } from 'react-icons/fc'


class AppBar extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

        this.displayFunctions = new DisplayFunctions()
    }


    setMainContent = (e) => {
        this.props.setMainContent(e.currentTarget.getAttribute('data-value'))
    }

    setGrow = (ev) => {
        this.props.userGrows.forEach((grow) => {
            if (grow.id === ev.target.dataset.value) {
                this.props.setGrow(grow)
            }
        })
    }

    // /////////
    // UI 
    // /////////
    handleSignOut = () => {
        this.props.handleSignOut()
    }



    render() {

        var renderedLiveGrowButtons = null;
        if (this.props.userGrows) {
            renderedLiveGrowButtons = this.props.userGrows.map((grow) => {

                var liveButtonData = null
                if (this.props.processedData && this.props.processedData[grow.id]) {
                    liveButtonData = this.props.processedData[grow.id][this.props.processedData[grow.id].length - 1]
                }
                var liveButtonIndicatorColor = this.displayFunctions.returnActiveIndicatorColor(this.props.processedData[grow.id])

                var brokenName = grow.name.split(" ")
                var acroName = ""
                if (grow.name.length >= 4) {
                    brokenName.forEach((piece) => {
                        acroName += piece.charAt(0)
                    })
                } else {
                    acroName = grow.name
                }


                return (
                    <div className="App-Bar-Button-Grow" key={grow.id} onClick={this.setGrow} data-value={grow.id}>
                        <div className="App-Bar-Button-Updated" data-value={grow.id}>
                            <div style={{ color: liveButtonIndicatorColor, marginLeft: '1px', fontSize: '10px' }}>⬤</div>
                        </div>

                        <div className="App-Bar-Button-Grow-Name" data-value={grow.id}>{acroName}</div>

                        {(() => {
                            if (liveButtonData && liveButtonData.s1t) {
                                return (
                                    <div ref={this.flowerTempRef} className="App-Bar-Button-Grow-Temp" data-value={grow.id}>
                                        {Math.round(liveButtonData.s1t * 10) / 10}°C
                                    </div>
                                )
                            }
                        })()}


                        {(() => {
                            if (liveButtonData && liveButtonData.s1h) {
                                return (
                                    <div ref={this.flowerHumidityRef} className="App-Bar-Button-Grow-Humidity" data-value={grow.id}>
                                        {Math.round(liveButtonData.s1h * 10) / 10}%
                                    </div>
                                )
                            }
                        })()}
                    </div>
                )
            })
        }

        return (

            <div id="App-Bar" >
                <div id="App-Bar-Logo" onClick={this.setMainContent} data-value={'graphs'}>
                    <img src={cornerLogo} alt="App Logo" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                </div>

                {renderedLiveGrowButtons}

                <div className="App-Bar-Button-Grow" style={{ background: '#4d55b1' }} onClick={this.setMainContent} data-value={'lifetime'}>
                    <AiOutlineLineChart style={{ color: '#FFF', fontSize: '30px', paddingTop: '5px' }} />
                </div>

                <div className="App-Bar-Button-Grow" style={{ background: '#77864a' }} onClick={this.setMainContent} data-value={'feed'}>
                    <FaPrescriptionBottle style={{ color: '#FFF', fontSize: '30px', paddingTop: '5px' }} />
                </div>

                <div style={{ flex: 1 }} />

                {/* SubMenu */}
                <div className="App-Bar-Dropdown-Icon">
                    <TiThMenu style={{ paddingLeft: '7px', color: '#FFF', fontSize: '30px', paddingTop: '5px' }} />
                    <div className="App-Bar-Submenu" style={{ width: '200px', background: '#FFF', position: 'fixed', right: '0px', top: '40px', color: "#000" }}>

                        <div className="App-Bar-Submenu-Settings" onClick={this.setMainContent} data-value={'settings'}>
                            <div style={{ flex: 1, paddingTop: '10px' }} >
                                App Settings
                            </div>
                            <div style={{ display: 'flex', width: "50px", justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                <TiCogOutline style={{ color: '#000', fontSize: '30px' }} />
                            </div>
                        </div>

                        <div className="App-Bar-Submenu-Item" onClick={this.setMainContent} data-value={'test'}>
                            <div style={{ flex: 1, paddingTop: '10px' }} >
                                Test Graph
                            </div>
                            <div style={{ display: 'flex', width: "50px", justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                <FcLineChart style={{ fontSize: '30px' }} />
                            </div>
                        </div>



                        <div className="App-Bar-Submenu-Item" onClick={this.setMainContent} data-value={'tobytiles'}>
                            <div style={{ flex: 1, paddingTop: '10px' }} >
                                TobyTiles
                            </div>
                            <div style={{ display: 'flex', width: "50px", justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                <TobyFace
                                    viewBox="0 0 110 110"
                                    style={{ flex: 1, height: "60%", padding: '20%' }} />
                            </div>
                        </div>


                        <div className="App-Bar-Submenu-Logout" onClick={this.handleSignOut}>
                            <div style={{ flex: 1, paddingTop: '10px' }} >
                                Logout
                            </div>
                            <div style={{ display: 'flex', width: "50px", justifyContent: 'center', alignItems: 'center', overflow: 'hidden', fontSize: '30px' }}>
                                &#10162;
                            </div>
                        </div>


                    </div>
                </div>
            </div >

        );
    }
}

export default AppBar;
