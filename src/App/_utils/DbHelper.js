import Firebase from '../../config/firebaseConfig.js'


class DbHelper {

    constructor() {

        this.firebase = new Firebase();

    }

    // Get 3 day data window from firebase
    async getThreeDays (growDeprecate, setData) {

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

        var getThreeDaysAddedDays = []
        var tempThreeDayData = []

        days.forEach((day) => {    
            ref.child(year).child(month).child(day).on("value", (snapshot) => {
                if (!getThreeDaysAddedDays.includes(day)) {
                    getThreeDaysAddedDays[getThreeDaysAddedDays.length] = day
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
                            tempThreeDayData[tempThreeDayData.length] = dataPoint;
                        }
                    });
                });

                if ((getThreeDaysAddedDays.length === days.length)) {

                    tempThreeDayData.sort((a, b) => (a.time > b.time) ? 1 : -1)

                    console.log("DBHELPER Test 3-day Datapoints to return..." + growDeprecate)
                    console.log(tempThreeDayData.length);
                    console.log(tempThreeDayData[0]);
                    console.log(tempThreeDayData[tempThreeDayData.length - 1]);


                    setData(tempThreeDayData);
                    tempThreeDayData = [];
                    getThreeDaysAddedDays = [];


                }
            });
        });
    }


}

export default DbHelper;
