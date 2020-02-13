// ==UserScript==
// @name        Rotten Tomatoes Decimal Rating
// @namespace   darkred
// @version     5
// @description Changes base-5 Rating of Rotten Tomatoes to base-10
// @author      wOxxOm, darkred
// @license     MIT
// @match       https://*.rottentomatoes.com/*
// @grant       none
// ==/UserScript==


const buttonSeeScoreDetails = document.querySelector('.mop-ratings-wrap__score-detail-container');

function audienceScorex2(){
	// 'See Score Details' | 'Audience Score' > Avg rating" score  --> Multiply x2
	let audienceScoreStars = document.querySelector('span.js-audience-score-info');
	audienceScoreStars.textContent = audienceScoreStars.textContent.replace('/5','');
	audienceScoreStars.textContent *= 2;
	audienceScoreStars.textContent += '/10';
}



buttonSeeScoreDetails.addEventListener('click', function(){

	audienceScorex2();

	let buttonInsideVerifiedAudience = document.querySelector('div.score-detail__info-wrap-section:nth-child(2) > nav:nth-child(2) > button:nth-child(1)');
	let buttonInsideAllAudience =      document.querySelector('div.score-detail__info-wrap-section:nth-child(2) > nav:nth-child(2) > button:nth-child(2)');
	[ buttonInsideVerifiedAudience, buttonInsideAllAudience ].forEach(function(element) {
		element.addEventListener('click', function() {
			audienceScorex2();
		});
	});



	// the buttons for the two descriptive texts: The 1st is for TOMATOMETER, the 2nd is for AUDIENCE SCORE
	let buttonQuestionmarkTomatometer = document.querySelector('.score-detail__help--tomatometer');
	let buttonQuestionmarkAudienceScore = document.querySelector('.score-detail__help--audience-score');


	buttonQuestionmarkTomatometer.addEventListener('click', function(){

		let descriptiveTextTomatometer = document.querySelector('p.score-detail__tooltip-text:nth-child(1)');
		// "TOMATOMETER" descriptive text - Append '(=6 stars or higher)'
		descriptiveTextTomatometer.innerHTML = descriptiveTextTomatometer.innerHTML.replace('review', 'review (=6 stars or higher)');

	});


	buttonQuestionmarkAudienceScore.addEventListener('click', function(){

		let descriptiveTextAudienceScode = document.querySelector('.score-detail__tooltip-content');
		// "AUDIENCE SCORE" descriptive text - modify in the text, from '3.5 stars or higher' to '7 stars or higher'
		descriptiveTextAudienceScode.innerHTML = descriptiveTextAudienceScode.innerHTML.replace(/([\d.]+)( stars)/g, function (m, s1, s2) {
			return 2 * s1 + s2;
		});

	});


});
