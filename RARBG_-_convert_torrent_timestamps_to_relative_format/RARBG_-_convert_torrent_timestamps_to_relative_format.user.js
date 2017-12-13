// ==UserScript==
// @name        RARBG - convert torrent timestamps to relative format
// @namespace   darkred
// @license     MIT
// @description Converts torrent upload timestamps to relative format
// @version     2017.12.13
// @include     /^https?:\/\/(www\.)?(rarbg|rarbgproxy|rarbgaccess)\.(to|com|org)\/torrents.php.*/
// @include     /^https?:\/\/(www\.)?(rarbg|rarbgproxy|rarbgaccess)\.(to|com|org)\/top10$/
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.6/moment-timezone-with-data-2010-2020.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.6/jstz.min.js
// ==/UserScript==

/* global jstz, moment */

// Customize the strings in the locale to display "1 minute ago" instead of "a minute ago" (https://github.com/moment/moment/issues/3764#issuecomment-279928245)
moment.updateLocale('en', {
	relativeTime: {
		future: 'in %s',
		past:   '%s ago',
		s:  'seconds',
		m:  '1 minute',
		mm: '%d minutes',
		h:  '1 hour',
		hh: '%d hours',
		d:  '1 day',
		dd: '%d days',
		M:  '1 month',
		MM: '%d months',
		y:  '1 year',
		yy: '%d years'
	}
});

var localTimezone = jstz.determine().name();
var serverTimezone = 'Europe/Berlin';		// GMT+1

function convertDates() {
	// var dates = document.querySelectorAll('tr.lista2 td:nth-child(3)');
  var dates = document.querySelectorAll('td[width="150px"]');
	for (var i = 0; i < dates.length; i++) {
		// if (moment(dates[i].innerText, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {		// As of moment.js v2.3.0, you may specify a boolean for the last argument to make Moment use strict parsing. Strict parsing requires that the format and input match exactly, including delimeters.
		if (moment(dates[i].innerText, 'YYYY-MM-DD HH:mm:ss').isValid()) {

			var temp2 = moment.tz(dates[i].innerText, serverTimezone).tz(localTimezone);
			dates[i].innerText = temp2.fromNow();

			var format = 'MM/DD/YYYY HH:mm:ss';
			dates[i].title = temp2.format(format);
		}
	}
}

convertDates();
