// ==UserScript==
// @name        Rotten Tomatoes Decimal Rating
// @namespace   darkred
// @version     5.0.1
// @description Changes base-5 Rating of Rotten Tomatoes to base-10
// @author      wOxxOm, darkred
// @license     MIT
// @match       https://*.rottentomatoes.com/*
// @grant       none
// ==/UserScript==


// Example URLs:
// https://www.rottentomatoes.com/m/birds_of_prey_2020
// https://www.rottentomatoes.com/m/toy_story_3



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

	let buttonVerifiedAudience = document.querySelector('div.score-detail__info-wrap-section:nth-child(2) > nav:nth-child(2) > button:nth-child(1)');
	let buttonAllAudience =      document.querySelector('div.score-detail__info-wrap-section:nth-child(2) > nav:nth-child(2) > button:nth-child(2)');
	[ buttonVerifiedAudience, buttonAllAudience ].forEach(function(element) {
		if (element) {
			element.addEventListener('click', function() {
				audienceScorex2();
			});
		}
	});



	// the '?' buttons for the two descriptive texts
	let buttonQuestionmarkTomatometer = document.querySelector('.score-detail__help--tomatometer');
	let buttonQuestionmarkAudienceScore = document.querySelector('.score-detail__help--audience-score');


	buttonQuestionmarkTomatometer.addEventListener('click', function(){

		let descriptiveTextTomatometer = document.querySelector('.score-detail__tooltip-content > p:nth-child(1)');
		// "TOMATOMETER" descriptive text - Append '(=6 stars or higher)'
		descriptiveTextTomatometer.innerHTML = descriptiveTextTomatometer.innerHTML.replace('review', 'review (=6 stars or higher)');

	});


	buttonQuestionmarkAudienceScore.addEventListener('click', function(){

		let descriptiveTextAudienceScode = document.querySelector('.score-detail__tooltip-content');
		// "AUDIENCE SCORE" descriptive text - Modify '3.5 stars or higher' to '7 stars or higher'
		descriptiveTextAudienceScode.innerHTML = descriptiveTextAudienceScode.innerHTML.replace(/([\d.]+)( stars)/g, function (m, s1, s2) {
			return 2 * s1 + s2;
		});

	});


});
