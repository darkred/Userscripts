// ==UserScript==
// @name         IMDb user reviews pages - ten star ratings
// @namespace    darkred
// @license      MIT
// @description  In IMDb user reviews pages, display the ratings with 10 stars, instead of just 1
// @version      2018.4.30
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


const fillColor = ['#e8e7e7', '#e6e5e5']; // default (almost white --> a bit darker)
// const fillColor = ['#2b2b2b', '#2f2f2f']; // for use with a dark style



function addStars(){

	let stars = document.querySelectorAll('.ipl-star-icon');

	for (let i = 0; i < stars.length; i++) {

		if (stars[i].parentNode.children.length !== 12) {  // if not already 10-star (+ 2 elements)

			let rating = Number(stars[i].nextElementSibling.textContent);
			for (let j = 0; j < 9; j++) {   // 9 more stars to each line
				let clone = stars[i].cloneNode(true);
				stars[i].parentNode.insertBefore(clone, stars[i].nextSibling);  // https://stackoverflow.com/questions/11117519/inserting-a-clone-after-the-original

			}


			for (let j = 0; j < 10; j++) {

				if (j > rating-1 ) {
					if (i % 2 === 0){  // https://stackoverflow.com/a/12984254  (odd/even iterations of the loop)
						stars[i].parentNode.children[j].children[1].setAttribute('style', 'fill:' + fillColor[0] + ';'); 	// for use with this style: https://userstyles.org/styles/98447/imdb-com-nightmode  ---> OK
					} else {
						stars[i].parentNode.children[j].children[1].setAttribute('style', 'fill:' + fillColor[1] + ';'); 	// for use with this style: https://userstyles.org/styles/98447/imdb-com-nightmode  ---> OK
					}
				}


			}
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



addStars();




var observer = new MutationObserver(function() {
	addStars();
}).observe(document.querySelector('div.lister-list'), 	// target of the observer: the "pics" area element, with rows that contain 3 pics each (watching for 'row' element additions)
	{
		// attributes: true,
		childList: true,
		// characterData: true,
		// subtree: true,
	}); // config of the observer