import { dater } from "./utility.js";

let tblHdrs = { accountID: "Acct ID" };
tblHdrs["accountName"] = "Name";
tblHdrs["accountStatus"] = "Status";
tblHdrs["dateCreated"] = "Created";
tblHdrs['isPrivate'] = 'Private?'

// let daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * let jData = [
  { name: "GeeksforGeeks", est: 2009 },
  { name: "Google", est: 1998 },
  { name: "Microsoft", est: 1975 }
];
jData.sort((a, b) => (a.name > b.name ? 1 : -1));
console.log(jData);
 */

const txtHaNmSrch = document.getElementById("txtHaNmSrch");
const haListDiv = document.getElementById("haListDiv");
const cntHA = document.getElementById("cntHA");
const chkStatOpn = document.getElementById("chkStatOpn");
const chkStatClsd = document.getElementById("chkStatClsd");
const statOpen = 'open';
const statClosed = 'closed';
/**
 *
 * @param {*} data
 * @returns rowCnt
 */

export function dispHaList(data) {


    let record
    // set up a search key if there is one
    let srchKey = txtHaNmSrch.value
    let lcSrchKey = srchKey.toLowerCase()
;
    let rowCnt = data.length;

    // if no data returned, display message and return
    if (rowCnt === 0) {
        haListDiv.innerHTML = "<b>No House Accounts</b>";
        return 0;
    }

    // sort the data by accountName
    data.sort((a, b) => (a.accountName > b.accountName ? 1 : -1));
    // console.log("dispResList: data: ", rowCnt, " : ", data);

    // if data returned, display table

    // will be putting the results into a table
    let newTable = "<table id='haListTbl' class='table table-sm table-hover'>";
    let newRow

    // create table header
    newTable += "<thead>";
    newTable += "<tr>";
    for (let key in tblHdrs) {
        newTable += "<th>" + tblHdrs[key] + "</th>";
    }
    newTable += "</tr>";
    newTable += "</thead>";

    // create table rows
    let displayCnt = 0;
    for (let i = 0; i < rowCnt; i++) {
        // newTable += "<tr>";
        record = data[i];
        if (! record.accountName.toLowerCase().includes(lcSrchKey)) {
            continue
        }
        // check for status filters
        if ((record.accountStatus === statClosed && !chkStatClsd.checked)
            || (record.accountStatus === statOpen && !chkStatOpn.checked))
         { continue }

        // console.log("record: ", record);
        // newRow = '<tr>'
        let acctID = record['accountID'];
        newRow = `<tr data-haid=${acctID} >`
        displayCnt++;
        for (let key in tblHdrs) {
            switch (key) {
                case "dateCreated":
                    newRow += "<td>" + dater(record[key]) + "</td>";
                    break;
                default:
                    newRow += "<td>" + record[key] + "</td>";
            }
            // newRow += "<td>" + record[key] + "</td>";

        }
        newRow += '</tr>'
        newTable += newRow;
    }

    // }
    // close the table
    newTable += "</table>";
    haListDiv.innerHTML = newTable;
    
    cntHA.innerHTML = "Number of House Accounts: <b>" + displayCnt + "</b>";

    return displayCnt;
}
