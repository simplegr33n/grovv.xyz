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
        var timelineDate = new Date(this.props.entry.datetime_true)
        var dayMonth = timelineDate.getMonth() + "-" + timelineDate.getDay() + "-" + timelineDate.getFullYear()

        return (
            <div>
                <div className="Timeline-Dot-Connector"><div className="Dot-Connector-Text-rotate-180">{dayMonth}</div></div>
                <button data-value={this.props.entry.id} id={idVar} className="Timeline-Dot" onClick={this.setEntry} />
            </div>        
        );
    }
}

export default JournalTimelineButton;
