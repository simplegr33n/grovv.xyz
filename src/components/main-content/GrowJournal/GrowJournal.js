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
            testContent: ''
        };

        this.firebase = new Firebase();

        this.timelineEntries = [];

        //this.watchConfig = this.watchTimeline();
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

            this.timelineEntries.push(snapshot.val())

            this.setState({ currentEntry: snapshot.val() });

            this.fillTimeline();

        }, function (errorObject) {
            console.log("follow journal failed: " + errorObject.code);
        });
    }

    fillTimeline = () => {
        console.log(this.timelineEntries.length);
        console.log(this.timelineEntries);
    }

    addTimelineEntry = () => {
        this.setState({ displayContent: "add-edit" });
    }


    closeModal = () => {
        this.setState({ displayContent: "main" });
    }

    setEntryContent = (ev) => {

        let val = ev.target.dataset.value;

        this.timelineEntries.forEach((timelineEntry) => {
            if (timelineEntry.datetime_post.toString() === val) {
                this.setState({ currentEntry: timelineEntry });
                return;
            }
        })

    }

    render() {

        var renderedTimeline = this.timelineEntries.map((item, i) => <button key={i} data-value={item.datetime_post} className="Timeline-Dot" onClick={this.setEntryContent} />)

        var datetimePost = null;
        if (this.state.currentEntry) {
            datetimePost = new Date(this.state.currentEntry.datetime_post)
        }

        return (


            <div id="Journal-Page">
                <div id="Journal-Main">
                    <h1>Grow Journal</h1>
                    {(() => {
                        if (this.state.currentEntry) {
                            return <div className="Journal-Post-View">

                                <div className="Journal-Post-Header">
                                    <div className="Journal-Post-Title">
                                        {this.state.currentEntry.title}
                                    </div>

                                    <div className="Journal-Post-Date">
                                        {datetimePost.toDateString()}
                                    </div>
                                </div>

                                <div className="Journal-Post-Content">
                                    {this.state.currentEntry.content}
                                </div>

                                
                                <div className="Journal-Post-Images">
                                    ...images eventually...
                                </div>

                            </div>
                        } else {
                            return (
                                <div className="Journal-Post-View" >
                                    Let's get some journal entries...
                                </div>
                            )
                        }
                    })()}

                    <div id="Timeline-Container">
                        <div id="Timeline-Line" />

                        {/* TODO: Generate dots from firebase entries... */}
                        <div id="Timeline-Spots">
                            {renderedTimeline}
                        </div>

                        <div id="Timeline-Add-Dot" onClick={this.addTimelineEntry}>
                            +
                        </div>
                    </div>
                </div>


                {/* MODAL */}

                {(() => {

                    switch (this.state.displayContent) {
                        case 'add-edit':
                            return <JournalAddEditModal closeModal={this.closeModal} />;
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
