// ==UserScript==
// @name        Instagram - visible images counter
// @namespace   darkred
// @version     2021.12.13
// @description Shows in instagram profile pages how many images out of total (as a number and as a percentage) are currently visible, as you scroll down the page.
// @author      darkred
// @license     MIT
// @include     https://www.instagram.com/*
// @grant       none
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==


var stylesheet =
`<style>
	.counter {
		color: #D9D9D9 !important;
	}
</style>`;
$('head').append(stylesheet);


// Not needed anymore
/*
// If you scroll down, beyond the first 12 images, then the "LOAD MORE" button(to show more images) will be automatically clicked
$(window).scroll(function() {
	if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
		var element = $(`a:contains('Load more')`)[0];
		element.click();
	}
});
*/

var hrefselems = [];
var hrefs = [];
var total;

function showCounter() {

	// var totalString = $(`span:contains('posts'):last-child > span, .g47SY`).html(); 																	// The 'total' value (it's a string). The ".g47SY" selector is for localized pages, e.g. https://www.instagram.com/instagram/?hl=de
	var totalString = document.querySelector(`#react-root > div > div > section > main > div > header > section > ul > li:nth-child(1) > span > span,
											  #react-root > div > div > section > main > div > header > section > ul > li:nth-child(1) >   a  > span`).textContent; // The 'total' value (it's a string). The ".g47SY" selector is for localized pages, e.g. https://www.instagram.com/instagram/?hl=de
	total = totalString.replace(',', '').replace('.', ''); // strip the thousand comma/dot seperator


	// hrefselems = document.querySelectorAll(`a[href*='taken-by']`);
	hrefselems = document.querySelectorAll(`.v1Nh3.kIKUG._bz0w > a`);
	$.each(hrefselems, function(index, value) {
		// hrefs.indexOf(String(value)) === -1 ? hrefs.push(String(value)) : console.log("This item already exists"); // https://stackoverflow.com/a/36683363
		if (hrefs.indexOf(String(value)) === -1) { 		// hrefs.count -below- serves as a counter for the newly added displayed images (on each infinite scrolling event)
			hrefs.push(String(value));
		}
	});

	var visibleCount = hrefs.length;

	var visiblePercent = ((visibleCount / total) * 100).toFixed(1); // Visible images count as percentage
	if (isNaN(visiblePercent)) {
		visiblePercent = 0 ;  // avoid NaN
	}

	var counter = visibleCount + ' / ' + totalString + ' that is ' + visiblePercent + '%';
	return counter;

}




function createDiv() {
	// Creation of the counter element
	document.body.appendChild(div);
	div.innerHTML = showCounter(); 	// Initial display of the counter
	div.style.top = '1px';
	div.style.right = '1px';
	div.style.position = 'fixed';
	div.className = 'counter';
}



function createObserver() {

	// var thePics = document.querySelector('div[style="flex-direction: column; padding-bottom: 0px; padding-top: 0px;"]');
	var thePics = document.querySelector('div[style^="flex-direction: column;"], div[style|="padding-top: 0px;"]');  // the "pics" area element, with rows that contain 3 pics each (watching for 'row' element additions)   --> https://stackoverflow.com/a/5110337  ("wildcard * in CSS") starting (^=) with x and ending (|=) with y
	if (!thePics){
		return;
	}

	hrefselems.length = 0;  // empty the array (see https://stackoverflow.com/a/1232046, method #2)
	hrefs.length = 0;
	/// ---------------------------------
	/// mutation observer -monitors the Posts grid for infinite scrolling event-.
	/// ---------------------------------
	observer = new MutationObserver(function() {  // --> Callback function to execute when mutations are observed
		if (div.innerHTML.indexOf(total + ' / ' + total) === -1) {
			div.innerHTML = showCounter(); 	// On each infinite scrolling event, re-calculate counter
		}
	// }).observe(document.querySelector('._havey'), 	// target of the observer: the "pics" area element, with rows that contain 3 pics each (watching for 'row' element additions)
	// }).observe(document.querySelector('div[style="flex-direction: column; padding-bottom: 0px; padding-top: 0px;"]'), 	// target of the observer: the "pics" area element, with rows that contain 3 pics each (watching for 'row' element additions)
	});

	observer.observe(thePics, 	// target of the observer
		{	// attributes: true,
			childList: true,
			// characterData: true,
			// subtree: true,
		}); // config of the observer

}






var div = document.createElement('div');
var observer;

// var avatarSelector = 'span[style="width: 152px; height: 152px;"]';   // the profile's photo/avatar element
// var avatarSelector = '._mainc';                                      // the profile's bio area element
// var avatarSelector = 'h1.notranslate';                               // the profile name element
// var avatarSelector = 'h1.rhpdm';                                  // the profile name element
// var avatarSelector = 'span.-nal3';                                  // the 'posts' count element, e.g.  683 posts
// var avatarSelector = 'ul.k9GMp';                                  // the profile's 3 counters container element
var avatarSelector = '.eC4Dz';                                  // the profile's username container element
// var avatarSelector = 'main > article > header > section > div._ienqf > div > button';                                  // the 3-dots icon
// var avatarSelector = 'div[style="flex-direction: column; padding-bottom: 0px; padding-top: 0px;"]';                                  // the 3-dots icon




if (document.querySelector(avatarSelector) ) {
	if (!document.querySelector('.counter')){
		createDiv();
		createObserver();
	}
} else {
	console.log('ERROR: Cannot create the Counter element, the avatarSelector element ( ' + avatarSelector + ' ) doesn\'t exist !!');
}


document.arrive(avatarSelector, function() { // the avatar in the profile page
	createDiv();
	createObserver();
	// alert()
});



function removeCounter(){
	div.remove();
	hrefselems.length = 0;  // empty the array (see https://stackoverflow.com/a/1232046, method #2)
	hrefs.length = 0;
	total = '';
	observer.disconnect();
	// if (observer) {
	// 	observer.disconnect();
	// }
}


document.leave(avatarSelector, function() {
	if (!document.querySelector(avatarSelector)){
		removeCounter();
	}
});


// when navigating using the browser's back/forth
window.addEventListener('popstate', function (event) {
	// alert()
	removeCounter();
	console.log('COUNTER IS REMOVED');

	// TODO
	// createDiv();
	// createObserver();

});


// when navigating from a profile to another via searchbox // history API)
// https://stackoverflow.com/questions/56760727/how-to-observe-a-change-in-the-url-using-javascript
(function(){
	var rs = history.pushState;
	history.pushState = function(state, title, url){
		if ( !url.includes('/following/') && !url.includes('/followers/') && !url.includes('/p/') && !url.includes('/direct/') ){   // avoid all possible in-page/popup "pages" (a profile's following/followers, and posts -opened by clicking on a thumb-)
			rs.apply(history, arguments); // preserve normal functionality
			console.log('navigating', arguments); // do something extra here; raise an event
			removeCounter();
			// alert()
		}
	};
}());

