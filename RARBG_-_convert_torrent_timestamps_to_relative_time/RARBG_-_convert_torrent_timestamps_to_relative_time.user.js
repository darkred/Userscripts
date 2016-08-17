// ==UserScript==
// @name        RARBG - convert torrent timestamps to relative time
// @namespace   darkred
// @description Converts torrent upload timestamps to relative time
// @include     https://rarbg.to/torrents.php*
// @version     2.0.1
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment-with-locales.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.1/moment-timezone-with-data.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.6/jstz.min.js
// ==/UserScript==

/* global $:false, jstz, moment */


function getLocalTimezone() {
	var tz = jstz.determine(); // Determines the time zone of the browser client
	return tz.name(); // Returns the name of the time zone eg "Europe/Berlin"
}

var localTimezone = getLocalTimezone();
var dates = $('tr.lista2 td:nth-child(3)');
var isDST = moment().isDST();


function convertDates() {
	var temp;
	for (var i = 0; i < dates.length; i++) {
		temp = dates[i].innerHTML;
		temp += ' +0100';			// RARBG Timezone offset : GMT+1
		var format0 = ('YYYY-MM-DD HH:mm:ss');
		if (moment(dates[i].innerHTML, format0, true).isValid()) {
			var format1 = ('YYYY-MM-DD HH:mm:ss Z');
			// var format2 = ('DD/MM/YYYY HH:mm:ss');
			var format2 = ('D/M/YYYY HH:mm:ss');
			var temp2 = moment(temp, format1).tz(localTimezone);
			if (isDST) {
				temp2.subtract(1, 'hours');
			} // else {
				// temp2.fromNow();
			// }
			dates[i].innerHTML = temp2.fromNow();
			dates[i].title = temp2.format(format2);
		}
	}
}

convertDates();
