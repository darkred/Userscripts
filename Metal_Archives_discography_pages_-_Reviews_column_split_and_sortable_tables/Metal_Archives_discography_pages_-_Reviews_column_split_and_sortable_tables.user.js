// ==UserScript==
// @name        Metal Archives discography pages - Reviews column split and sortable tables
// @namespace   darkred
// @version     2.0.7
// @date        2019.10.27
// @description Splits the Reviews column into Reviews(count) and Ratings and makes the tables in all discography tabs sortable.
// @author      RobG, Brock Adams, Mottie, darkred
// @license     MIT
// @include     /^https?:\/\/www\.metal-archives\.com/bands?/.*$/
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-1.11.1.min.js
// @require     https://greasyfork.org/scripts/12036-mutation-summary/code/Mutation%20Summary.js
// @require     https://greasyfork.org/scripts/5844-tablesorter/code/TableSorter.js
//
// This userscript uses jQuery v1.11.1,
// the jQuery plugin 'tablesorter' (forked by Rob Garrison (Mottie)) http://mottie.github.io/tablesorter/docs/index.html ,
// and the JavaScript library 'Mutation Summary' (https://github.com/rafaelw/mutation-summary) (by Rafael Weinstein).
//
// Thanks a lot for the invaluable help to RobG, Mottie and especially Brock Adams.
//
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==


/* global MutationSummary */

// CSS rules in order to show 'up' and 'down' arrows in each table header
var stylesheet = `
<style>
thead th {
	background-repeat: no-repeat;
	background-position: right center;
}
thead th.up {
	background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7);
}
thead th.down {
	background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7);
}
.discog th:nth-last-child(2){
	width: 38px;
}
.discog th:nth-last-child(1){
	width: 35px;
}
</style>`;

$('head').append(stylesheet);





function appendColumn(jNode) {

	// STEP 1+2: SPLIT THE 'REVIEWS' COLUMN INTO A 'REVIEWS' COLUMN AND A 'RATINGS' COLUMN
	var tbl = jNode[0];     // table reference


	// If you have logged in (therefore the column 'Tools' exists in the discography table)
	if (document.getElementsByClassName('member_name').length >0){
		tbl.rows[0].cells[1].width = '45%';            // In order the column 'Name'(it's the 2nd) to have enough(in fact fixed) width
	} else {
		tbl.rows[0].cells[0].width = '53%';           // In order the column 'Name'(it's the 1nd) to have enough(in fact fixed) width
	}



	// If the current sub-table has no data, then stop the execution of the function
	if (tbl.rows[1].cells[0].innerHTML === '<em>Nothing entered yet. Please add the releases, if applicable. </em>') {
		return;
	}

	var newCell;

	const cols = tbl.rows[0].cells.length - 1;

	var tr = tbl.tHead.children[0],
		th = document.createElement('th');

	th.innerHTML = 'Ratings';
	th.className = 'ratingsCol';
	tr.appendChild(th);

	for (var i = 1; i < tbl.rows.length; i++) {
		var k = tbl.rows[i].cells[cols].innerHTML;    // Retrieve the content of the current cell of the Review column and store it to variable k


		var re1 = /<a [^>]*>[^(]*[(]([^)]+)/ ;        // (RegEx which matches the 'Ratings' percentage(incl.the % symbol)
		var l = re1.exec(k);                          // (Execute the RegEx and store it to variable l)

		newCell = tbl.rows[i].insertCell(-1);     // Add a new cell (for the new 'Ratings' column ) -for each row-

		if (re1.test(k)){                    // If the RegEx has matches, (only) then create new cells with...

			var re0 = /(<a [^>]*>)[0-9]*[^(]/ ;       // (RegEx which matches the reviews URL)
			var url = re0.exec(k);                    // (Execute the RegEx and store it to variable url)

			newCell.innerHTML = url[1] + l[1] + '</url>'; // ...the Ratings percentage (which is also a link to the Reviews)...


			var re2 = /<a [^>]*>([0-9]*)[^(]/ ;       // (RegEx which matches the 'Reviews' number)
			var m = re2.exec(k);                      // (Execute the RegEx and store it to variable m)

			newCell = tbl.rows[i].cells[cols];
			newCell.innerHTML = url[1] + m[1] + '</url>'; // ...and the Reviews number (which is also a link to the Reviews)
		}
	}

	//  STEP 3: MAKE THE DISCOGRAPHY TABLE SORTABLE  (using the jQuery plugin "tablesorter")
	$(tbl).tablesorter ( {
		cssAsc: 'up',
		cssDesc: 'down',
		// headers: {
			// 0: {sorter: false}
		// }
	} );
}


function handleDiscographyChanges (muteSummaries) {
	var mSummary    = muteSummaries[0];
	if (mSummary.added.length) {
		appendColumn ( $(mSummary.added[0]) );
	}
}


new MutationSummary ( {
	callback: handleDiscographyChanges,
	rootNode: $('#band_disco')[0],
	queries: [ {element: '.discog'} ]
} );
