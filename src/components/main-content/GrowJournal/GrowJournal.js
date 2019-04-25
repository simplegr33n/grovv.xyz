import React, { Component } from 'react';
import '../../../styles/App.css';

import JournalAddEditModal from './JournalAddEditModal'

import Firebase from '../../../config/firebaseConfig.js'


class GrowJournal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayContent: "main"
        };

        this.firebase = new Firebase();
    }

    addTimelineEntry = () => {
        this.setState({ displayContent: "add-edit" });
    }

    
    closeModal = () => {
        this.setState({ displayContent: "main" });
    }

    render() {
        return (

            <div id="Journal-Page">
                <div id="Journal-Main">
                    JOURNAL
                        <div id="Timeline-Container">
                        <div id="Timeline-Line" />

                        {/* TODO: Generate dots from firebase entries... */}

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
