// ==UserScript==
// @name        Twitter - add unread notifications count in the tab title
// @namespace 	darkred
// @author      darkred
// @description Adds unread notifications count in the tab title
// @include     https://twitter.com/*
// @version     2016.08.07
// @grant       none
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js?version=139586
// ==/UserScript==

var counter;

function addCounterInTitle() {
	counter = parseInt(document.querySelector('.count-inner').innerHTML);
	if (counter > 0 && document.title.indexOf('|') === - 1) {
		document.title = counter + ' | ' + document.title;
	} else if (counter === 0) {
		document.title = /[0-9]*\\|(.*)/g.exec(document.title) [1];
	}
}



// After the 'Notifications' counter is first visible in the page (= the selector below is for the element: 'the 1st avatar thumbnail in the "Who to follow" panel')
document.arrive('div.js-account-summary:nth-child(1) > div:nth-child(2) > a:nth-child(1) > img:nth-child(1)', function () {
	addCounterInTitle();
});



// Whenever there are new unread tweets in the timeline...
document.arrive('.new-tweets-bar', function () {
	var target = document.querySelector('.new-tweets-bar'); // ... οbserve the unread counter for changes(increase) ...
	var observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			addCounterInTitle(); // ... and refresh the counter on every such change
		});
	});
	var config = {
		childList: true,
	};
	observer.observe(target, config);
});



// Refresh the counter when there are no unread tweets
document.leave('.new-tweets-bar', function () {
	addCounterInTitle();
});



// Whenever viewing the 'Notifications' tab  ('the '.toggle-item-4' is the selector for the 'People you follow' link in the 'Notifications' tab)...
document.arrive('.toggle-item-4', function () {
	document.querySelector('.count-inner').innerHTML = 0;				// ... reset the counter
	document.title = /[0-9]*\\|(.*)/g.exec(document.title) [1];		// ... and the tab title
});



// Observe the 'Notifications' counter for changes
var target2 = document.querySelector('.count-inner');
// var target2 = document.querySelector('.count');
var observer2 = new MutationObserver(function (mutations) {
	mutations.forEach(function (mutation) {
		addCounterInTitle();
	});
});
var config2 = {
	childList: true,
};
observer2.observe(target2, config2);
