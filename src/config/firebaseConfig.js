import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth' 
import 'firebase/storage' 


// Initialize Firebase
var config = {
    apiKey: "AIzaSyBJuUseKfGN_MjNEWg722WY1FsO2xZ1AuE",
    authDomain: "grovv-22cbd.firebaseapp.com",
    databaseURL: "https://grovv-22cbd.firebaseio.com",
    projectId: "grovv-22cbd",
    storageBucket: "grovv-22cbd.appspot.com",
    messagingSenderId: "30272449560"
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
