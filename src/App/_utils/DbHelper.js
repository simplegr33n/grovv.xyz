import Firebase from '../../config/firebaseConfig.js'


class DbHelper {

    constructor() {

        this.firebase = new Firebase();

        this.userID = 'FjfypUxF0ddiUjuFytPU5vES5B42' // Hardcoded to bradyn's for now

        this.runningData = []
    }

    // ............ //
    //    USER      //
    // ............ //
    // Get User
    getUser(UID, setData) {

        // Config data isResetting in firebase 
        var ref = this.firebase.db.ref().child('users').child(UID)

        ref.on('value', (snapshot) => {
            setData(snapshot.val())
            ref.off('value')

        }, function (errorObject) {
            console.log("get user failed: " + errorObject.code);
        });
    }


    // Set Grow Config in firebase
    setUser(u) {
        var ref = this.firebase.db.ref().child('users').child(u.uid)
        ref.set(u)
    }

    // .................. //
    // ADD LIFETIME DATA  //
    // .................. //
    getLifetimeData(userID, setData) {
        var ref = this.firebase.db.ref().child('lifetime').child(this.userID)

        ref.on('value', (snapshot) => {
            setData(snapshot.val())
            ref.off('value')

        }, function (errorObject) {
            console.log("Get Lifetime Data failed: " + errorObject.code);
        });
    }

    postLifetimeData(lifetimeObject, growID, year, month, day) {
        console.log("Post Lifetime Data", lifetimeObject)

        var ref = this.firebase.db.ref().child('lifetime').child(this.userID).child(growID).child(year).child(month).child(day)
        ref.set(lifetimeObject)
    }

    getMonthChunk(growID, year, month, setData) {
        console.log("getMonthCHunk!" + growID + " " + year + " " + month)

        var ref = this.firebase.db.ref().child('grow_data').child(this.userID).child(growID).child('sensor_data').child(year).child(month)
        ref.on('value', (snapshot) => {
            setData(snapshot.val())
            ref.off('value')
        }, function (errorObject) {
            console.log("getMonthChunk: " + errorObject.code);
        });
    }


    // .......... //
    //    DATA    //
    // .......... //
    // ....... //
    // GRAPHS  //
    // ....... //

    // Get 1 day data window from firebase
    getOneDayData(growID, updateThreeDayData) {
        var ref = this.firebase.db.ref().child('grow_data').child(this.userID).child(growID).child('sensor_data')

        if (!this.runningData[growID]) {
            this.runningData[growID] = []
        }

        var date = new Date();
        var month = (date.getMonth() + 1).toString()
        if (month.length < 2) {
            month = '0' + month
        }


        // Two days...
        var days = [date.getDate(), date.getDate() - 1]
        days.forEach((day) => {
            if ((day.toString().length < 2)) {
                day = '0' + day
            }
        })

        days.forEach((day) => {
            ref.child(date.getFullYear()).child(month).child(day).on('value', (snapshot) => {
                snapshot.forEach((child) => {
                    child.forEach((gChild) => {
                        var dataPoint = gChild.val()
                        dataPoint.time = dataPoint.time * 1000
                        this.runningData[growID][this.runningData[growID].length] = dataPoint
                    });
                });
                // Sort data
                // Then set listeners for current day data
                this.runningData[growID].sort((a, b) => (a.time > b.time) ? 1 : -1)
                this.getCurrentData(growID, updateThreeDayData, month)

                ref.child(date.getFullYear()).child(month).child(day).off()
            });
        });



    }


    getCurrentData(growID, updateThreeDayData, month) {

        var ref = this.firebase.db.ref().child('grow_data').child(this.userID).child(growID).child('sensor_data')

        var date = new Date();
        var day = date.getDate()
        if ((day.toString().length < 2)) {
            day = '0' + day
        }

        ref.child(date.getFullYear()).child(month).child(day).child(date.getHours()).on('child_added', (snapshot) => {

            var dataPoint = snapshot.val()
            dataPoint.time = dataPoint.time * 1000

            if (dataPoint.time > this.runningData[growID][this.runningData[growID].length - 1].time) {
                this.runningData[growID][this.runningData[growID].length] = dataPoint
            } else {
                console.log("skipping already included value")
            }

            updateThreeDayData(this.runningData);
        });
    }

