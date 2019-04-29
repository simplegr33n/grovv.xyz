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
        var idVar = "Timeline-Dot-" + this.props.entry.grow_stage

        return (
            <div>
                <div className="Timeline-Dot-Connector"></div>
                <button data-value={this.props.entry.id} id={idVar} className="Timeline-Dot" onClick={this.setEntry} />
            </div>        
        );
    }
}

export default JournalTimelineButton;
