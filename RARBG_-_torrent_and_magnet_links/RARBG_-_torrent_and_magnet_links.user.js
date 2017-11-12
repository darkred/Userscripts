// ==UserScript==
// @name        RARBG - torrent and magnet links
// @namespace   darkred
// @license     MIT
// @description Adds a column with torrent and magnet links in RARBG lists
// @version     2017.11.11
// @include     /^(https?:)?\/\/(www\.)?rarbg\.(to|com)\/(torrents\.php.*|catalog\/.*|top10)$/
// @grant       none
// ==/UserScript==


function appendColumn(title) {

	var entries = document.querySelectorAll('.lista2t > tbody > tr > td:nth-child(2) ');        // the initial column 'Files' after of which the extra column will be appended

	for (let i = 0; i < entries.length; i++) {                                                  // creation of the extra column
		entries[i].insertAdjacentHTML('afterend', `<td>` + title + `</td>`);
	}

	var header = document.querySelector('.lista2t > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3)');       // the first cell (the header cell) of the new column
	header.innerHTML = title;
	header.setAttribute('class', 'header6');
	header.setAttribute('align', 'center');

	var cells = document.querySelectorAll('.lista2t > tbody > tr[class="lista2"] > td:nth-child(3)');               // the rest cells of the new column
	for (let i = 0; i < cells.length; i++) {
		cells[i].setAttribute('class', 'lista');
		cells[i].setAttribute('width', '50px');
		cells[i].setAttribute('align', 'center');
	}

	var newColumn = document.querySelectorAll('.lista2t > tbody > tr[class="lista2"] > td:nth-child(3)');       // new column
	var oldColumn = document.querySelectorAll('.lista2t > tbody > tr[class="lista2"] > td:nth-child(2)');       // old column

	// populate the cells in the new column with DL and ML links
	for (let i = 0; i < newColumn.length; i++) {
		if ((/over\/(.*)\.jpg\\/).test(oldColumn[i].firstChild.outerHTML)){
			var hash = oldColumn[i].firstChild.outerHTML.match(/over\/(.*)\.jpg\\/)[1];
		} else {
			hash = undefined;
		}
		let title = oldColumn[i].firstChild.innerText;
		var trackers = 'http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710';
		newColumn[i].innerHTML = '<a href="' + oldColumn[i].firstChild.href.replace('torrent/', 'download.php?id=') + '&f=' + oldColumn[i].firstChild.innerText + '-[rarbg.com].torrent"><img src="https://dyncdn.me/static/20/img/16x16/download.png"">' + '</>';
		// if the torrent hash is contained in the filenames of the thumbnail image
		if (hash !== undefined){
			// then generate magnet link from preview thumbnail if available
			newColumn[i].innerHTML += '&nbsp;<a href="magnet:?xt=urn:btih:' + hash + '&dn=' + title + '&tr=' + trackers + ' "><img src="https://dyncdn.me/static/20/img/magnet.gif""></>';
		} else {
			// else generate it via an ajax request
			let href = oldColumn[i].firstChild.href;
			newColumn[i].innerHTML += '&nbsp;<a class="xhrMagnetLink" data-href="' + href + '" href="#"><img src="https://dyncdn.me/static/20/img/magnet.gif""></>';
			newColumn[i].lastChild.title = 'ML via XHR';
		}
	}
}

appendColumn('DL&nbsp;ML');

var xhrMagnetLinks = document.querySelectorAll('.xhrMagnetLink');

for(let i=0; i < xhrMagnetLinks.length; i++) {

	xhrMagnetLinks[i].addEventListener('mouseover', function(event){

		event.preventDefault();
		let href = this.getAttribute('href');
		if (href === '#') {
			let tLink = this.getAttribute('data-href');

			var xhr = new XMLHttpRequest();
			xhr.open('GET', tLink, true);	// XMLHttpRequest.open(method, url, async)
			xhr.onload = function () {

				let container = document.implementation.createHTMLDocument().documentElement;
				container.innerHTML = xhr.responseText;
				let magnetLink = container.querySelector('a[href^="magnet:"]');		// the 'magnet link' element in the retrieved page

				if (magnetLink) {
					let magnetHref = magnetLink.href;
					this.href = magnetHref;
					let currentMagnetLink = document.querySelector('a[data-href^="' + tLink + '"]');	// the current magnet link element
					currentMagnetLink.setAttribute('href', magnetHref);
				}

			};
			xhr.send();

		}

	}, false);

}