import React, { Component } from 'react';
import '../../styles/App.css';
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

    handleChangePassword = () => {
        // this.firebase.auth.sendPasswordResetEmail(this.state.username)
        alert("Sorry - request from reset admin for now.")
        return;
    }


    render() {
        return (

            <div id="Profile-Page">
                <div id="Profile-Page-Header">
                    <div>
                        Email: <b>{this.props.username}</b>
                    </div>
                    <button onClick={this.handleChangePassword}>Change Password</button>
                </div>
            </div>

        );
    }
}

export default EditProfile;
