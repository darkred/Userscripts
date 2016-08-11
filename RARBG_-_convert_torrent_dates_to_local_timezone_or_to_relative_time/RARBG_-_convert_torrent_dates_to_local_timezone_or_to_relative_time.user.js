// ==UserScript==
// @name        RARBG - convert torrent dates to local timezone or to relative time
// @namespace   darkred
// @description Convert torrent upload dates to local timezone or to relative time
// @include     https://rarbg.to/torrents.php*
// @version     1
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



// 2016-07-21 16:51:24
function toTimeZone(time, zone) {
	var format1 = ('YYYY-MM-DD HH:mm:ss Z');
	var zz = moment(time, format1).tz(zone);
	if (isDST) {
		// var format2 = ('YYYY-MM-DD HH:mm:ss');				// Note: you may uncomment this line(#34),35 and 39, and comment out lines 36 and 40, in order the dates to just be displayed using local timezone
		// return zz.subtract(1, 'hours').format(format2);
		return zz.subtract(1, 'hours').fromNow();
	} else {

		// return zz.format(format2);
		return zz.fromNow();}
}


function convertDates() {
	var temp;
	for (var i = 0; i < dates.length; i++) {
		temp = dates[i].innerHTML;
		// temp += ' +0000';
		temp += ' +0100';			// RARBG Timezone offset : GMT+1
		var format0 = ('YYYY-MM-DD HH:mm:ss');
		// var format1 = ('YYYY-MM-DD HH:mm:ss Z');
		if (moment(dates[i].innerHTML, format0, true).isValid()) {
			dates[i].innerHTML = toTimeZone(temp, localTimezone);
		}
	}
}

convertDates();
