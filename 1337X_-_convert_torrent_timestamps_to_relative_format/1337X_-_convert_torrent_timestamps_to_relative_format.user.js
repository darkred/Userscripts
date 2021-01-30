// ==UserScript==
// @name        1337X - convert torrent timestamps to relative format
// @namespace   darkred
// @version     2021.1.30
// @description Converts torrent upload timestamps to relative format
// @author      darkred
// @license     MIT
// @include     /^https?://1337x\.to/(home|search|sort-search|trending|cat|top-100).*$/
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.31/moment-timezone-with-data-10-year-range.min.js
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==

'use strict';
/* global moment */





// 11:59am         ---> h:hha
// 10am Oct. 30th  ---> haA MMM. Do
// 11pm Nov. 4th
// Oct. 31st '20



// Based on the timestamp on the footer of each RARBG page --> "Sat, 01 May 2020 20:14:56 +0200",
// the script takes that the server time is GMT+2 and that it doesn't take DST.
// Also, the script uses the 'moment-timezone' library as it takes DST offsets into account when converting the timestamps to user/local timezone.

// This is no typo:
// const serverTimezone = 'Etc/GMT+2';  	// -02:00	-02:00  (=no DST)
// const serverTimezone = 'Etc/GMT-2';  		// +02:00	+02:00  (=no DST)

const serverTimezone = 'Etc/GMT-1';

const localTimezone = moment.tz.guess();    // In my case ----> +02:00	+03:00  (DST)

// const format = 'MM/DD/YYYY HH:mm:ss';
// const format = 'YYYY-MM-DD HH:mm:ss';
moment.locale('en');
const format = ['h:mma', 'ha MMM. Do', 'MMM. Do \'YY'];

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

			// TODO
			// timestamps[i].title = convertedToLocalTimezone.format(format);   // <-- not working because you use MULTIPLE FORMATS !!
			// timestamps[i].title = convertedToLocalTimezone.format(format[0]) || convertedToLocalTimezone.format(format[1]) || convertedToLocalTimezone.format(format[2]) ;   // <-- not working because you use MULTIPLE FORMATS !!
			timestamps[i].title = initialTimestamp;
			// timestamps[i].title = convertedToLocalTimezone.toISOString();	// Display timestamps in tooltips in ISO 8601 format, combining date and time  (https://stackoverflow.com/questions/25725019/how-do-i-format-a-date-as-iso-8601-in-moment-js/)
			// timestamps[i].title = convertedToLocalTimezone.format();
		}
	}

	// TODO
	/*
	// recalculate the relative times every 10 sec
	(function(){
		for (let i = 0; i < timestamps.length; i++) {
			timestamps[i].textContent = moment(timestamps[i].title).fromNow();
		}
		setTimeout(arguments.callee, 1 * 60 * 1000);
	})();
	*/

}

// const timestamps = document.querySelectorAll('tr.lista2 td:nth-child(3)');
const timestamps = document.querySelectorAll('tbody .coll-date');
convertToLocalTimezone(timestamps);
