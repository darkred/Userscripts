// ==UserScript==
// @name         Google YouTube search link
// @description  Adds a YouTube search link next to the Videos link (e.g. Web, Images, Videos, YouTube, News, Maps, Shopping, ...)
// @version      2017.6.9
// @author       wOxxOm, darkred
// @namespace    darkred
// @license      MIT License
// @include      https://www.google.com/*
// @include      /https?:\/\/(www\.)?google\.(com|(?:com?\.)?\w\w)\/.*/
// @grant        none
// @run-at       document-start
// ==/UserScript==

process();
new MutationObserver(process).observe(document, { childList: true, subtree: true });

function process(mutations) {
	var youtube = document.querySelector('#__YOUTUBE_SEARCH__');
	if (youtube)
		return;

	var menu = document.querySelector('#hdtb-msb');			// selector for the element that contains all the links (Web, Images, Videos, News, Maps, Shopping, ...)
	if (!menu)
		return;

	var menuContainer = menu.querySelector('.hdtb-imb').parentNode;

	if (!youtube) {
		var q = '',
			queryElement = document.querySelector('input[name="q"]');		// selector for the Google search input textbox
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
		} else if ((q = location.href.match(/^.+?(?:[#\/&?](?:q|query))=(.+?)(?:|&.+|\|.+)$/)))
			q = q[1];

		var node = document.querySelector(`a[href*='tbm=vid']`);			// selector for the 'Videos' link (works in any Google search page language)
		var text =  '<div class="hdtb-mitem hdtb-imb" id="__YOUTUBE_SEARCH__">' +
					'<a class="q qs" href="https://www.youtube.com/results?search_query=' + q + '">YouTube</a>' +
					'</div>';
		node.parentElement.insertAdjacentHTML('afterend', text);		// insert the YouTube link
	}

	new MutationObserver(process).observe(menuContainer, { childList: true });
}
