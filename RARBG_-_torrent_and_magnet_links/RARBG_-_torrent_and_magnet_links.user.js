// ==UserScript==
// @name        RARBG - torrent and magnet links
// @namespace   darkred
// @version     2019.2.1
// @description Adds a column with torrent and magnet links in RARBG lists
// @author      darkred
// @contributor sxe
// @license     MIT
// @include     /^(https?:)?\/\/(www\.)?(rarbg(\.(bypassed|unblockall|unblocked))?|rarbgaccess|rarbgget|rarbgmirror|rarbgproxy|rarbgproxied|rarbgprx|rarbgs|rarbgto|rarbgunblock|proxyrarbg|unblocktorrent)\.(to|com|org|is|xyz|lol|vc|link)\/(rarbg-proxy-unblock\/)?(torrents\.php.*|catalog\/.*|top10)$/
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


	for (let i = 0; i < newColumn.length; i++) {

		let href = oldColumn[i].firstChild.href;

		newColumn[i].innerHTML =        '<a class="xhrDownloadLink" data-href="' + href + '" href="#"><img src="https://dyncdn.me/static/20/img/16x16/download.png""></>';
		newColumn[i].lastChild.title = 'DL via XHR';

		newColumn[i].innerHTML += '&nbsp;<a class="xhrMagnetLink" data-href="' + href + '" href="#"><img src="https://dyncdn.me/static/20/img/magnet.gif""></>';
		newColumn[i].lastChild.title = 'ML via XHR';

	}
}


function addMouseoverListeners(links, type){

	for(let i=0; i < links.length; i++) {


		links[i].addEventListener('mouseover', function(event){

			event.preventDefault();
			let href = this.getAttribute('href');
			if (href === '#') {
				let tLink = this.getAttribute('data-href');

				var xhr = new XMLHttpRequest();
				xhr.open('GET', tLink, true);	// XMLHttpRequest.open(method, url, async)
				xhr.onload = function () {

					let container = document.implementation.createHTMLDocument().documentElement;
					container.innerHTML = xhr.responseText;

					let retrievedLink;
					if (type === 'dl'){
						retrievedLink = container.querySelector('a[href^="/download.php"]');		// the 'magnet link' element in the retrieved page
					} else {
						retrievedLink = container.querySelector('a[href^="magnet:"]');		// the 'magnet link' element in the retrieved page
					}


					if (retrievedLink) {
						links[i].setAttribute('href', retrievedLink.href);
					}



				};
				xhr.send();

			}

		}, false);

	}

}


appendColumn('DL&nbsp;ML');


var xhrDownloadLinks = document.querySelectorAll('.xhrDownloadLink');
var xhrMagnetLinks = document.querySelectorAll('.xhrMagnetLink');

addMouseoverListeners(xhrDownloadLinks, 'dl' );
addMouseoverListeners(xhrMagnetLinks, 'ml' );
