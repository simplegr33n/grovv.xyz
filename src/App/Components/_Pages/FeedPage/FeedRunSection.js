import React, { Component } from 'react'
import '../../../../styles/App.css'

import DbHelper from '../../../_utils/DbHelper.js'

import FeedEntriesRow from './FeedEntriesRow.js'

import { BiHide } from 'react-icons/bi'
import { IoIosAddCircle } from 'react-icons/io'
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'


class FeedRunSection extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ADDING_ENTRY: false,
        };

        this.dbHelper = new DbHelper()

        this.newEntry = []
    }



    toggleNewEntryDisplay = () => {
        var tempBool = true
        if (this.state.ADDING_ENTRY) {
            this.newEntry = []
            tempBool = false
        }
        this.setState({ ADDING_ENTRY: tempBool })
    }

    entryValueChange = (e) => {
        this.newEntry[e.currentTarget.getAttribute('data-value')] = e.target.value
    }

    addEntry = () => {
        if (Object.entries(this.newEntry).length === 0) {
            this.setState({ ADDING_ENTRY: false })
            return
        }

        var now = new Date()
        this.newEntry.time = Math.floor(now / 1000)

        this.dbHelper.postFeedEntry("w/e", this.props.growID, this.props.run[0], this.newEntry, now.getFullYear(), now.getMonth() + 1)

        this.newEntry = []
        this.setState({ ADDING_ENTRY: false })
    }


    render() {

        var now = new Date()

        var entriesList = []
        var substancesList = []

        if (this.props.run[1].ENTRIES) {
            for (const [entryKey, entry] of Object.entries(this.props.run[1].ENTRIES[now.getFullYear()][now.getMonth() + 1])) {
                entriesList[entriesList.length] = entry
                for (const [substance, value] of Object.entries(entry)) {
                    if ((substance !== 'time') && (substance !== 'ph_pre') && (substance !== 'ph_post') && (substance !== 'ppm_pre') && (substance !== 'ppm_post')) {
                        // add to substance list if not there
                        if (!substancesList.includes(substance)) {
                            substancesList[substancesList.length] = substance
                        }

                    }
                }
            }
        }


        entriesList.sort((a, b) => (a.time < b.time) ? 1 : -1)

        var renderFeedEntryHeaders = substancesList.map((substance) => {
            return (
                <div key={substance} style={{ background: '#b78427', height: '20px', width: '50px', margin: '1px', color: '#fff', fontSize: '10px' }} >{substance}</div>
            )
        })

        var renderNewFeedEntryRow = substancesList.map((substance) => {
            return (
                <div key={substance} style={{ background: '#e6ece4', height: '30px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }} >
                    <input onChange={this.entryValueChange} data-value={substance} type='number' style={{ maxWidth: '80%', marginTop: '4px', fontSize: '10px' }} />
                </div>
            )
        })

        var renderFeedEntriesRows = entriesList.map((entry) => {
            return <FeedEntriesRow key={entry.time} entry={entry} substancesList={substancesList} feedData={this.props.feedData} style={{ marginBottom: '4px' }} />
        })


        // MAIN RENDER RETURN
        return (
            <div style={{ width: '100%', marginLeft: '4px' }}>

                <div style={{ textAlign: 'left', fontSize: '30px', userSelect: 'none', display: 'flex', flexDirection: 'row', background: '#658b3b', marginTop: '2px' }}>

                    {(() => {

                        if (!this.state.ADDING_ENTRY) {
                            return (
                                <div onClick={this.toggleNewEntryDisplay} style={{ width: '40px', background: '#43b443', fontSize: '24px', cursor: 'pointer', alignContent: 'center' }} >
                                    <IoIosAddCircle style={{ fontSize: "24px", padding: '4px 0px 0px 8px' }} />
                                </div>
                            )
                        } else {
                            return (
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div onClick={this.toggleNewEntryDisplay} style={{ width: '40px', background: '#e63838', fontSize: '24px', cursor: 'pointer', alignContent: 'center' }} >
                                        <AiOutlineCloseCircle style={{ fontSize: "24px", padding: '4px 0px 0px 8px' }} />
                                    </div>
                                </div>

                            )
                        }
                    })()}

                    <div style={{ fontSize: '22px', marginLeft: '4px', paddingBottom: '4px' }}>
                        {this.props.run[1]._name}
                    </div>

                    <div style={{ flex: 1 }} />

                    <BiHide style={{ fontSize: "22px", padding: "4px", cursor: 'pointer', background: '#222f4b' }} />
                </div >



                <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', background: '#343e2b' }}>

                    <div style={{ display: 'flex', flexDirection: 'row', background: '#343e2b', fontSize: '12px' }}>

                        {(() => {

                            if (this.state.ADDING_ENTRY) {
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ height: '20px', maxHeight: '20px', width: '40px', margin: '1px 1px 1px 0px', fontSize: '16px' }} >
                                        </div>
                                        {renderFeedEntryHeaders}
                                    </div>
                                )
                            }
                        })()}

                        {/*  */}

                    </div>

                    {/* Default Hidden New Entry Row */}
                    {(() => {
                        if (this.state.ADDING_ENTRY) {
                            return (
                                <div style={{ display: 'flex', flexDirection: 'row', background: '#343e2b', fontSize: '12px' }}>

                                    <div onClick={this.addEntry} style={{ width: '40px', margin: '1px 1px 1px 0px', background: '#43b443', fontSize: '24px', cursor: 'pointer' }} >
                                        <AiOutlineCheckCircle style={{ fontSize: "24px", padding: "4px" }} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            {renderNewFeedEntryRow}
                                        </div>


                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>


                                                <div style={{ background: '#b78427', height: '20px', width: '50px', margin: '1px', color: '#fff', fontSize: '10px' }}>
                                                    ppm pre
                                                </div>

                                                <div style={{ background: '#b78427', height: '20px', width: '50px', margin: '1px', color: '#fff', fontSize: '10px' }}>
                                                    pH pre
                                                    </div>

                                                <div style={{ background: '#b78427', height: '20px', width: '50px', margin: '1px', color: '#fff', fontSize: '10px' }}>
                                                    ppm post
                                                </div>

                                                <div style={{ background: '#b78427', height: '20px', width: '50px', margin: '1px', color: '#fff', fontSize: '10px' }}>
                                                    pH post
                                                </div>
                                            </div>
                                        </div>



                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>

                                                <div style={{ background: '#e6ece4', height: '30px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }} >
                                                    <input onChange={this.entryValueChange} data-value={'ppm_pre'} type='number' style={{ maxWidth: '80%', marginTop: '4px', fontSize: '10px' }} />
                                                </div>

                                                <div style={{ background: '#e6ece4', height: '30px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }} >
                                                    <input onChange={this.entryValueChange} data-value={'ph_pre'} type='number' style={{ maxWidth: '80%', marginTop: '4px', fontSize: '10px' }} />
                                                </div>

                                                <div style={{ background: '#e6ece4', height: '30px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }} >
                                                    <input onChange={this.entryValueChange} data-value={'ppm_post'} type='number' style={{ maxWidth: '80%', marginTop: '4px', fontSize: '10px' }} />
                                                </div>





                                                <div style={{ background: '#e6ece4', height: '30px', width: '50px', margin: '1px', color: '#000', fontSize: '10px' }} >
                                                    <input onChange={this.entryValueChange} data-value={'ph_post'} type='number' style={{ maxWidth: '80%', marginTop: '4px', fontSize: '10px' }} />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })()}

                    {renderFeedEntriesRows}



                </div>
            </div>
        );
    }
}

export default FeedRunSection;
