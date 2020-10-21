import React, { Component } from 'react'
import '../../../../styles/App.css'


class FeedRunRow extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }


    render() {

        var now = new Date()

        var renderFeedEntries = Object.entries(this.props.run[1].ENTRIES[now.getFullYear()][now.getMonth() + 1]).map((entry) => {

            console.log("entry" + entry[0], entry[1])
        })


        // MAIN RENDER RETURN
        return (
            <div style={{ background: "#000", width: '100%' }}>
                <div style={{ textAlign: 'left', fontSize: '30px', userSelect: 'none', display: 'flex', flexDirection: 'row', background: "#FF0", color: "#000" }}>
                    {/* <BiHide onClick={this.toggleGrowLines} style={{ fontSize: "24px", padding: "4px", cursor: 'pointer', background: "#222f4b" }} /> */}
                    <div style={{ fontSize: "24px", marginLeft: "4px", marginBottom: '2px' }}>
                        RUN NAME
                    </div>
                    <div style={{ flex: 1 }} />
                    {/* <MdSettingsApplications data-value={this.props.grow} onClick={this.openGrowLineSettings} style={{ fontSize: "30px", padding: "4px", background: "#555555", cursor: 'pointer', marginRight: "16px" }} /> */}
                </div >
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {renderFeedEntries}
                    feed entries
                </div>
            </div>
        );
    }
}

export default FeedRunRow;
