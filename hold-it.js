const ExcelJS = require("exceljs");

let tblHdrs = [];
tblHdrs["accountName"] = { 'align': 'left', 'value': 'Name' };
tblHdrs["accountStatus"] = { 'align': 'center', 'value': 'Status' };
tblHdrs["charges"] = { 'align': 'right', 'value': 'Balance' };

let chrgHdrs = [];
chrgHdrs["balance"] = { 'align': 'right', 'value': 'Charges' };
chrgHdrs["monMin"] = { 'align': 'right', 'value': 'Minimum' };
chrgHdrs["minDelta"] = { 'align': 'right', 'value': 'Delta' };
chrgHdrs["minTax"] = { 'align': 'right', 'value': '7.5%' };
chrgHdrs["subTot"] = { 'align': 'right', 'value': 'Sub Total' };
chrgHdrs["creChg"] = { 'align': 'right', 'value': '3.0%' };
chrgHdrs["totChg"] = { 'align': 'right', 'value': 'Total Charge' };



const workbook = new ExcelJS.Workbook();
workbook.creator = 'Me';
workbook.lastModifiedBy = 'Her';
workbook.created = new Date(1985, 8, 30);
workbook.modified = new Date();
workbook.lastPrinted = new Date(2016, 9, 27);
workbook.calcProperties.fullCalcOnLoad = true;
workbook.views = [
    {
        x: 0, y: 0, width: 10000, height: 20000,
        firstSheet: 0, activeTab: 1, visibility: 'visible'
    }
]
const sheet = workbook.addWorksheet('First Sheet', { properties: { tabColor: { argb: 'FFC0000' } } });

// let row = sheet.getRow(1);

// // row.getCell(1).value = 5; // A5's value set to 5
// let colIdx = 1;
// for (let key in tblHdrs) {
//     switch (key) {
//         case 'charges':
//             for (let key in chrgHdrs) {
//                 row.getCell(colIdx).value = chrgHdrs[key].value;
//                 colIdx++;
//             }
//             break;
//         default:
//             row.getCell(colIdx).value = tblHdrs[key].value;
//             colIdx++;
//     }
// }

let rowCnt = data.length;
let colCnt = 1;
for (let i = 0; i < rowCnt; i++) {
    let record = data[i];
    row = sheet.getRow(i + 2);
    colIdx = 1;
    for (let key in tblHdrs) {
        switch (key) {
            case 'charges':
                let actChrgs = record.charges;
                if (typeof (actChrgs) === 'undefined') {
                    continue
                }

                for (let chrgKey in chrgHdrs) {
                    row.getCell(colIdx).value = actChrgs[chrgKey];
                    colIdx++;
                }
                break;
            default:
                row.getCell(colIdx).value = record[key];
                colIdx++;
        }
    }
}

workbook.xlsx.writeFile("data.xlsx").then(function () {
    console.log("xls file is written.");
});


ipcMain.on('exportData', (event, data) => {
    console.log('ipcMain main: exportData: ', data)
    // console.log("main: exportData: ", data)
}
)