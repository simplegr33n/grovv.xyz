import React, { Component } from 'react';
import '../../styles/main-content.css';
import Firebase from '../../config/firebaseConfig.js'


class EditProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };

        this.firebase = new Firebase()
    }

    handleUsernameChange = (event) => {
        this.setState({ username: event.target.value });
    }

    handleSubmit = () => {

    }


    render() {
        return (
            <div id="submit-song-box">
                <div>
                    Edit Username:
                        <input id="edit-username-area" value={this.props.username} onChange={this.handleUsernameChange} />
                </div>
                <div>
                    Change Password:
                        <input type="password" id="edit-password-area" />
                </div>
                <div id="post-button" onClick={this.handleSubmit}>
                    Submit Changes
                    </div>
            </div>
        );
    }
}

export default EditProfile;
