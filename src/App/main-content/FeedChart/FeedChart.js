import React, { Component } from 'react';
import '../../../styles/App.css';


class FeedChart extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }


    render() {
        return (

            <div id="Chart-Page">
                <iframe id="Food-Chart" title="FoodChart" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQiIvBEmBjgIFQ_5vSAZJrzVTepyDpyDYeNrOrfqWOuraA_MHZE_sRLyGkcARlIYR-INkuwq667Seqe/pubhtml?widget=true&amp;headers=false">
                </iframe>
            </div>

        );
    }
}

export default FeedChart;
