const { app, BrowserWindow, ipcMain } = require("electron");
const fetch = require("electron-fetch").default;
const nodeFs = require("fs");

const path = require("path");
// // const sqlite3 = require("sqlite3").verbose();
// // const db = new sqlite3.Database("./db/rm-test.db");
// const findGst = require("./sql/sql.js");
// const findHA = require("./sql/sql_ha.js");

// let {ha_accts} = require("./data_sets/ha_accts.js");
// import { ha_accts } from "./data_sets/ha_accts";    

let ha_accts;  // this is the global variable for the house accounts
let resWindow, resData;

const cbConfig = JSON.parse(nodeFs.readFileSync('./.config.json', 'utf-8'));

const winWidth = cbConfig.winWidth;
const winHeight = cbConfig.winHeight;
const winX = cbConfig.winX;
const winY = cbConfig.winY;
const openDevTools = cbConfig.devTools;


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
        getHA_List();
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
// const cbApiCall = 'getDashboard'

const getHA_List = () => {
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
            // console.log("main: getHA_List: ", data);
            // console.log("main: getHA_List: ");
            let haData = data.data;
            window.webContents.send("HA_Data", haData); // send to preload
        })
        .catch(err => console.error(err))
        ;

}
// user asked for a reload of the HA data
ipcMain.on("haLoad", async () => {
    getHA_List();
})

// function getResList() {
ipcMain.on("resList", async (event, data) => {
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
    fetch(cbServer + 'getReservations?' + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            // console.log("main: getResList: ", data);
            resData = data.data;
            window.webContents.send("resData", resData); // send to preload
        });
}
    // console.log('main: resList: ', resData)
    // window.webContents.send("resData", resData); // send to preload
);

ipcMain.on('getResDetail',  (event, resID) => {
    // console.log('main: getResDetail: resID: ', resID)
    let params = new URLSearchParams({
        propertyID: cbPropertyID,
        reservationID: resID,
    });
    fetch(cbServer + 'getReservation?' + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            // console.log("main: getResDetail: data: ", data);
            resData = data.data;
            window.webContents.send("gotResDetail", data);
        });
})

// cbApiHA_Details

ipcMain.on('getHaDetail',  (event, keyID) => {
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

ipcMain.on('getHaBalance',  (event, record) => {
    let keyID = record.accountID;
    console.log('ipcMain main: getHaBalance: ', keyID)
    let params = new URLSearchParams({
        propertyID: cbPropertyID,
        houseAccountID: keyID,
        resultsFrom: '2024-07-08',
        resultsTo: '2024-12-31',
    })
    fetch(cbServer + cbApiHA_Details + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            console.log('keyID: ', keyID, ' record: ', record)
            console.log("main: getHaBalance: data: ", data);
            resData = data.data;
            let credit = resData.total.credit.slice(4)
            let debit = resData.total.debit.slice(4)
            let balance = credit - debit
            console.log(`credit: ${credit} - debit: ${debit} = balance: ${balance}`) // console.log('credit: ', credit) 
            // return resData
            // window.webContents.send("gotHaDetail", resData);
        });
})