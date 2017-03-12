// ==UserScript==
// @name        thepiratebay - add a sortable Ratio column
// @namespace   darkred
// @author      darkred
// @description Adds a sortable "Ratio" column
// @include     https://thepiratebay.org/search/*
// @include     https://thepiratebay.org/browse/*
// @include     https://thepiratebay.org/recent
// @include     https://thepiratebay.org/user/*
// @include     https://thepiratebay.org/tv/
// @include     https://thepiratebay.org/music
// @include     https://thepiratebay.org/top
// @version     1.2.2
// @grant       none
// @require     https://greasyfork.org/scripts/5844-tablesorter/code/TableSorter.js?version=21758
// This userscript uses jQuery and it's plugin "tablesorter" (forked by Rob Garrison (Mottie)) http://mottie.github.io/tablesorter/docs/index.html
// ==/UserScript==


function appendColumn() {
	var tbl = document.getElementById('searchResult');
	var newCell;
	var tr = tbl.tHead.children[0],
		th = document.createElement('th');
	// th.innerHTML = 'Ratio';
	th.innerHTML = 'Rt';
	th.className = 'ratioCol';
	tr.appendChild(th);
	var m, n, ratio;
	for (var i = 1; i < tbl.rows.length; i++) {
		m = tbl.rows[i].cells[5].innerHTML;   // Retrieve the content of the cell of the SE column and store it to variable m
		n = tbl.rows[i].cells[6].innerHTML;   // Retrieve the content of the cell of the LE column and store it to variable n
		ratio = m/n;
		if (m>0 && n==0){
			ratio=m;
		}
		if (m==0 && n==0){
			ratio=0;
		}
		newCell = tbl.rows[i].insertCell(-1);
		newCell.innerHTML = (Math.round(100 * ratio) / 100);

	}
}



function sorting() {
	$('table#searchResult').tablesorter({
		headers: {
			0: {sorter: false},
			1: {sorter: false},
			2: {sorter: false},
			3: {sorter: false},
			4: {sorter: false},
			5: {sorter: false},
			6: {sorter: false},
			7: {sorter: true}
		}
	});
}
//

appendColumn();
sorting();


// Select all Ratio values (=all last cells of all rows) an align to the text
$('td:last-child').css('text-align', 'right');