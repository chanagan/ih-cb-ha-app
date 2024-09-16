import { dater, formatter } from "./utility.js";

let tblHdrs = { guestID: "Guest ID" };
tblHdrs["guestLastName"] = "Last";
tblHdrs["guestFirstName"] = "First";
tblHdrs["isMainGuest"] = "Main?";
tblHdrs["assignedRoom"] = "Assigned?";
// tblHdrs["roomName"] = "Room";
tblHdrs["guestStatus"] = "Status";
tblHdrs["rooms"] = "Rooms";
// tblHdrs['isPrivate'] = 'Private?'

let statusHdrs = {'checked_in': 'Chk/In'
    , 'checked_out': 'Chk/Out'
    , 'cancelled': 'Canx'
    , 'confirmed': 'Confrm'
    , 'in_house': 'In Hse'
    , 'not_checked_in': 'Not C/I'
    , 'vip': 'VIP'}  

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

export function dispResDetail(data) {
    let guestList = data.data.guestList;
    // let guestList = data.data;

    let assignedRooms = data.data.assigned;
    let guestCnt = Object.keys(guestList).length;

    for (let key in guestList) {
        console.log("dispResDetail: guestList: ", key, " : ", guestList[key]);
        for (let key1 in guestList[key]) {
            console.log(
                "dispResDetail: guestList: ",
                key1,
                " : ",
                guestList[key][key1]
            );
        }
    }
    let rowCnt = data.length;
    let resDtlDiv = document.getElementById("resDtlDiv");

    // return;
    // if no data returned, display message and return
    // if (guestCnt === 0) {
    //     haTblDiv.innerHTML = "<b>No Reservation Data</b>";
    //     return 0;
    // }
    // console.log("dispResDetail: data: ", rowCnt, " : ", data);

    // // sort the data by startDate
    // data.sort((a, b) => (a.startDate > b.startDate ? 1 : -1));
    // console.log("dispResDetail: data: ", rowCnt, " : ", data);

    // // compute the number of nights
    // for (let i = 0; i < rowCnt; i++) {
    //     let sDate = new Date(data[i].startDate);
    //     let eDate = new Date(data[i].endDate);
    //     let diffTime = Math.abs(eDate - sDate);
    //     let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //     data[i].nights = diffDays;
    // }
    // console.log("dispResDetail: data: ", rowCnt, " : ", data);

    // if data returned, display table

    // will be putting the results into a table
    let newTable = "<table border='0' id='listTbl'>";

    // create table header
    // newTable += "<thead>";
    // newTable += "<tr>";

    newTable += "<tr>";
    for (let key1 in tblHdrs) {
        newTable += "<th>" + tblHdrs[key1] + "</th>";
    }
    newTable += "</tr>";

    let rooms
    for (let key in guestList) {
        let guest = guestList[key];
        rooms = (guest.isMainGuest) ? guest.rooms : "";
        newTable += "<tr>";
        console.log("dispResDetail: guestList: ", key, " : ", guestList[key]);
        for (let key1 in tblHdrs) {
            switch (key1) {
                case "guestStatus":
                    let status = guest[key1];
                    let statStr = statusHdrs[status];
                    newTable += "<td>" + statStr + "</td>";
                    break;
                case "rooms":
                    if (guest.isMainGuest) {
                        newTable += "<td>" 
                        for (let i = 0; i < rooms.length; i++) {
                            newTable += rooms[i].roomName + "<br>";
                        }
                        newTable += "</td>";
                    }
                    break;
                default:
                    newTable += "<td>" + guest[key1] + "</td>";
                    break;
                }
            // if (key1 === "rooms") {
            //     // newTable += "<td>" + rooms + "</td>";
            // } else {
            //     newTable += "<td>" + guestList[key][key1] + "</td>";
            // }
        }
        newTable += "</tr>";
    }

    // for (let key in tblHdrs) {
    //     newTable += "<tr>";
    //     newTable += "<th>" + tblHdrs[key] + "</th>";
    // }
    // // newTable += "</tr>";
    // // newTable += "</thead>";
    // // create table rows
    // for (let i = 0; i < rowCnt; i++) {
    //     // newTable += "<tr>";
    //     let resStatus = data[i].nights < 6 ? data[i].status : "vip";
    //     // let newRow = "<tr class='" + resStatus + "'>";
    //     // let rawData = JSON.stringify(data[i]);
    //     let resID = data[i].reservationID;
    //     let newRow = `<tr class='${resStatus}' data-resID=${resID}>`;
    //     newTable += newRow;
    //     for (let key in tblHdrs) {
    //         switch (key) {
    //             case "startDate":
    //                 newTable += "<td>" + dater(data[i][key]) + "</td>";
    //                 break;
    //             case "endDate":
    //                 newTable += "<td>" + dater(data[i][key]) + "</td>";
    //                 break;
    //             default:
    //                 newTable += "<td>" + data[i][key] + "</td>";
    //                 break;
    //         }
    //     }
    //     newTable += "</tr>";
    // }

    newTable += "</table>";
    resDtlDiv.innerHTML = newTable;

    return rowCnt;
}
