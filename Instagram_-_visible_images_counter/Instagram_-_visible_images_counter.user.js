// ==UserScript==
// @name        Instagram - visible images counter
// @namespace   darkred
// @description Shows (in instagram profile pages) how many images out of total (as a number and as a percentage) are currently visible, as you scroll down the page
// @include     https://www.instagram.com/*
// @version     2016.08.02
// @grant       none
// @require     https://code.jquery.com/jquery-3.0.0.min.js
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js?version=139586
// ==/UserScript==

/* eslint-env jquery */
/* eslint-disable quotes */


// If you scroll down, beyond the first 12 images, then the "LOAD MORE" button(to show more images) will be automatically clicked
$(window).scroll(function() {
	if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
		var element = $("a:contains('Load more')")[0];
		element.click();
	}
});



function showCounter() {
	var visibleCount = $( "a[href*='taken-by']" ).length; 	// Count of visible images
	var totalString = $("span:contains('posts')").eq(1).children().eq(0).html(); 	// The 'total' value (it's a string)
	var total = totalString.replace(/(\d+),(?=\d{3}(\D|$))/g, '$1'); 	// Apply regex to 'total' string to strip the thousand comma seperator
	if (visibleCount > total){
		visibleCount = total;
	}
	var visiblePercent = ((visibleCount / total) * 100).toFixed(1); // Visible images as percentage
	var counter = visibleCount + ' / ' + totalString + ' that is ' + visiblePercent + '%';
	return counter;
}




function createDiv(){
	// Creation of the counter element
	document.body.appendChild(div);
	div.innerHTML = showCounter(); 		// Initial display of the counter
	div.style.top = '1px';
	div.style.right = '1px';
	div.style.position = 'fixed';
}



function observer(){

	/// ---------------------------------
	/// mutation observer -monitors the Posts grid for infinite scrolling event-.
	/// ---------------------------------
	observer1 = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			div.innerHTML = showCounter(); 						// In each infinite scrolling event, re-calculate counter
		});
	}).observe($('article').children().eq(1).children()[0], 	// target of the observer
		{
			// attributes: true,
			childList: true,
			// characterData: true,
		}); // config of the observer

}






var div = document.createElement('div');	// global variable
var observer1;                              // global variable

if (document.URL !== 'https://www.instagram.com/' &&
	document.URL.indexOf('https://www.instagram.com/p/') === -1 ){
	createDiv();
	observer();
}



$(document).arrive('article ._5axto', function() {		// 'article .5axto'
	createDiv();
	observer();
});



$(document).leave('article ._5axto', function() {
	div.remove();
	observer1.disconnect();
});
