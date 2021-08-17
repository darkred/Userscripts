// ==UserScript==
// @name        1337x - torrent and magnet links
// @namespace   darkred
// @version     2021.8.17
// @description Adds a column with torrent and magnet links in lists
// @author      darkred
// @contributor NotNeo, barn852
// @license     MIT
// @include     /^https:\/\/(www\.)?1337x\.(to|st|ws|eu|se|is|gd|unblocked\.dk)((?!\/torrent)).*$/
// @grant       GM_addStyle
// @run-at      document-idle
//
//    Thanks to:
//    - NotNeo: most of the CSS used is taken from this script: https://greasyfork.org/en/scripts/373230-1337x-magnet-torrent-links-everywhere .
//    - barn852 for his contribution here: https://greasyfork.org/en/scripts/420754-1337x-torrent-and-magnet-links/discussions/96026
//
// Official mirrors list: https://1337x.to/about
//
// ==/UserScript==



GM_addStyle(`

	main.container, div.container {
		/* max-width: 1600px; */
		max-width: 1450px;
	}

	.list-button-magnet > i.flaticon-magnet {
		font-size: 13px;
		color: #da3a04
	}

	.list-button-dl > i.flaticon-torrent-download {
		font-size: 13px;
		color: #89ad19;
	}

	table.table-list td.dl-buttons {
		border-left: 1px solid #f6f6f6;
		border-right: 1px solid #c0c0c0;
		padding-left: 2.5px;
		padding-right: 2.5px;
		text-align: center !important;
		position: relative;
		display: table-cell !important; /* proper height of cell on multiple row torrent name */
		width: 6%;
	}

	td.dl-buttons > a,
	td.dl-buttons > a:hover,
	td.dl-buttons > a:visited,
	td.dl-buttons > a:link,
	td.dl-buttons > a:active {
		color: inherit;
		text-decoration: none;
		cursor: pointer;
		display: inline-block !important;
		/* margin: 0 1.5px; */
		margin: 0 2px;
	}

	table.table-list td.coll-1b {
		border-right: 1px solid silver;
	}

	.table-list > thead > tr > th:nth-child(2),
	.table-list > thead > tr > td:nth-child(2) {
		text-align: center;
	}

`);


function appendColumn() {

	const allTables = document.querySelectorAll('.table-list-wrap');  // for pages with multiple tables e.g. https://1337x.to/home/
	const isSeries = window.location.href.includes('/series/');       // for pages with tables that have no header e.g. https://1337x.to/series/a-to-z/1/13/
	const title = 'ml&nbsp;dl';


	allTables.forEach((table) => {

		const headersCellsInitial = table.querySelectorAll(`.table-list > thead > tr:not(.blank) > th:nth-child(1),
		                                                    .table-list > tbody > tr:not(.blank) > td:nth-child(1)`);
		headersCellsInitial.forEach((cell, index) => {
			if (index === 0 && !isSeries) {
				cell.insertAdjacentHTML('afterend', `<th>` + title + `</th>`);
			} else {
				cell.insertAdjacentHTML('afterend', `<td>` + title + `</td>`);
			}
		});

		const headersCellsNew = table.querySelectorAll(`.table-list > thead > tr:not(.blank) > th:nth-child(2),
		                                                .table-list > tbody > tr:not(.blank) > td:nth-child(2)`);
		headersCellsNew.forEach((cell, index) => {
			cell.classList.add('coll-1b');
			if (index === 0 && !isSeries) {
				cell.innerHTML = title;
			} else {
				cell.classList.add('dl-buttons');

				let href;
				if (!isSeries){
					href = headersCellsInitial[index].firstElementChild.nextElementSibling.href;
				} else {
					href = headersCellsInitial[index].firstElementChild.href;
				}

				cell.innerHTML =  `<a class="list-button-magnet" data-href=" ${href} "href="javascript:void(0)" title="ml via xhr"><i class="flaticon-magnet"></i></a>`;
				cell.innerHTML += `<a class="list-button-dl" data-href="     ${href} "href="javascript:void(0)" title="dl via xhr"><i class="flaticon-torrent-download"></i></a>`;
			}
		});


	});


}



function addClickListeners(links, type){

	links.forEach((link) => {

		link.addEventListener('click', function(event){

			let href = this.getAttribute('href');
			if (href === 'javascript:void(0)') {
				let tLink = this.getAttribute('data-href');

				var xhr = new XMLHttpRequest();
				xhr.open('GET', tLink, true);	// XMLHttpRequest.open(method, url, async)
				xhr.onload = function () {

					let container = document.implementation.createHTMLDocument().documentElement;
					container.innerHTML = xhr.responseText;

					let retrievedLink = (type === 'ml') ? container.querySelector('a[href^="magnet:"]') : container.querySelector('.dropdown-menu > li > a');

					if (retrievedLink) {
						link.setAttribute('href', retrievedLink.href.replace('http:', 'https:'));  // the links are http and as such are blocked in Chrome
						link.click();
					}


				};
				xhr.send();

			}

		}, false);

	});

}



function createColumn(){
	appendColumn();
	addClickListeners(document.querySelectorAll('.list-button-magnet'), 'ml' );
	addClickListeners(document.querySelectorAll('.list-button-dl'), 'dl' );
}


createColumn();
