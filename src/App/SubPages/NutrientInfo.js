import React, { Component } from 'react';
import '../../styles/App.css';

import { TiLeaf } from 'react-icons/ti'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'

class NutrientInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true //todo: list? or perhaps only ever one showing since they're iframes.
        };
    }

    componentDidMount() {

    }

    componentDidUpdate = () => {

    }


    toggleShow = () => {
        this.setState({ show: !this.state.show })
    }


    render() {

        var renderWebView = null
        var renderChevron = <HiChevronUp onClick={() => this.toggleShow()} style={{ fontSize: "24px", padding: "8px", cursor: 'pointer', background: "#5882bf" }} />
        if (this.state.show === true) {
            renderWebView = (
                <div style={{ background: '#394b39', height: "90%" }} >
                    <iframe src="https://generalhydroponics.com/feedcharts" style={{ width: "100%", height: "100%", minWidth: "100%", minHeight: "100%", maxHeight: "100%" }} />
                </div>
            )
            renderChevron = <HiChevronDown onClick={() => this.toggleShow()} style={{ fontSize: "24px", padding: "8px", cursor: 'pointer', background: "#5882bf" }} />
        }

        return (
            <div style={{ width: '100%', height: '100%', minWidth: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>

                <div style={{ width: '100%', minWidth: '100%', minHeight: '100%', marginLeft: '4px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ textAlign: 'left', fontSize: '30px', userSelect: 'none', display: 'flex', flexDirection: 'row', background: "#1e4354", marginBottom: '2px' }}>

                        <TiLeaf style={{ fontSize: "30px", padding: "4px" }} />

                        <div style={{ fontSize: "24px", marginTop: '2px' }}>
                            General Hydroponics
                        </div>

                        <div style={{ flex: 2 }} />

                        {renderChevron}

                    </div >

                    {renderWebView}

                </div>
            </div>
        );
    }
}

export default NutrientInfo;
