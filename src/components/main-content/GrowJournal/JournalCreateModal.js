import React, { Component } from 'react';
import '../../../styles/App.css';

import Firebase from '../../../config/firebaseConfig.js'


class JournalCreateModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            journalName: '',
            journalID: this.props.journalID
        };

        this.firebase = new Firebase();

    }

    componentDidMount() {


    }

    handleJournalNameChange = (event) => {
        this.setState({ journalName: event.target.value });
    }

    cancelModal = () => {
        this.props.setJournalID(this.state.journalID);
    }

    createJournal = () => {
        if (this.state.journalName === '') {
            alert("Journal needs a name!")
            return;
        }

        // ref for actual journal
        var ref = this.firebase.db.ref().child('journals').push()
        // user object ref to journal key
        var userRef = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('journals').child(ref.key)

        var journalId = ref.key
        var journalName = this.state.journalName
        var nowDate = new Date()

        this.setState({ journalID: journalId });

        ref.set({ 'id': journalId, 'name': journalName, 'createdAt': nowDate.getTime() })
        userRef.set({ 'id': journalId, 'name': journalName })

        this.props.setJournalID(journalId);
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
