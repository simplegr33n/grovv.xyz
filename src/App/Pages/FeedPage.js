import React, { Component } from 'react'
import '../../styles/App.css'

import '../_utils/DbHelper.js'
import DbHelper from '../_utils/DbHelper.js';

import FeedGrowSection from '../Components/_Pages/FeedPage/FeedGrowSection.js'


class FeedPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };

        this.dbHelper = new DbHelper()

    }

    componentDidMount() {
        this.dbHelper.getFeedData('fix_id_thing', this.setFeedData)
    }

    componentDidUpdate() {

    }

    setFeedData = (feedData) => {
        this.setState({ feedData: feedData })
    }


    render() {

        if (this.state.feedData) {
            var renderGrowRows = Object.entries(this.props.user.grows).map((userGrowData) => {
                return <FeedGrowSection key={userGrowData[0]} feedData={this.state.feedData} userGrowData={userGrowData} />
            })
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', userSelect: 'none', width: '100%' }}>
                <div>
                    feedpage
                </div>

                {renderGrowRows}

            </div>

        );
    }
}

export default FeedPage;
