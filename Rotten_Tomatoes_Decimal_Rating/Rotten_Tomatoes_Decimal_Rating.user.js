// ==UserScript==
// @name        Rotten Tomatoes Decimal Rating
// @namespace   darkred
// @author      wOxxOm
// @license     MIT
// @description Changes base-5 Rating of Rotten Tomatoes to base-10
// @version     3.0.1
// @include     http://www.rottentomatoes.com/*
// @include     https://www.rottentomatoes.com/*
// @grant       none
// @require     https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @run-at      document-start
// ==/UserScript==
/* --------- Note ---------
	This script changes the Base 5 rating of Rotten Tomatoes to Base 10.
	Thanks a lot to wOxxOm:
	he initially wrote it: https://greasyfork.org/en/forum/discussion/comment/5975/#Comment_5975
	and he also offered improvement: http://stackoverflow.com/questions/32412900/modify-elements-immediately-after-they-are-displayed-not-after-page-completely
	and https://greasyfork.org/en/forum/discussion/7583/x
*/



// Monitor mutations on the "AUDIENCE SCORE Average Rating" selector
setMutationHandler(document, '.audience-info div:first-child', function(nodes) {
	this.disconnect();

	// for "AUDIENCE SCORE Average Rating"
	nodes[0].innerHTML = nodes[0].innerHTML.replace(/[\d.]+/g, function(m) { return 2*m;});

	// for mouseover on "TOMATOMETER (?)"
	document.querySelector('h3.scoreTitle:nth-child(2) > span:nth-child(1)').title += ' (=6 stars or higher)';

	// for mouseover on "AUDIENCE SCORE (?) / WANT TO SEE (?)"
	var node = document.querySelector('h3.scoreTitle:nth-child(1) > span:nth-child(1)');
	node.title = node.title.replace(/([\d.]+)( stars)/, function(m, s1, s2) { return 2 * s1 + s2;});

});
