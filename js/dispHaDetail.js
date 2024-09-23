
import { dater, formatter } from "./utility.js";

let tblTotalHdrs = {};
tblTotalHdrs['count'] = 'Count';
tblTotalHdrs['credit'] = 'Charges';
tblTotalHdrs['debit'] = 'Payments';
tblTotalHdrs['quantity'] = 'Quantity';

let tblRecordHdrs = {};
// tblRecordHdrs["currency"] = "Currency";
tblRecordHdrs["transactionDateTime"] = "Trans Date";
tblRecordHdrs["credit"] = "Charge";
tblRecordHdrs["debit"] = "Payment";
tblRecordHdrs["balance"] = "Balance";
// tblRecordHdrs["description"] = "Description";
// tblRecordHdrs["notes"] = "Notes";
// tblRecordHdrs["quantity"] = "Quantity";
tblRecordHdrs["userName"] = "userName";

let statusHdrs = {
    'checked_in': 'Chk/In'
    , 'checked_out': 'Chk/Out'
    , 'cancelled': 'Canx'
    , 'confirmed': 'Confrm'
    , 'in_house': 'In Hse'
    , 'not_checked_in': 'Not C/I'
    , 'vip': 'VIP'
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

export function dispHaDetail(data) {
    let total = data.total;
    let records = data.records;
    let rowCnt = data.records.length;
    let newTable, newRow, newCol;

    // first, sort oldest to newest
    records.sort((a, b) => (a.transactionDateTime > b.transactionDateTime ? 1 : -1));
    console.log('1st record: ', records[0]);

    // set the initial balance
    records[0].balance = records[0].credit - records[0].debit;

    // loop through and compute the balance for each record
    for (let i = 1; i < rowCnt; i++) {
        records[i].balance = records[i].credit - records[i].debit + records[i - 1].balance;
    }

    records.sort((a, b) => (a.transactionDateTime < b.transactionDateTime ? 1 : -1));
    console.log('records: ', records);


    const haDtlDivTotal = document.getElementById("haDtlDivTotal");
    const haDtlDivRecords = document.getElementById("haDtlDivRecords");

    // will be putting the results into a table
    newTable = "<table border='0' id='haTotalTbl' class='table table-sm table-hover'>";


    // headers for the 'total' table
    newRow = "<tr>";
    for (let key1 in tblTotalHdrs) {
        newRow += "<th>" + tblTotalHdrs[key1] + "</th>";
    }
    newRow += "</tr>";
    newTable += newRow;

    // detail for the 'total' table
    newRow = "<tr>";
    for (let key1 in tblTotalHdrs) {
        newRow += "<td>" + total[key1] + "</td>";
    }
    newRow += "</tr>";
    newTable += newRow;

    newTable += "</table>";
    haDtlDivTotal.innerHTML = newTable;


    newTable = "<table border='0' id='haRecordsTbl' class='table table-sm table-hover table-fixed'>";
    newTable += "<thead>";
    // headers for the 'records' table
    newRow = "<tr>";
    for (let key1 in tblRecordHdrs) {
        newRow += "<th>" + tblRecordHdrs[key1] + "</th>";
    }
    // newRow += "<td class='glyphicon >&#xe086;</td>"
    newRow += "</tr>";
    newTable += newRow;
    newTable += "</thead>";
    

    /**
     * "<img src='images/info-circle-fill.svg' title='" + data[i]['TRANTYPE_DESC'] + "'>"

     */


    // detail for the 'total' table
    let tdAlign = ''
    for (let record in records) {
        newRow = "<tr>";
        for (let fldKey in tblRecordHdrs) {
            let thisRecord = records[record];
            switch (fldKey) {
                case "credit":
                    tdAlign = 'right';
                    newCol = formatter.format(thisRecord[fldKey]);
                    break;
                case "debit":
                    tdAlign = 'right';
                    newCol = formatter.format(thisRecord[fldKey]);
                    break;
                case 'balance':
                    tdAlign = 'right';
                    newCol = formatter.format(thisRecord[fldKey]);
                    break
                case 'transactionDateTime':
                    tdAlign = 'left';
                    newCol = thisRecord[fldKey];
                    break
                case 'description':
                    newCol = "<img src='images/info-circle-fill.svg' title='" + thisRecord[fldKey] + "'>"
                    break

                default:
                    tdAlign = 'left';
                    newCol = thisRecord[fldKey];
            }
            newRow += `<td align="${tdAlign}">` + newCol + "</td>";
        }
        newRow += "</tr>";
        newTable += newRow;
    }

    newTable += "</table>";
    haDtlDivRecords.innerHTML = newTable;


    return

    let rooms
    for (let key in guestList) {
        let guest = guestList[key];
        rooms = (guest.isMainGuest) ? guest.rooms : "";
        let newRow = "<tr>";
        // console.log("dispResDetail: guestList: ", key, " : ", guestList[key]);
        for (let key1 in tblRecordHdrs) {
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
