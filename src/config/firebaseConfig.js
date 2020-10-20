import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'


// Initialize Firebase
var config = {
    apiKey: "AIzaSyDj3nUoOGPgtU7OFOBv9UpGf6YQGMBixKI",
    authDomain: "grovv2-4e8e5.firebaseapp.com",
    databaseURL: "https://grovv2-4e8e5.firebaseio.com",
    projectId: "grovv2-4e8e5",
    storageBucket: "grovv2-4e8e5.appspot.com",
    messagingSenderId: "419338421156",
};

class Firebase {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }

        this.db = firebase.database();
        this.auth = firebase.auth();
        this.storage = firebase.storage();
    }
}

export default Firebase;
