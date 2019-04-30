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
        var shortMonth = (timelineDate.getMonth() + 1) + "-"
        if (shortMonth.length === 2) {
            shortMonth = "0" + shortMonth;
        }
        var shortDateVar = shortMonth + timelineDate.getDate()

        var isActiveEntry = false;
        if (this.props.currentEntryID === this.props.entry.id) {
            isActiveEntry = true;
            console.log("YIPers!")
        }


        return (
            <div>
                {(() => {
                    if (isActiveEntry) {
                        return (
                            <div className="Timeline-Dot-Connector"><div className="Dot-Connector-Text-rotate-180">{shortDateVar}</div></div>
                        )
                    }
                })()}
                <button data-value={this.props.entry.id} id={idVar} className="Timeline-Dot" onClick={this.setEntry} />
            </div>
        );
    }
}

export default JournalTimelineButton;
