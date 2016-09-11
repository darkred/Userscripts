// ==UserScript==
// @name        Bugzilla - reveal the Depends, Blocks, See Also and Duplicates bug titles
// @namespace   darkred
// @description Reveal the Depends, Blocks, See Also and Duplicates bug titles in bugzilla.mozilla.org via keyboard shortcuts
// @include     https://bugzilla.mozilla.org/show_bug.cgi?id=*
// @version     1.1
// @grant       none
// @require     http://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/keypress/2.1.3/keypress.min.js
// ==/UserScript==



var flag1 = 1;

var listener1 = new window.keypress.Listener();

var depends, blocks, combined;
var seealso;

listener1.simple_combo('`', function() {
	// console.log('You pressed `');

	depends = $('#dependson_input_area').siblings();
	blocks = $('#blocked_input_area').siblings();
	combined = [].concat(Array.prototype.slice.call(depends), Array.prototype.slice.call(blocks));

	if (flag1 === 1) {
		flag1 = 0;

		for (var i = 0; i < combined.length; i++) {
			combined[i].innerHTML = '(' + combined[i].innerHTML + ')  ' + combined[i].title;
			combined[i].outerHTML += '<br/>';
		}

		seealso = $('.bug_urls > li').children();
		for (var z = 0; z < seealso.length; z++) {
			seealso[z].innerHTML = '(' + seealso[z].innerHTML + ')  ' + seealso[z].title;
		}



	} else {

		var regex = /^https:\/\/bugzilla\.mozilla\.org\/show_bug\.cgi\?id=(.*)$/;


		if (flag1 === 0) {
			flag1 = 1;
			for (var j = 0; j < combined.length; j += 2) {
				combined[j].innerHTML = combined[j].href.match(regex)[1];
			}

			for (var k = (combined.length) - 1; k >= 0; k -= 2) {
				combined[k].remove();
			}

			seealso = $('.bug_urls > li').children();
			for (var w = 0; w < seealso.length; w++) {
				seealso[w].innerHTML = seealso[w].href.match(regex)[1];
			}

		}


		document.body.scrollTop = document.documentElement.scrollTop = 0;           // scroll to the top of the page
	}

});


// ---------------------------------------------------------------------


var flag2 = 1;

var listener2 = new window.keypress.Listener();

var duplicates;

listener2.simple_combo('~', function() {
	if (flag2 === 1) {
		flag2 = 0;
		duplicates = $('#duplicates').children();

		for (var i = 0; i < duplicates.length; i++) {
			duplicates[i].innerHTML = '(' + duplicates[i].innerHTML + ')  ' + duplicates[i].title;
			duplicates[i].outerHTML += '<br/>';
		}

	} else {

		var regex = /^https:\/\/bugzilla\.mozilla\.org\/show_bug\.cgi\?id=(.*)$/;

		duplicates = $('#duplicates').children();

		if (flag2 === 0) {
			flag2 = 1;
			for (var j = 0; j < duplicates.length; j += 2) {
				duplicates[j].innerHTML = duplicates[j].href.match(regex)[1];
			}

			for (var k = (duplicates.length) - 1; k >= 0; k -= 2) {
				duplicates[k].remove();
			}
		}
		document.body.scrollTop = document.documentElement.scrollTop = 0;           // scroll to the top of the page
	}

});
