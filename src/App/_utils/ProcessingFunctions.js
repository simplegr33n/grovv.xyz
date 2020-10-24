import DbHelper from './DbHelper.js'

class ProcessingFunctions {

    constructor() {
        this.dbHelper = new DbHelper()

        this.APP_INITIALIZED = false

        this.appUpdateFunction = null
        this.appUpdateObject = []

    }

    // ///////////////////////////////////////
    // App Init Functions (inc. data updating)
    // ///////////////////////////////////////
    initializeApp = (userID, appInitFunction, appUpdateFunction) => {
        // Set Init and Update functions
        this.appInitFunction = appInitFunction
        this.appUpdateFunction = appUpdateFunction

        // Get User
        this.dbHelper.getUser(userID, this.setUser)
        // Get User Grows
        this.dbHelper.getUserGrows("", this.setUserGrows) // currently grabbing B's hardcoded
    }


    setUser = (u) => {
        this.appUpdateObject['user'] = u
        this.appUpdateObject['displayWindow'] = u.PREFS.GRAPHS.AllGraph.timeWindow
    }

    setUserGrows = (userGrows) => {
        this.appUpdateObject['userGrows'] = userGrows

        userGrows.forEach((grow) => {
            this.dbHelper.getOneDayData(grow.id, this.processAllGrowsData)
        })
    }

    processAllGrowsData = (rawData, window = 10800000) => {
        var now = Math.floor(new Date().getTime() / 1000)

        var reducerValue = Math.round(window / 10800000)
        if (reducerValue < 1) {
            reducerValue = 1
        }

        var growProcessedData = []
        this.appUpdateObject.userGrows.forEach((grow) => {
            if (!rawData[grow.id]) {
                return
            }

            var subProcessedData = []
            var i = -1
            rawData[grow.id].forEach((dataPoint) => {
                if (now - dataPoint.time < window) {
                    i++;
                    if (i === 0 || i % reducerValue === 0) {
                        subProcessedData[subProcessedData.length] = dataPoint
                    }
                }
            })

            growProcessedData[grow.id] = subProcessedData
        })

        // appUpdateObject construction complete
        this.appUpdateObject['processedData'] = growProcessedData

        if (this.APP_INITIALIZED) {
            // throttle updates...
            var time = new Date().getTime()
            if (!this.lastAppUpdate || time - this.lastAppUpdate > 100) {
                this.lastAppUpdate = time
                this.appUpdateFunction(this.appUpdateObject)
            }
        } else {
            this.APP_INITIALIZED = true
            this.appInitFunction(this.appUpdateObject)
        }
    }




    ////////////////////
    // Lifetime Graphs
    ///////////////////
    normalizeLifetimeData(lifetimeData, returnData, rangeMin = 0, rangeMax = new Date().valueOf()) {
        if (lifetimeData === undefined || lifetimeData === null) {
            return
        }

        var allYears = [2019, 2020, 2021] // this will be a bug one day
        var allMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
        var allDays = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]

        var normalizedData = []
        var sensorList = []

        var sampleHighs = []

        allYears.forEach((year) => {
            allMonths.forEach((month) => {
                var testDate = new Date(year + "-" + month).valueOf()

                if ((testDate < rangeMax) && (testDate > rangeMin)) {
                    allDays.forEach((day) => {
                        var normalizedDataPoint = {}
                        for (const [growID, dataSet] of Object.entries(lifetimeData)) {
                            if (dataSet[year] && dataSet[year][month] && dataSet[year][month][day]) {

                                // add datapieces to normalizedDataPoint
                                for (const [dataType, values] of Object.entries(dataSet[year][month][day])) {
                                    for (const [pid, value] of Object.entries(values)) {
                                        var renamedSensor = pid + "^" + growID + "^" + dataType
                                        normalizedDataPoint[renamedSensor] = value
                                        // add to sensorlist if not yet there
                                        if (!sensorList.includes(renamedSensor)) {
                                            sensorList[sensorList.length] = renamedSensor
                                        }

                                        // add to sample highs for axis picking if not there
                                        if (dataType === "HIGH" && !sampleHighs[pid + "^" + growID] || sampleHighs[pid + "^" + growID] < value) {
                                            sampleHighs[pid + "^" + growID] = value
                                        }
                                    }
                                }
                            }
                        }

                        if (Object.keys(normalizedDataPoint).length !== 0) {
                            // add normalized datapoint to normalizedData
                            var aDate = new Date(year + "-" + month + "-" + day).valueOf()
                            normalizedDataPoint.time = aDate
                            normalizedData[normalizedData.length] = normalizedDataPoint
                        }
                    })
                }
            })
        })

        returnData(sensorList, normalizedData, sampleHighs)
    }




}

export default ProcessingFunctions;