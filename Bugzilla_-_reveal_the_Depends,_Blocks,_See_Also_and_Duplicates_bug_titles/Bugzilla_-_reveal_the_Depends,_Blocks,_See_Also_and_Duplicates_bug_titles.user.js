// ==UserScript==
// @name        Bugzilla - reveal the Depends, Blocks, See Also and Duplicates bug titles
// @namespace   darkred
// @description Reveal the Depends, Blocks, See Also and Duplicates bug titles in bugzilla.mozilla.org via keyboard shortcuts
// @include     https://bugzilla.mozilla.org/show_bug.cgi?id=*
// @version     1.3
// @grant       none
// @require		https://code.jquery.com/jquery-3.1.1.min.js
// @require 	https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.2/jquery.scrollTo.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/keypress/2.1.3/keypress.min.js
// ==/UserScript==



// Case 1: when you press ` (in order to toggle Depends, BLocks and See Also)

var flag1 = 1;
var listener1 = new window.keypress.Listener();
var listener2 = new window.keypress.Listener();
var depends, blocks, combinedRefs, seeAlsoRefs, duplicatesRefs;

var combinedInners = [], seeAlsoInners = [], duplicatesInners = [];

listener1.simple_combo('`', function() {
	// console.log('You pressed `');

	depends = $('#dependson_input_area  ~ .bz_bug_link');
	blocks = $('#blocked_input_area ~ .bz_bug_link');
	combinedRefs = depends.add(blocks);

	seeAlsoRefs = $('.bug_urls > li > a');

	if (flag1 === 1) {
		flag1 = 0;

		$(window).scrollTo('#field_label_see_also');

		$.each(combinedRefs, function(index, val) {	combinedInners[index] = combinedRefs[index].innerHTML;});
		$.each(seeAlsoRefs, function(index, val) {	seeAlsoInners[index] = seeAlsoRefs[index].innerHTML; });

		$.each(combinedRefs, function(index, val) {
			combinedRefs[index].innerHTML = '(' + combinedRefs[index].innerHTML + ')  ' + combinedRefs[index].title;
			combinedRefs[index].outerHTML += '<br/>';
		});

		$.each(seeAlsoRefs, function(index, val) {
			seeAlsoRefs[index].innerHTML = '(' + seeAlsoRefs[index].innerHTML + ')  ' + seeAlsoRefs[index].title;
			combinedRefs[index].outerHTML += '<br/>';
		});


	} else {
		if (flag1 === 0) {
			flag1 = 1;

			$.each(combinedRefs, function(index, val) {	combinedRefs[index].innerHTML = combinedInners[index]; });

			var dependsNL = $('#dependson_input_area  ~ .bz_bug_link ~ br');
			var blocksNL = $('#blocked_input_area ~ .bz_bug_link  ~ br');

			var combinedNL = dependsNL.add(blocksNL);
			for (let m = (combinedNL.length) - 1; m >= 0; m -= 1) {
				combinedNL[m].remove();
			}

			$.each(seeAlsoRefs, function(index, val) {	seeAlsoRefs[index].innerHTML = seeAlsoInners[index]; });
		}
		// document.body.scrollTop = document.documentElement.scrollTop = 0;           // scroll to the top of the page
		// window.scrollTo(0, 0);
		// document.querySelector('html').scrollIntoView();
		$(window).scrollTo('#field_label_see_also');
	}
});


// =========================================================================


// Case 2: when you press ~ (in order to toggle Duplicates)

var flag2 = 1;

listener2.simple_combo('~', function() {
	// console.log('You pressed ~');

	duplicatesRefs = $('#duplicates > .bz_bug_link');

	if (flag2 === 1) {
		flag2 = 0;

		$(window).scrollTo('#duplicates');

		$.each(duplicatesRefs, function(index, val) {	duplicatesInners[index] = duplicatesRefs[index].innerHTML;});

		$.each(duplicatesRefs, function(index, val) {
			duplicatesRefs[index].innerHTML = '(' + duplicatesRefs[index].innerHTML + ')  ' + duplicatesRefs[index].title;
			duplicatesRefs[index].outerHTML += '<br/>';
		});

	} else {
		if (flag2 === 0) {
			flag2 = 1;

			$.each(duplicatesRefs, function(index, val) {	duplicatesRefs[index].innerHTML = duplicatesInners[index]; });

			var duplicatesNL = $('#duplicates > .bz_bug_link ~ br');
			for (let k = (duplicatesNL.length) - 1; k >= 0; k -= 1) {
				duplicatesNL[k].remove();
			}
		}

		// document.body.scrollTop = document.documentElement.scrollTop = 0;           // scroll to the top of the page
		// window.scrollTo(0, 0);
		// document.querySelector('html').scrollIntoView();
		$(window).scrollTo('#duplicates');
	}
});
