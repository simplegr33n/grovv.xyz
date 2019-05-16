import React, { Component } from 'react';
import '../../../styles/App.css';

class JournalEntry extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentEntry) {
            if (this.state.currentEntry.id === prevProps.currentEntry.id) {
                return;
            }
        }

        this.setState({
            currentEntry: prevProps.currentEntry
        });

    }

    displayFullImage = (ev) => {
        this.props.displayFullImage(this.props.currentEntry.images)
        this.props.currentFullImage(ev.target.dataset.value)
        // let val = ev.target.dataset.value;
        // window.open(val);
    }

    editEntryByID = (ev) => {
        this.props.editEntryByID(ev.target.dataset.value);
    }

    render() {

        var renderedThumbnails = null;
        if (this.props.currentEntry) {
            if (this.props.currentEntry.images) {
                renderedThumbnails = this.props.currentEntry.images.map((image, i) => <img key={i} alt="grow img" data-value={image.url} src={image.thumb} className="Journal-Entry-Thumbnail" onClick={this.displayFullImage} />)
            }
        }

        var datetimeTrue = null;
        if (this.props.currentEntry && (this.props.currentEntry !== '')) {
            datetimeTrue = new Date(this.props.currentEntry.datetime_true)
        }

        return (
            <div className="Journal-Post-View">

                <div className="Journal-Post-Header">
                    <div className="Journal-Post-Date">
                        {datetimeTrue.toDateString()}
                    </div>

                    <div className="Journal-Post-Title">
                        {this.props.currentEntry.title}
                    </div>

                    <button className="Journal-Edit-Post-Btn" data-value={this.props.currentEntry.id} onClick={this.editEntryByID}>
                        edit &#9998;
                    </button>
                </div>

                <div className="Journal-Post-Content">
                    {this.props.currentEntry.content}
                </div>


                {(() => {
                    if (renderedThumbnails) {
                        return (
                            <div className="Journal-Post-Images-Wrapper">
                                <div className="Journal-Post-Images">
                                    {renderedThumbnails}
                                </div>
                            </div>
                        )
                    }
                })()}


            </div>
        );
    }
}

export default JournalEntry;
