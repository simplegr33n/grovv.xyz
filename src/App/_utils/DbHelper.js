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



                            console.log("Test last hour Datapoints to render...")
                            console.log(tempData.length);
                            console.log(tempData[0]);

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

}




export default DbHelper;
