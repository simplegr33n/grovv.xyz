

class ProcessingFunctions {

    constructor() {
    }


    ////////////////////
    // Lifetime Graphs
    ///////////////////
    normalizeLifetimeData(lifetimeData, returnData, rangeMin = 0, rangeMax = new Date().valueOf()) {

        var allYears = [2019, 2020]
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


    // GRAPH ALL GROWS
    concatAllGrowsData = (concatData, rawGrowData, userGrows, DataCheckLengths, setAllGrowsConcat) => {
        var newCheckLengths = []
        var valChanged = false

        userGrows.forEach((grow) => {

            // returns
            if (!rawGrowData[grow.id]) {
                newCheckLengths[grow.id] = 0
                return
            }
            if ((DataCheckLengths) && (DataCheckLengths[grow.id] && rawGrowData[grow.id]) && (DataCheckLengths[grow.id] === rawGrowData[grow.id][rawGrowData[grow.id].length - 1].length)) {
                newCheckLengths[grow.id] = rawGrowData[grow.id][rawGrowData[grow.id].length - 1].length
                return; // 
            }
            valChanged = true

            newCheckLengths[grow.id] = rawGrowData[grow.id][rawGrowData[grow.id].length - 1].length

            var subConcatData = []
            rawGrowData[grow.id].forEach((list) => {
                subConcatData = subConcatData.concat(list)
            })

            if (!DataCheckLengths || DataCheckLengths[grow.id] !== subConcatData.length) {
                subConcatData.sort((a, b) => (a.time > b.time) ? 1 : -1)
                concatData[grow.id] = subConcatData
            }
        })

        if (valChanged) {
            setAllGrowsConcat(concatData, newCheckLengths)
        }
    }

    processAllGrowsData = (superData, userGrows, returnData, window = 10800000) => {
        var now = new Date().getTime()
        var processedData = []
        var combinedProcessedData = []

        //remove....TODO
        if (!userGrows) {
            return
        }

        //forEach
        userGrows.forEach((grow) => {
            if (!superData[grow.id]) {
                return
            }

            var subProcessedData = []

            var i = -1
            superData[grow.id].forEach((dataPoint) => {

                var subCombined = {}

                var reducerValue = Math.round(window / 10800000)
                if (reducerValue < 1) {
                    reducerValue = 1
                }

                if (now - dataPoint.time < window) {
                    i++;

                    if (i === 0 || i % reducerValue === 0) {
                        var processedPoint = dataPoint

                        for (const [key, value] of Object.entries(processedPoint)) {
                            if (key !== "time") {
                                subCombined[key + "^" + grow.id] = value
                            } else {
                                subCombined.time = value
                            }
                        }

                        combinedProcessedData[combinedProcessedData.length] = subCombined

                        subProcessedData[subProcessedData.length] = processedPoint
                    }
                }
            })

            processedData[grow.id] = subProcessedData
        })

        combinedProcessedData.sort((a, b) => (a.time > b.time) ? 1 : -1)

        returnData(combinedProcessedData, processedData)
    }

}

export default ProcessingFunctions;