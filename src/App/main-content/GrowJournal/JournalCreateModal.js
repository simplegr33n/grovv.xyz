import React, { Component } from 'react';
import '../../../styles/App.css';


import DbHelper from '../../_utils/DbHelper.js'



class JournalCreateModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            journalName: '',
            journalID: this.props.journalID
        };

		this.dbHelper = new DbHelper();

    }

    componentDidMount() {

    }

    handleJournalNameChange = (event) => {
        this.setState({ journalName: event.target.value });
    }

    cancelModal = () => {
        this.props.setJournalID(null);
    }

    createJournal = async () => {
        if (this.state.journalName === '') {
            alert("Journal needs a name!")
            return;
        }

        try {
            await this.dbHelper.createJournal(this.state.journalName, this.openJournal)
        } catch (e) {
            console.log(e);
            return 'caught ' + e
        }

    }

    openJournal = (journalID) => {
        this.setState({ journalID: journalID });
        this.props.setJournalID(journalID);
    }

    render() {

        return (
            <div id="Journal-Modal-Space">
                <div id="Journal-Create-Modal">
                    {/* TITLE INPUT  */}
                    <input className="journal-modal-journal-name" placeholder="enter journal name..." value={this.state.journalName} onChange={this.handleJournalNameChange} />
                    <div id="journal-create-btns">
                        <button className="journal-cancel-create-btn" onClick={this.cancelModal}>Cancel</button>
                        <button className="journal-create-journal-btn" onClick={this.createJournal}>Create Journal</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default JournalCreateModal;
