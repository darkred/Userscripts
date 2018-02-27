// ==UserScript==
// @name        Instagram - visible images counter
// @namespace   darkred
// @license     MIT
// @description Shows (in instagram profile pages) how many images out of total (as a number and as a percentage) are currently visible, as you scroll down the page
// @version     2018.2.27
// @include     https://www.instagram.com/*
// @grant       none
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// ==/UserScript==


var stylesheet =
`<style>
.counter {
		color: #D9D9D9 !important;
}
</style>`;
$('head').append(stylesheet);


// If you scroll down, beyond the first 12 images, then the "LOAD MORE" button(to show more images) will be automatically clicked
$(window).scroll(function() {
	if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
		var element = $(`a:contains('Load more')`)[0];
		element.click();
	}
});


var hrefs = [];
var total;

function showCounter() {

	var totalString = $(`span:contains('posts'):last-child > span`).html();	// The 'total' value (it's a string)
	// var total = totalString.replace(',', ''); 	// strip the thousand comma seperator
	total = totalString.replace(',', ''); 	// strip the thousand comma seperator


	// var visibleCount = document.querySelectorAll( `a[href*='taken-by']` ).length;
	var hrefselems = document.querySelectorAll( `a[href*='taken-by']` );
	$.each(hrefselems, function(index, value) {
		// hrefs.indexOf(String(value)) === -1 ? hrefs.push(String(value)) : console.log("This item already exists"); // https://stackoverflow.com/a/36683363
		if (hrefs.indexOf(String(value)) === -1){	// hrefs.count -below- serves as a counter for the newly added displayed images (on each infinite scrolling event)
			hrefs.push(String(value));
		}
	});

	var visibleCount = hrefs.length;

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
	div.className = 'counter';
}



function observer(){

	/// ---------------------------------
	/// mutation observer -monitors the Posts grid for infinite scrolling event-.
	/// ---------------------------------
	observer1 = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (div.innerHTML.indexOf(total + ' / ' + total) === -1){
				div.innerHTML = showCounter(); 						// On each infinite scrolling event, re-calculate counter
			}
		});
	// }).observe($('article').children().eq(1).children()[0], 	// target of the observer
	}).observe(document.querySelector('._havey'), 	// target of the observer: the "pics" area element, with rows that contain 3 pics each (watching for 'row' element additions)
		{
			attributes: true,
			// childList: true,
			// characterData: true,
			// subtree: true,
		}); // config of the observer

}






var div = document.createElement('div');	// global variable
var observer1;                              // global variable


if (document.URL !== 'https://www.instagram.com/' &&
	document.URL.indexOf('https://www.instagram.com/p/') === -1 ){


	if ( document.querySelector('._l8yre._qdmzb') ) {
		createDiv();
		observer();
	} else {
		$(document).arrive('._l8yre._qdmzb', function() {		// the avatar in the profile page
			createDiv();
			observer();
		});
	}
}


$(document).leave('._l8yre._qdmzb', function() {
	if (!document.querySelector('._l8yre._qdmzb')) {
		div.remove();
		observer1.disconnect();
	}
});
