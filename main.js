const { app, BrowserWindow, ipcMain } = require("electron");
const { get } = require("http");
const fetch = require("electron-fetch").default;

const path = require("path");
// // const sqlite3 = require("sqlite3").verbose();
// // const db = new sqlite3.Database("./db/rm-test.db");
// const findGst = require("./sql/sql.js");
// const findHA = require("./sql/sql_ha.js");

// let {ha_accts} = require("./data_sets/ha_accts.js");
// import { ha_accts } from "./data_sets/ha_accts";    

let ha_accts;  // this is the global variable for the house accounts
let resWindow, resData;

const winWidth = 1200;
const winHeight = 900;
const winX = 0;
const winY = 0;

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
        show: true,
    });
};

app.whenReady().then(() => {
    createWindow();
    window.once("ready-to-show", () => {
        window.show();
        // getResList();
    });
});

/**
 * once the window is open, fetch the list of reservations
 * - this is a one-time fetch
 * - the list is used to populate the dropdown
 */

const cbPropertyID = "310046";
const cbServer = "https://hotels.cloudbeds.com/api/v1.2/";
// const cbApiCall = 'getGuestList'
// const cbApiCall = "getHouseAccountDetails?";
const cbApiHouseAccountList = "getHouseAccountList?";
const cbApiGetReservations = "getReservations?";
// const cbApiCall = 'getDashboard'

const cbOptions = {
    method: "GET",
    headers: {
        "x-api-key": "cbat_AVYJ4dezriaScXdXY9WJrVyjHl5PxxY5",
    },
};

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
            console.log("main: getResList: ", data);
            resData = data.data;
            window.webContents.send("resData", resData); // send to preload
        });
}
    // console.log('main: resList: ', resData)
    // window.webContents.send("resData", resData); // send to preload
);

ipcMain.on('getResDetail', async (event, resID) => {
    console.log('main: getResDetail: resID: ', resID)
    let params = new URLSearchParams({
        propertyID: cbPropertyID,
        reservationID: resID,
    });
    fetch(cbServer + 'getReservation?' + params, cbOptions)
        .then(res => res.json())
        .then((data) => {
            console.log("main: getResDetail: data: ", data);
            resData = data.data;
            window.webContents.send("gotResDetail", data);
        });
})