import Firebase from '../../config/firebaseConfig.js'


class DbHelper {

    constructor() {

        this.firebase = new Firebase();

    }


    // .......... //
    // LIVE DATA  //
    // .......... //
    // Get live data from firebase
    async getLiveData(growDeprecate, setData) {

        // Sensor data in firebase
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('sensors_live').child(growDeprecate)

        ref.on('value', (snapshot) => {
            setData(snapshot.val())
        }, function (errorObject) {
            console.log("follow " + growDeprecate + " live failed: " + errorObject.code);
        });

    }

    // .......... //
    // LIVE DATAS  //
    // .......... //
    // Get live data from firebase
    // TODO: FIx when database is changed
    async getLiveGrowDatas(userGrows, setData) {

        var grows = ['flower', 'vegger']

        grows.forEach((grow) => {
            // Sensor data in firebase
            var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows').child('-LdG6gTCNZxfu1wU5Xvx').child('sensors_live').child(grow)

            ref.on('value', (snapshot) => {
                setData(grow, snapshot.val())
            }, function (errorObject) {
                console.log("follow " + grow + " live failed: " + errorObject.code);
            });
        })
    }



    // ....... //
    // GRAPHS  //
    // ....... //

    // Get 3 day data window from firebase
    async getThreeDays(growDeprecate, setData) {

        // Sensor data in firebase
        var ref = this.firebase.db.ref().child('sensor_data').child(growDeprecate)

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

                        console.log("DBHELPER Test 3-day Datapoints to return..." + growDeprecate)
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
    getThreeDayData(growDeprecate, setData) {

        // Sensor data in firebase
        var ref = this.firebase.db.ref().child('sensor_data').child(growDeprecate)

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
            
            var dayData = []

            ref.child(year).child(month).child(day).on("value", (snapshot) => {

                snapshot.forEach((child) => {
                    child.forEach((gChild) => {
                        var dataPoint = gChild.val()
                        var dataTime = new Date(dataPoint.time).getTime()
                        dataPoint.time = dataTime

                        dayData[dayData.length] = dataPoint;
                    });
                });

                console.log("Daydata!" + dayData.length)

                dayData.sort((a, b) => (a.time > b.time) ? 1 : -1)

                var dayDataProcessed = []
                dayDataProcessed[day] = dayData


                setData(growDeprecate, dayDataProcessed);
            });
        });
    }


    // Get 3 day data window from firebase
    async getBoxHour(growDeprecate, setData) {

        // Sensor data in firebase
        var ref = this.firebase.db.ref().child('sensor_data').child(growDeprecate)

        var date = new Date();
        var year = date.getFullYear().toString()
        var month = (date.getMonth() + 1).toString()
        if (month.length < 2) {
            month = '0' + month
        }


        var day = date.getDate().toString()

        var hour = date.getHours()

        var hoursList = []
        var tempHour = null
        if ((hour - 1) >= 0) {
            tempHour = hour - 1
            if (tempHour.toString().length < 2) {
                tempHour = '0' + tempHour
            }
            hoursList[hoursList.length] = tempHour
        }
        if (hour.toString().length < 2) {
            hour = '0' + hour
        }
        hoursList[hoursList.length] = hour


        var staticTwoHourData = []
        var getTwoHoursAddedHours = []


        hoursList.forEach((hr) => {
            if (hr.toString() === hour.toString()) {
                return;
            }
            ref.child(year).child(month).child(day).child(hr).on("value", (snapshot) => {


                if (!getTwoHoursAddedHours.includes(hr)) {
                    getTwoHoursAddedHours[getTwoHoursAddedHours.length] = hr
                } else {
                    return;
                }

                snapshot.forEach((child) => {
                    var dataPoint = child.val()
                    var dataTime = new Date(dataPoint.time).getTime()
                    dataPoint.time = dataTime
                    staticTwoHourData[staticTwoHourData.length] = dataPoint;
                });

                if (getTwoHoursAddedHours.length === hoursList.length - 1) {

                    var tempData = []

                    ref.child(year).child(month).child(day).child(hour).on("value", (snapshot) => {
                        snapshot.forEach((child) => {
                            var dataPoint = child.val()
                            var dataTime = new Date(dataPoint.time).getTime()
                            dataPoint.time = dataTime
                            tempData[tempData.length] = dataPoint;



                            console.log("Test last hour Datapoints to render..." + tempData.length)
                            console.log(tempData[tempData.length - 1]);

                        });

                        var fullData = staticTwoHourData.concat(tempData);

                        fullData.sort((a, b) => (a.time > b.time) ? 1 : -1)

                        setData(fullData);
                    });
                };

            });

        });

    }

    // ............ //
    // GROW CONFIG  //
    // ............ //

    // Watch Grow Config in firebase
    watchGrowConfig(setData) {
        // Sensor data in firebase
        var ref = this.firebase.db.ref().child('grow').child('-LdG6gTCNZxfu1wU5Xvx').child('config')

        ref.on('value', (snapshot) => {

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
    setGrowConfig(config) {

        var ref = this.firebase.db.ref().child('grow').child('-LdG6gTCNZxfu1wU5Xvx').child('config')

        ref.set(config)
    }

    // ........... //
    // GROW PAGE   //
    // ........... //

    // Get live data from firebase
    getUserGrows(setData) {

        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('grows')

        ref.on('value', (snapshot) => {

            var userGrowIDs = [];

            console.log("TODO: remove filter.")
            snapshot.forEach((child) => {
                if (!child.val().sensors_live) {
                    userGrowIDs[child.key] = child.val()
                }
            });

            // TODO: make own function...?
            var setUserGrows = []
            for (var key of Object.keys(userGrowIDs)) {
                var growRef = this.firebase.db.ref().child('grows').child(key)

                growRef.on('value', (snapshot) => {
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

        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('journals')

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
        var ref = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('journals')

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

        var ref = this.firebase.db.ref().child('journals').child(journalID).child('entries')

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
        var ref = this.firebase.db.ref().child('journals').push()
        // user object ref to journal key
        var userRef = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('journals').child(ref.key)

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
    async saveJournalEntry(journalID, entryID, trueDate, title, content, growStage, postDate, images, closeModal) {
        // Journal data in firebase // TODO scalable.
        var ref = this.firebase.db.ref().child('journals').child(journalID).child('entries')

        var editDate = new Date().getTime()

        var temptTrueDate = trueDate
        var shortMonth = (temptTrueDate.getMonth() + 1) + "-"
        if (shortMonth.length === 2) {
            shortMonth = "0" + shortMonth;
        }
        var shortDateVar = shortMonth + temptTrueDate.getDate() + "-" + temptTrueDate.getFullYear()


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
        var jRef = this.firebase.db.ref().child('journals').child(journalID)
        var userRef = this.firebase.db.ref().child('users').child('wR4QKyZ77mho1fL0FQWSMBQ170S2').child('journals').child(journalID)
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
        var storageRef = this.firebase.storage.ref().child('journals').child('-LdG6gTCNZxfu1wU5Xvx/');

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
            console.log("deleted " + url + "error :(")
        });
    }

}

export default DbHelper;