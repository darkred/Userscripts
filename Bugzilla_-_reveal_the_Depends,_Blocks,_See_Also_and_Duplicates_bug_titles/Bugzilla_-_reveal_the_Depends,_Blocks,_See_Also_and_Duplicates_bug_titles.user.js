// ==UserScript==
// @name        Bugzilla - reveal the Depends, Blocks, See Also and Duplicates bug titles
// @namespace   darkred
// @description Reveal the Depends, Blocks, See Also and Duplicates bug titles in bugzilla.mozilla.org via keyboard shortcuts
// @include     https://bugzilla.mozilla.org/show_bug.cgi?id=*
// @version     1.2
// @grant       none
// @require     http://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/keypress/2.1.3/keypress.min.js
// ==/UserScript==



// Case 1: when you press ` (in order to toggle Depends, BLocks and See Also)

var flag1 = 1;
var listener1 = new window.keypress.Listener();
var depends, blocks, combined;
var seealso;
var regex = /^https:\/\/bugzilla\.mozilla\.org\/show_bug\.cgi\?id=(.*)$/;

listener1.simple_combo('`', function() {
	// console.log('You pressed `');
	depends = $('#dependson_input_area  ~ .bz_bug_link');
	blocks = $('#blocked_input_area ~ .bz_bug_link');
	combined = [].concat(Array.prototype.slice.call(depends), Array.prototype.slice.call(blocks));

	seealso = $('.bug_urls > li > a');

	if (flag1 === 1) {
		flag1 = 0;
		for (var i = 0; i < combined.length; i++) {
			combined[i].innerHTML = '(' + combined[i].innerHTML + ')  ' + combined[i].title;
			combined[i].outerHTML += '<br/>';
		}
		for (var z = 0; z < seealso.length; z++) {
			seealso[z].innerHTML = '(' + seealso[z].innerHTML + ')  ' + seealso[z].title;
		}
	} else {
		if (flag1 === 0) {
			flag1 = 1;
			for (var j = 0; j < combined.length; j++) {
				if (regex.test(combined[j].href)){
					combined[j].innerHTML = combined[j].href.match(regex)[1];
				}
			}
			var dependsNL = $('#dependson_input_area  ~ .bz_bug_link ~ br');
			var blocksNL = $('#blocked_input_area ~ .bz_bug_link  ~ br');
			var combinedNL = [].concat(Array.prototype.slice.call(dependsNL), Array.prototype.slice.call(blocksNL));
			for (var k = (combinedNL.length) - 1; k >= 0; k -= 1) {
				combinedNL[k].remove();
			}
			for (var w = 0; w < seealso.length; w++) {
				seealso[w].innerHTML = seealso[w].href.match(regex)[1];
			}
		}
		document.body.scrollTop = document.documentElement.scrollTop = 0;           // scroll to the top of the page
	}
});


// =========================================================================


// Case 2: when you press ~ (in order to toggle Duplicates)

var flag2 = 1;
var listener2 = new window.keypress.Listener();
var duplicates;

listener2.simple_combo('~', function() {
	// console.log('You pressed ~');

	duplicates = $('#duplicates > .bz_bug_link');

	if (flag2 === 1) {
		flag2 = 0;
		for (var i = 0; i < duplicates.length; i++) {
			duplicates[i].innerHTML = '(' + duplicates[i].innerHTML + ')  ' + duplicates[i].title;
			duplicates[i].outerHTML += '<br/>';
		}
	} else {
		if (flag2 === 0) {
			flag2 = 1;
			for (var j = 0; j < duplicates.length; j++) {
				duplicates[j].innerHTML = duplicates[j].href.match(regex)[1];
			}
			var duplicatesNL = $('#duplicates > .bz_bug_link ~ br');
			for (var k = (duplicatesNL.length) - 1; k >= 0; k -= 1) {
				duplicatesNL[k].remove();
			}
		}

		document.body.scrollTop = document.documentElement.scrollTop = 0;           // scroll to the top of the page
	}
});
