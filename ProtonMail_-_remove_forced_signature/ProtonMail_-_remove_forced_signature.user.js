// ==UserScript==
// @name        ProtonMail - remove forced signature
// @namespace   darkred
// @version     2020.12.01
// @description Removes the forced ProtonMail signature from the 'New message' textboxes
// @author      darkred
// @license     MIT
// @include     https://mail.protonmail.com/*
// @include     https://beta.protonmail.com/*
// @grant       none
// @require     https://cdn.rawgit.org/greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @supportURL  https://github.com/darkred/Userscripts/issues
// @icon        https://cdn.rawgit.org/icons.duckduckgo.com/ip2/protonmail.com.ico
// ==/UserScript==

const isInBeta = window.location.href.includes('beta');

var elementToWatch;
isInBeta? elementToWatch = '.squireIframe' : elementToWatch = '.squireToolbar-row-1';


// wait for the formatting toolbar element to be created
document.arrive(elementToWatch, function () {

	// debugger

	let iframe;



	if (!isInBeta) {

		iframe = document.querySelector('.squireIframe').contentDocument;
		iframe.querySelector('.protonmail_signature_block').remove();   // remove the signature element
		iframe.querySelector('body > div:last-child').remove();         // remove (the element that contains a) leftover newline (<br>)

	} else {

		iframe = this.contentDocument;

		// Setup the config
		const config = {
			childList: true,
			subtree: true
		};

		const callback = function callback(mutationList, observer) {
			mutationList.forEach( (mutation) => {
				mutation.addedNodes.forEach( (node) => {
					if (node.className === 'protonmail_signature_block') {
						node.remove();
						observer.disconnect();
					}});

			});
		};

		// Watch the iframe for changes
		const observer = new MutationObserver(callback);
		observer.observe(iframe, config);
	}
});
