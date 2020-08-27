import React, { Component } from 'react';
import '../../styles/App.css';
import Firebase from '../../config/firebaseConfig.js'


class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            SHOWFIELDS: false
        };

        this.firebase = new Firebase()

        this.firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                this.postUserToFirebase(user.uid, user.email);
            } else {
                this.showSignupFields();
            }
        });


    }

    postUserToFirebase(uid, username) {
        let date = new Date()
        let timestamp = date.getTime()

        // A user entry.
        var userData = {
            uid: uid,
            username: username,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['/users/' + uid] = userData;

        return this.firebase.db.ref().update(updates);
    }

    validateEmail(testEmail) {
        var emailRegex = /^\S+@\S+$/;
        return emailRegex.test(String(testEmail).toLowerCase());
    }

    validatePassword(testPswd) {
        var paswdRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        return paswdRegex.test(String(testPswd));
    }

    hideSignupFields = () => {
        this.setState({ SHOWFIELDS: false });
    }

    showSignupFields = () => {
        this.setState({ SHOWFIELDS: true });
    }

    handleUsernameChange = (event) => {
        this.setState({ username: event.target.value });
    }

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
    }

    handleSubmit = () => {
        let username = this.state.username;
        let password = this.state.password;
        console.log(`SignUp submit pressed - username ${username}`);
        if (!this.validateEmail(username)) {
            alert('Bad email me thinks :(')
            this.setState({
                username: ''
            });
            return;
        }
        if (!this.validatePassword(password)) {
            alert('Bad password. Must be 7-15 characters with at least 1 numeric digit and a special character.')
            this.setState({
                password: ''
            });
            return;
        }

        this.firebase.auth.createUserWithEmailAndPassword(username, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(`${errorCode}: ${errorMessage}`)
            return;
            // ...
        });
        
        return;
    }

    handleGotoSignIn = () => {
        this.props.gotoSignIn("signin");
        console.log("Goto signin pressed");
    }

    render() {

        if (this.state.SHOWFIELDS) {
            return (
                <div id="signup-div">
                    <h3>Sign Up</h3>
                    <div>
                        Email:
                        <input id="signup-username" value={this.state.username} onChange={this.handleUsernameChange} />
                    </div>
                    <div>
                        Password:
                        <input type="password" id="signup-password" value={this.state.password} onChange={this.handlePasswordChange} />
                    </div>
                    <div>
                        <button id="submit-signup-btn" onClick={this.handleSubmit} > Sign up! </button>
                    </div>
                    <div>
                        <button id="goto-signin-btn" onClick={this.handleGotoSignIn} > Sign in! </button>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    One Moment...
                </div>
            );
        }
    }
}

export default SignUp;
