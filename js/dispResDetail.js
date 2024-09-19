import { dater, formatter } from "./utility.js";

let tblHdrs = { guestID: "Guest ID" };
tblHdrs["guestLastName"] = "Last";
tblHdrs["guestFirstName"] = "First";
tblHdrs["isMainGuest"] = "Main?";
tblHdrs["assignedRoom"] = "Assgnd?";
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

    // for (let key in guestList) {
    //     console.log("dispResDetail: guestList: ", key, " : ", guestList[key]);
    //     for (let key1 in guestList[key]) {
    //         console.log(
    //             "dispResDetail: guestList: ",
    //             key1,
    //             " : ",
    //             guestList[key][key1]
    //         );
    //     }
    // }
    let rowCnt = data.length;
    let resDtlDiv = document.getElementById("resDtlDiv");

    // will be putting the results into a table
    let newTable = "<table border='0' id='listTbl' class='table table-sm'>";

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
        let newRow = "<tr>";
        // console.log("dispResDetail: guestList: ", key, " : ", guestList[key]);
        for (let key1 in tblHdrs) {
            switch (key1) {
                case "guestStatus":
                    let status = guest[key1];
                    let statStr = statusHdrs[status];
                    newRow += "<td>" + statStr + "</td>";
                    break;
                case "rooms":
                    if (guest.isMainGuest) {
                        newRow += "<td>" 
                        for (let i = 0; i < rooms.length; i++) {
                            newRow += rooms[i].roomName + "<br>";
                        }
                        newRow += "</td>";
                    }
                    break;
                default:
                    newRow += "<td>" + guest[key1] + "</td>";
                    break;
                }
        }
        newRow += "</tr>";
        newTable += newRow;
    }

    newTable += "</table>";
    resDtlDiv.innerHTML = newTable;

    return rowCnt;
}
