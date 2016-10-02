// ==UserScript==
// @name        RARBG - torrent and magnet links
// @namespace   darkred
// @description Adds a column with torrent and magnet links in RARBG lists
// @include     /^(https?:)?\/\/(www\.)?rarbg\.(to|com)\/(torrents\.php.*|catalog\/.*|top10)$/
// @version     1.1.5
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @grant       none
// ==/UserScript==



function appendColumn(title) {
	$('.lista2t > tbody > tr > td:nth-child(2) ').after('<td>link</td>');

	var columnHeader = $('.lista2t > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3)');
	$(columnHeader).html(title);
	$(columnHeader).attr('class', 'header6');
	$(columnHeader).attr('align', 'center');
	var columnCells = $('.lista2t > tbody > tr[class="lista2"] > td:nth-child(3)');
	columnCells.attr('class', 'lista');
	columnCells.attr('width', '50px');
	columnCells.attr('align', 'center');

	arr1 = $('.lista2t > tbody > tr[class="lista2"] > td:nth-child(3)');		// new column
	arr2 = $('.lista2t > tbody > tr[class="lista2"] > td:nth-child(2)');		// old column
}


function addLinks(){
	$.each(arr1, function( index ) {
		if ((/over\/(.*)\.jpg\\/).test(arr2[index].firstChild.outerHTML)){
			var hash = arr2[index].firstChild.outerHTML.match(/over\/(.*)\.jpg\\/)[1];
		}
		var title = arr2[index].firstChild.innerText;
		var trackers = 'http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710';

		arr1[index].innerHTML = '<a href="' + arr2[index].firstChild.href.replace('torrent/', 'download.php?id=') + '&f=' + arr2[index].firstChild.innerText + '-[rarbg.com].torrent"><img src="https://dyncdn.me/static/20/img/16x16/download.png"">' + '</>';
		if (hash !== undefined){
			arr1[index].innerHTML += '&nbsp;<a href="magnet:?xt=urn:btih:' + hash + '&dn=' + title + '&tr=' + trackers + ' "><img src="https://dyncdn.me/static/20/img/magnet.gif""></>';
		} else {
			arr1[index].innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;';
		}
	});
}


var arr1, arr2;

appendColumn('DL&nbsp;ML');
addLinks();