    updateCurrentDataGet(growID, updateThreeDayData, month) {

        var ref = this.firebase.db.ref().child('grow_data').child(this.userID).child(growID).child('sensor_data')

        var date = new Date();
        var day = date.getDate()
        if ((day.toString().length < 2)) {
            day = '0' + day
        }

        // turn off listener from previous hour
        ref.child(date.getFullYear()).child(month).child(day).child(date.getHours() - 1).off()
        if (date.getHours() === 0) {
            // turn off for previous day
            ref.child(date.getFullYear()).child(month).child(date.getDate() - 1).child(24).off()
        }

        ref.child(date.getFullYear()).child(month).child(day).child(date.getHours()).on('child_added', (snapshot) => {

            var dataPoint = snapshot.val()
            dataPoint.time = dataPoint.time * 1000

            if (dataPoint.time > this.runningData[growID][this.runningData[growID].length - 1].time) {
                this.runningData[growID][this.runningData[growID].length] = dataPoint
            } else {
                console.log("skipping already included value")
            }

            updateThreeDayData(this.runningData);
        });
    }


    // ............ //
    // GROW CONFIG  //
    // ............ //
    // Get Reset Value
    getGrowConfig(growID, setData) {

        // Config data isResetting in firebase 
        var ref = this.firebase.db.ref().child('grows').child(this.userID).child(growID).child('config')

        ref.on('value', (snapshot) => {

            if (snapshot.val() === null) {
                setData(false);
                return;
            }

            setData(snapshot.val())


        }, function (errorObject) {
            console.log("watch isResetting failed: " + errorObject.code);
        });
    }


    // Set Grow Config in firebase
    setGrowConfig(growID, config) {
        var ref = this.firebase.db.ref().child('grows').child(this.userID).child(growID).child('config')
        ref.update(config)
    }


    // .................. //
    // GROW CONFIG RESET  //
    // .................. //

    // Get Reset Value
    getResetValue(growID, setData) {

        // Config data isResetting in firebase 
        var ref = this.firebase.db.ref().child('grows').child(this.userID).child(growID).child('config').child('isResetting')

        ref.on('value', (snapshot) => {

            if (snapshot.val() === null) {
                setData(false);
                return;
            }

            setData(snapshot.val())


        }, function (errorObject) {
            console.log("watch isResetting failed: " + errorObject.code);
        });
    }

    // Get Reset Value
    resetGrow(growID) {
        // Config data isResetting in firebase 
        var ref = this.firebase.db.ref().child('grows').child(this.userID).child(growID).child('config').child('isResetting')

        ref.set(true)
    }



    // ........... //
    // GROW PAGE   //
    // ........... //

    // Get live data from firebase
    getUserGrows(userID, setData) {

        var ref = this.firebase.db.ref().child('users').child(this.userID).child('grows')

        ref.on('value', (snapshot) => {

            var userGrowIDs = [];

            snapshot.forEach((child) => {
                if (!child.val().sensors_live) {
                    userGrowIDs[userGrowIDs.length] = child.key
                }
            });

            var setUserGrows = []

            userGrowIDs.forEach((key) => {
                var growRef = this.firebase.db.ref().child('grows').child(this.userID).child(key)

                growRef.once('value', (snapshot) => {

                    if (!setUserGrows.includes(snapshot.val())) {
                        setUserGrows[setUserGrows.length] = snapshot.val()
                    }

                    setUserGrows.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)

                    setData(setUserGrows)

                }, function (errorObject) {
                    console.log("watch user grows grow failed: " + errorObject.code);
                });
            })

        }, function (errorObject) {
            console.log("watch user grows failed: " + errorObject.code);
        });

    }


    // ............ //
    //    FEED      //
    // ............ //
    getFeedData(UID, setData) {
        // Config data isResetting in firebase 
        var ref = this.firebase.db.ref().child('feed').child(this.userID)

        ref.on('value', (snapshot) => {

            if (snapshot.val() === null) {
                setData(false);
                return;
            }
            setData(snapshot.val())

        }, function (errorObject) {
            console.log('get user failed: ', errorObject.code);
        });
    }

    createFeedRun(UID, growID, name, setData) {

        var feedRun = []
        feedRun._createdAt = Math.floor(new Date().getTime() / 1000)
        feedRun._name = name
        feedRun._isActive = true

        var ref = this.firebase.db.ref().child('feed').child(this.userID).child(growID)

        ref.push(feedRun)
    }

    postFeedEntry(UID, growID, runID, entry, year, month) {

        console.log("POSTFEED", entry)

        var ref = this.firebase.db.ref().child('feed').child(this.userID).child(growID).child(runID).child('ENTRIES').child(year).child(month)
        ref.push(entry)
    }

    // ............... //
    //   DEVICE RESET  //
    // ............... //


    resetDevice(UID, growID) {
        var ref = this.firebase.db.ref().child('grows').child(this.userID).child(growID).child('config-hardware').child('reset')
        ref.set(1)
    }


    // .............. //
    //   SIGN OUT     //
    // .............. //


    signOut() {
        this.firebase.auth.signOut().then(function () {
            // Sign-out successful.
            console.log(`signed out`)
            window.location.reload()
        }).catch(function (error) {
            // An error happened.
            console.log(`Error signing out: ${error}`)
        });
    }




}

export default DbHelper;