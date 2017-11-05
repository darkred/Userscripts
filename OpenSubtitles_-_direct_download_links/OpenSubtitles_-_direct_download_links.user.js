// ==UserScript==
// @name        OpenSubtitles - direct download links
// @namespace   darkred
// @description Converts the subtitles download links to direct ones, in order to avoid the redirection to download pages that display ads.
// @include     https://www.opensubtitles.org/*/search/*
// @include     https://www.opensubtitles.org/*/subtitles/*
// @version     1
// @grant       none
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// ==/UserScript==


// cases for the selectors:
// 1. https://www.opensubtitles.org/en/search/subs
// 2.https://www.opensubtitles.org/en/search/sublanguageid-all/idmovie-513313
// 3. https://www.opensubtitles.website/en/opensubtitles-player.subtitles-download/subtitles/7150264

var allLinks = document.querySelectorAll(`
	html body div.content fieldset table.smalltable tbody tr.change td:nth-child(4) a,
	html body div.content form#submultiedit table#search_results tbody tr td:nth-child(5) a,
	#bt-dwl-bt
	`);

for (var i = 0; i < allLinks.length; i++) {
	allLinks[i].href = allLinks[i].href.replace('subtitleserve/', 'download/vrf-108d030f/');
}

var old_element = document.querySelector('#bt-dwl-bt');
if (old_element){
	var new_element = old_element.cloneNode(true);
	old_element.parentNode.replaceChild(new_element, old_element);
}



// in order to avoid the redirections when you click the "Download" button on a subtitle page.
document.querySelector('#bt-dwl-bt').addEventListener('click', function(){
	$('#bt-dwl-bt').off();
});

$('#bt-dwl-bt').on('click', function(){
	window.location.href = document.querySelector('#bt-dwl-bt').href;
});
