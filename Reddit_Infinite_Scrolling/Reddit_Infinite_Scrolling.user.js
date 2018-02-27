// ==UserScript==
// @name        Reddit Infinite Scrolling
// @namespace   darkred
// @author      darkred
// @license     MIT
// @description Adds infinite scrolling to subreddits and to comments.
// @version     2018.2.27
// @include     https://www.reddit.com/*
// @grant       unsafeWindow
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @require     https://greasyfork.org/scripts/11636-jscroll/code/jScroll.js
// ==/UserScript==

// Jscroll code
$('#siteTable').jscroll({
	nextSelector: 'span.nextprev a:last',
	contentSelector: '#siteTable .thing, .nav-buttons',
	callback: function() {
		$('.nav-buttons').remove();
	}
});


//if current URL contains the string 'comments', then click the 'more comments' button when scrolling at the end of the page
if (/(.*comments.*)/.test(document.location)) {
	$(window).scroll(function() {
		if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
			// console.log('bottom!');
			var element = unsafeWindow.document.getElementsByClassName('morecomments');
			var last = element.length;
			element[last - 1].firstChild.click();
		}
	});
}