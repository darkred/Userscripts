// ==UserScript==
// @name        Rotten Tomatoes Decimal Rating
// @namespace   darkred
// @version     6.0
// @description Changes base-5 Rating of Rotten Tomatoes to base-10
// @author      wOxxOm, darkred
// @license     MIT
// @match       https://*.rottentomatoes.com/*
// @grant       none
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==


// Example URLs:
// https://www.rottentomatoes.com/m/birds_of_prey_2020
// https://www.rottentomatoes.com/m/toy_story_3



function modifyaudienceScoreStars(audienceScoreStars){
	if (!audienceScoreStars.textContent.includes('NaN') && audienceScoreStars.textContent.includes('out of 5') ) {
		audienceScoreStars.textContent = audienceScoreStars.textContent.replace('out of 5','');
		audienceScoreStars.textContent *= 2;
		audienceScoreStars.textContent += ' out of 10';
	}
}


function audienceScorex2(){

	// 'Score Details' card | 'AUDIENCE' > average rating" score  --> Multiply x2
	let audienceScoreStars = document.querySelector('score-details-audience').shadowRoot.querySelector('star-rating').shadowRoot.querySelector('.average-stars');
	modifyaudienceScoreStars(audienceScoreStars);


	// Select the node that will be observed for mutations
	const targetNode = audienceScoreStars;

	// Options for the observer (which mutations to observe)
	const config = { // attributes: true ,
		childList: true ,
				// subtree: true,
				// characterData: true
	};


	// Callback function to execute when mutations are observed
	const callback = mutations => {

		mutations.forEach(function(mutation) {

			observer.disconnect();
			modifyaudienceScoreStars(audienceScoreStars);

		});

	};

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);

}



let scoreBoard = document.querySelector('score-board');


scoreBoard.onclick = function(event) {

	// let target = event.target;

	audienceScorex2();

	let buttonVerifiedAudience = document.querySelector('#mainColumn > overlay-base > score-details > score-details-audience > filter-chip:nth-child(2)');
	let buttonAllAudience =      document.querySelector('#mainColumn > overlay-base > score-details > score-details-audience > filter-chip:nth-child(3)');
	[ buttonVerifiedAudience, buttonAllAudience ].forEach(function(element) {
		if (element) {
			element.addEventListener('click', function() {
				audienceScorex2();
			});
		}
	});



	// the '?' buttons for the two descriptive texts
	let buttonQuestionmarkTomatometer = document.querySelector('#mainColumn > overlay-base > score-details > score-details-critics > tool-tip');
	let buttonQuestionmarkAudienceScore = document.querySelector('#mainColumn > overlay-base > score-details > score-details-audience > tool-tip');


	buttonQuestionmarkTomatometer.addEventListener('click', function(){

		let descriptiveTextTomatometer = document.querySelector('#mainColumn > overlay-base > score-details > score-details-critics > tool-tip').shadowRoot.querySelector('.description');
		if (!descriptiveTextTomatometer.textContent.includes('review (=6 stars or higher)')) {
			descriptiveTextTomatometer.innerHTML = descriptiveTextTomatometer.innerHTML.replace('review', 'review (=6 stars or higher)');
		}

	});


	buttonQuestionmarkAudienceScore.addEventListener('click', function(){

		let descriptiveTextAudienceScode = document.querySelector('#mainColumn > overlay-base > score-details > score-details-audience > tool-tip').shadowRoot.querySelector('.description');
		/*
		descriptiveTextAudienceScode.innerHTML = descriptiveTextAudienceScode.innerHTML.replace(/([\d.]+)( stars)/g, function (m, s1, s2) {
			return 2 * s1 + s2;
		});
		*/
		if (!descriptiveTextAudienceScode.textContent.includes('7 stars or higher')) {
			descriptiveTextAudienceScode.textContent = descriptiveTextAudienceScode.textContent.replace('3.5 stars or higher', '7 stars or higher');
		}

	});


};
