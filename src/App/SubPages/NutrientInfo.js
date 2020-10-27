import React, { Component } from 'react';
import '../../styles/App.css';

import { TiLeaf } from 'react-icons/ti'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'

class NutrientInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showGenHydro: true, //todo: list? or perhaps only ever one showing since they're iframes.
            showBigBud: true
        };
    }

    componentDidMount() {

    }

    componentDidUpdate = () => {

    }


    toggleShow = () => {
        this.setState({ showGenHydro: !this.state.showGenHydro })
    }

    toggleShowBigBud = () => {
        this.setState({ showBigBud: !this.state.showBigBud })
    }


    render() {

        var renderChevron = <HiChevronUp onClick={this.toggleShow} style={{ fontSize: "24px", padding: "8px", cursor: 'pointer', background: "#5882bf" }} />
        if (this.state.showGenHydro === true) {
            renderChevron = <HiChevronDown onClick={this.toggleShow} style={{ fontSize: "24px", padding: "8px", cursor: 'pointer', background: "#5882bf" }} />
        }

        var renderChevronBigBud = <HiChevronUp onClick={this.toggleShowBigBud} style={{ fontSize: "24px", padding: "8px", cursor: 'pointer', background: "#5882bf" }} />
        if (this.state.showBigBud === true) {
            renderChevronBigBud = <HiChevronDown onClick={this.toggleShowBigBud} style={{ fontSize: "24px", padding: "8px", cursor: 'pointer', background: "#5882bf" }} />
        }

        var renderGeneralHydroponicsFloraGroDTW = (
            <table style={{ fontSize: '14px', color: '#000', fontWeight: 700 }}>
                <colgroup>
                    <col style={{ backgroundColor: '#626a86' }} />
                    <col style={{ backgroundColor: '#ae98d5' }} />
                    <col style={{ backgroundColor: '#75ab83' }} />
                    <col style={{ backgroundColor: '#fc91a9' }} />
                </colgroup>
                <tbody>
                    <tr style={{ height: '34px', color: '#fff' }}>
                        <td style={{ backgroundColor: '#152015', fontSize: '10px' }}>
                            <div>Recirculating Program</div>
                            <div>per 1 US Gallon (3.79 L)</div>
                        </td>
                        <td style={{ backgroundColor: '#8e7bb1' }}>FloraMicro</td>
                        <td style={{ backgroundColor: '#669873' }}>FloraGro</td>
                        <td style={{ backgroundColor: '#ce778a' }}>FloraBloom</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Seedling</div>
                            <div style={{ fontSize: '10px', fontWeight: 500 }}>200-250 ppm</div>
                        </td>
                        <td>2.5mL</td>
                        <td>2.5mL</td>
                        <td>2.5mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Early Growth</div>
                            <div style={{ fontSize: '10px', fontWeight: 500 }}>550-700 ppm</div>
                        </td>
                        <td>7.5mL</td>
                        <td>10mL</td>
                        <td>2.5mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Late Growth</div>
                            <div style={{ fontSize: '10px', fontWeight: 500 }}>600-900 ppm</div>
                        </td>
                        <td>10mL</td>
                        <td>10mL</td>
                        <td>5mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Transition [1]</div>
                            <div style={{ fontSize: '10px', fontWeight: 500 }}>650-900 ppm</div>
                        </td>
                        <td>7.5mL</td>
                        <td>7.5mL</td>
                        <td>7.5mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Early Bloom [2]</div>
                            <div style={{ fontSize: '10px', fontWeight: 500 }}>500-700 ppm</div>
                        </td>
                        <td>7.5mL</td>
                        <td>2.5mL</td>
                        <td>10mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Early Bloom [3]</div>
                            <div style={{ fontSize: '10px', fontWeight: 500 }}>500-700 ppm</div>
                        </td>
                        <td>7.5mL</td>
                        <td>2.5mL</td>
                        <td>10mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Mid Bloom [4]</div>
                            <div style={{ fontSize: '10px', fontWeight: 500 }}>600-800 ppm</div>
                        </td>
                        <td>7.5mL</td>
                        <td>2.5mL</td>
                        <td>12.5mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Mid Bloom [5]</div>
                            <div style={{ fontSize: '10px', fontWeight: 500 }}>600-800 ppm</div>
                        </td>
                        <td>7.5mL</td>
                        <td>2.5mL</td>
                        <td>12.5mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Mid Bloom [6]</div>
                            <div style={{ fontSize: '10px', fontWeight: 500 }}>600-800 ppm</div>
                        </td>
                        <td>7.5mL</td>
                        <td>&nbsp;</td>
                        <td>15mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Late Bloom [7]</div>
                            <div style={{ fontSize: '10px', fontWeight: 500 }}>600-800 ppm</div>
                        </td>
                        <td>7.5mL</td>
                        <td>&nbsp;</td>
                        <td>15mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Ripen [8]</div>
                            <div style={{ fontSize: '10px', fontWeight: 500 }}>400-700 ppm</div>
                        </td>
                        <td>5mL</td>
                        <td>&nbsp;</td>
                        <td>15mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Flush [9]</div>
                            <div style={{ fontSize: '10px', fontWeight: 500 }}>0-50 ppm</div>
                        </td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                </tbody>
            </table>
        )

        var renderBigBud = (
            <table style={{ fontSize: '14px', color: '#000', fontWeight: 700 }}>
                <colgroup>
                    <col style={{ backgroundColor: '#626a86' }} />
                    <col style={{ backgroundColor: '#aad598' }} />
                </colgroup>
                <tbody>
                    <tr style={{ height: '34px', color: '#fff' }}>
                        <td style={{ backgroundColor: '#152015', fontSize: '10px' }}>Big Bud per 1 Liter</td>
                        <td style={{ backgroundColor: '#789a6a' }}>Big Bud</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Week 1</div>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Week 2</div>
                        </td>
                        <td>2mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Week 3</div>
                        </td>
                        <td>2mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Week 4</div>
                        </td>
                        <td>2mL</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Week 5</div>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Week 6</div>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr style={{ height: '34px' }}>
                        <td style={{ color: '#FFF' }}>
                            <div>Week 7</div>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                </tbody>
            </table>
        )

        if (this.state.showBigBud !== true) {
            renderBigBud = null
        }
        if (this.state.showGenHydro !== true) {
            renderGeneralHydroponicsFloraGroDTW = null
        }

        return (
            <div style={{ width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>

                <div style={{ width: '100%', minWidth: '100%', marginLeft: '4px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ textAlign: 'left', fontSize: '30px', userSelect: 'none', display: 'flex', flexDirection: 'row', background: "#1e4354", marginBottom: '2px' }}>

                        <TiLeaf style={{ fontSize: "30px", padding: "4px" }} />

                        <div style={{ fontSize: "24px", marginTop: '2px' }}>
                            General Hydroponics
                        </div>

                        <div style={{ flex: 2 }} />

                        {renderChevron}

                    </div >


                    {renderGeneralHydroponicsFloraGroDTW}


                </div>

                <div style={{ width: '100%', minWidth: '100%', marginLeft: '4px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ textAlign: 'left', fontSize: '30px', userSelect: 'none', display: 'flex', flexDirection: 'row', background: "#1e4354", marginBottom: '2px' }}>

                        <TiLeaf style={{ fontSize: "30px", padding: "4px" }} />

                        <div style={{ fontSize: "24px", marginTop: '2px' }}>
                            Big Bud
                        </div>

                        <div style={{ flex: 2 }} />

                        {renderChevronBigBud}

                    </div >

                    {renderBigBud}

                </div>
            </div>
        );
    }
}

export default NutrientInfo;
