import { dater, formatter, statusFlag } from "./utility.js";

let tblHdrs = { reservationID: "Res ID" };
tblHdrs["guestName"] = "Guest Name";
tblHdrs["nights"] = "Nights";
tblHdrs["startDate"] = "Check In";
tblHdrs["dow"] = "Day of Week";
tblHdrs["adults"] = "Adults";
// tblHdrs['isPrivate'] = 'Private?'

let daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * let jData = [
  { name: "GeeksforGeeks", est: 2009 },
  { name: "Google", est: 1998 },
  { name: "Microsoft", est: 1975 }
];
jData.sort((a, b) => (a.name > b.name ? 1 : -1));
console.log(jData);
 */

/**
 *
 * @param {*} data
 * @returns rowCnt
 */

export function dispResList(data) {
    let record
    let rowCnt = data.length;
    let haTblDiv = document.getElementById("resListDiv");

    // if no data returned, display message and return
    if (rowCnt === 0) {
        haTblDiv.innerHTML = "<b>No Reservations</b>";
        return 0;
    }
    // console.log("dispResList: data: ", rowCnt, " : ", data);

    // sort the data by startDate
    data.sort((a, b) => (a.startDate > b.startDate ? 1 : -1));
    console.log("dispResList: data: ", rowCnt, " : ", data);

    // compute the number of nights
    for (let i = 0; i < rowCnt; i++) {
        record = data[i];
        let sDate = new Date(record.startDate);
        let eDate = new Date(record.endDate);
        let diffTime = Math.abs(eDate - sDate);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        record.nights = diffDays;
    }
    console.log("dispResList: data: ", rowCnt, " : ", data);

    // if data returned, display table

    // will be putting the results into a table
    let displayCnt = 0;
    let newTable = "<table border='0' id='listTbl'>";
    // if (Array.isArray(data)) {
    // create table header
    newTable += "<thead>";
    newTable += "<tr>";
    for (let key in tblHdrs) {
        newTable += "<th>" + tblHdrs[key] + "</th>";
    }
    newTable += "</tr>";
    newTable += "</thead>";
    // create table rows
    for (let i = 0; i < rowCnt; i++) {
        // newTable += "<tr>";
        record = data[i];
        if (record.status === "canceled") {
            continue;
        }
        let resStatus = record.nights < 6 ? record.status : "vip";

        // if (statusFlag(resStatus)) {
        if (resStatus === "vip") {
            displayCnt++;
            let resID = record.reservationID;
            // start a new row
            // let newRow = `<tr class='${resStatus}' data-resID=${resID}>`;
            let newRow = `<tr  data-resID=${resID}>`;
            for (let key in tblHdrs) {
                switch (key) {
                    case "startDate":
                        newRow += "<td>" + dater(record[key]) + "</td>";
                        break;
                    // case "endDate":
                    //     newTable += "<td>" + dater(record[key]) + "</td>";
                    //     break;
                    case "dow":
                        let dowNum = new Date(record.startDate).getDay();
                        newRow +=
                            "<td align='center'>" +
                            daysOfWeek[dowNum] +
                            "</td>";
                        break;
                    default:
                        newRow += "<td>" + record[key] + "</td>";
                        break;
                }
            }
            // close the row
            newRow += "</tr>";
            // add the row to the table
            newTable += newRow;
        }
    }

    // }
    // close the table
    newTable += "</table>";
    haTblDiv.innerHTML = newTable;

    return displayCnt;
}
