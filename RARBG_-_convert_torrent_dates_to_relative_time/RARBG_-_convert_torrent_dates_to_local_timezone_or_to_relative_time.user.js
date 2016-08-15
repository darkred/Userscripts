// ==UserScript==
// @name        RARBG - convert torrent timestamps to relative time
// @namespace   darkred
// @description Converts torrent upload timestamps to relative time
// @include     https://rarbg.to/torrents.php*
// @version     2
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


var currtemp;

// 2016-07-21 16:51:24
function toTimeZone(time, zone) {
	var format0 = ('YYYY-MM-DD HH:mm:ss');
	var format1 = ('YYYY-MM-DD HH:mm:ss Z');
	var zz = moment(time, format1).tz(zone);
	if (isDST) {
		currtemp = moment(zz._i, format1);
		currtemp = currtemp.subtract(1, 'hours').format(format0);
		return zz.subtract(1, 'hours').fromNow();
	} else {
		currtemp = moment(zz._i, format1);
		currtemp = currtemp.format(format0);
		return zz.fromNow();}
}


function convertDates() {
	var temp;
	for (var i = 0; i < dates.length; i++) {
		temp = dates[i].innerHTML;
		temp += ' +0100';			// RARBG Timezone offset : GMT+1
		var format0 = ('YYYY-MM-DD HH:mm:ss');
		if (moment(dates[i].innerHTML, format0, true).isValid()) {
			dates[i].innerHTML = toTimeZone(temp, localTimezone);
			dates[i].title = currtemp;
		}
	}
}

convertDates();
