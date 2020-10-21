import React, { Component } from 'react'
import '../../../../styles/App.css'

import FeedRunRow from './FeedRunRow.js'

import { BiHide } from 'react-icons/bi'
import { MdSettingsApplications } from 'react-icons/md'


class FeedPageRow extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    todoAlert = () => {
        alert("todo! damn.")
    }


    render() {

        var renderFeedRunRows = null

        if (this.props.feedData[this.props.userGrowData[0]]) {
            var renderFeedRunRows = Object.entries(this.props.feedData[this.props.userGrowData[0]]).map((run) => {
                return <FeedRunRow key={run[0]} feedData={this.props.feedData} run={run} growID={this.props.userGrowData[0]} />
            })
        }



        // MAIN RENDER RETURN
        return (
            <div style={{ marginBottom: '2px', marginLeft: '4px' }}>
                <div style={{ textAlign: 'left', fontSize: '30px', userSelect: 'none', display: 'flex', flexDirection: 'row', background: '#426021' }}>

                    <MdSettingsApplications onClick={this.todoAlert} style={{ fontSize: "30px", padding: "4px", background: "#555555", cursor: 'pointer' }} />

                    <div style={{ fontSize: '24px', marginLeft: '4px', paddingBottom: '4px' }}>
                        {this.props.userGrowData[1]}
                    </div>
                    <div style={{ flex: 1 }} />

                    <BiHide onClick={this.todoAlert} style={{ fontSize: "24px", padding: "4px", cursor: 'pointer', background: '#222f4b' }} />
                </div >
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

                    {renderFeedRunRows}

                </div>
            </div>
        );
    }
}

export default FeedPageRow;
