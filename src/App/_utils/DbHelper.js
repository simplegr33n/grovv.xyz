import Firebase from '../../config/firebaseConfig.js'


class DbHelper {

    constructor() {

        this.firebase = new Firebase();

        this.userID = 'wR4QKyZ77mho1fL0FQWSMBQ170S2'

    }


    // .......... //
    // LIVE DATA  //
    // .......... //
    // Get live data from firebase
    // TODO: FIx when database is changed
    async getLiveGrowData(userGrows, setData) {

        userGrows.forEach((grow) => {
            // Grow Live Data in firebase
            var ref = this.firebase.db.ref().child('grow_data').child(this.userID).child(grow.id).child('live_data')

            ref.on('value', (snapshot) => {
                setData(grow.id, snapshot.val())
            }, function (errorObject) {
                console.log("follow " + grow + " live failed: " + errorObject.code);
            });
        })
    }



    // ....... //
    // GRAPHS  //
    // ....... //

    // Get 3 day data window from firebase
    async getThreeDays(growID, setData) {

        var ref = this.firebase.db.ref().child('grow_data').child(this.userID).child(growID).child('sensor_data')


        var date = new Date();
        var year = date.getFullYear().toString()
        var month = (date.getMonth() + 1).toString()
        if (month.length < 2) {
            month = '0' + month
        }

        var days = []
        var tempDay = null
        var dy = date.getDate()
        if ((dy - 2) >= 1) {
            tempDay = dy - 2
            if (tempDay.toString().length < 2) {
                tempDay = '0' + tempDay
            }
            days[days.length] = tempDay
        }
        if ((dy - 1) >= 1) {
            tempDay = dy - 1
            if (tempDay.toString().length < 2) {
                tempDay = '0' + tempDay
            }
            days[days.length] = tempDay
        }
        if (dy.toString().length < 2) {
            dy = '0' + dy
        }
        days[days.length] = dy

        var i = 0;

        var staticTwoDayData = []
        var getTwoDaysAddedDays = []

        days.forEach((day) => {
            if (day.toString() === dy.toString()) {
                return;
            }

            ref.child(year).child(month).child(day).on("value", (snapshot) => {
                if (!getTwoDaysAddedDays.includes(day)) {
                    getTwoDaysAddedDays[getTwoDaysAddedDays.length] = day
                } else {
                    return;
                }
                snapshot.forEach((child) => {
                    child.forEach((gChild) => {
                        i++;
                        if (i % 10 === 0 || i === 0) {
                            var dataPoint = gChild.val()
                            var dataTime = new Date(dataPoint.time).getTime()
                            dataPoint.time = dataTime
                            staticTwoDayData[staticTwoDayData.length] = dataPoint;
                        }
                    });
                });

                if ((getTwoDaysAddedDays.length === days.length - 1)) {


                    ref.child(year).child(month).child(dy).on("value", (snapshot) => {

                        console.log("DAYALOOUYA! deeep" + dy)
                        var tempCurrentData = [];


                        snapshot.forEach((child) => {
                            child.forEach((gChild) => {
                                i++;
                                if (i % 10 === 0 || i === 0) {
                                    var dataPoint = gChild.val()
                                    var dataTime = new Date(dataPoint.time).getTime()
                                    dataPoint.time = dataTime
                                    tempCurrentData[tempCurrentData.length] = dataPoint;
                                }
                            });
                        });

                        tempCurrentData.sort((a, b) => (a.time > b.time) ? 1 : -1)

                        console.log("DBHELPER Test 3-day Datapoints to return... grow:" + growID)
                        console.log(tempCurrentData.length);
                        console.log(tempCurrentData[0]);
                        console.log(tempCurrentData[tempCurrentData.length - 1]);

                        var fullData = staticTwoDayData.concat(tempCurrentData);

                        fullData.sort((a, b) => (a.time > b.time) ? 1 : -1)


                        setData(fullData);

                    });
                }
            });
        });
    }

    // Get 3 day data window from firebase
    getThreeDayData(growID, setData) {

        var ref = this.firebase.db.ref().child('grow_data').child(this.userID).child(growID).child('sensor_data')


        var date = new Date();
        var year = date.getFullYear().toString()
        var month = (date.getMonth() + 1).toString()
        if (month.length < 2) {
            month = '0' + month
        }

        var days = []
        var tempDay = null
        var dy = date.getDate()
        if ((dy - 2) >= 1) {
            tempDay = dy - 2
            if (tempDay.toString().length < 2) {
                tempDay = '0' + tempDay
            }
            days[days.length] = tempDay
        }
        if ((dy - 1) >= 1) {
            tempDay = dy - 1
            if (tempDay.toString().length < 2) {
                tempDay = '0' + tempDay
            }
            days[days.length] = tempDay
        }
        if (dy.toString().length < 2) {
            dy = '0' + dy
        }
        days[days.length] = dy

        days.forEach((day) => {

            ref.child(year).child(month).child(day).on("value", (snapshot) => {

                // TODO: on child added listener instead, this this var stored outside the "on()" event
                var dayData = []

                snapshot.forEach((child) => {
                    child.forEach((gChild) => {
                        var dataPoint = gChild.val()

                        dataPoint.time = dataPoint.time * 1000

                        dayData[dayData.length] = dataPoint;
                    });
                });

                dayData.sort((a, b) => (a.time > b.time) ? 1 : -1)

                setData(growID, day, dayData);
            });
        });
    }

