// ==UserScript==
// @name         Google YouTube search link
// @namespace    darkred
// @author       wOxxOm, darkred
// @license      MIT
// @description  Adds a YouTube search link next to the Videos link (e.g. Web, Images, Videos, YouTube, News, Maps, Shopping, ...)
// @version      2022.5.27
// @include      https://www.google.com/*
// @include      /https?:\/\/(www\.)?google\.(com|(?:com?\.)?\w\w)\/.*/
// @grant        none
// @run-at       document-start
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==

const escapeHTMLPolicy = (({ trustedTypes }, policy) =>
	trustedTypes
		? trustedTypes.createPolicy('myEscapePolicy', policy)
		: policy)(window, {
	createHTML: (str) => str,
});

process();
new MutationObserver(process).observe(document, { childList: true, subtree: true });

function process(mutations) {
	var youtube = document.querySelector('#__YOUTUBE_SEARCH__');
	if (youtube)
		return;

	// Selectors for the bar element that contains all the links (Web, Images, Videos, News, Maps, Shopping, ...)
	// '.ndYZfc', is for when the 'Images' tab is selected. The other, '#hdtb', is for all other cases.
	var menu = document.querySelector('#hdtb, .ndYZfc');
	if (!menu)
		return;

	var menuContainer = menu.querySelector('#hdtb-msb, .tAcEof').parentNode;	// '.tAcEof' is for when the 'Images' tab is selected. The other, '#hdtb-msb', is for all other cases.

	if (!youtube) {
		var q = '',
			queryElement = document.querySelector('input[name="q"]');		// The google search input textbox
		if (queryElement) {
			if (queryElement.value)
				q = encodeURIComponent(queryElement.value);
			else {
				new MutationObserver(function(mut) {
					if (queryElement.value) {
						var youtube = document.querySelector('#__YOUTUBE_SEARCH__');
						if (youtube) {
							this.disconnect();
							youtube.querySelector('a').href += encodeURIComponent(queryElement.value);
						}
					}
				}).observe(queryElement, { attributes: true, attributeFilter: ['value'] });			// monitor the textbox for changes (your typed criteria)
			}
		} else if ((q = location.href.match(/^.+?(?:[#/&?](?:q|query))=(.+?)(?:|&.+|\|.+)$/)))
			q = q[1];

		// Source URL: https://upload.wikimedia.org/wikipedia/commons/c/c9/YouTube_play_buttom_dark_icon_%282013-2017%29.svg
		// No change is done to its source code (the only thing applied to it is the CSS below)
		var svg = `
		<svg version="1.1" id="YouTube_Icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
			 y="0px" viewBox="0 0 1024 721" enable-background="new 0 0 1024 721" xml:space="preserve">
		<path id="Triangle" fill="#FFFFFF" d="M407,493l276-143L407,206V493z"/>
		<path id="The_Sharpness" opacity="0.12" fill-rule="evenodd" clip-rule="evenodd" d="M407,206l242,161.6l34-17.6L407,206z"/>
		<g id="Lozenge">
			<g>
				<path fill="#282928" d="M1013,156.3c0,0-10-70.4-40.6-101.4C933.6,14.2,890,14,870.1,11.6C727.1,1.3,512.7,1.3,512.7,1.3h-0.4
					c0,0-214.4,0-357.4,10.3C135,14,91.4,14.2,52.6,54.9C22,85.9,12,156.3,12,156.3S1.8,238.9,1.8,321.6v77.5
					C1.8,481.8,12,564.4,12,564.4s10,70.4,40.6,101.4c38.9,40.7,89.9,39.4,112.6,43.7c81.7,7.8,347.3,10.3,347.3,10.3
					s214.6-0.3,357.6-10.7c20-2.4,63.5-2.6,102.3-43.3c30.6-31,40.6-101.4,40.6-101.4s10.2-82.7,10.2-165.3v-77.5
					C1023.2,238.9,1013,156.3,1013,156.3z M407,493l0-287l276,144L407,493z"/>
			</g>
		</g>
		</svg>
		`;

		var text =  '<div class="hdtb-mitem" aria-selected="false" role="tab" id="__YOUTUBE_SEARCH__">' +
					'<a class="hide-focus-ring" href="https://www.youtube.com/results?search_query=' + q + '">' +
					'<span class="bmaJhd iJddsb" style="height:16px;width:16px">' + svg + '</span>YouTube' +
					'</a></div>';

		const isVideosTabSelected = !!document.querySelector('.hdtb-mitem.hdtb-msel path[d^="M10 16.5l6-4.5-6-4.5"]');
		var node = isVideosTabSelected === false ? document.querySelector(`a[href*='tbm=vid']`) : document.querySelector('path[d^="M10 16.5l6-4.5-6-4.5"]').closest('span').parentNode;


		// (when the selected/active tab is 'Images') select the 'Images' selected tab svg icon by its path[d] attribute
		var imagesTabSelected = !!document.querySelector('path[d^="M14 13l"]').closest('span.rQEFy');
		if (imagesTabSelected) {
			text =	'<a jsname="ONH4Gc" data-navigation="server" class="NZmxZe" data-hveid="CAEQAg" id="__YOUTUBE_SEARCH__"' +
					'href="https://www.youtube.com/results?search_query=' + q + '"><span class="m3kSL">' + svg + '</span>YouTube</a>';
			// select the (next, non-selected/non-active) 'Videos' tab svg icon by its path[d] attribute
			node = document.querySelector('path[d^="M10 16.5l6-4.5-6-4.5"]').closest('span');
		}

		const escaped = escapeHTMLPolicy.createHTML(text);
		node.parentElement.insertAdjacentHTML('afterend', escaped);		// insert the YouTube link

	}

	new MutationObserver(process).observe(menuContainer, { childList: true });
}


function addCss(cssString) {
	var head = document.getElementsByTagName('head')[0];
	var newCss = document.createElement('style');
	newCss.type = 'text/css';
	newCss.innerHTML = escapeHTMLPolicy.createHTML(cssString);
	head.appendChild(newCss);
}

addCss(`
 #__YOUTUBE_SEARCH__ svg {
	filter: invert(100%);
 }
`);
