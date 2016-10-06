// ==UserScript==
// @name        rutracker - torrent links
// @namespace   darkred
// @include     https://rutracker.org/forum/tracker.php?nm=*
// @include     https://rutracker.org/forum/tracker.php?f=*
// @version     1
// @require     http://code.jquery.com/ui/1.9.1/jquery-ui.min.js
// @grant       none
// ==/UserScript==

function appendColumn(title) {
	$('#tor-tbl > THEAD > TR > TH:nth-child(4), \
	#tor-tbl > TBODY > TR > TD:nth-child(4)').after('<td class="row4 small number-format">link</td>');

	var columnHeader = $('#tor-tbl > thead:nth-child(1) > tr:nth-child(1) > td:nth-child(5)');
	$(columnHeader).html(title);
	$(columnHeader).attr('class', '{sorter: false}');
	$(columnHeader).css('background-color', '#CFD4D8');
	$(columnHeader).css('font-weight', 'bold');
	var columnCells = $('#tor-tbl > THEAD > TR > TH:nth-child(4)');
	columnCells.attr('class', 'lista');


	arr1 = $('#tor-tbl > TBODY > TR > TD:nth-child(5)');		// new column
	arr2 = $('#tor-tbl > TBODY > TR > TD:nth-child(4)');		// old column
}


function addLinks(){
	$.each(arr1, function( index ) {
		var temp = $(arr2[index]).children(':first').children(':first').attr('href').replace('viewtopic.php?t=', '');
		arr1[index].innerHTML = '<a href="' + `https://rutracker.org/forum/dl.php?t=` + temp + '">' + `<img src="https://static.t-ru.org/templates/v1/images/attach_big.gif"">` + '</>';
	});
}


var arr1, arr2;

appendColumn('DL');
addLinks();
