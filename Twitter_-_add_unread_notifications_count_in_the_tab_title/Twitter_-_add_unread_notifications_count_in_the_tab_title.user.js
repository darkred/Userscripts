// ==UserScript==
// @name        Twitter - add unread notifications count in the tab title
// @namespace   darkred
// @version     2018.2.27
// @description Adds unread notifications count in the tab title
// @author      darkred
// @license     MIT
// @include     https://twitter.com/*
// @grant       none
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==



// .count > .count-inner
// Notifications counter

// .dm-new > .count-inner
// DM counter


var notificationsCounter;

function addCounterInTitle() {
	// alert(0);
	// counter = parseInt(document.querySelector('.count-inner').innerHTML);									// the Notifications counter value
	notificationsCounter = parseInt(document.querySelector('.count > .count-inner').innerHTML);					// the Notifications counter value
	// if (counter > 0 && document.title.indexOf('|') > 3) {		// if the '|' symbol is the default separator of username and 'Twitter' when viewing profiles, e.g.:  Twitter Support (@Support) | Twitter. In here the position of `|` is 27.
	if (notificationsCounter > 0) {		// if the '|' symbol is the default separator of username and 'Twitter' when viewing profiles, e.g.:  Twitter Support (@Support) | Twitter. In here the position of `|` is 27.
		if (/[0-9]+\ \|\ .*/.test(document.title)){			// if our counter is already added to title
			var defaultTitle = document.title.match(/[0-9]+\ \|\ (.*)/)[1];
			document.title = notificationsCounter + ' | ' + defaultTitle;
			return;
		} else {
			document.title = notificationsCounter + ' | ' + document.title;				// add the counter to the title
			return;
		}
	} else if (notificationsCounter === 0) {
		document.title = /[0-9]+\ \|\ (.*)/g.exec(document.title)[1];		// remove title's added counter
	}
}



// After the 'Notifications' counter is first visible in the page (= the selector below is for the element: 'the 1st avatar thumbnail in the "Who to follow" panel')
document.arrive('div.js-account-summary:nth-child(1) > div:nth-child(2) > a:nth-child(1) > img:nth-child(1)', function () {
	addCounterInTitle();
});



// Whenever there are new unread tweets in the timeline..
document.arrive('.new-tweets-bar', function () {
	var target = document.querySelector('.new-tweets-bar'); // ..οbserve the unread counter for changes(increase)
	var observer = new MutationObserver(function (mutations) {
		addCounterInTitle(); 							// Refresh the counter on every such change
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



// Whenever viewing the 'Notifications' tab
document.arrive('.NotificationsHeadingContent', function () {
	// document.querySelector('.count-inner').innerHTML = 0;			// ..reset the counter..
	document.querySelector('.count > .count-inner').innerHTML = 0;			// ..reset the counter..
	notificationsCounter = 0;
	document.title = document.title.match(/[0-9]+\ \|\ (.*)/)[1];	// ..and the tab title
});



// Observe the 'Notifications' counter for changes
var target2 = document.querySelector('.count-inner');
var observer2 = new MutationObserver(function (mutations) {
	addCounterInTitle();
});
var config2 = {
	childList: true,
};
observer2.observe(target2, config2);






function resetCounter(){
	// document.querySelector('.new-count').className = 'count';
	notificationsCounter = 0;
	document.querySelector('.count-inner').innerHTML = '';
	document.title = /[0-9]+\ \|\ (.*)/g.exec(document.title)[1];
}

/// A "click" event listener attached on the "Notifications" button:
// if the user clicks, rightclicks or middle-clicks the button, then reset the counter and the tab title.
var target3 = document.querySelector('.people');
target3.addEventListener('mousedown', resetCounter, false);
