import React, { Component } from 'react';
import '../../styles/App.css';
import Firebase from '../../config/firebaseConfig.js'


class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            SHOWFIELDS: false
        };

        this.firebase = new Firebase()

        this.firebase.auth.onAuthStateChanged((user) => {
            if (!user) {
                this.showSigninFields();
            }
        });
    }

    handleUsernameChange = (event) => {
        this.setState({ username: event.target.value });
    }

    handlePasswordChange = (event) => {
        this.setState({ password: event.target.value });
    }

    validateEmail(testEmail) {
        var emailRegex = /^\S+@\S+$/;
        return emailRegex.test(String(testEmail).toLowerCase());
    }

    validatePassword(testPswd) {
        var paswdRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        return paswdRegex.test(String(testPswd));
    }

    handleSubmit = () => {
        console.log("SignIn submit pressed");
        let username = this.state.username;
        let password = this.state.password;
        console.log(`SignUp submit pressed - username ${username}`);
        if (!this.validateEmail(username)) {
            alert('Bad email me thinks :(')
            return;
        }
        if (!this.validatePassword(password)) {
            alert('Bad password. Must be 7-15 characters with at least 1 numeric digit and a special character.')
            return;
        }
        this.setState({
            username: '',
            password: ''
        });
        this.hideSigninFields();

        this.firebase.auth.signInWithEmailAndPassword(username, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(`${errorCode}: ${errorMessage}`)
            alert(`${errorCode}: ${errorMessage}`)
            this.setState({ SHOWFIELDS: true });
            return;
            // ...
        });

        console.log(`username ${username} - logged in`)
        this.props.signIn("songwall");
        return;

    }

    hideSigninFields = () => {
        this.setState({ SHOWFIELDS: false });
    }

    showSigninFields = () => {
        this.setState({ SHOWFIELDS: true });
    }

    // handleGotoSignUp = () => {
    //     this.props.gotoSignUp("signup");
    //     console.log("Goto signup pressed");
    // }

    render() {

        if (this.state.SHOWFIELDS) {
            return (
                <div id="signin-div">
                    <h3>Sign In</h3>
                    <div>
                        Email:
                        <input id="signin-username" value={this.state.username} onChange={this.handleUsernameChange} />
                    </div>
                    <div>
                        Password:
                        <input type="password" id="signin-password" value={this.state.password} onChange={this.handlePasswordChange} />
                    </div>
                    <div>
                        <button id="submit-signin-btn" onClick={this.handleSubmit} > Sign in! </button>
                    </div>
                    {/* <div>
                        <button id="goto-signup-btn" onClick={this.handleGotoSignUp} > Sign up! </button>
                    </div> */}
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


export default SignIn;
