import { dater } from "./utility.js";

let tblHdrs = [];
tblHdrs["reservationID"] = {'align': 'left', 'value': 'Res ID'};
tblHdrs["guestName"] = {'align': 'left', 'value': 'Guest Name'};
tblHdrs["nights"] = {'align': 'center', 'value': 'Nights'};
tblHdrs["startDate"] = {'align': 'center', 'value': 'Check In'};
tblHdrs["dow"] = {'align': 'center', 'value': 'Dow'};
tblHdrs["adults"] = {'align': 'center', 'value': 'Adults'};



// tblHdrs["guestName"] = "Guest Name";
// tblHdrs["nights"] = "Nights";
// tblHdrs["startDate"] = "Check In";
// tblHdrs["dow"] = {'align': 'center', 'value': 'Dow'};
// tblHdrs["adults"] = "Adults";
// tblHdrs['isPrivate'] = 'Private?'

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const vipDays = 6

const computeNights = (startDate, endDate) => {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let timeDiff = Math.abs(end.getTime() - start.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays
}
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
        record.nights = computeNights(record.startDate, record.endDate)
    }

    let listTable, listHead, listBody;
    let listRow, listCell;


    // let's make a new table
    listTable = document.createElement("table");
    listTable.id = "listTbl";
    listTable.className = "table table-sm table-hover";
    resListDiv.appendChild(listTable);

    // now need to create the table parts
    listHead = document.createElement("thead");
    listTable.appendChild(listHead);
    listBody = document.createElement("tbody");
    listTable.appendChild(listBody);

    // now the header row
    listRow = document.createElement("tr");
    listHead.appendChild(listRow);
    for (let key in tblHdrs) {
        listCell = document.createElement("th");
        listCell.innerHTML = tblHdrs[key].value;
        listRow.appendChild(listCell);
    }

    // now the data rows
    // loop through the records
    let displayCount = 0;
    for (let i = 0; i < rowCnt; i++) {

        // get the record and check some filters
        record = data[i];
        if (record.status === "canceled") {
            continue;
        }
        if (record.nights < vipDays) {
            continue;
        }

        // need a row for each record
        listRow = document.createElement("tr");
        listBody.appendChild(listRow);

        displayCount++;
        let resID = record.reservationID;
        // start a new row
        listRow.setAttribute("data-resID", resID);
        for (let key in tblHdrs) {
            listCell = document.createElement("td");
            listRow.appendChild(listCell);
            switch (key) {
                case "startDate":
                    listCell.setAttribute('align', tblHdrs[key].align);
                    listCell.innerHTML = dater(record[key]);
                    break;
                case "dow":
                    let dowNum = new Date(record.startDate).getDay();
                    listCell.setAttribute('align', tblHdrs[key].align);
                    listCell.innerHTML = daysOfWeek[dowNum];
                    break;
                case "nights":
                case "adults":
                    listCell.setAttribute('align', tblHdrs[key].align);
                default:
                    listCell.innerHTML = record[key];
                    break;
            }
        }
    }

    console.log("dispResList: listTable: ", listTable);
    return displayCount;
}
