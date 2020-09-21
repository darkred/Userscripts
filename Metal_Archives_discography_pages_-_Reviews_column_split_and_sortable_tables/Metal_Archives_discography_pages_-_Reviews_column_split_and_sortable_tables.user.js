// ==UserScript==
// @name        Metal Archives discography pages - Reviews column split and sortable tables
// @namespace   darkred
// @version     2.1.0
// @date        2020.9.20
// @description Splits the Reviews column into Reviews(count) and Ratings and makes the tables in all discography tabs sortable.
// @author      RobG, Brock Adams, Mottie, darkred
// @license     MIT
// @include     /^https?:\/\/www\.metal-archives\.com/bands?/.*$/
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @require     https://greasyfork.org/scripts/12036-mutation-summary/code/Mutation%20Summary.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.widgets.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/extras/jquery.tablesorter.pager.min.js
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
.tablesorter .filtered {
	display: none;
}



/* All of the following css is already contained within each theme file; modify it as desired */
/* filter row */
.tablesorter-filter-row td {
	background: #000;
  line-height: normal;
  text-align: center; /* center the input */
  -webkit-transition: line-height 0.1s ease;
  -moz-transition: line-height 0.1s ease;
  -o-transition: line-height 0.1s ease;
  transition: line-height 0.1s ease;
}
/* optional disabled input styling */
.tablesorter-filter-row .disabled {
  opacity: 0.5;
  filter: alpha(opacity=50);
  cursor: not-allowed;
}

/* hidden filter row */
.tablesorter-filter-row.hideme td {
  /*** *********************************************** ***/
  /*** change this padding to modify the thickness     ***/
  /*** of the closed filter row (height = padding x 2) ***/
  padding: 2px;
  /*** *********************************************** ***/
  margin: 0;
  line-height: 0;
  cursor: pointer;
}
.tablesorter-filter-row.hideme * {
  height: 1px;
  min-height: 0;
  border: 0;
  padding: 0;
  margin: 0;
  /* don't use visibility: hidden because it disables tabbing */
  opacity: 0;
  filter: alpha(opacity=0);
}
/* filters */
.tablesorter-filter {
  width: 95%;
  height: inherit;
  margin: 4px;
  padding: 4px;
  background-color: #1b0b0b;
  color: #c2b8af;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: height 0.1s ease;
  -moz-transition: height 0.1s ease;
  -o-transition: height 0.1s ease;
  transition: height 0.1s ease;
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


	// TODO: are you login? Then header0: sorter: false
	let login;
	// if login form doesn't exist (=you have login), then disable sorting (NOT filtering too) on column 0 ("Edit/Tools")
	$('#login_form > div > button').length === 0 ? login = false : login = true;

	//  STEP 3: MAKE THE DISCOGRAPHY TABLE SORTABLE  (using the jQuery plugin "tablesorter")
	$(tbl).tablesorter ( {
		cssAsc: 'up',
		cssDesc: 'down',
		headers: {
			// 0: {sorter: false}
			0: { sorter: login,
				filter: login}
		},
		widgets: ['filter'],
		ignoreCase: true,
		widgetOptions : {
			filter_hideFilters : true,
		},
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
