// ==UserScript==
// @name        Blabbermouth - generate timestamps and add link to the fb comments area
// @namespace   darkred
// @version     1.0.2
// @description (blabbermouth cd/dvd reviews and news pages) generates the missing timestamps or converts the existing ones in relative format, and adds link to the fb comments area
// @author      darkred
// @license     MIT
// @include     https://www.blabbermouth.net/
// @include     https://www.blabbermouth.net/news*
// @include     https://www.blabbermouth.net/cdreviews*
// @include     https://www.blabbermouth.net/dvdreviews*
// @include     https://www.facebook.com/plugins/feedback.php*
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// ==/UserScript==


/* global moment */
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
	// (the timestamp is in ISO 8601 format and its trailing Z means that it's in UTC )
	// 2020-03-05T15:40:38.000Z
	let initialTimestamp = timestamp;
	if (moment(initialTimestamp, moment.ISO_8601, true).isValid()) {
		// let convertedToLocalTimezone = moment(initialTimestamp.replace('Z','')  + '-05:00', 'YYYY-MM-DDTHH:mm:ssZ');		// The server's timezone is GMT-5
		let convertedToLocalTimezone = moment(initialTimestamp.replace('Z','')  + '-04:54', 'YYYY-MM-DDTHH:mm:ssZ');		// The server's timezone is GMT-5 (6 min less, according to the relevant post timestamps in both https://www.facebook.com/Blabbermouth.net and https://twitter.com/BLABBERMOUTHNET
		publishedTimeLTZ = convertedToLocalTimezone.fromNow();
		let format = 'YYYY-MM-DD HH:mm:ss';
		publishedTimeLTZtitle = convertedToLocalTimezone.format(format);
	}
}

function recalc(timestamp, format, notitle) {
	// repeat every 1 minute
	setInterval(function() {
		if (timestamp && moment(timestamp.title, format, true).isValid()) {
			timestamp.textContent = moment(timestamp.title).fromNow();
		} else if (notitle === true) {
			timestamp.innerText = moment(timestamp.innerText.trim()).fromNow();
		}
	}, 1 * 60 * 1000);
}


if (
	window.location.href === 'https://www.blabbermouth.net/' ||
	window.location.href === 'https://www.blabbermouth.net/news' ||
	window.location.href.startsWith('https://www.blabbermouth.net/news/page')
) {
	var allTimestamps = document.querySelectorAll('.date-time');
	// February 22, 2020
	allTimestamps.forEach(function(item) {
		var initial = item.innerText.trim();
		var now = moment();
		// diff() - The supported measurements are: years, months, weeks, days
		var interval = now.diff(moment(item.innerText.trim()), 'days');
		if (interval === 0) {
			item.innerText = 'Today';
		} else if (interval < 7) {
			item.innerText = interval + ' days ago';
		} else if (interval < 30) {
			item.innerText =
				now.diff(moment(item.innerText.trim()), 'weeks') + ' weeks ago';
		} else if (interval < 365) {
			item.innerText =
				now.diff(moment(item.innerText.trim()), 'months') +
				' months ago';
		} else {
			item.innerText =
				now.diff(moment(item.innerText.trim()), 'years') + ' years ago';
		}
		if (
			interval === 1 ||
			interval === 7 ||
			interval === 30 ||
			interval === 365
		) {
			item.innerText = item.innerText.replace('s ', ' ');
		}
		item.title = initial;
	});
} else if (window.location.href.includes('blabbermouth.net/news/')) {
	if (
		document.querySelector('meta[property="article:published_time"]') !==
		null
	) {
		var publishedTimestamp = document.querySelector(
			'meta[property="article:published_time"]'
		).content;
	}


	console.log('publishedTimestamp: ' + publishedTimestamp);

	var publishedTimeLTZ, publishedTimeLTZtitle;

	convertToLocalTimezone(publishedTimestamp);

	document.querySelector('.date-time').textContent = publishedTimeLTZ;
	document.querySelector('.date-time').title = publishedTimeLTZtitle;
} else if (
	(window.location.href.includes('blabbermouth.net/cdreviews/') ||
	window.location.href.includes('blabbermouth.net/dvdreviews/')) &&
	!window.location.href.includes('/page/')
) {
	//--- Double-check that this iframe is on the expected domain:
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
<span class="date-time">${publishedTimeLTZ}</span>
<span class="date-comments">
<a data-permalink="${currentURL}" href="#comments">${commentcount}</a>
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
				// something from an unknown domain, or doesn't contain the string "Comment" let's ignore it
				if (e.origin !== 'https://www.facebook.com' || e.data.indexOf(' Comment') === -1) {
					return;
				}
				console.log('Received message: ' + e.data);
				document.querySelector(
					'#main > article > p > span.date-comments > a:nth-child(1)'
				).innerText = e.data.replace(/ Comments?/i,'');
				window.removeEventListener('message', addFbCounter);
			},
			false
		);
		console.log('Waiting for Message 1, from iframe...');
	}
}  else if (window.location.href.includes('facebook.com')) {

	console.log('Userscript is in the FRAMED page.');

	var selector = '._50f7';
	window.parent.postMessage(
		document.querySelector(selector).innerText,
		'https://www.blabbermouth.net/cdreviews/'
	);
}
