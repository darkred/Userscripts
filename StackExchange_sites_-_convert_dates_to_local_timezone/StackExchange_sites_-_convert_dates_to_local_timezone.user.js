// ==UserScript==
// @name        StackExchange sites - convert dates to local timezone
// @namespace   darkred
// @license     MIT
// @description Converts dates to your local timezone
// @version     2016.10.16
// @match       *://*.stackoverflow.com/*
// @match       *://*.stackexchange.com/*
// @match       *://*.superuser.com/*
// @match       *://*.stackapps.com/*
// @match       *://*.askubuntu.com/*
// @match       *://*.mathoverflow.net/*
// @match       *://*.serverfault.com/*
// @grant       none
// @require     http://momentjs.com/downloads/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.6/moment-timezone-with-data-2010-2020.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.6/jstz.min.js
// ==/UserScript==


/* global jstz, moment */


var localTimezone = jstz.determine().name();
var serverTimezone = 'Europe/Berlin';		// GMT+1


function convertDates() {
	var dates = document.getElementsByClassName('relativetime');
	var temp;
	for (var i = 0; i < dates.length; i++) {
		temp = moment(dates[i].title, 'YYYY-MM-DD HH:mm:ssZ', true);
		if (temp.isValid()) {
			dates[i].title = moment.tz(dates[i].title, serverTimezone).tz(localTimezone);
		}
	}
}


convertDates();

var target = document.querySelector('#question-mini-list'),
	observer = new MutationObserver(function (mutations) {
		convertDates();
	}),
	config = {
		characterData: true,
		subtree: true
	};
observer.observe(target, config);
