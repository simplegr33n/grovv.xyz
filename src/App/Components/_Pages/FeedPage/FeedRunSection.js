import React, { Component } from 'react'
import '../../../../styles/App.css'

import DbHelper from '../../../_utils/DbHelper.js'

import FeedEntriesRow from './FeedEntriesRow.js'

import { BiHide } from 'react-icons/bi'
import { MdSettingsApplications } from 'react-icons/md'


class FeedRunSection extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

        this.dbHelper = new DbHelper()
    }

    postEntry = () => {
        // var now = new Date()
        // var nowSeconds = Math.floor(now.valueOf() / 1000)

        // var newEntry = []
        // newEntry.AN_BigB = 12
        // newEntry.H20 = 987
        // newEntry.time = nowSeconds

        // console.log("newEntry", newEntry)
        // console.log("RUN!", this.props.run)

        // this.dbHelper.postFeedEntry("userID", this.props.growID, this.props.run[0], newEntry, now.getFullYear(), now.getMonth() + 1)
    }


    render() {

        var now = new Date()

        var entriesList = []
        var substancesList = []
        for (const [entryKey, entry] of Object.entries(this.props.run[1].ENTRIES[now.getFullYear()][now.getMonth() + 1])) {
            entriesList[entriesList.length] = entry
            for (const [substance, value] of Object.entries(entry)) {
                if (substance !== 'time') {
                    // add to substance list if not there
                    if (!substancesList.includes(substance)) {
                        substancesList[substancesList.length] = substance
                    }

                }
            }
        }
        entriesList.sort((a, b) => (a.time > b.time) ? 1 : -1)

        var renderFeedEntryHeaders = substancesList.map((substance) => {
            return <div key={substance} style={{ background: '#236313', height: '20px', width: '60px', margin: '1px', color: '#fff', fontSize: '10px' }} >{substance}</div>
        })

        var renderFeedEntriesRows = entriesList.map((entry) => {
            return <FeedEntriesRow key={entry.time} entry={entry} substancesList={substancesList} />
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

                    <div style={{ display: 'flex', flexDirection: 'row', background: '#343e2b', fontSize: '12px' }}>

                        <div style={{ height: '20px', maxHeight: '20px', width: '70px', margin: '1px 1px 1px 0px', background: '#43b443', fontSize: '16px' }} >
                            +
                        </div>


                        {renderFeedEntryHeaders}

                    </div>

                    {renderFeedEntriesRows}

                </div>
            </div>
        );
    }
}

export default FeedRunSection;
