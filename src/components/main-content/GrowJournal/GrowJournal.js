import React, { Component } from 'react';
import '../../../styles/App.css';

import JournalAddEditModal from './JournalAddEditModal'
import FullImageModal from './FullImageModal'
import JournalCreateModal from './JournalCreateModal'
import JournalTimelineButton from './JournalTimelineButton'
import JournalBoxItem from './JournalBoxItem'
import JournalEntry from './JournalEntry'


import Firebase from '../../../config/firebaseConfig.js'


class GrowJournal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayContent: "main",
            displayEntries: [], // list of entries at selected date
            currentEntry: null,
            currentEntryID: null,
            testContent: '',
            timelineEntries: [],
            userJournals: [],
            journalID: null,
            fullImageModalImages: null,
            currentFullImage: null
        };

        this.firebase = new Firebase();

    }

    componentDidMount() {
        this._ismounted = true;
        this.watchJournals = this.watchJournals();
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    watchJournals = () => {
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('journals')

        ref.on('value', (snapshot) => {

            var journalsList = [];

            snapshot.forEach((child) => {
                journalsList.push(child.val())
            });

            console.log(journalsList)

            // if (journalsList.length > 0) {
            //     this.watchEntries(journalsList[0].id);

            //     this.setState({
            //         journalID: journalsList[0].id
            //     });
            // }

            this.setState({
                userJournals: journalsList
            });

        }, function (errorObject) {
            console.log("watch user journals failed: " + errorObject.code);
        });
    }

    watchEntries = (journalId = this.state.journalID) => {
        var ref = this.firebase.db.ref().child('journals').child(journalId).child('entries')

        console.log('watchin... ' + journalId)

        ref.on('value', (snapshot) => {

            var tempEntriesList = []
            snapshot.forEach((child) => {
                tempEntriesList.push(child.val())
            });

            tempEntriesList.sort((a, b) => (a.datetime_true > b.datetime_true) ? 1 : -1)

            var tempDotsList = [];
            tempEntriesList.forEach((entry) => {
                if (!tempDotsList.includes(entry.datetime_short)) {
                    tempDotsList[tempDotsList.length] = entry.datetime_short;
                }
            });

            var tempDeepDotsList = [];
            tempDotsList.forEach((dotDate) => {
                var dotValue = []
                tempEntriesList.forEach((entry) => {
                    if (dotDate === entry.datetime_short) {
                        dotValue[dotValue.length] = entry;
                    }
                });

                tempDeepDotsList[tempDeepDotsList.length] = dotValue;
            });

            if (tempEntriesList.length > 0) {
                this.setState({
                    currentEntry: tempEntriesList[tempEntriesList.length - 1],
                    currentEntryID: tempEntriesList[tempEntriesList.length - 1].id,
                    timelineEntries: tempEntriesList,
                    timelineDots: tempDeepDotsList,
                    displayEntries: tempDeepDotsList[tempDeepDotsList.length - 1]
                });
            } else {
                this.setState({
                    currentEntry: null,
                    currentEntryID: null,
                    timelineEntries: [],
                    timelineDots: [],
                    displayEntries: []
                });
            }

            this.setEntries(tempDeepDotsList[tempDeepDotsList.length - 1]);

        }, function (errorObject) {
            console.log("follow journal failed: " + errorObject.code);
        });

    }

    addTimelineEntry = () => {
        this.setState({ displayContent: "add" });
    }

    editEntryByID = (entryID) => {
        console.log("edit: " + entryID)
        console.log(entryID)

        this.state.timelineEntries.forEach((timelineEntry) => {
            if (timelineEntry.id === entryID) {
                this.setState({
                    currentEntry: timelineEntry,
                    currentEntryID: timelineEntry.id,
                    displayContent: "edit"
                });
                return;
            }
        })

    }

    openFullImageModal = (images) => {

        this.setState({
            displayContent: "full-image",
            fullImageModalImages: images
        });
    }

    openFullImage = (imageUrl) => {

        console.log("imageURL")
        console.log(imageUrl)

        this.setState({
            currentFullImage: imageUrl
        });
    }


    closeModal = (key) => {

        if (!key || key === '') {
            this.setState({ displayContent: "main" });
            return;
        }

        this.setState({ displayContent: "main" });
        this.state.timelineEntries.forEach((timelineEntry) => {
            if (timelineEntry.id === key) {
                this.setState({
                    currentEntry: timelineEntry,
                    currentEntryID: timelineEntry.id
                });
                return;
            }
        })

    }

    setJournalID = (id) => {
        this.setState({
            displayContent: "main",
            journalID: id
        });

        this.watchEntries(id);
    }

    setEntries = (entries) => {
        if (!entries) {
            return;
        }

        this.setState({
            currentEntry: entries[0],
            currentEntryID: entries[0].id,
            displayEntries: entries
        });
    }

    handleJournalChange = (ev) => {
        console.log("JOURNAL CHANGE!!!!")
        console.log(ev.target.value)
        this.setState({
            currentEntry: null,
            currentEntryID: null,
            displayEntries: [],
            journalID: ev.target.value
        });
        this.watchEntries(ev.target.value)
    }

    openCreateJournalModal = () => {
        this.setState({ displayContent: "create-journal" });
    }

    openJournal = (journal) => {
        this.watchEntries(journal.id);

        this.setState({
            journalID: journal.id
        });
    }

    render() {

        var renderedJournalOptions = '';
        if (this.state.userJournals.length > 0) {
            renderedJournalOptions = this.state.userJournals.map((journal) => <option key={journal.id} value={journal.id}>{journal.name}</option>)
        }

        var renderedUserJournals = null;
        if (this.state.userJournals) {
            renderedUserJournals = this.state.userJournals.map((journal) =>
                <div className="Journal-Box-Item-Container">
                    <JournalBoxItem journal={journal} openJournal={this.openJournal} />
                </div>
            )
        }

        var renderedJournalEntries = null;
        if (this.state.displayEntries) {
            renderedJournalEntries = this.state.displayEntries.map((entry) =>
                <JournalEntry key={entry.id} editEntryByID={this.editEntryByID} currentEntry={entry} currentFullImage={this.openFullImage} displayFullImage={this.openFullImageModal} />
            )
        }

        var renderedTimelineDots = null;
        if (this.state.timelineDots) {
            renderedTimelineDots = this.state.timelineDots.map((dot) =>
                <JournalTimelineButton key={dot[0].datetime_short} currentEntryID={this.state.currentEntryID} setEntries={this.setEntries} entry={dot[0]} entries={dot} />
            )
        }

        return (


            <div id="Journal-Page">
                <div id="Journal-Main">
                    <div id="Grow-Journal-Main-Area">



                        {(() => {
                            if (this.state.journalID === null) {
                                return (
                                    <div id="Grow-Journal-Header-Area">
                                        <div id="Grow-Journal-Header-Text">Grow Journal</div>
                                        <button className="New-Journal-Btn" onClick={this.openCreateJournalModal}>
                                            +
                                        </button>
                                    </div>
                                )
                            }
                        })()}

                        {(() => {
                            if (renderedUserJournals && !this.state.journalID) {
                                return (
                                    <div id="Journal-Box-Area-Scroll">
                                        <div id="Journal-Box-Area">
                                            {renderedUserJournals}
                                        </div>
                                    </div>
                                )
                            }
                        })()}


                        {(() => {
                            if (renderedJournalOptions && this.state.journalID) {
                                return (
                                    <div className="Grow-Journal-Title-Div">
                                        <select id="Grow-Journal-Title-Select" onChange={this.handleJournalChange} value={this.state.journalID}>
                                            {renderedJournalOptions}
                                        </select>
                                        <button className="New-Journal-Btn" onClick={this.openCreateJournalModal}>
                                            +
                                        </button>
                                    </div>
                                )
                            }
                        })()}

                        {(() => {
                            if (this.state.journalID) {
                                return (
                                    <div id="Journal-Posts-Container">
                                        {(() => {
                                            if (renderedJournalEntries) {
                                                return (
                                                    <div>
                                                        {renderedJournalEntries}
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div className="Journal-Post-View" >
                                                        Let's get some journal entries...
                                                    </div>
                                                )
                                            }
                                        })()}
                                    </div>
                                )
                            }
                        })()}

                    </div>




                    {(() => {
                        if (this.state.journalID) {
                            return (
                                <div id="Timeline-Container">

                                    <div id="Timeline-Inner-Container">
                                        <div id="Timeline-Line" />
                                        {/* Generate dots from firebase entries... */}
                                        <div id="Timeline-Spots">

                                            {renderedTimelineDots}

                                            <button id="Timeline-Add-Dot" onClick={this.addTimelineEntry}>+</button>
                                        </div>
                                    </div>

                                </div>
                            )

                        }
                    })()}

                </div>


                {/* MODAL */}

                {(() => {

                    switch (this.state.displayContent) {
                        case 'add':
                            return <JournalAddEditModal journalID={this.state.journalID} closeModal={this.closeModal} editPost="new" />;
                        case 'edit':
                            return <JournalAddEditModal journalID={this.state.journalID} closeModal={this.closeModal} editPost={this.state.currentEntry} />;
                        case 'full-image':
                            return <FullImageModal closeModal={this.closeModal} imageList={this.state.fullImageModalImages} currentFullImage={this.state.currentFullImage} />;
                        case 'create-journal':
                            return <JournalCreateModal journalID={this.state.journalID} setJournalID={this.setJournalID} />;
                        case 'main':
                            return <div />;
                        default:
                            return <div />;
                    }

                })()}

            </div>

        );
    }
}

export default GrowJournal;