    // ............ //
    // GROW CONFIG  //
    // ............ //

    // Watch Grow Config in firebase
    watchGrowConfig(growID, setData) {

        // Config data in firebase // TODO... proper
        var ref = this.firebase.db.ref().child('grows').child(this.userID).child(growID).child('config')

        ref.on('value', (snapshot) => {

            if (snapshot.val() === null) {
                return;
            }

            setData({
                temp_min: snapshot.val().temp_min,
                temp_max: snapshot.val().temp_max,
                temp_hyst: snapshot.val().temp_hyst,
                fan_min: snapshot.val().fan_min,
                fan_max: snapshot.val().fan_max,
                humidity_min: snapshot.val().humidity_min,
                humidity_max: snapshot.val().humidity_max,
                humidity_hyst: snapshot.val().humidity_hyst,
                humidifier_min: snapshot.val().humidifier_min,
                humidifier_max: snapshot.val().humidifier_max
            });

        }, function (errorObject) {
            console.log("watch config failed: " + errorObject.code);
        });
    }

    // Set Grow Config in firebase
    setGrowConfig(growID, config) {
        var ref = this.firebase.db.ref().child('grows').child(this.userID).child(growID).child('config')
        ref.set(config)
    }

    // ........... //
    // GROW PAGE   //
    // ........... //

