// ==UserScript==
// @name        RARBG - torrent and magnet links
// @namespace   darkred
// @description Adds a column with torrent and magnet links in RARBG lists
// @include     /^(https?:)?\/\/(www\.)?rarbg\.(to|com)\/(torrents\.php.*|catalog\/.*|top10)$/
// @version     2016.11.17
// @grant       none
// ==/UserScript==



function appendColumn(title) {
	if (document.querySelectorAll('.lista2t > tbody > tr').length !== 0) {

		var entries = document.querySelectorAll('.lista2t > tbody > tr > td:nth-child(2) ');
		for (let i = 0; i < entries.length; i++) {
			entries[i].insertAdjacentHTML('afterend', '<td>link</td>');
		}

		var header = document.querySelector('.lista2t > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3)');
		header.innerHTML = title;
		header.setAttribute('class', 'header6');
		header.setAttribute('align', 'center');
		var cells = document.querySelectorAll('.lista2t > tbody > tr[class="lista2"] > td:nth-child(3)');
		for (let i = 0; i < cells.length; i++) {
			cells[i].setAttribute('class', 'lista');
			cells[i].setAttribute('width', '50px');
			cells[i].setAttribute('align', 'center');
		}

		var arr1 = document.querySelectorAll('.lista2t > tbody > tr[class="lista2"] > td:nth-child(3)');		// new column
		var arr2 = document.querySelectorAll('.lista2t > tbody > tr[class="lista2"] > td:nth-child(2)');		// old column


		for (let i = 0; i < arr1.length; i++) {
			if ((/over\/(.*)\.jpg\\/).test(arr2[i].firstChild.outerHTML)){
				var hash = arr2[i].firstChild.outerHTML.match(/over\/(.*)\.jpg\\/)[1];
			}
			let title = arr2[i].firstChild.innerText;
			var trackers = 'http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710';

			arr1[i].innerHTML = '<a href="' + arr2[i].firstChild.href.replace('torrent/', 'download.php?id=') + '&f=' + arr2[i].firstChild.innerText + '-[rarbg.com].torrent"><img src="https://dyncdn.me/static/20/img/16x16/download.png"">' + '</>';
			if (hash !== undefined){
				arr1[i].innerHTML += '&nbsp;<a href="magnet:?xt=urn:btih:' + hash + '&dn=' + title + '&tr=' + trackers + ' "><img src="https://dyncdn.me/static/20/img/magnet.gif""></>';
			} else {
				arr1[i].innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;';
			}
		}
	}
}

appendColumn('DL&nbsp;ML');
