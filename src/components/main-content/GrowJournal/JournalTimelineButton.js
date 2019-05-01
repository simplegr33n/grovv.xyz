import React, { Component } from 'react';
import '../../../styles/App.css';

class JournalTimelineButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            journalName: '',
            journalID: this.props.journalID,
            monthDayDate: ''
        };

    }

    componentDidMount() {

        if (this.props.entry) {
            var timelineDate = new Date(this.props.entry.datetime_true)
            var shortMonth = (timelineDate.getMonth() + 1) + "-"
            if (shortMonth.length === 2) {
                shortMonth = "0" + shortMonth;
            }
            var shortDateVar = shortMonth + timelineDate.getDate()
            this.setState({ monthDayDate: shortDateVar });

        }


    }

    setEntry = () => {
        this.props.setEntry(this.props.entry);
    }

    setEntries = () => {
        this.props.setEntries(this.props.entries);
    }

    render() {
        var growStage = this.props.entry.grow_stage
        var idVar = "Timeline-Dot-" + growStage.charAt(0).toUpperCase() + growStage.slice(1)

        // Check if the button corresponds to the active entry
        var isActiveEntry = false;
        if (this.props.currentEntryID === this.props.entry.id) {
            isActiveEntry = true;
        }

        var array = (this.props.entry.datetime_short).split("-");
        var datetimeShortMD = array[0] + "-" + array[1]

        return (
            <div>
                {(() => {
                    if (isActiveEntry) {
                        return (
                            <div className="Timeline-Dot-Connector"><div className="Dot-Connector-Text-rotate-180">{datetimeShortMD}</div></div>
                        )
                    }
                })()}
                <button data-value={this.props.entries} id={idVar} className="Timeline-Dot" onClick={this.setEntries} />
            </div>
        );
    }
}

export default JournalTimelineButton;
