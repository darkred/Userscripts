// ==UserScript==
// @name        thepiratebay - add a sortable Ratio column
// @namespace   darkred
// @date        2020.7.29
// @description Adds a sortable "Ratio" column
// @author      darkred
// @license     MIT
// @include     https://thepiratebay.org/search.php*
// @grant       none
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// This userscript uses jQuery and it's plugin "tablesorter" (forked by Rob Garrison (Mottie)) http://mottie.github.io/tablesorter/docs/index.html
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==


// For the sortable Ratio column
function appendColumn() {
	var se, le, ratio;
	if (document.querySelector('span.list-header:nth-child(7)')){
		document.querySelector('span.list-header:nth-child(7)').insertAdjacentHTML('afterend', '<span class="list-item list-header item-seed"><label onclick="sortlist(7);" title="Seeds/Peers">Rt</label></span>');
	}
	var entries = document.querySelectorAll('li.list-entry > span:nth-child(7)');
	for (var i = 0; i < entries.length; i++) {
		se = parseInt(entries[i].previousElementSibling.innerHTML);   // Retrieve the content of the cell of the SE column and store it to variable se
		le = parseInt(entries[i].innerHTML);   // Retrieve the content of the cell of the LE column and store it to variable le
		if (se > 0 && le === 0){
			ratio = se;
		} else if (se === 0 || le === 0){
			ratio = 0;
		} else {
			ratio = se/le;
		}
		// ratio = (Math.round(10 * ratio) / 10);
		ratio = ratio.toFixed(1);
		entries[i].insertAdjacentHTML('afterend', '<span>' + ratio + '</span>');
		entries[i].nextSibling.className = 'list-item item-ratio';
		$('.item-ratio').css('text-align', 'right');
	}
}

appendColumn();


// Select all Ratio values (=all last cells of all rows) an align to the text
$('.list-item:last-child').css('text-align', 'right');
