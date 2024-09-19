// import { api } from "./preload.js";
import { dispResList } from "./js/dispResList.js";
import { dispResDetail } from "./js/dispResDetail.js";
import { dispHaList } from "./js/dispHaList.js";

import { showHaList, showVipList, clearInfoBlocks, clearHighlight, clearSelections }
  from "./js/utility.js";
// import { ipcRenderer } from "electron";

showHaList();
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


let ha_accts = {};
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

const displayReservations = (data) => {
  clearSelections();

  // go show results of the guest search
  rowCnt = dispResList(resList);
  // console.log('rowCnt: ', rowCnt);

  let cntRes = document.getElementById("cntRes");
  cntRes.innerHTML = "Number of reservations found: <b>" + rowCnt + "</>";

  // return

  if (rowCnt > 0) {
    let listTbl = document.getElementById("listTbl");

    // this will fire when the table is clicked
    listTbl.addEventListener("click", (e) => {
      // clearSelections();
      clearHighlight();
      let thisTR = e.target.parentNode;

      let reservationID = thisTR.getAttribute("data-resID");
      thisTR.classList.add("table-active");

      // let col = e.target.cellIndex;
      let dispSelName = document.getElementById("dispSelName");
      let row = e.target.parentNode.rowIndex;
      let selName = listTbl.rows[row].cells[1].innerHTML;
      dispSelName.innerHTML = selName;

      console.log("row: ", row, "  cellData: ", reservationID);

      api.send('getResDetail', reservationID);
      // api.send("gstDetail", qryKeyVIP);
      // api.send("gstReserves", qryKeyVIP);
      // api.send("gstStays", qryKeyVIP);
    });
  }
  return rowCnt;
}
/*
 * get the search results back from preload.js
 */
let rowCnt = 0;

window.addEventListener("message", (event) => {

  /**
   * have a list of reservations from main=>preload=>renderer
   */
  if (event.data.type === "resData") {
    // console.log('renderer: ', event.data.data);
    resList = event.data.data;
    displayReservations(resList);
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

  if (event.data.type === "HA_Data") {
    // console.log('renderer: ', event.data.data);
    ha_accts = event.data.data;
    dispHaList(ha_accts);
  }
}
);

btnHaReload.addEventListener("click", () => {
  api.send("haLoad");
})