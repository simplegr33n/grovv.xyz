import React, { Component } from 'react';
import '../../../styles/App.css';

import JournalAddEditModal from './JournalAddEditModal'
import FullImageModal from './FullImageModal'
import JournalCreateModal from './JournalCreateModal'
import JournalTimelineButton from './JournalTimelineButton'
import JournalBoxItem from './JournalBoxItem'
import JournalEntry from './JournalEntry'


import DbHelper from '../../_utils/DbHelper.js'



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
            journalID: this.props.journalID,
            fullImageModalImages: null,
            currentFullImage: null
        };

        this.dbHelper = new DbHelper();

    }

    componentDidMount() {
        this._ismounted = true;
        this.watchUserJournals = this.watchUserJournals();

        if (this.props.journalID) {
            this.watchEntries(this.props.journalID)
        }
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    watchUserJournals = () => {
        this.dbHelper.watchUserJournals(this.setUserJournals)
    }

    setUserJournals = (journalsList) => {
        if (this._ismounted) {
            this.setState({
                userJournals: journalsList
            }); 
        }
    }

    watchEntries = (journalID = this.props.journalID) => {
        this.dbHelper.watchJournalEntries(journalID, this.setJournalEntries)
    }

    setJournalEntries = (entriesList, dotsList) => {
        if (entriesList.length > 0) {
            this.setState({
                currentEntry: entriesList[entriesList.length - 1],
                currentEntryID: entriesList[entriesList.length - 1].id,
                timelineEntries: entriesList,
                timelineDots: dotsList,
                displayEntries: dotsList[dotsList.length - 1]
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

        this.setEntries(dotsList[dotsList.length - 1]);
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
        if (id === null) {
            this.setState({
                displayContent: "main",
            });
            this.props.setJournalID(null)
            return;
        }

        this.setState({
            displayContent: "main",
            journalID: id
        });
        this.props.setJournalID(id)
        this.watchEntries(id)
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
            displayEntries: []
        });
        this.props.setJournalID(ev.target.value)
        this.watchEntries(ev.target.value)
    }

    openCreateJournalModal = () => {
        this.setState({ displayContent: "create-journal" });
    }

    openJournal = (journal) => {
        this.setState({
            journalID: journal.id
        });
        this.props.setJournalID(journal.id);
        this.watchEntries(journal.id);
    }

    render() {

        var renderedJournalOptions = '';
        if (this.state.userJournals.length > 0) {
            renderedJournalOptions = this.state.userJournals.map((journal) => <option key={journal.id} value={journal.id}>{journal.name}</option>)
        }

        var renderedUserJournals = null;
        if (this.state.userJournals) {
            renderedUserJournals = this.state.userJournals.map((journal) =>
                <div key={journal.id} className="Journal-Box-Item-Container">
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
                            if (renderedUserJournals && !this.props.journalID) {
                                return (
                                    <div id="Journal-Box-Area-Scroll">


                                        <div id="Grow-Journal-Header-Area">
                                            <div id="Grow-Journal-Header-Text">Grow Journals</div>
                                            <button className="New-Journal-Btn" onClick={this.openCreateJournalModal}>
                                                +
                                            </button>
                                        </div>


                                        <div id="Journal-Box-Area">
                                            {renderedUserJournals}
                                        </div>
                                    </div>
                                )
                            } else if (!this.props.journalID) {
                                return (
                                    <div id="Grow-Journal-Header-Area">
                                        <div id="Grow-Journal-Header-Text">Grow Journals</div>
                                        <button className="New-Journal-Btn" onClick={this.openCreateJournalModal}>
                                            +
                                        </button>
                                    </div>
                                )
                            }
                        })()}


                        {(() => {
                            if (renderedJournalOptions && this.props.journalID) {
                                return (
                                    <div className="Grow-Journal-Title-Div">
                                        <select id="Grow-Journal-Title-Select" onChange={this.handleJournalChange} value={this.props.journalID}>
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
                            if (this.props.journalID) {
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
                        if (this.props.journalID) {
                            return (
                                <div id="Timeline-Container">

                                    <div id="Timeline-Inner-Container">
                                        <div id="Timeline-Line" />
                                        
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
                            return <JournalAddEditModal journalID={this.props.journalID} closeModal={this.closeModal} editPost="new" />;
                        case 'edit':
                            return <JournalAddEditModal journalID={this.props.journalID} closeModal={this.closeModal} editPost={this.state.currentEntry} />;
                        case 'full-image':
                            return <FullImageModal closeModal={this.closeModal} imageList={this.state.fullImageModalImages} currentFullImage={this.state.currentFullImage} />;
                        case 'create-journal':
                            return <JournalCreateModal journalID={this.props.journalID} setJournalID={this.setJournalID} />;
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
