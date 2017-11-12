// ==UserScript==
// @name        Bugzilla - reveal the Depends, Blocks, See Also and Duplicates bug titles
// @namespace   darkred
// @license     MIT
// @description Reveal the Depends, Blocks, See Also and Duplicates bug titles in bugzilla.mozilla.org via keyboard shortcuts
// @include     https://bugzilla.mozilla.org/show_bug.cgi?id=*
// @version     2017.3.7
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.2/jquery.scrollTo.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/keypress/2.1.3/keypress.min.js
// ==/UserScript==

/* eslint-disable no-unused-vars */

// Case 1: when you press ` (in order to toggle Depends, BLocks and See Also)

var flag1 = 1;
var listener1 = new window.keypress.Listener();
var listener2 = new window.keypress.Listener();
var depends, blocks, combinedRefs, seeAlsoRefs, duplicatesRefs;

var combinedInners = [], seeAlsoInners = [], duplicatesInners = [];

listener1.simple_combo('`', function() {
	// console.log('You pressed `');

	depends = $('#field-value-dependson > a');
	blocks = $('#field-value-blocked > a');
	seeAlsoRefs = $('#field-value-see_also a');
	combinedRefs = depends.add(blocks).add(seeAlsoRefs);


	if (flag1 === 1) {
		flag1 = 0;

		$(window).scrollTo('#field-dependson');

		$.each(combinedRefs, function(index, val) {	combinedInners[index] = combinedRefs[index].innerHTML;});

		$.each(combinedRefs, function(index, val) {
			combinedRefs[index].nextSibling.remove();
			combinedRefs[index].innerHTML = '(' + combinedRefs[index].innerHTML + ')  ' + combinedRefs[index].title;
			combinedRefs[index].outerHTML += '<br/>';
		});


	} else {
		if (flag1 === 0) {
			flag1 = 1;

			$.each(combinedRefs, function(index, val) {
				combinedRefs[index].innerHTML = combinedInners[index];
				combinedRefs[index].outerHTML += ', ';
			});

			var dependsNL = $('#field-value-dependson > a ~ br');
			var blocksNL = $('#field-value-blocked > a ~ br');

			var combinedNL = dependsNL.add(blocksNL);
			for (let m = (combinedNL.length) - 1; m >= 0; m -= 1) {
				combinedNL[m].remove();
			}

		}
		document.body.scrollTop = document.documentElement.scrollTop = 0;           // scroll to the top of the page
		// window.scrollTo(0, 0);
		// document.querySelector('html').scrollIntoView();

		// $(window).scrollTo('#field-see_also');
		$(window).scrollTo('#field-dependson');  // alternative to line 78
	}
});


// =========================================================================


// Case 2: when you press ~ (in order to toggle Duplicates)

var flag2 = 1;

listener2.simple_combo('~', function() {
	// console.log('You pressed ~');

	duplicatesRefs = $(`a:contains('Duplicates')`).parent().parent().find('.value > a');

	if (flag2 === 1) {
		flag2 = 0;

		// $(window).scrollTo('#duplicates');
		$(window).scrollTo(`a:contains('Duplicates')`).parent().parent();

		$.each(duplicatesRefs, function(index, val) {	duplicatesInners[index] = duplicatesRefs[index].innerHTML;});

		$.each(duplicatesRefs, function(index, val) {
			duplicatesRefs[index].nextSibling.remove();
			duplicatesRefs[index].innerHTML = '(' + duplicatesRefs[index].innerHTML + ')  ' + duplicatesRefs[index].title;
			duplicatesRefs[index].outerHTML += '<br/>';
		});

	} else {
		if (flag2 === 0) {
			flag2 = 1;

			$.each(duplicatesRefs, function(index, val) {
				duplicatesRefs[index].innerHTML = duplicatesInners[index];
				duplicatesRefs[index].outerHTML += ', ';
			});


			var duplicatesNL = $(`a:contains('Duplicates')`).parent().parent().find('.value > a ~ br');
			for (let k = (duplicatesNL.length) - 1; k >= 0; k -= 1) {
				duplicatesNL[k].remove();
			}

		}

		// document.body.scrollTop = document.documentElement.scrollTop = 0;           // scroll to the top of the page
		window.scrollTo(0, 0);
		// document.querySelector('html').scrollIntoView();
		// $(window).scrollTo('#duplicates');
		$(window).scrollTo(`a:contains('Duplicates')`).parent().parent();
	}
});
