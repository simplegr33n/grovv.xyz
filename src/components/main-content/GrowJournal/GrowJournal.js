import React, { Component } from 'react';
import '../../../styles/App.css';

import JournalAddEditModal from './JournalAddEditModal'
import JournalCreateModal from './JournalCreateModal'

import Firebase from '../../../config/firebaseConfig.js'


class GrowJournal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayContent: "main",
            currentEntry: null,
            testContent: '',
            timelineEntries: [],
            entryThumbnails: [],
            userJournals: [],
            journalID: null
        };

        this.firebase = new Firebase();

        //this.watchJournals();

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

            if (journalsList.length > 0) {
                this.watchEntries(journalsList[0].id);

                this.setState({
                    journalID: journalsList[0].id
                });
            }

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
            var tempChild = null;
            var tempImages = [];

            snapshot.forEach((child) => {
                console.log('watchin... entry')
                console.log(child.val())
                console.log(child.child('images').val())

                tempEntriesList.push(child.val())
                tempImages = child.child('images').val()
                tempChild = child.val()
            });

            this.getThumbs(tempImages)

            tempEntriesList.sort((a, b) => (a.datetime_true > b.datetime_true) ? 1 : -1)
            

            this.setState({
                currentEntry: tempChild,
                timelineEntries: tempEntriesList
            });

            this.setEntry(tempChild);

        }, function (errorObject) {
            console.log("follow journal failed: " + errorObject.code);
        });

    }

    addTimelineEntry = () => {
        this.setState({ displayContent: "add" });
    }

    editTimelineEntry = () => {
        this.setState({ displayContent: "edit" });
    }


    closeModal = (key) => {
        this.setState({ displayContent: "main" });
        this.state.timelineEntries.forEach((timelineEntry) => {
            if (timelineEntry.id === key) {
                this.getThumbs(timelineEntry.images);
                this.setState({
                    currentEntry: timelineEntry
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

    setEntryContent = (ev) => {

        let val = ev.target.dataset.value;

        console.log(val)

        this.state.timelineEntries.forEach((timelineEntry) => {
            if (timelineEntry.id === val) {
                console.log("AFFIRM!")
                this.getThumbs(timelineEntry.images);
                this.setState({
                    currentEntry: timelineEntry
                });
                return;
            }
        })
    }

    setEntry = (entry) => {
        if (!entry) {
            return;
        }

        this.getThumbs(entry.images)

        this.setState({
            currentEntry: entry
        });

    }

    displayFullImage = (ev) => {
        let val = ev.target.dataset.value;
        window.open(val);
    }

    getThumbs = (thmbObj) => {

        if (thmbObj === null) {
            if (this.state.currentEntry === null) {
                return;
            } else {
                thmbObj = this.state.currentEntry.images;
            }
        }

        var thumbList = [];

        for (var key in thmbObj) {
            // skip loop if the property is from prototype
            if (!thmbObj.hasOwnProperty(key)) continue;

            thumbList.push(thmbObj[key])
        }

        this.setState({ entryThumbnails: thumbList });

    }



    handleJournalChange = (ev) => {
        console.log(ev.target.value)
        this.setState({
            entryThumbnails: [],
            journalID: ev.target.value
        });
        this.watchEntries(ev.target.value)
    }

    openCreateJournalModal = () => {
        this.setState({ displayContent: "create-journal" });
    }

    render() {

        var renderedJournalOptions = '';
        if (this.state.userJournals.length > 0) {
            renderedJournalOptions = this.state.userJournals.map((journal) => <option key={journal.id} value={journal.id}>{journal.name}</option>)
        } 

        //this.state.timelineEntries.sort((a, b) => (a.datetime_true > b.datetime_true) ? 1 : -1)
        var renderedTimeline = this.state.timelineEntries.map((item, i) => <button key={i} data-value={item.id} className="Timeline-Dot" onClick={this.setEntryContent} />)

        var renderedThumbnails = this.state.entryThumbnails.map((image, i) => <img key={i} alt="grow img" data-value={image.url} src={image.thumb} className="Journal-Entry-Thumbnail" onClick={this.displayFullImage} />)

        var datetimeTrue = null;
        if (this.state.currentEntry && (this.state.currentEntry !== '')) {
            datetimeTrue = new Date(this.state.currentEntry.datetime_true)
        }

        return (


            <div id="Journal-Page">
                <div id="Journal-Main">
                    <div id="Grow-Journal-Entry-Area">
                        <div id="Grow-Journal-Header-Area">
                            <div id="Grow-Journal-Header-Text">Grow Journal</div>
                            <button className="New-Journal-Btn" onClick={this.openCreateJournalModal}>
                                +
                            </button>
                        </div>

                        {(() => {
                            if (this.state.userJournals.length > 0) {
                                return (
                                    <select id="Grow-Journal-Title-Select" onChange={this.handleJournalChange} value={this.state.journalId}>
                                        {renderedJournalOptions}
                                    </select>
                                )
                            }
                        })()}

                        {(() => {
                            if (this.state.currentEntry) {
                                return (
                                    <div className="Journal-Post-View">

                                        <div className="Journal-Post-Header">
                                            <div className="Journal-Post-Date">
                                                {datetimeTrue.toDateString()}
                                            </div>

                                            <div className="Journal-Post-Title">
                                                {this.state.currentEntry.title}
                                            </div>

                                            <button className="Journal-Edit-Post-Btn" onClick={this.editTimelineEntry}>
                                                edit &#9998;
                                            </button>
                                        </div>

                                        <div className="Journal-Post-Content">
                                            {this.state.currentEntry.content}
                                        </div>


                                        {(() => {
                                            if (renderedThumbnails) {
                                                return (
                                                    <div className="Journal-Post-Images">
                                                        {renderedThumbnails}
                                                    </div>
                                                )
                                            }
                                        })()}


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

                    {(() => {
                        if (this.state.journalID) {
                            return (
                                <div id="Timeline-Container">
                                    <div id="Timeline-Line" />
                                    {/* Generate dots from firebase entries... */}
                                    <div id="Timeline-Spots">

                                        {renderedTimeline}

                                        <button id="Timeline-Add-Dot" onClick={this.addTimelineEntry}>+</button>
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
