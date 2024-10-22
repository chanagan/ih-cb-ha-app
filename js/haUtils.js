export function haGetBalances(showRecords) {
    let rowCnt = showRecords.length
    console.log("haGetBalances: rowCnt: ", rowCnt, " : ", showRecords); 
    let record = showRecords[0]
    api.send("getHaBalance", record)
}