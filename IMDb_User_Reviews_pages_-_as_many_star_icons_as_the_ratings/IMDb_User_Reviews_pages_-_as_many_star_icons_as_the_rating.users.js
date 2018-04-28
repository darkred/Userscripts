// ==UserScript==
// @name         IMDb User Reviews - as many star icons as the ratings
// @namespace    darkred
// @license      MIT
// @description  In IMDb User Reviews pages, display as many star icons as the ratings (in yellow) compared to the max rating, 10 (in black).
// @version      1
// @match        https://www.imdb.com/title/*/reviews*
// @grant        GM_addStyle
// ==/UserScript==



// Example:
// rating = 9
// is displayed as:
// 1 star + 9/10 text
//
// Therefore: (1 existing +)  8 more stars needed
// and, if element is larger than 9, i.e. >9, i.e.  10th then blacken it


let stars = document.querySelectorAll('.ipl-star-icon');

for (let i = 0; i < stars.length; i++) {

	let rating = Number(stars[i].nextElementSibling.textContent);
	// let extraStars = Number(stars[i].nextElementSibling.textContent) - 1;
	// for (let j = 0; j < extraStars-1; j++) {
	for (let j = 0; j < 9; j++) {   // 9 more stars to each line
		let clone = stars[i].cloneNode(true);
		stars[i].parentNode.insertBefore(clone, stars[i].nextSibling);  // https://stackoverflow.com/questions/11117519/inserting-a-clone-after-the-original

	}


	for (let j = 0; j < 10; j++) {
		if (j > rating-1 ) {
			stars[i].parentNode.children[j].children[1].setAttribute('style', 'fill: black;');
		}

	}

}


let CSS = `
	svg.ipl-star-icon {
		height: 18px;
		width: 18px;
		vertical-align: middle !important;
	}
`;
GM_addStyle(CSS);
