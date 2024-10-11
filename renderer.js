// import { api } from "./preload.js";

import { getVipList, dispVipList } from "./js/dispResList.js";
import { dispResDetail } from "./js/dispResDetail.js";
import { dispHaList } from "./js/dispHaList.js";
import { dispHaDetail } from "./js/dispHaDetail.js";

import { haGetBalances } from "./js/haUtils.js";


import { haClearDetails, showHaList, showVipList, clearInfoBlocks, clearHighlight, clearSelections }
  from "./js/utility.js";
// import { ipcRenderer } from "electron";

/**
 * Initialise the UI
 */
// showHaList(); // set initial state to show HA
showVipList(); // set initial state to show VIP

/**
 * set the NAV button handlers
 */
navHA.addEventListener("click", showHaList);
navVIP.addEventListener("click", showVipList);

/**
 * set handlers for various buttons and filters
 */
// House Accounts (HA)
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


let reservationList;
let today = Date()
let later = today + 5


/*
 * Clicked on the VIP search button
 */
btnDateSearch.addEventListener("click", () => {
  let resDateFrom = document.getElementById("resDateFrom").value;
  let resDateTo = document.getElementById("resDateTo").value;
  // let srchID = 'all'
  clearInfoBlocks();

  api.send("getVipResList", { resDateFrom, resDateTo }); // send to main
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




// let rowCnt = 0;

/*
 * get the search results back from preload.js
 */

let showRecords = [];

window.addEventListener("message", (event) => {

  /**
   * have a list of reservations from main=>preload=>renderer
   */
  if (event.data.type === "resData") {
    showRecords = [];
    let resList = event.data.data;
    // let vipGuests = getVipList(resList);
    let vipGuests = resList;

    let rowCnt = vipGuests.length;
    let intMilSec = 250;
    let anInterval = 1000 / intMilSec;
    let rowsPerInterval = rowCnt / anInterval
    let rowInterv = 100 / rowsPerInterval;

    console.log(`renderer: vipGuests ${rowCnt} : ${rowsPerInterval}`)
    let nIntervalId;

    let progBar = document.createElement('div');
    resListDiv.appendChild(progBar)

    progBar.className = 'progress';
    progBar.role = 'progressbar';
    progBar.ariaLabel = 'Basic example';
    progBar.ariaValuenow = '75';
    progBar.ariaValuemin = '0';
    progBar.ariaValuemax = '100';

    // <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
    let progBarInner = document.createElement('div');
    progBar.appendChild(progBarInner);
    progBarInner.className = 'progress-bar progress-bar-striped progress-bar-animated';
    progBarInner.style.width = '0%';
    // </div>

    let rowProgress = 0;

    for (let i = 0; i < rowCnt; i++) {
      if (!nIntervalId)
        nIntervalId = setInterval(function () {
          if (i < rowCnt) {
            if (i > rowProgress) {
              rowProgress += rowInterv
              progBarInner.style.width = `${rowProgress}%`;
            }
              // let keyID = vipGuests[i].reservationID;
            // showRecords.push(vipGuests[i]);
            // api.send("getResDetail", showRecords[i])
            api.send("getResDetail", vipGuests[i])
            i++
          } else {
            progBar.remove();
            console.log('end of vipGuests: ', showRecords);
            clearInterval(nIntervalId);
            dispVipList(showRecords);
          }
        }, 250);
    }
    console.log('render: resData: end');
  }

  /** 
   * got the reservation detail from main=>preload=>renderer
   */
  if (event.data.type === "gotResDetail") {
    let resData = event.data.data;
    showRecords.push(resData);
    // console.log('renderer: ', event.data.data);
    // dispResDetail(resData);
  }


  if (event.data.type === "HA_Data") {
    // console.log('renderer: ', event.data.data);
    ha_accts = event.data.data;
    // rowCnt = dispHaList(ha_accts);
    let showRecords = dispHaList(ha_accts);
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
