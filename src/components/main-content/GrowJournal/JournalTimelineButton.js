import React, { Component } from 'react';
import '../../../styles/App.css';

class JournalTimelineButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            journalName: '',
            journalID: this.props.journalID
        };

    }

    componentDidMount() {


    }

    setEntry = () => {
        this.props.setEntry(this.props.entry);
    }

    render() {

        return (
            <button data-value={this.props.entry.id} className="Timeline-Dot" onClick={this.setEntry} />
        );
    }
}

export default JournalTimelineButton;
