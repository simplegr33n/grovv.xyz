import React, { Component } from 'react';
import '../../../styles/App.css';


class JournalBoxItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            journal: this.props.journal
        };

    }

    openJournal = () => {
        this.props.openJournal(this.props.journal)
    }

    render() {

        var createdAt = new Date(this.props.journal.createdAt).toDateString()

        return (
            <div className="Journal-Box-Item" onClick={this.openJournal}>
                <div className="Journal-Box-Item-Main">
                    <div className="Journal-Box-Item-Header">
                        <div>
                            {this.props.journal.name}
                        </div>
                        <div className="Journal-Box-Created">
                            created: <i>{createdAt}</i>
                        </div>
                    </div>

                    <div className="Journal-Box-Info">
                        <b>grow status:</b> (TODO)
                    </div>

                    <div className="Journal-Box-Info">
                        <b>last update:</b> (TODO)
                    </div>
                </div>

                <img alt="preview" src={this.props.journal.previewImage} className="Journal-Box-Preview-Image" />
            </div>
        );
    }
}

export default JournalBoxItem;
