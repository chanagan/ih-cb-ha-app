export function dater(date) {
    if (!date) return "<b>no date</b>";

    let dateT = "";
    if (date.length == 19) {
        // console.log('long date - in: ', date)
        let yr = date.substring(0, 4);
        let mo = date.substring(5, 7);
        let dy = date.substring(8, 10);
        dateT = mo + "/" + dy + "/" + yr;
        // console.log('long date - out: ', dateT)
    } else {
        // console.log('short date - in: ', date)
        /**
         * dates can be in the format of mm/dd/yyyy or yyyy-mm-dd
         * so we need to check for both
         * with the year being 4 digits in front or the end
         *
         * first check for the hyphen and then the slash and where they are
         */
        let firstHyphen = date.indexOf("-");
        let firstSlash = date.indexOf("/");
        let dy = "",
            mo = "",
            yr = "";
        if (firstHyphen < 0) {
            // date uses slashes
            const dtParts = date.split("/");
            // first zero pad the month and day
            if (firstSlash < 4) {
                yr = dtParts[2];
                mo = ("00" + dtParts[0]).slice(-2);
                dy = ("00" + dtParts[1]).slice(-2);
                // dateT = mo + '/' + dy + '/' + yr
            } else {
                yr = dtParts[0];
                mo = dtParts[1];
                dy = dtParts[2];
                // dateT = mo + '/' + dy + '/' + yr
            }
        } else if (firstSlash < 0) {
            // date uses hyphens
            const dtParts = date.split("-");
            if (firstHyphen < 4) {
                yr = dtParts[2];
                mo = ("00" + dtParts[0]).slice(-2);
                dy = ("00" + dtParts[1]).slice(-2);
                // dateT = mo + '/' + dy + '/' + yr
            } else {
                yr = dtParts[0];
                mo = dtParts[1];
                dy = dtParts[2];
            }
        }
        dateT = mo + "/" + dy + "/" + yr;
    }
    return dateT;
}

// Create our number formatter.
export const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

let statusFlags = { vip: true };
statusFlags["checked_in"] = true;
statusFlags["checked_out"] = true;
// statusFlags["canceled"] = true;
statusFlags["confirmed"] = true;

export function statusFlag(status) {
    return statusFlags[status];
}

export function updateStatusFlag(status, flag) {
    statusFlags[status] = flag;
}
