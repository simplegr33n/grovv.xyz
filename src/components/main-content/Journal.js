import React, { Component } from 'react';
import '../../styles/App.css';

import Firebase from '../../config/firebaseConfig.js'


class Journal extends Component {

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
                            return (
                                <div id="Journal-Modal-Space">
                                    <div id="Journal-Edit-Entry-Modal">
                                        <div id="Journal-Edit-Topline">
                                            <input className="journal-modal-edit-title" placeholder="enter title..." />
                                            <div className="journal-modal-edit-date-container">
                                                <ul className="journal-modal-edit-date">
                                                    <li className="modal-date-li"><a href="#">January</a>
                                                        <ul className="journal-entry-date-dropdown">
                                                            <li className="date-li"><a href="#">January</a></li>
                                                            <li className="date-li"><a href="#">February</a></li>
                                                            <li className="date-li"><a href="#">March</a></li>
                                                            <li className="date-li"><a href="#">April</a></li>
                                                            <li className="date-li"><a href="#">May</a></li>
                                                            <li className="date-li"><a href="#">June</a></li>
                                                            <li className="date-li"><a href="#">July</a></li>
                                                            <li className="date-li"><a href="#">August</a></li>
                                                            <li className="date-li"><a href="#">September</a></li>
                                                            <li className="date-li"><a href="#">October</a></li>
                                                            <li className="date-li"><a href="#">November</a></li>
                                                            <li className="date-li"><a href="#">December</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="modal-date-li"><a href="#">1</a>
                                                        <ul className="journal-entry-date-dropdown">
                                                            <li className="date-li"><a href="#">1</a></li>
                                                            <li className="date-li"><a href="#">2</a></li>
                                                            <li className="date-li"><a href="#">3</a></li>
                                                            <li className="date-li"><a href="#">4</a></li>
                                                            <li className="date-li"><a href="#">5</a></li>
                                                            <li className="date-li"><a href="#">6</a></li>
                                                            <li className="date-li"><a href="#">7</a></li>
                                                            <li className="date-li"><a href="#">8</a></li>
                                                            <li className="date-li"><a href="#">9</a></li>
                                                            <li className="date-li"><a href="#">10</a></li>
                                                            <li className="date-li"><a href="#">11</a></li>
                                                            <li className="date-li"><a href="#">12</a></li>
                                                            <li className="date-li"><a href="#">13</a></li>
                                                            <li className="date-li"><a href="#">14</a></li>
                                                            <li className="date-li"><a href="#">15</a></li>
                                                            <li className="date-li"><a href="#">16</a></li>
                                                            <li className="date-li"><a href="#">17</a></li>
                                                            <li className="date-li"><a href="#">18</a></li>
                                                            <li className="date-li"><a href="#">19</a></li>
                                                            <li className="date-li"><a href="#">20</a></li>
                                                            <li className="date-li"><a href="#">21</a></li>
                                                            <li className="date-li"><a href="#">22</a></li>
                                                            <li className="date-li"><a href="#">23</a></li>
                                                            <li className="date-li"><a href="#">24</a></li>
                                                            <li className="date-li"><a href="#">25</a></li>
                                                            <li className="date-li"><a href="#">26</a></li>
                                                            <li className="date-li"><a href="#">27</a></li>
                                                            <li className="date-li"><a href="#">28</a></li>
                                                            <li className="date-li"><a href="#">29</a></li>
                                                            <li className="date-li"><a href="#">30</a></li>
                                                            <li className="date-li"><a href="#">31</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="modal-date-li"><a href="#">2019</a>
                                                        <ul className="journal-entry-date-dropdown">
                                                            <li className="date-li"><a href="#">2019</a></li>
                                                        </ul>
                                                    </li>
                                                    <li className="modal-date-li"><a href="#">00:00</a>
                                                        <ul className="journal-entry-date-dropdown">
                                                            <li className="date-li"><a href="#">00:00</a></li>
                                                            <li className="date-li"><a href="#">01:00</a></li>
                                                            <li className="date-li"><a href="#">02:00</a></li>
                                                            <li className="date-li"><a href="#">03:00</a></li>
                                                            <li className="date-li"><a href="#">04:00</a></li>
                                                            <li className="date-li"><a href="#">05:00</a></li>
                                                            <li className="date-li"><a href="#">06:00</a></li>
                                                            <li className="date-li"><a href="#">07:00</a></li>
                                                            <li className="date-li"><a href="#">08:00</a></li>
                                                            <li className="date-li"><a href="#">09:00</a></li>
                                                            <li className="date-li"><a href="#">10:00</a></li>
                                                            <li className="date-li"><a href="#">11:00</a></li>
                                                            <li className="date-li"><a href="#">12:00</a></li>
                                                            <li className="date-li"><a href="#">13:00</a></li>
                                                            <li className="date-li"><a href="#">14:00</a></li>
                                                            <li className="date-li"><a href="#">15:00</a></li>
                                                            <li className="date-li"><a href="#">16:00</a></li>
                                                            <li className="date-li"><a href="#">17:00</a></li>
                                                            <li className="date-li"><a href="#">18:00</a></li>
                                                            <li className="date-li"><a href="#">19:00</a></li>
                                                            <li className="date-li"><a href="#">20:00</a></li>
                                                            <li className="date-li"><a href="#">21:00</a></li>
                                                            <li className="date-li"><a href="#">22:00</a></li>
                                                            <li className="date-li"><a href="#">23:00</a></li>
                                                            <li className="date-li"><a href="#">24:00</a></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>


                                            <div className="journal-modal-edit-stage-container">
                                                <ul className="journal-modal-edit-stage">
                                                    <li className="modal-stage-li"><a href="#">Veg</a>
                                                        <ul className="journal-entry-stage-dropdown">
                                                            <li className="stage-li"><a href="#">Veg</a></li>
                                                            <li className="stage-li"><a href="#">Flower</a></li>
                                                            <li className="stage-li"><a href="#">Seedling</a></li>
                                                            <li className="stage-li"><a href="#">None</a></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>

                                        <textarea className="journal-modal-edit-body" placeholder="enter body content..." />

                                        <div className="journal-add-images-area">
                                            <button className="journal-add-images-btn">Add Images &#x1f4f7;</button>
                                            <div className="journal-add-images">

                                            </div>
                                        </div>

                                        <button className="journal-cancel-btn" onClick={this.closeModal}>Cancel</button>
                                        <button className="journal-save-entry-btn">Save Entry</button>

                                    </div>
                                </div>
                            );
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

export default Journal;
