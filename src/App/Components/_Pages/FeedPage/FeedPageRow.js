import React, { Component } from 'react'
import '../../../../styles/App.css'

import FeedRunRow from './FeedRunRow.js'


class FeedPageRow extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }


    render() {

        var renderFeedRunRows = null

        var renderFeedRunRows = Object.entries(this.props.feedData[this.props.userGrowData[0]]).map((run) => {
            return <FeedRunRow key={run[0]} feedData={this.props.feedData} run={run} />
        })


        // MAIN RENDER RETURN
        return (
            <div style={{ background: "#000", width: '100%' }}>
                <div style={{ textAlign: 'left', fontSize: '30px', userSelect: 'none', display: 'flex', flexDirection: 'row', background: "#1e4354" }}>
                    {/* <BiHide onClick={this.toggleGrowLines} style={{ fontSize: "24px", padding: "4px", cursor: 'pointer', background: "#222f4b" }} /> */}
                    <div style={{ fontSize: "24px", marginLeft: "4px", marginBottom: '2px' }}>
                        {this.props.userGrowData[1]}
                    </div>
                    <div style={{ flex: 1 }} />
                    {/* <MdSettingsApplications data-value={this.props.grow} onClick={this.openGrowLineSettings} style={{ fontSize: "30px", padding: "4px", background: "#555555", cursor: 'pointer', marginRight: "16px" }} /> */}
                </div >
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

                    {renderFeedRunRows}

                    stuff stuff
                </div>
            </div>
        );
    }
}

export default FeedPageRow;
