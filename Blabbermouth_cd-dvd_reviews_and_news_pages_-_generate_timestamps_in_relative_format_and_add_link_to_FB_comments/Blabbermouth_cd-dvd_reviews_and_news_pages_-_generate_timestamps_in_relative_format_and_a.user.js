// ==UserScript==
// @name        Blabbermouth cd/dvd reviews and news pages - generate timestamps in relative format and add link to the FB comments area
// @namespace   http://tampermonkey.net/
// @version     1
// @description Generates timestamps in relative format in cd/dvd reviews pages and news pages and adds link to the FB comments area.
// @author      darkred
// @license     MIT
// @match       https://www.blabbermouth.net/news
// @match       https://www.blabbermouth.net/news/*
// @match       https://www.blabbermouth.net/cdreviews/*
// @match       https://www.blabbermouth.net/dvdreviews/*
// @match       https://www.facebook.com/plugins/feedback.php*
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.6/moment-timezone-with-data-2010-2020.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.6/jstz.min.js
// ==/UserScript==


/* global jstz, moment */
'use strict';


// Customize the strings in the locale to display "1 minute ago" instead of "a minute ago" (https://github.com/moment/moment/issues/3764#issuecomment-279928245)
moment.updateLocale('en', {
	relativeTime: {
		future: 'in %s',
		past: '%s ago',
		s: 'seconds',
		m: '1 minute',
		mm: '%d minutes',
		h: '1 hour',
		hh: '%d hours',
		d: '1 day',
		dd: '%d days',
		M: '1 month',
		MM: '%d months',
		y: '1 year',
		yy: '%d years'
	}
});

function convertToLocalTimezone(timestamp) {
	const localTimezone = jstz.determine().name();
	const serverTimezone = 'Europe/Berlin'; // GMT+1

	let initialTimestamp = timestamp;
	let convertedToLocalTimezone = moment
		.tz(initialTimestamp, serverTimezone)
		.tz(localTimezone);
	publishedTimeLTZ = convertedToLocalTimezone.fromNow();
	let format = 'YYYY-MM-DD HH:mm:ss';
	publishedTimeLTZtitle = convertedToLocalTimezone.format(format);
}

function recalc(timestamp, format, notitle) {
	// repeat every 1 minute
	setInterval(function() {
		if (
			timestamp &&
			moment(
				timestamp.title,
				format,
				true
			).isValid()
		) {
			timestamp.textContent = moment(timestamp.title).fromNow();
		} else if (notitle === true) {
			timestamp.innerText = moment(timestamp.innerText.trim()).fromNow();
		}
	}, 1 * 60 * 1000);
}








// if (window.top === window.self) return;
// console.log ('Script start...');

// Example for 'diff'
// var a = moment([2007, 0, 29]);
// var b = moment([2007, 0, 28]);
// a.diff(b, 'days') // 1

if (window.location.href === 'https://www.blabbermouth.net'
	|| window.location.href === ('https://www.blabbermouth.net/news')
	|| window.location.href === ('https://www.blabbermouth.net/news/')
	|| window.location.href.startsWith('https://www.blabbermouth.net/news/page')) {
	var allTimestamps = document.querySelectorAll('.date-time');
	// February 22, 2020
	allTimestamps.forEach(function(item) {
		var initial = item.innerText.trim();
		var now = moment();
		// diff() - The supported measurements are: years, months, weeks, days
		var interval = now.diff(moment(item.innerText.trim()), 'days');
		if (interval === 0) {
			item.innerText = 'Today';
		} else if (interval < 7){
			item.innerText = interval + ' days ago';
		} else if (interval < 30) {
			item.innerText = now.diff(moment(item.innerText.trim()), 'weeks') + ' weeks ago';
		} else if  (interval < 365) {
			item.innerText = now.diff(moment(item.innerText.trim()), 'months') + ' months ago';
		} else {
			item.innerText = now.diff(moment(item.innerText.trim()), 'years') + ' years ago';
		}
		if (interval === 1 || interval === 7 || interval === 30 || interval === 365 ){
			item.innerText = item.innerText.replace('s ', ' ');
		}
		item.title = initial;
		recalc(item, 'MMMM DD, YYYY', true);
	});

} else  if (
	window.location.href.includes('blabbermouth.net/news/')
) {

	// if there's a timestamp inside the page
	if (
		document.querySelector('meta[property="article:published_time"]') !==
		null
	) {
		var publishedTimestamp = document.querySelector(
			'meta[property="article:published_time"]'
		).content;
	}


	console.log(publishedTimestamp);

	var publishedTimeLTZ, publishedTimeLTZtitle;

	convertToLocalTimezone(publishedTimestamp);

	document.querySelector('.date-time').textContent = publishedTimeLTZ;
	document.querySelector('.date-time').title = publishedTimeLTZtitle;
} else if (
	window.location.href.includes('blabbermouth.net/cdreviews') ||
	window.location.href.includes('blabbermouth.net/dvdreviews')
) {
	if (/blabbermouth\.net/i.test(location.host)) {
		console.log('Userscript is in the MAIN page.');

		// 2019-10-17T15:32:18.000Z
		if (
			document.querySelector(
				'meta[property="article:published_time"]'
			) !== null
		) {
			publishedTimestamp = document.querySelector(
				'meta[property="article:published_time"]'
			).content;
		}

		console.log(publishedTimestamp);

		var currentURL = window.location.href;

		convertToLocalTimezone(publishedTimestamp);

		var commentcount = '';

		var HTML = `
<p class="byline-single vcard">
<span class="date-time">
${publishedTimeLTZ}
</span>
<span class="date-comments">
<a data-permalink="
${currentURL}
" href="#comments">
${commentcount}
</a>
<a href="#comments">
Comments
</a>
</span>
</p>
`;

		if (document.querySelector('.entry-content') !== null) {
			document
				.querySelector('.entry-content')
				.insertAdjacentHTML('beforebegin', HTML);
			document.querySelector('.date-time').title = publishedTimeLTZtitle;

			let newDateTimeElement = document.querySelector('.date-time');
			recalc(newDateTimeElement, 'YYYY-MM-DD HH:mm:ss');
		}

		// Wait fof messages (from iframe)
		window.addEventListener(
			'message',
			function addFbCounter(e) {
				if (e.data.indexOf(' Comment') !== -1) {
					document.querySelector(
						'#main > article > p > span.date-comments > a:nth-child(2)'
					).innerText =
						e.data;
					window.removeEventListener('message', addFbCounter);
				}
			},
			false
		);
		console.log('Waiting for Message 1, from iframe...');
	}
} else if (window.location.href.includes('facebook.com')) {
	console.log('Userscript is in the FRAMED page.');

	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (!mutation.addedNodes) return;

			for (var i = 0; i < mutation.addedNodes.length; i++) {
				var selector = '._50f7';
				if (document.body.contains(document.querySelector(selector))) {
					observer.disconnect();
					// Send message from iframe
					window.top.postMessage (document.querySelector(selector).innerText, '*');
				}
			}
		});
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
}
