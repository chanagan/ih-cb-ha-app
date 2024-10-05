// import { api } from "./preload.js";

import { getVipList } from "./js/dispResList.js";
import { dispResDetail } from "./js/dispResDetail.js";
import { dispHaList } from "./js/dispHaList.js";
import { dispHaDetail } from "./js/dispHaDetail.js";

import { haGetBalances } from "./js/haUtils.js";


import { haClearDetails, showHaList, showVipList, clearInfoBlocks, clearHighlight, clearSelections }
  from "./js/utility.js";
// import { ipcRenderer } from "electron";

// load up the HA data early
// showHaList();
showVipList();

navHA.addEventListener("click", showHaList);
navVIP.addEventListener("click", showVipList);
btnHaNmSearch.addEventListener("click", () => {
  dispHaList(ha_accts);
})
chkStatOpn.addEventListener("click", () => {
  dispHaList(ha_accts);
})
chkStatClsd.addEventListener("click", () => {
  dispHaList(ha_accts);
})
chkFilterEmp.addEventListener("click", () => {
  dispHaList(ha_accts);
})
chkFilterGc.addEventListener("click", () => {
  dispHaList(ha_accts);
})
btnHaReload.addEventListener("click", () => {
  api.send("haLoad");
})

let ha_accts = {};
let ha_details = {};
let resList = {};


let reservationList;
let today = Date()
let later = today + 5


/*
 * Clicked on the search button
 */
btnDateSearch.addEventListener("click", () => {
  let resDateFrom = document.getElementById("resDateFrom").value;
  let resDateTo = document.getElementById("resDateTo").value;
  // let srchID = 'all'
  clearInfoBlocks();

  api.send("resList", { resDateFrom, resDateTo }); // send to main
});

const haNameCol = 1;

haListDiv.addEventListener("click", (e) => {
  let dispElems = haListDiv.getElementsByClassName("table-active");
  for (let i = 0; i < dispElems.length; i++) {
    dispElems[i].classList.remove("table-active");
  }
  let thisTR = e.target.parentNode;
  thisTR.classList.add("table-active");

  let keyID = thisTR.getAttribute("data-haID");
  let haName = thisTR.children[haNameCol].innerHTML;
  // document.getElementById("dispHaSelName").innerHTML = haName;
  haClearDetails();
  dispHaSelName.innerHTML = `Selected House Account: <b> ${haName} </b>`;
  // let keyID = 611559; // 611559
  api.send("getHaDetail", keyID)
})

haDtlDivRecords.addEventListener("click", (e) => {
  let thisTR = e.target.parentNode;
  document.getElementById("haDtlDivDesc").innerHTML = thisTR.getAttribute("data-desc");
  document.getElementById("haDtlDivNotes").innerHTML = thisTR.getAttribute("data-note");
  // console.log(thisTR)

})

// haRecordsTbody.addEventListener('mouseover', (e) => {
//   let thisTR = e.target.parentNode;
//   document.getElementById("haDtlDivDesc").innerHTML = thisTR.getAttribute("data-desc");
//   document.getElementById("haDtlDivNotes").innerHTML = thisTR.getAttribute("data-note");
// })

const displayReservations = (data) => {
  clearSelections();

  // need some preprocessing for the data
  let rowCnt = data.length;
  // if there were no reservations, return
  if (rowCnt === 0) {
    resListDiv.innerHTML = "<b>No Reservations</b>";
    return
  }

  // now let's see how many VIP reservations there are
  let vipGuests = [];
  let record
  // for (let i = 0; i < rowCnt; i++) {
  //   record = data[i];
  //   let sDate = new Date(record.startDate);
  //   let eDate = new Date(record.endDate);
  //   let diffTime = Math.abs(eDate - sDate);
  //   let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   record.nights = diffDays;
  //   if (record.nights > 5) {
  //     vipGuests.push(record);
  //   }

  
  // console.log("displayReservations: data: ", rowCnt, " : ", vipGuests);


  // console.log("displayReservations: data: ", rowCnt, " : ", data);

  // go show results of the guest search
  vipGuests = getVipList(resList);
  console.log('renderer: vipGuests ', vipGuests);

  return  
}

  // let cntRes = document.getElementById("cntRes");
  // cntRes.innerHTML = "Number of reservations found: <b>" + rowCnt + "</>";

  // return

  // if (rowCnt > 0) {
  //   let listTbl = document.getElementById("listTbl");

  //   // this will fire when the table is clicked
  //   listTbl.addEventListener("click", (e) => {
  //     // clearSelections();
  //     clearHighlight();
  //     let thisTR = e.target.parentNode;

  //     let reservationID = thisTR.getAttribute("data-resID");
  //     thisTR.classList.add("table-active");

  //     // let col = e.target.cellIndex;
  //     let dispSelName = document.getElementById("dispSelName");
  //     let row = e.target.parentNode.rowIndex;
  //     let selName = listTbl.rows[row].cells[1].innerHTML;
  //     dispSelName.innerHTML = selName;

  //     console.log("row: ", row, "  cellData: ", reservationID);

  //     api.send('getResDetail', reservationID);
  //   });
  // }
  // return rowCnt;


let rowCnt = 0;

/*
 * get the search results back from preload.js
 */

window.addEventListener("message", (event) => {

  /**
   * have a list of reservations from main=>preload=>renderer
   */
  if (event.data.type === "resData") {
    resList = event.data.data;
    let vipGuests = getVipList(resList);
    console.log('renderer: vipGuests ', vipGuests);


    // displayReservations(resList);
    // return
  }

  /** 
   * got the reservation detail from main=>preload=>renderer
   */
  if (event.data.type === "gotResDetail") {
    console.log('renderer: ', event.data.data);
    let resData = event.data.data;
    dispResDetail(resData);
  }

  let showRecords = []
  if (event.data.type === "HA_Data") {
    // console.log('renderer: ', event.data.data);
    ha_accts = event.data.data;
    // rowCnt = dispHaList(ha_accts);
    showRecords = dispHaList(ha_accts);
    haGetBalances(showRecords);
  }

  if (event.data.type === "gotHaDetail") {
    // console.log('renderer: ');
    let haData = event.data.data;
    if (haData.length == 0) {
      haClearDetails();
      document.getElementById("dispHaSelName").innerHTML = 'No records found';
      return
    }
    //haData.total.count
    // document.getElementById("haDtlDivCount").innerHTML = haData.total.count;
    // document.getElementById("haDtlDivCharges").innerHTML = haData.total.debit;
    // document.getElementById("haDtlDivCredits").innerHTML = haData.total.credit;
    // document.getElementById("haDtlDivQty").innerHTML = haData.total.quantity;

    dispHaDetail(haData);
  }

}
);
