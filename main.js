const { app, BrowserWindow, ipcMain } = require("electron");
const fetch = require("electron-fetch").default;
// const nodeFs = require("fs");

const { getHA_List, computeCharges, log } = require("./js/haMainFuncs");

const path = require("path");
// // const sqlite3 = require("sqlite3").verbose();
// // const db = new sqlite3.Database("./db/rm-test.db");
// const findGst = require("./sql/sql.js");
// const findHA = require("./sql/sql_ha.js");

// let {ha_accts} = require("./data_sets/ha_accts.js");
// import { ha_accts } from "./data_sets/ha_accts";    

let ha_accts;  // this is the global variable for the house accounts
let resWindow, resData, haData;

const cbConfig = require('./config.json');
// console.log("main: cbConfig: ", cbConfig);

const winWidth = cbConfig.winWidth;
const winHeight = cbConfig.winHeight;
const winX = cbConfig.winX;
const winY = cbConfig.winY;
const openDevTools = cbConfig.devTools;

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const vipDays = 6

let reservHdrs = []
reservHdrs["reservationID"] = true
reservHdrs["guestName"] = true
reservHdrs["nights"] = true
reservHdrs["startDate"] = true
reservHdrs["endDate"] = true
reservHdrs["adults"] = true
reservHdrs["dow"] = true

const computeNights = (startDate, endDate) => {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let timeDiff = Math.abs(end.getTime() - start.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays
}
const computeDow = (startDate) => {
    let start = new Date(startDate).getDay();
    return daysOfWeek[start];
}

let window;

const createWindow = () => {
    window = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        x: winX,
        y: winY,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    window.loadFile("index.html");
    // console.log('in main.js: ', window)

    window.webContents.openDevTools({
        mode: "detach",
        width: winWidth,
        height: winHeight,
        x: winWidth,
        y: 100,
        show: openDevTools,
    });
};

app.whenReady().then(() => {
    createWindow();
    window.once("ready-to-show", () => {
        window.show();
        getHA_List(window);
        // getResList();
    });
});

/**
 * once the window is open, fetch the list of reservations
 * - this is a one-time fetch
 * - the list is used to populate the dropdown
 */


// // const cbApiCall = 'getGuestList'
const cbPropertyID = cbConfig.cbPropertyID;
const cbServer = cbConfig.cbServer;
const cbOptions = cbConfig.cbOptions;

const cbApiHA_Details = "getHouseAccountDetails?";
const cbApiHA_List = "getHouseAccountList?";
const cbApiGetReservations = "getReservations?";
const cbApiGetReservation = "getReservation?";
// const cbApiCall = 'getDashboard'

// const getHA_List = () => {
//     let params = new URLSearchParams({
//         propertyID: cbPropertyID,
//         accountStatus: "open",
//         // checkInFrom: "2024-08-23",
//         // checkInTo: "2024-08-31",
//         // pageNumber: 1,
//     });
//     fetch(cbServer + cbApiHA_List + params, cbOptions)
//         .then(res => res.json())
//         .then((data) => {
//             // console.log("main: getHA_List: ", data);
//             // console.log("main: getHA_List: ");
//             let haData = data.data;
//             log("main: getHA_List:");
//             window.webContents.send("HA_Data", haData); // send to preload
//         })
//         .catch(err => console.error(err))
//         ;
// }
// user asked for a reload of the HA data
ipcMain.on("haLoad", async () => {
    getHA_List(window);
})

// function getResList() {
ipcMain.on("getVipResList", async (event, data) => {
    let dtFrom = data.resDateFrom;
    let dtTo = data.resDateTo;
    let params = new URLSearchParams({
        propertyID: cbPropertyID,
        // checkInFrom: "2024-08-23",
        // checkInTo: "2024-08-31",
        checkInFrom: dtFrom,
        checkInTo: dtTo,
        // pageNumber: 1,
    });
    fetch(cbServer + cbApiGetReservations + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            // console.log("main: getResList: ", data);
            let vipResRecordsList = [];
            resData = data.data;
            for (let i = 0; i < resData.length; i++) {
                if (resData[i].status == 'canceled') {
                    continue
                }
                let resNights = computeNights(resData[i].startDate, resData[i].endDate);
                if (resNights < vipDays) {
                    continue
                }
                resData[i].nights = resNights;
                resData[i].dow = computeDow(resData[i].startDate);
                let tmpRecord = {}
                for (let key in reservHdrs) {
                    tmpRecord[key] = resData[i][key];
                }
                vipResRecordsList.push(tmpRecord);
                // vipResRecordsList.push(resData[i]);
            }
            // data.sort((a, b) => (a.startDate > b.startDate ? 1 : -1));
            vipResRecordsList.sort((a, b) => (a.startDate > b.startDate ? 1 : -1));
            // console.log("main: vipResRecordsList: ", vipResRecordsList);
            window.webContents.send("resData", vipResRecordsList); // send to preload
        });
}
    // console.log('main: resList: ', resData)
    // window.webContents.send("resData", resData); // send to preload
);

ipcMain.on('getResDetail', (event, vipRecord) => {
    // console.log('main: getResDetail: resID: ', resID)
    let params = new URLSearchParams({
        propertyID: cbPropertyID,
        reservationID: vipRecord.reservationID,
    });
    fetch(cbServer + cbApiGetReservation + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            // console.log("main: getResDetail -vip-pre: ", vipRecord);
            // console.log("main: getResDetail: data: ", data);
            resData = data.data;
            vipRecord.guestList = resData.guestList;
            vipRecord.isMainGuest = resData.isMainGuest;
            vipRecord.assignedRoom = resData.assignedRoom;
            vipRecord.guestStatus = resData.guestStatus;
            vipRecord.rooms = resData.rooms;
            // console.log("main: getResDetail -vip-post: ", vipRecord);

            window.webContents.send("gotResDetail", vipRecord);
        });
})

// cbApiHA_Details

ipcMain.on('getHaDetail', (event, keyID) => {
    // console.log('ipcMain main: getHAdtl: ', keyID)
    let params = new URLSearchParams({
        propertyID: cbPropertyID,
        houseAccountID: keyID,
        resultsFrom: '2024-07-08',
        resultsTo: '2024-12-31',
    })
    fetch(cbServer + cbApiHA_Details + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            // console.log("main: getHaDetail: data: ", data);
            resData = data.data;
            // return resData
            window.webContents.send("gotHaDetail", resData);
        });
})

ipcMain.on('getHaBalance', (event, record) => {
    let keyID = record.accountID;
    // console.log('ipcMain main: getHaBalance: ', keyID)
    let params = new URLSearchParams({
        propertyID: cbPropertyID,
        houseAccountID: keyID,
        resultsFrom: '2024-07-08',
        resultsTo: '2024-12-31',
    })
    fetch(cbServer + cbApiHA_Details + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            // console.log('keyID: ', keyID, ' record: ', record)
            // console.log("main: getHaBalance: data: ", data);
            haData = data.data;
            // let credit = resData.total.credit.slice(4).replaceAll(',', '')
            // let debit = resData.total.debit.slice(4).replaceAll(',', '')
            // let balance = credit - debit
            // record.balance = balance
            let charges = computeCharges(record.accountName, haData)
            record.charges = charges
            console.log(`credit: ${credit} - debit: ${debit} = balance: ${balance}`) // console.log('credit: ', credit) 
            // return resData
            window.webContents.send("gotHaBalance", record);
        })
        .catch(err => {
            console.log(`main: getHaBalance: ${record} error: ${err}`) // console.log(err)
            window.webContents.send("gotHaBalance", record);
            console.error(err)
        })
        ;
})