import React, { Component } from 'react';
import '../../../styles/App.css';

import GrowBoxItem from './GrowBoxItem'


import Firebase from '../../../config/firebaseConfig.js'


class GrowPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayContent: "main",
            userGrows: [],
            growID: null,
        };

        this.firebase = new Firebase();

    }

    componentDidMount() {
        this._ismounted = true;
        this.watchgrows = this.watchGrows();
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    watchGrows = () => {
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows')

        ref.on('value', (snapshot) => {


            console.log("watch grows!")
            console.log(snapshot.val())

            // var growsList = [];

            // snapshot.forEach((child) => {
            //     growsList.push(child.val())
            // });

            // console.log("grows List:")
            // console.log(growsList)

            // growsList.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : -1)

            // this.setState({
            //     userGrows: growsList
            // });

        }, function (errorObject) {
            console.log("watch user grows failed: " + errorObject.code);
        });
    }



    closeModal = (key) => {
        if (!key || key === '') {
            this.setState({ displayContent: "main" });
            return;
        }

        this.setState({ displayContent: "main" });
    }

    handleGrowChange = (ev) => {
        console.log("grow CHANGE!!!!")
        console.log(ev.target.value)
        this.setState({
            userGrows: [],
            growID: ev.target.value
        });
        this.watchEntries(ev.target.value)
    }

    openCreateGrowModal = () => {
        alert("GrowPage.js TODO")
        this.firebase.db.ref().child('grows').push({'name':'Ganja Grove'})
        // this.setState({ displayContent: "create-grow" });
    }

    render() {

        var renderedGrowBoxes = null;
        if (this.state.userGrows) {
            renderedGrowBoxes = this.state.userGrows.map((grow) =>
                <div className="Grow-Box-Item-Container">
                    <GrowBoxItem grow={grow} openGrow={this.openGrow} />
                </div>
            )
        }

        return (

            <div id="Grow-Page">
                <div id="Grow-Main">
                    <div id="Grow-Main-Area">

                        {(() => {
                            if (this.state.growID === null) {
                                return (
                                    <div id="Grow-Header-Area">
                                        <div id="Grow-Header-Text">Grows</div>
                                        <button className="New-Grow-Btn" onClick={this.openCreateGrowModal}>
                                            +
                                        </button>
                                    </div>
                                )
                            }
                        })()}

                        {(() => {
                            if (renderedGrowBoxes) {
                                return (
                                    <div id="Grow-Box-Area-Scroll">
                                        <div id="Grow-Box-Area">
                                            {renderedGrowBoxes}
                                        </div>
                                    </div>
                                )
                            }
                        })()}

                    </div>
                </div>
            </div>
        );
    }
}

export default GrowPage;
