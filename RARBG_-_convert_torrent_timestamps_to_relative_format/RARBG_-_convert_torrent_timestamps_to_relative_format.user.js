// ==UserScript==
// @name        RARBG - convert torrent timestamps to relative format
// @namespace   darkred
// @version     2021.11.9
// @description Converts torrent upload timestamps to relative format
// @author      darkred
// @license     MIT
// @include     /^(https?:)?\/\/(www\.)?(proxy|unblocked)?rarbg((2018|2019|2020|2021)?|access(ed)?|cdn|core|data|enter|get|go|index|mirror(ed)?|p2p|prox(ied|ies|y)|prx|to(r|rrents)?|unblock(ed)?|way|web)\.(to|com|org|is)\/(torrents\.php.*|catalog\/.*|s\/.*|tv\/.*|top10)$/
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.25.0/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.28/moment-timezone-with-data-10-year-range.min.js
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==

'use strict';
/* global moment */


// Based on the timestamp on the footer of each RARBG page --> "Sat, 01 May 2020 20:14:56 +0200", the script takes that the server time is GMT+2 and that it doesn't take DST.
// Otherwise, when it's e.g.                               --> "Mon, 08 Nov 2021 21:26:11 +0100",         it takes that the server time is GMT+1 and that it doesn't take DST.
// Also, the script uses the 'moment-timezone' library as it takes DST offsets into account when converting the timestamps to user/local timezone.

/*
// This is no typo:
// const serverTimezone = 'Etc/GMT+2';  	// -02:00	-02:00  (=no DST)
// const serverTimezone = 'Etc/GMT-2';  	// +02:00	+02:00  (=no DST)
const serverTimezone = 'Etc/GMT-1';  		// +01:00	+01:00  (=no DST)
*/
let serverTimezone;
$('div:contains("SUPPORT :")').contents().last().text().trim().slice(-5) === '+0200' ? serverTimezone = 'Etc/GMT-2' : serverTimezone = 'Etc/GMT-1';


const localTimezone = moment.tz.guess();    // In my case ----> +02:00	+03:00  (DST)

// const format = 'MM/DD/YYYY HH:mm:ss';
// const format = 'YYYY-MM-DD HH:mm:ss';
const format = 'YYYY-MM-DD HH:mm:ss';

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


function convertToLocalTimezone(timestamps) {
	for (let i = 0; i < timestamps.length; i++) {
		let initialTimestamp = timestamps[i].textContent;
		if (moment(initialTimestamp, format, true).isValid()) {		// As of moment.js v2.3.0, you may specify a boolean for the last argument to make Moment use strict parsing. Strict parsing requires that the format and input match exactly, including delimeters.
			let convertedToLocalTimezone = moment.tz(initialTimestamp, format, serverTimezone).tz(localTimezone);
			timestamps[i].textContent = convertedToLocalTimezone.fromNow();
			timestamps[i].title = convertedToLocalTimezone.format(format);
			// timestamps[i].title = convertedToLocalTimezone.toISOString();	// Display timestamps in tooltips in ISO 8601 format, combining date and time  (https://stackoverflow.com/questions/25725019/how-do-i-format-a-date-as-iso-8601-in-moment-js/)
			// timestamps[i].title = convertedToLocalTimezone.format();
		}
	}

	// recalculate the relative dates every 1 min
	(function(){
		for (let i = 0; i < timestamps.length; i++) {
			timestamps[i].textContent = moment(timestamps[i].title).fromNow();
		}
		// setTimeout(arguments.callee, 10 * 1000); 	// 10 * 1000 msec = 10 sec = 1/6 min
		setTimeout(arguments.callee, 60 * 1000); 	// 60 * 1000 msec = 1 min
	})();

}



// Per request: https://greasyfork.org/en/scripts/21550-rarbg-convert-torrent-timestamps-to-relative-format/discussions/91794
const isOnTV = window.location.href.includes('/tv/');  // example link: https://rarbgproxy.org/tv/tt1720601/

if (isOnTV) {

	// document.querySelectorAll('.tvshowClick').forEach((element) => {
	document.querySelectorAll('div[id^="episode_"]').forEach((element) => {
		element.addEventListener('click', function(){
			document.arrive('div[id^="tvcontent_"] .lista2t', function () {
				convertToLocalTimezone(document.querySelectorAll('td[width="150px"]'));
			});
		});
	});

} else {

	// const timestamps = document.querySelectorAll('tr.lista2 td:nth-child(3)');
	const timestamps = document.querySelectorAll('td[width="150px"]');
	convertToLocalTimezone(timestamps);

}
