import React, { Component } from 'react'
import '../../../../styles/App.css'

import DbHelper from '../../../_utils/DbHelper.js'

import { BiHide } from 'react-icons/bi'
import { MdSettingsApplications } from 'react-icons/md'


class FeedRunRow extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

        this.dbHelper = new DbHelper()
    }

    postEntry = () => {

        var now = new Date()
        var nowSeconds = Math.floor(now.valueOf() / 1000)

        var newEntry = []
        newEntry.AN_BigB = 12
        newEntry.H20 = 987
        newEntry.time = nowSeconds

        console.log("newEntry", newEntry)
        console.log("RUN!", this.props.run)

        this.dbHelper.postFeedEntry("userID", this.props.growID, this.props.run[0], newEntry, now.getFullYear(), now.getMonth() + 1)
    }


    render() {

        var now = new Date()

        for (const [key, value] of Object.entries(this.props.run[1].ENTRIES[now.getFullYear()][now.getMonth() + 1])) {
            console.log("HEYA" + key, value)
        }

        var renderEntryHeaders = null


        var renderFeedEntries = Object.entries(this.props.run[1].ENTRIES[now.getFullYear()][now.getMonth() + 1]).map((entry) => {

            console.log("entry" + entry[0], entry[1])
        })


        // MAIN RENDER RETURN
        return (
            <div style={{ width: '100%', marginLeft: '4px' }}>

                <div style={{ textAlign: 'left', fontSize: '30px', userSelect: 'none', display: 'flex', flexDirection: 'row', background: '#658b3b', marginTop: '2px' }}>

                    <div style={{ fontSize: '22px', marginLeft: '4px', paddingBottom: '4px' }}>
                        {this.props.run[1]._name}
                    </div>

                    <div style={{ flex: 1 }} />

                    <div style={{ fontSize: '14px', marginRight: '4px', paddingBottom: '4px', fontStyle: 'italic' }}>
                        (lastUpdate...)
                    </div>

                    <BiHide onClick={this.todoAlert} style={{ fontSize: "22px", padding: "4px", cursor: 'pointer', background: '#222f4b' }} />
                </div >



                <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', background: '#343e2b' }}>

                    {renderEntryHeaders}

                    {/* <div onClick={this.postEntry} style={{ background: '#fff', color: '#000', cursor: 'pointer', userSelect: 'none' }}>
                        YO
                    </div> */}

                    {renderFeedEntries}
                    feed entries
                </div>
            </div>
        );
    }
}

export default FeedRunRow;
