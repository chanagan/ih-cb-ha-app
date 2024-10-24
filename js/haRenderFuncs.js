import { dater, formatter } from "./utility.js";

// let tblHdrs = { accountID: "Acct ID" };
// tblHdrs["accountName"] = "Name";
// tblHdrs["accountStatus"] = "Status";
// // tblHdrs["dateCreated"] = "Created";
// // tblHdrs['isPrivate'] = 'Private?'
let tblHdrs = [];
// tblHdrs["accountID"] = { 'align': 'left', 'value': 'Acct ID' };
tblHdrs["accountName"] = { 'align': 'left', 'value': 'Name' };
// tblHdrs["accountStatus"] = { 'align': 'center', 'value': 'Status' };
tblHdrs["charges"] = { 'align': 'right', 'value': 'Balance' };

let chrgHdrs = [];
chrgHdrs["balance"] = { 'align': 'right', 'value': 'Charges' };
chrgHdrs["monMin"] = { 'align': 'right', 'value': 'Minimum' };
chrgHdrs["minDelta"] = { 'align': 'right', 'value': 'Delta' };
chrgHdrs["minTax"] = { 'align': 'right', 'value': '7.5%' };
chrgHdrs["subTot"] = { 'align': 'right', 'value': 'Sub Total' };
chrgHdrs["creChg"] = { 'align': 'right', 'value': '3.0%' };
chrgHdrs["totChg"] = { 'align': 'right', 'value': 'Total Charge' };

// let daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];



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

export function filterHaList(data) {
    // filter the full list of accounts
    let rowCnt = data.length;
    // if no data returned, display message and return
    if (rowCnt === 0) {
        haListDiv.innerHTML = "<b>No Accounts</b>";
        return 0;
    }
    // set up a search key if there is one
    let srchKey = txtHaNmSrch.value
    let lcSrchKey = srchKey.toLowerCase();

    let wantClosed = chkStatClsd.checked
    let wantOpen = chkStatOpn.checked
    // let wantEmp = chkFilterEmp.checked
    // let wantGC = chkFilterGc.checked

    let isEmp = false
    let isGC = false

    let showRecords = []
    let displayCount = 0
    let record


    for (let i = 0; i < rowCnt; i++) {
        record = data[i];
        if (!record.accountName.toLowerCase().includes(lcSrchKey)) {
            continue
        }
        // check for status filters
        if ((record.accountStatus === statClosed && !wantClosed)
            || (record.accountStatus === statOpen && !wantOpen)) { continue }

        // check for acct type filters
        // isGC = record.accountName.startsWith('GC')
        // isEmp = record.accountName.startsWith('IH')
        // if (wantEmp && !isEmp) { continue }
        // if (wantGC && !isGC) { continue }
        // if (isGC && !wantGC) { continue }
        // if (isEmp && !wantEmp) { continue }

        // at this point we're going to show this record, so,
        // push it to the showRecords array
        showRecords.push(record)
        displayCount += 1
    }
    console.log('filterHaList: displayCount: ', displayCount)
    return showRecords
}
export function dispHaList(data) {
    let rowCnt = data.length;
    // if no data returned, display message and return
    if (rowCnt === 0) {
        haListDiv.innerHTML = "<b>No Accounts</b>";
        return 0;
    }

    // check for the div already having a table
    if (haListDiv.hasChildNodes()) {
        haListDiv.removeChild(haListTbl);
    }

    // set up a search key if there is one
    let srchKey = txtHaNmSrch.value
    let lcSrchKey = srchKey.toLowerCase();

    let listTable, listHead, listBody;
    let listRow, listCell;

    // if data returned, display table

    // will be putting the results into a table

    // let's make a new table
    listTable = document.createElement("table");
    listTable.style.border = "1px solid moccasin";
    listTable.id = "haListTbl";
    listTable.className = "table table-sm table-hover";
    haListDiv.appendChild(listTable);

    // now need to create the table parts
    listHead = document.createElement("thead");
    listTable.appendChild(listHead);
    listBody = document.createElement("tbody");
    listTable.appendChild(listBody);

    // now the header row
    listRow = document.createElement("tr");
    listHead.appendChild(listRow);
    for (let key in tblHdrs) {
        switch (key) {
            case 'charges':
                for (let key in chrgHdrs) {
                    listCell = document.createElement("th");
                    listRow.appendChild(listCell);
                    listCell.style.textAlign = chrgHdrs[key].align;
                    listCell.innerHTML = chrgHdrs[key].value;
                }
                break;
            default:
                listCell = document.createElement("th");
                listRow.appendChild(listCell);
                listCell.style.textAlign = tblHdrs[key].align;
                listCell.innerHTML = tblHdrs[key].value;
        }
    }

    // let's sort the data by name
    data.sort((a, b) => (a.accountName > b.accountName ? 1 : -1));
    
    // create table rows
    let wantClosed = chkStatClsd.checked
    let wantOpen = chkStatOpn.checked
    // let wantEmp = chkFilterEmp.checked
    // let wantGC = chkFilterGc.checked

    // let isEmp = false
    // let isGC = false

    let showRecords = []
    let displayCount = 0
    let record
    for (let i = 0; i < rowCnt; i++) {
        record = data[i];
        if (!record.accountName.toLowerCase().includes(lcSrchKey)) {
            continue
        }
        // check for status filters
        if ((record.accountStatus === statClosed && !wantClosed)
            || (record.accountStatus === statOpen && !wantOpen)) { continue }

        // check for acct type filters
        // isGC = record.accountName.startsWith('GC')
        // isEmp = record.accountName.startsWith('IH')
        // if (wantEmp && !isEmp) { continue }
        // if (wantGC && !isGC) { continue }
        // if (isGC && !wantGC) { continue }
        // if (isEmp && !wantEmp) { continue }

        // at this point we're going to show this record, so,
        // push it to the showRecords array
        showRecords.push(record)

        // need a row for each record
        let acctID = record['accountID'];
        listRow = document.createElement("tr");
        listBody.appendChild(listRow);
        // identify the 'closed' account
        if (record.accountStatus === statClosed) {
            listRow.className = "table-danger";
        }
        listRow.setAttribute("data-haid", acctID);
        displayCount++;
        for (let key in tblHdrs) {

            switch (key) {
                case "charges":
                    let actChrgs = record.charges;
                    if (typeof (actChrgs) === 'undefined') {
                        continue
                    }
                    for (let chrgKey in chrgHdrs) {
                        listCell = document.createElement("td");
                        listRow.appendChild(listCell);
                        listCell.style.textAlign = chrgHdrs[chrgKey].align;
                        let chrgAmt = formatter.format(actChrgs[chrgKey])
                        listCell.innerHTML = chrgAmt;
                    }
                    break
                default:
                    listCell = document.createElement("td");
                    listRow.appendChild(listCell);
                    listCell.style.textAlign = tblHdrs[key].align;
                    listCell.innerHTML = record[key];
            }
        }
    }

    // }
    cntHA.innerHTML = "Accounts: <b>" + displayCount + "</b>";

    return showRecords;
}
