// const fs = require('fs');
const {app} = require("electron");
const path = require("path");
const appData = app.getPath("userData");
let configFile = path.join(appData, "ih-ap-config.json");
const cbConfig = require(configFile);
// const cbConfig = require('../config.json');
// const cbConfig = JSON.parse(fs.readFileSync("../config.json", 'utf-8'));

const cbPropertyID = cbConfig.cbPropertyID;
const cbServer = cbConfig.cbServer;
const cbOptions = cbConfig.cbOptions;

const cbApiHA_Details = "getHouseAccountDetails?";
const cbApiHA_List = "getHouseAccountList?";
const cbApiGetReservations = "getReservations?";
const cbApiGetReservation = "getReservation?";

const computeCharges = (accountName, haData) => {
    const flTax = 0.075
    const ccFee = 0.03
    let credit = haData.total.credit.slice(4).replaceAll(',', '')
    let debit = haData.total.debit.slice(4).replaceAll(',', '')
    let balance = credit - debit
    let monMin = ''
    let minDelta = ''
    let minTax = ''
    let subTot = ''
    let creChg = ''
    let totChg = ''

    if (balance >= 0) {
        monMin = accountName.includes("&") ? 200 : 100
        minDelta = balance < monMin ? monMin - balance : 0
        minTax = minDelta * flTax
        subTot = balance + minDelta + minTax
        creChg = subTot * ccFee
        totChg = subTot + creChg
    }


    return {
        balance: balance,
        monMin: monMin,
        minDelta: minDelta,
        minTax: minTax,
        subTot: subTot,
        creChg: creChg,
        totChg: totChg
    }
}
const getHA_List = (window) => {
    let params = new URLSearchParams({
        propertyID: cbPropertyID,
        accountStatus: "open",
        // checkInFrom: "2024-08-23",
        // checkInTo: "2024-08-31",
        // pageNumber: 1,
    });
    fetch(cbServer + cbApiHA_List + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            let haAcctRecordsList = [];
            let haData = data.data;
            for (let i = 0; i < haData.length; i++) {
                let dtRecord = haData[i];
                // want only house accounts
                let isGC = dtRecord.accountName.startsWith("GC")
                let isEmp = dtRecord.accountName.startsWith("IH")
                if (isGC || isEmp) {
                    continue
                }
                let haRecord = {};
                haRecord.accountID = haData[i].accountID;
                haRecord.accountName = haData[i].accountName;
                haRecord.accountStatus = haData[i].accountStatus;

                haAcctRecordsList.push(haRecord);
            }
            // log("main: getHA_List:");
            haAcctRecordsList.sort((a, b) => (a.accountName > b.accountName ? 1 : -1));
            window.webContents.send("HA_Data", haAcctRecordsList); // send to preload
        })
        .catch(err => console.error(err))
        ;
}

function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`log: ${timestamp}: ${message}`);
}

module.exports = {
    getHA_List,
    computeCharges,
    log
}