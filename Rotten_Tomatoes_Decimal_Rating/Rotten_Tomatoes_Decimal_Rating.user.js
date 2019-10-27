// ==UserScript==
// @name        Rotten Tomatoes Decimal Rating
// @namespace   darkred
// @version     4
// @description Changes base-5 Rating of Rotten Tomatoes to base-10
// @author      wOxxOm
// @license     MIT
// @match       https://*.rottentomatoes.com/*
// @grant       none
// @require     https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @run-at      document-start
// ==/UserScript==

// Monitor mutations on the "AUDIENCE SCORE Average Rating" stars selector
setMutationHandler(document, '#js-tomatometer-overlay .star-display', function (nodes) {
	// this.disconnect();

	// "AUDIENCE SCORE > Average Rating" score - Multiply x2
	var audienceScoreStars = nodes[0].nextElementSibling;
	audienceScoreStars.textContent *= 2;
	audienceScoreStars.textContent += '/10';

	// The 1st is for TOMATOMETER, the 2nd is for AUDIENCE SCORE
	var theTwoDescriptiveTexts = document.querySelectorAll('li.score-modal__dets');

	// "TOMATOMETER" descriptive text - Append '(=6 stars or higher)'
	theTwoDescriptiveTexts[0].innerHTML = theTwoDescriptiveTexts[0].innerHTML.replace('review.', 'review (=6 stars or higher).');

	// "AUDIENCE SCORE" descriptive text - modify in the text, from '3.5 stars or higher' to '7 stars or higher'
	theTwoDescriptiveTexts[1].innerHTML = theTwoDescriptiveTexts[1].innerHTML.replace(/([\d.]+)( stars)/, function (m, s1, s2) {
		return 2 * s1 + s2;
	});

});
