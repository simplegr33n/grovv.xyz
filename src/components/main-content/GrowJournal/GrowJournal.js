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

        this.timelineEntries = new Array();

        this.watchTimeline();
    }

    watchTimeline = () => {
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('journal')

        ref.on('child_added', (snapshot) => {

            this.timelineEntries.push(snapshot.val())

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

        return (


            <div id="Journal-Page">
                <div id="Journal-Main">

                    {(() => {
                        if (this.state.currentEntry) {
                            return <div className="Journal-Post-View">
                                        <div>
                                            {this.state.currentEntry.datetime_post} 
                                        </div>

                                        <div>
                                            <b>
                                                <h1>
                                                    {this.state.currentEntry.title} 
                                                </h1>
                                            </b>
                                        </div>
                                        
                                        <div>
                                            <b>
                                                {this.state.currentEntry.content} 
                                            </b>
                                        </div>
                            
                                   </div>
                        } else {
                            return <div> Grow Journal... </div>
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
