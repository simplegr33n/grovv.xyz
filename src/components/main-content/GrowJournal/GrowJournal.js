import React, { Component } from 'react';
import '../../../styles/App.css';

import JournalAddEditModal from './JournalAddEditModal'

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
            }

            this.setState({
                userJournals: journalsList,
                journalID: journalsList[0].id
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

            this.setState({
                currentEntry: tempChild,
                timelineEntries: tempEntriesList
            });

            this.setEntry(tempChild);

        }, function (errorObject) {
            console.log("follow journal failed: " + errorObject.code);
        });

    }

    updateShownJournalPost = (id) => {
        // TODO: maybe eliminate this whole function.
        var ref = this.firebase.db.ref().child('journals').child(this.state.journalID).child('entries').child(id)
        if (id) {
            ref = ref.child(id)
        } else {
            ref = ref.child(this.state.currentEntry.id)
        }

        ref.on('value', (snapshot) => {
            this.setState({ currentEntry: snapshot.val() });
        }, function (errorObject) {
            console.log("update journal failed: " + errorObject.code);
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
        this.updateShownJournalPost(key);
    }

    setEntryContent = (ev) => {

        let val = ev.target.dataset.value;

        console.log(val)

       // this.updateShownJournalPost(val);

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

        console.log("yeey" + entry)
        console.log(entry.images)
        
        this.getThumbs(entry.images)

        this.setState({ 
            currentEntry: entry 
        });

    //     let val = ev.target.dataset.value;

    //     console.log(val)

    //    // this.updateShownJournalPost(val);

    //     this.state.timelineEntries.forEach((timelineEntry) => {
    //         if (timelineEntry.id === val) {
    //             console.log("AFFIRM!")
    //             this.getThumbs(timelineEntry.images);
    //             this.setState({ 
    //                 currentEntry: timelineEntry 
    //             });
    //             return;
    //         }
    //     })
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

    createNewJournal = () => {
        // ref for actual journal
        var ref = this.firebase.db.ref().child('journals').push()
        // user object ref to journal key
        var userRef = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('journals').child(ref.key)

        var journalId = ref.key
        var journalName = ref.key
        var nowDate = new Date()

        this.setState({ journalID: journalId });

        ref.set({ 'id': journalId, 'name': journalName, 'createdAt': nowDate.getTime() })
        userRef.set({ 'id': journalId, 'name': journalName })
    }

    handleJournalChange = (ev) => {
        console.log(ev.target.value)
        this.setState({  
            entryThumbnails: [],
            journalID: ev.target.value 
        });
        this.watchEntries(ev.target.value)
    }

    render() {

        var renderedJournalOptions = <option key={0} value={null} value={null}>none</option>;
        if (this.state.userJournals.length > 0) {
            renderedJournalOptions = this.state.userJournals.map((journal) => <option key={journal.id} value={journal.id}>{journal.name}</option>)
        }

        this.state.timelineEntries.sort((a, b) => (a.datetime_true > b.datetime_true) ? 1 : -1)
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
                            <button className="New-Journal-Btn" onClick={this.createNewJournal}>
                                +
                            </button>
                        </div>

                        <select id="Grow-Journal-Title-Select" onChange={this.handleJournalChange} value={this.state.journalId}>
                            {renderedJournalOptions}
                        </select>
                        {(() => {
                            if (this.state.currentEntry) {
                                return <div className="Journal-Post-View">

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
                            } else {
                                return (
                                    <div className="Journal-Post-View" >
                                        Let's get some journal entries...
                                </div>
                                )
                            }
                        })()}
                    </div>


                    <div id="Timeline-Container">
                        <div id="Timeline-Line" />
                        {/* Generate dots from firebase entries... */}
                        <div id="Timeline-Spots">

                            {renderedTimeline}

                            <button id="Timeline-Add-Dot" onClick={this.addTimelineEntry}>+</button>
                        </div>
                    </div>
                </div>


                {/* MODAL */}

                {(() => {

                    switch (this.state.displayContent) {
                        case 'add':
                            return <JournalAddEditModal journalID={this.state.journalID} closeModal={this.closeModal} editPost="new" />;
                        case 'edit':
                            return <JournalAddEditModal journalID={this.state.journalID} closeModal={this.closeModal} editPost={this.state.currentEntry} />;
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
