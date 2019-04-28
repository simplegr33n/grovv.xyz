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
            entryThumbnails: []
        };

        this.firebase = new Firebase();

        this.timelineEntries = [];

    }

    componentDidMount() {
        this._ismounted = true;
        this.watchConfig = this.watchTimeline();
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    watchTimeline = () => {
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('journal')

        ref.on('child_added', (snapshot) => {

            this.getThumbs(snapshot.child('images').val());

            this.timelineEntries.push(snapshot.val())

            this.setState({ currentEntry: snapshot.val() });

        }, function (errorObject) {
            console.log("follow journal failed: " + errorObject.code);
        });
    }

    updateShownJournalPost = (id) => {
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('journal')
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

        this.timelineEntries.forEach((timelineEntry) => {
            if (timelineEntry.datetime_post.toString() === val) {
                this.getThumbs(timelineEntry.images);
                this.setState({ currentEntry: timelineEntry });
                this.updateShownJournalPost(timelineEntry.id);
                return;
            }
        })
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

    render() {

        var datetimeTrue = null;

        this.timelineEntries.sort((a, b) => (a.datetime_true > b.datetime_true) ? 1 : -1)
        var renderedTimeline = this.timelineEntries.map((item, i) => <button key={i} data-value={item.datetime_true} className="Timeline-Dot" onClick={this.setEntryContent} />)

        var renderedThumbnails = this.state.entryThumbnails.map((image, i) => <img key={i} alt="grow img" data-value={image.url} src={image.thumb} className="Journal-Entry-Thumbnail" onClick={this.displayFullImage} />)

        if (this.state.currentEntry) {
            datetimeTrue = new Date(this.state.currentEntry.datetime_true)
        }

        return (


            <div id="Journal-Page">
                <div id="Journal-Main">
                    <div id="Grow-Journal-Entry-Area">
                        <div id="Grow-Journal-Header-Text">Grow Journal</div>
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
                            return <JournalAddEditModal closeModal={this.closeModal} editPost="new" />;
                        case 'edit':
                            return <JournalAddEditModal closeModal={this.closeModal} editPost={this.state.currentEntry} />;
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
