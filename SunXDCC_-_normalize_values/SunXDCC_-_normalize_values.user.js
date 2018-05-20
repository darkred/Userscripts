// ==UserScript==
// @name        SunXDCC - normalize values
// @namespace   darkred
// @version     2018.2.27
// @description It converts the values: in the 'Record' column from B/s to kB/s, and in the 'Size' column from e.g. G to GB. Also adds a space between the value and the unit, in both cases.
// @author      darkred
// @license     MIT
// @include     /^https?:\/\/(www\.)?sunxdcc\.com.*/
// @grant       none
// @require     https://greasyfork.org/scripts/12036-mutation-summary/code/Mutation%20Summary.js
// ==/UserScript==

/* global MutationSummary */

function normalizeValues(){

	var records = document.querySelectorAll('.record.val');
	for (var i = 0; i < records.length; i++) {
		if (records[i].innerText !== 'Na'){
			var initial = records[i].innerText;
			var temp = parseInt(records[i].innerText.replace('kB/s', '')) / 1000;
			// temp = Math.round(100 * temp) / 100;                 // round to 2 decimal places
			temp = Math.round(10 * temp) / 10;                 // round to 1 decimal place
			records[i].innerText = temp + 'mB/s';
			records[i].title = initial;

			var len = records[i].innerText.length;
			records[i].innerText = records[i].innerText.substring(0, len-4) +  ' ' + records[i].innerText.substring(len-4);
		}

	}


	var sizes = document.querySelectorAll('.fsize.val');
	for (let i = 0; i < sizes.length; i++) {
		// var initial = sizes[i].innerText;
		// var temp
		sizes[i].innerText += 'B';
		// http://stackoverflow.com/questions/5869551/insert-before-last-2-char-in-javascript
		let len = sizes[i].innerText.length;
		sizes[i].innerText = sizes[i].innerText.substring(0, len-2) +  ' ' + sizes[i].innerText.substring(len-2);
	}
}







new MutationSummary({
	callback: normalizeValues,
	rootNode: document.querySelector('#content'),
	queries: [{ element: '.table' }],
	// queries: [{ element: '.results > .table:first-child' }],
});