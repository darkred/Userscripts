// ==UserScript==
// @name        Blabbermouth - generate timestamps and add link to the fb comments area
// @namespace   darkred
// @version     2.0
// @date        2022.5.14
// @description Generates missing timestamps or converts the existing ones in relative format, and adds link to the fb comments area
// @author      darkred
// @license     MIT
// @include     /^(https?:)?\/\/(www\.)?blabbermouth\.net\/(news|reviews)?/
// @exclude     /^(https?:)?\/\/(www\.)?blabbermouth\.net\/reviews(\/page|$)/
// @include     https://www.facebook.com/plugins/feedback.php*
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @supportURL  https://github.com/darkred/Userscripts/issues
// @icon        https://drnizx3otcofi.cloudfront.net/b64e6010-2ac1-4e95-b545-1a2994bbbd04/img/favicon/favicon-32x32.png
// ==/UserScript==


/* global moment */
/* eslint-disable no-console */

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
	// 2020-03-05T15:40:38.000Z    old
	// 2022-05-11T12:16:05+00:00   new
	let initialTimestamp = timestamp;
	if (moment(initialTimestamp, moment.ISO_8601, true).isValid()) {
		// let convertedToLocalTimezone = moment(initialTimestamp.replace('Z','')  + '-05:00', 'YYYY-MM-DDTHH:mm:ssZ');		// the server's timezone is GMT-5
		let convertedToLocalTimezone = moment(initialTimestamp + '-03:47', 'YYYY-MM-DDTHH:mm:ss+Z');		// the server's timezone is GMT-4 plus 13 min, in order to sync with the relevant post timestamps in both Facebook and Twitter(TW is 1 min later than FB) blabbbermouth pages
		publishedTimeLTZ = convertedToLocalTimezone.fromNow();
		let format = 'YYYY-MM-DD HH:mm:ss';
		publishedTimeLTZtitle = convertedToLocalTimezone.format(format);
	}
}

function recalc(existingTimestampElement, format, notitle) {
	setInterval(function() {
		if (existingTimestampElement && moment(existingTimestampElement.title, format, true).isValid()) {
			existingTimestampElement.textContent = moment(existingTimestampElement.title).fromNow();
		} else if (notitle === true) {
			existingTimestampElement.innerText = moment(existingTimestampElement.innerText.trim()).fromNow();
		}
	}, 1 * 60 * 1000);		// repeat every 1 minute
}


function onClick(){
	document.querySelector('iframe[title="fb:comments Facebook Social Plugin"]').scrollIntoView();
}


// 1. IF ON NEWS PAGES LISTINGS (convertTolocal + apply to pagination)
if (
	window.location.href.endsWith('blabbermouth.net/') ||
	window.location.href.endsWith('blabbermouth.net/news') ||
	window.location.href.includes('blabbermouth.net/news/page/')
) {

	let options = {
		root: null,
		rootMargin: '0px',
		threshold: 0
	};

	let callback = (entries) => {
		entries.forEach(entry => {

			if (!entry.target.classList.contains('done')){


				if (entry.isIntersecting && !entry.target.classList.contains('in-viewport') ) {
					entry.target.classList.add('in-viewport');

					const xhr = new XMLHttpRequest();
					const url = entry.target.parentElement.parentElement.firstElementChild.firstElementChild.href;
					xhr.open('GET', url, true);	// XMLHttpRequest.open(method, url, async)
					xhr.onload = function () {

						let container = document.implementation.createHTMLDocument().documentElement;
						container.innerHTML = xhr.responseText;

						let publishedTimestamp = container.querySelector('meta[property="article:published_time"]').content;

						convertToLocalTimezone(publishedTimestamp);

						entry.target.textContent = publishedTimeLTZ;
						entry.target.title = publishedTimeLTZtitle;

						entry.target.classList.add('done');

						recalc(entry.target, 'YYYY-MM-DD HH:mm:ss');
					};
					xhr.send();
				}
			}
		});
	};

	let observer = new IntersectionObserver(callback, options);

	let allTimestamps = document.querySelectorAll('.news-single span.date');
	allTimestamps.forEach((element) => {
		observer.observe(element);
	});


	// ----------------------------------------
	// Watch for pagination events (when new '.article' children are added inside the '.infinite_scroll' element)
	const targetNode2 = document.querySelector('.infinite-scroll-component');
	const config2 = { attributes: false, childList: true, subtree: false };

	const callback2 = function(mutationsList) {
		for(const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				let allTimestamps = document.querySelectorAll('.news-single span.date');
				allTimestamps.forEach((element) => {
					observer.observe(element);
				});
			}
		}
	};

	const observer2 = new MutationObserver(callback2);
	observer2.observe(targetNode2, config2);
	// ----------------------------------------


	// /blabbermouth\.net/\(reviews|news)/i.test(window.location.href)

