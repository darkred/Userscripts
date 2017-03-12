// ==UserScript==
// @name        Metal Archives (discography pages) - Reviews column split and sortable tables
// @namespace   darkred
// @author      darkred
// @description Splits the Reviews column into Reviews(count) and Ratings and makes the tables in all discography tabs sortable.
// @include     http://www.metal-archives.com/bands/*
// @include     http://www.metal-archives.com/band/*
// @version     2.0
// @date		2017.3.12
// @grant       none
// @require     https://greasyfork.org/scripts/12036-mutation-summary/code/Mutation%20Summary.js?version=70722
// @require     https://greasyfork.org/scripts/5844-tablesorter/code/TableSorter.js?version=21758
//
// This userscript uses jQuery UI, the jQuery plugin 'tablesorter' (forked by Rob Garrison (Mottie)) http://mottie.github.io/tablesorter/docs/index.html
// and the JavaScript library 'Mutation Summary' (https://github.com/rafaelw/mutation-summary) (by Rafael Weinstein)
//
// ==/UserScript==


// CSS rules in order to show 'up' and 'down' arrows in each table header
var stylesheet = `
<style>
thead th {
    background-repeat: no-repeat;
    background-position: right center;
}
thead th.up {
    padding-right: 20px;
    background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7);
}
thead th.down {
    padding-right: 20px;
    background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7);
}
}
</style>`;

$('head').append(stylesheet);





function appendColumn(jNode) {

    // STEP 1+2: SPLIT THE 'REVIEWS' COLUMN INTO A 'REVIEWS' COLUMN AND A 'RATINGS' COLUMN
    var tbl = jNode[0];     // table reference


    // If you have logged in (therefore the column 'Tools' exists in the discography table)
    if (document.getElementsByClassName('member_name').length >0){
       tbl.rows[0].cells[1].width = "45%";            // In order the column 'Name'(it's the 2nd) to have enough(in fact fixed) width
    } else {
        tbl.rows[0].cells[0].width = "53%";           // In order the column 'Name'(it's the 1nd) to have enough(in fact fixed) width
    }



    // If the current sub-table has no data, then stop the execution of the function
    if (tbl.rows[1].cells[0].innerHTML == '<em>Nothing entered yet. Please add the releases, if applicable. </em>') {
        return;
    }

    var newCell, newText;

    const cols = tbl.rows[0].cells.length - 1;

    var tr = tbl.tHead.children[0],
    th = document.createElement('th');

    th.innerHTML = "Ratings";
    th.className = "ratingsCol";
    tr.appendChild(th);

    for (i = 1; i < tbl.rows.length; i++) {
        k = tbl.rows[i].cells[cols].innerHTML;    // Retrieve the content of the current cell of the Review column and store it to variable k


        re1 = /<a [^>]*>[^(]*[(]([^)]+)/ ;        // (RegEx which matches the 'Ratings' percentage(incl.the % symbol)
        l = re1.exec(k);                          // (Execute the RegEx and store it to variable l)

        newCell = tbl.rows[i].insertCell(-1);     // Add a new cell (for the new 'Ratings' column ) -for each row-

        if (re1.test(k) != 0){                    // If the RegEx has matches, (only) then create new cells with...

            re0 = /(<a [^>]*>)[0-9]*[^(]/ ;       // (RegEx which matches the reviews URL)
            url = re0.exec(k);                    // (Execute the RegEx and store it to variable url)

            newCell.innerHTML = url[1] + l[1] + '</url>'; // ...the Ratings percentage (which is also a link to the Reviews)...


            re2 = /<a [^>]*>([0-9]*)[^(]/ ;       // (RegEx which matches the 'Reviews' number)
            m = re2.exec(k);                      // (Execute the RegEx and store it to variable m)

            newCell = tbl.rows[i].cells[cols];    //
            newCell.innerHTML = url[1] + m[1] + '</url>'; // ...and the Reviews number (which is also a link to the Reviews)
        }
    }

    //  STEP 3: MAKE THE DISCOGRAPHY TABLE SORTABLE  (using the jQuery plugin "tablesorter")
    $(tbl).tablesorter ( {
        cssAsc: 'up',
        cssDesc: 'down',
        headers: {
              0: {sorter: false}
        }
    } );
}



var muteObserver = new MutationSummary ( {
    callback: handleDiscographyChanges,
    rootNode: $("#band_disco")[0],
    queries: [ {element: ".discog"} ]
} );


function handleDiscographyChanges (muteSummaries) {
    var mSummary    = muteSummaries[0];
    if (mSummary.added.length) {
        appendColumn ( $(mSummary.added[0]) );
    }
}