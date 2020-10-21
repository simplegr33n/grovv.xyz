import React, { Component } from 'react';
import '../../styles/App.css';
import Firebase from '../../config/firebaseConfig.js'

import { ReactComponent as TobyFace } from '../../assets/tobyface.svg';


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

    enterSubmit() {
        console.log("SignIn submit enter pressed");
        let username = this.state.username;
        let password = this.state.password;
        console.log(`SignUp submit enter pressed - username ${username}`);
        if (!this.validateEmail(username)) {
            alert('Bad email me thinks :(')
            return;
        }
        // if (!this.validatePassword(password)) {
        //     alert('Bad password. Must be 7-15 characters with at least 1 numeric digit and a special character.')
        //     return;
        // }
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
        // this.props.signIn();
        return;

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
        // if (!this.validatePassword(password)) {
        //     alert('Bad password. Must be 7-15 characters with at least 1 numeric digit and a special character.')
        //     return;
        // }
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
        // this.props.signIn();
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
                        <input type="password" id="signin-password" value={this.state.password}
                            onChange={this.handlePasswordChange}
                            onKeyPress={(ev) => {
                                console.log(`Pressed keyCode ${ev.key}`);
                                if (ev.key === 'Enter' || ev.key === '13') {
                                    // Do code here
                                    this.enterSubmit()
                                }
                            }} />
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


                <div className="Loading-Screensaver">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: "#c3e7c340", borderRadius: '50%', marginTop: '30px', marginLeft: '60px', marginRight: '60px' }}>
                        <div style={{ maxHeight: '100vw', maxWidth: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'row', flex: 1, background: "#c3e7c340", borderRadius: '50%' }}>
                            < TobyFace
                                className="Flying-toby"
                                viewBox="0 0 110 110"
                                style={{ flex: 1, height: "10%", paddingLeft: "30%", paddingRight: "30%", paddingTop: "10%" }} />

                            <div style={{ color: "#000", fontWeight: 800, position: 'absolute', color: "#5da55d", top: '60px', fontSize: '50px' }}>
                                LOADING...
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}


export default SignIn;