// 2+3. ELSE IF ON CD/DVD REVIEWS OR NEWS PAGES ((convertTolocal + generate timestamp)
} else if ( /blabbermouth\.net\/(reviews|news)/i.test(window.location.href) &&
		!window.location.href.includes('/page/') ) {

	//--- Double-check that this iframe is on the expected domain:
	if (/blabbermouth\.net/i.test(location.host)) {
		console.log('Userscript is in the MAIN page.');

		// 2019-10-17T15:32:18.000Z


		let publishedTimestamp;
		if (document.querySelector('meta[property="article:published_time"]') !== null) {
			publishedTimestamp = document.querySelector('meta[property="article:published_time"]').content;
		}
		console.log('publishedTimestamp: ' + publishedTimestamp);



		if (window.location.href.includes('blabbermouth.net/news/')) {

			var publishedTimeLTZ, publishedTimeLTZtitle;

			convertToLocalTimezone(publishedTimestamp);

			let existingTimestampElement = document.querySelector('div > h1+span.date');

			existingTimestampElement.textContent = publishedTimeLTZ;
			existingTimestampElement.title = publishedTimeLTZtitle;

			recalc(existingTimestampElement, 'YYYY-MM-DD HH:mm:ss');

		}








		if (!window.location.href.includes('blabbermouth.net/news/page/')){

			convertToLocalTimezone(publishedTimestamp);

			var commentcount = '0';

			var datePart = !window.location.href.includes('blabbermouth.net/news/') ? `<span class="date">${publishedTimeLTZ}</span>` : '';

			var HTML = `
${datePart}
<div>
<span class="date">
<a href="javascript:void(0)" id="commentCount">${commentcount} Comments</a>
</span>
</div>
`;

			const refSelector = '.reviews-single-article > div > .reviews-rate-comments,div > h1+span.date';

			if (document.querySelector(refSelector) !== null) {
				document.querySelector(refSelector).insertAdjacentHTML('afterend', HTML);
				document.querySelector(refSelector).title = publishedTimeLTZtitle;

				document.getElementById('commentCount').addEventListener('click', onClick, false);

				let newDateTimeElement = document.querySelector('span.date');
				recalc(newDateTimeElement, 'YYYY-MM-DD HH:mm:ss');
			}

		}

		// Wait for messages [commentcount] (from iframe)
		window.addEventListener('message', function addFbCounter(e) {
			// something from an unknown domain, or doesn't contain the string "Comment" let's ignore it
			console.log('Received message: ' + e.data);
			if (e.origin !== 'https://www.facebook.com' || e.data.indexOf(' Comment') === -1) {
				return;
			}
			console.log('Received message: ' + e.data);
			// document.querySelector('#commentCount').innerText = e.data.replace(/ Comments?/i,'');
			document.querySelector('#commentCount').innerText = e.data;
			window.removeEventListener('message', addFbCounter);
		},
		false
		);
		console.log('Waiting for Message 1, from iframe...');
	}


// ELSE IF IT'S ON THE FACEBOOK COMMENTS IFRAME  (send fb comment count to main page)
}

if (window.location.href.includes('facebook.com')) {

	console.log('Userscript is in the FRAMED page.');

	const selector = '._50f7';
	// Send commentcount to MAIN page
	window.parent.postMessage(
		document.querySelector(selector).innerText,
		'https://blabbermouth.net/reviews/'
	);
}
