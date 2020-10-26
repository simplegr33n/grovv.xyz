import Firebase from '../../config/firebaseConfig.js'


class DbHelper {

    constructor() {

        this.firebase = new Firebase();

        this.userID = 'FjfypUxF0ddiUjuFytPU5vES5B42' // Hardcoded to bradyn's for now

        this.runningData = []
        this.lastEntryTime = []
    }

    // ............ //
    //    USER      //
    // ............ //
    getUser(UID, setData) {

        // Config data isResetting in firebase 
        var ref = this.firebase.db.ref().child('users').child(UID)

        ref.once('value', (snapshot) => {
            setData(snapshot.val())
        }, function (errorObject) {
            console.log("get user failed: " + errorObject.code);
        });
    }

    // Set Grow Config in firebase
    setUser(u) {
        var ref = this.firebase.db.ref().child('users').child(u.uid)
        ref.set(u)
    }

    // .......... //
    //    DATA    //
    // .......... //
    // ....... //
    // CURRENT  //
    // ....... //
    getLastDayData(userGrows, sendGrowData) {
        this.sendGrowData = sendGrowData

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

        var i = 0

        userGrows.forEach((grow) => {

            var ref = this.firebase.db.ref().child('grow_data').child(this.userID).child(grow.id).child('sensor_data').child(date.getFullYear()).child(month)

            if (!this.runningData[grow.id]) {
                this.runningData[grow.id] = []
            }


            var dayCount = 0

            // get up to the most recent day
            days.forEach((day) => {
                dayCount++
                if (day !== date.getDate()) {
                    ref.child(day).once('value', (snapshot) => {
                        snapshot.forEach((child) => {
                            child.forEach((gChild) => {
                                i++;
                                if (i % 16 * dayCount === 0 || i === 0) {
                                    var dataPoint = gChild.val()
                                    dataPoint.time = dataPoint.time * 1000
                                    if (dataPoint.time < 2000000000000) { // maybe a garbage check i dont need...
                                        this.runningData[grow.id][this.runningData[grow.id].length] = dataPoint
                                    }
                                }
                            });
                        });
                        // Check if got data for each grow
                        // Sort data
                        // Then set listeners for current day data
                        var checkGrowsBool = true
                        userGrows.forEach((checkGrow) => {
                            if (this.runningData[checkGrow.id].length === 0) {
                                checkGrowsBool = false
                            } else {
                                this.runningData[grow.id].sort((a, b) => (a.time > b.time) ? 1 : -1)
                            }
                        })

                        if (checkGrowsBool) {
                            sendGrowData(this.runningData)
                            this.watchDataHours(userGrows)
                        }

                    });
                }
            });
        });
    }

    watchDataHours(userGrows) {
        var date = new Date();
        var day = date.getDate()

        var month = (date.getMonth() + 1).toString()
        if (month.length < 2) {
            month = '0' + month
        }

        var growsReturnCount = 0

        userGrows.forEach((grow) => {

            var i = 0

            console.log("watch loop", grow.id)

            var ref = this.firebase.db.ref().child('grow_data').child(this.userID).child(grow.id).child('sensor_data').child(date.getFullYear()).child(month).child(day)
            ref.off()
            ref.on('child_added', (snapshot) => {
                var checkDate = new Date();

                // datapoints for hours up to the current hour
                if (parseInt(snapshot.key) <= checkDate.getHours()) {
                    snapshot.forEach((child) => {
                        i++
                        if (i % 4 === 0 || i === 0) {
                            var dataPoint = child.val()
                            dataPoint.time = dataPoint.time * 1000
                            this.runningData[grow.id][this.runningData[grow.id].length] = dataPoint
                        }
                    })
                }

                // open first hour listener only after getting current hour for each grow
                // will bug if any grow doesnt have a current hour... but the render() App.js catch should fix?
                if (parseInt(snapshot.key) === checkDate.getHours()) {
                    growsReturnCount++

                }

                if (growsReturnCount === userGrows.length) {
                    this.getAllCurrentData(userGrows)
                }

            })
        })
    }

    getAllCurrentData(userGrows) {
        userGrows.forEach((grow) => {
            this.getCurrentData(grow.id)
        })
    }

    getCurrentData(growID) {
        console.log("get current", growID)

        var date = new Date();
        var day = date.getDate()

        var month = (date.getMonth() + 1).toString()
        if (month.length < 2) {
            month = '0' + month
        }

        // remove previous listeners
        this.firebase.db.ref().child('grow_data').child(this.userID).child(growID).child('sensor_data').child(date.getFullYear()).child(month).child(date.getDate() - 1).child(23).off()
        this.firebase.db.ref().child('grow_data').child(this.userID).child(growID).child('sensor_data').child(date.getFullYear()).child(month).child(date.getDate()).child(date.getHours() - 1).off()

        // create new listener
        var ref = this.firebase.db.ref().child('grow_data').child(this.userID).child(growID).child('sensor_data').child(date.getFullYear()).child(month).child(day).child(date.getHours())
        ref.off()
        ref.on('child_added', (snapshot) => {
            this.runningData[growID].sort((a, b) => (a.time > b.time) ? 1 : -1)

            var dataPoint = snapshot.val()
            dataPoint.time = dataPoint.time * 1000

            if ((dataPoint.time > this.runningData[growID][this.runningData[growID].length - 1].time) && (dataPoint.time > date.getTime() - 20 * 1000)) {
                this.runningData[growID][this.runningData[growID].length] = dataPoint
            }

            // TODO: can basically just rely on the second part as a wait to load timer..
            if ((date.getTime() - dataPoint.time < 600 * 1000) || (new Date().getTime() - date.getTime() > 10 * 1000)) {
                this.sendGrowData(growID, this.runningData[growID])
            }

        })
    }

    // ........... //
    //  LIFETIME   //
    // ........... //
    getLifetimeData(userID, setData) {
        var ref = this.firebase.db.ref().child('lifetime').child(this.userID)

        ref.once('value', (snapshot) => {
            setData(snapshot.val())
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
        ref.once('value', (snapshot) => {
            setData(snapshot.val())
        }, function (errorObject) {
            console.log("getMonthChunk: " + errorObject.code);
        });
    }


    // ............ //
    // GROW CONFIG  //
    // ............ //
    getGrowConfig(growID, setData) {
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