    // Get live data from firebase
    getUserGrows(setData) {

        var ref = this.firebase.db.ref().child('users').child(this.userID).child('grows')

        ref.on('value', (snapshot) => {

            var userGrowIDs = [];

            console.log("TODO: remove filter. what does this even do O.o")
            snapshot.forEach((child) => {
                if (!child.val().sensors_live) {
                    userGrowIDs[userGrowIDs.length] = child.key
                }
            });

            // TODO: make own function...?
            for (var key of userGrowIDs) {
                var growRef = this.firebase.db.ref().child('grows').child(this.userID).child(key)

                var setUserGrows = []

                growRef.once('value', (snapshot) => {

                    if (!setUserGrows.includes(snapshot.val())) {
                        setUserGrows[setUserGrows.length] = snapshot.val()
                    }

                    setUserGrows.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : -1)

                    setData(setUserGrows)

                }, function (errorObject) {
                    console.log("watch user grows grow failed: " + errorObject.code);
                });
            }

        }, function (errorObject) {
            console.log("watch user grows failed: " + errorObject.code);
        });

    }



    // ............ //
    // GROW JRNLS  //
    // ............ //

    // Get live data from firebase
    getLinkedJournals(key, journals, setData) {

        var ref = this.firebase.db.ref().child('users').child(this.userID).child('journals')

        ref.on('value', (snapshot) => {

            var journalsList = [];

            snapshot.forEach((child) => {
                if (journals) {
                    Object.keys(journals).forEach(function (key) {
                        if (child.val().id === key) {
                            journalsList.push(child.val())
                        }
                    });
                }
            });

            journalsList.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : -1)

            setData(journalsList)

        }, function (errorObject) {
            console.log("GrowDetails watch user journals failed: " + errorObject.code);
        });
    }

    // ............ //
    // WATCH JRNLS  //
    // ............ //

    // Watch Journals
    getUserJournals(setUserJournals) {
        var ref = this.firebase.db.ref().child('users').child(this.userID).child('journals')

        ref.on('value', (snapshot) => {

            var journalsList = [];

            snapshot.forEach((child) => {
                journalsList.push(child.val())
            });

            console.log("Journals List:")
            console.log(journalsList)

            journalsList.sort((a, b) => (a.updatedAt < b.updatedAt) ? 1 : -1)

            setUserJournals(journalsList)

        }, function (errorObject) {
            console.log("watch user journals failed: " + errorObject.code);
        });
    }

    // Watch Entries
    watchJournalEntries(journalID, setJournalEntries) {

        var ref = this.firebase.db.ref().child('journals').child(this.userID).child(journalID).child('entries')

        console.log('watchin... ' + journalID)

        ref.on('value', (snapshot) => {

            var tempEntriesList = []
            snapshot.forEach((child) => {
                tempEntriesList.push(child.val())
            });

            tempEntriesList.sort((a, b) => (a.datetime_true > b.datetime_true) ? 1 : -1)

            var tempDotsList = [];
            tempEntriesList.forEach((entry) => {
                if (!tempDotsList.includes(entry.datetime_short)) {
                    tempDotsList[tempDotsList.length] = entry.datetime_short;
                }
            });

            var tempDeepDotsList = [];
            tempDotsList.forEach((dotDate) => {
                var dotValue = []
                tempEntriesList.forEach((entry) => {
                    if (dotDate === entry.datetime_short) {
                        dotValue[dotValue.length] = entry;
                    }
                });

                tempDeepDotsList[tempDeepDotsList.length] = dotValue;
            });

            setJournalEntries(tempEntriesList, tempDeepDotsList)

        }, function (errorObject) {
            console.log("follow journal failed: " + errorObject.code);
        });
    }

    // ............ //
    // JRNL CREATE  //
    // ............ //

    // Get live data from firebase
    async createJournal(journalName, openJournal) {
        // ref for actual journal
        var ref = this.firebase.db.ref().child('journals').child(this.userID).push()
        // user object ref to journal key
        var userRef = this.firebase.db.ref().child('users').child(this.userID).child('journals').child(ref.key)

        var journalID = ref.key
        var nowDate = new Date()

        ref.set({ 'id': journalID, 'name': journalName, 'updatedAt': nowDate.getTime(), 'createdAt': nowDate.getTime(), 'previewImage': 'https://via.placeholder.com/160x120?text=NO+PREVIEW' })
        userRef.set({ 'id': journalID, 'name': journalName, 'updatedAt': nowDate.getTime(), 'createdAt': nowDate.getTime(), 'previewImage': 'https://via.placeholder.com/160x120?text=NO+PREVIEW' })

        openJournal(journalID)
    }


    // ................ //
    // SAVE JRNL ENTRY  //
    // ................ //

    // Get live data from firebase
    saveJournalEntry(journalID, entryID, trueDate, title, content, growStage, postDate, images, closeModal) {
        // Journal data in firebase // TODO scalable.
        var ref = this.firebase.db.ref().child('journals').child(this.userID).child(journalID).child('entries')

        var editDate = new Date().getTime()

        var temptTrueDate = trueDate
        var shortMonth = (temptTrueDate.getMonth() + 1) + "-"
        if (shortMonth.length === 2) {
            shortMonth = "0" + shortMonth;
        }
        var shortDateVar = shortMonth + temptTrueDate.getDate() + "-" + temptTrueDate.getFullYear()

        if (!entryID) {
            // ref for actual journal
            var refPush = ref.push()
            entryID = refPush.key
        }

        if (!postDate) {
            postDate = new Date()
        }

        if (!trueDate) {
            trueDate = new Date()
        }


        ref.child(entryID).set({
            'id': entryID,
            'title': title,
            'published': true,
            'content': content,
            'grow_stage': growStage,
            'datetime_post': postDate.getTime(),
            'datetime_edit': editDate,
            'datetime_true': trueDate.getTime(),
            'datetime_short': shortDateVar,
            'journal_id': journalID,
            'images': images
        })

        console.log('set journal entry ' + entryID)

        // update updatedAt
        var jRef = this.firebase.db.ref().child('journals').child(this.userID).child(journalID)
        var userRef = this.firebase.db.ref().child('users').child(this.userID).child('journals').child(journalID)
        var nowDate = new Date()
        jRef.child('updatedAt').set(nowDate.getTime())
        userRef.child('updatedAt').set(nowDate.getTime())


        closeModal(entryID);
    }

    // .................. //
    // JRNL ENTRY IMAGES  //
    // .................. //

    // Upload Image
    async handleImageUpload(file, setImages) {
        // Get storage reference and push file blob 
        var storageRef = this.firebase.storage.ref().child('journals').child(this.userID);

        console.log("filename:" + file.name)

        var dateNow = new Date()

        const metadata = { contentType: file.type };
        const storageTask = storageRef.child(dateNow.getTime() + file.name).put(file, metadata);
        storageTask
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                // Create thumb url from url (thumbs automatically created via cloud function on upload)
                var urlSplit = url.split("%2F")
                var thumbURL = urlSplit[0] + "%2F" + urlSplit[1] + "%2Fthumb_" + urlSplit[2]

                // URL AND THUMBURL
                setImages(url, thumbURL)

            })
    }

    // Delete Image
    handleImageDelete(url) {
        // Create a reference to the file to delete
        var desertRef = this.firebase.storage.refFromURL(url)

        // Delete the file
        desertRef.delete().then(function () {
            // File deleted successfully
            console.log("deleted " + url + "successfully :)")
        }).catch(function (error) {
            // Uh-oh, an error occurred!
            console.log("delete " + url + "error :(")
        });
    }

}

export default DbHelper;