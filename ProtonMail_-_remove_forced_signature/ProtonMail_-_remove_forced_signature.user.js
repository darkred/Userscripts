// ==UserScript==
// @name        ProtonMail - remove forced signature
// @namespace   darkred
// @version     2022.6.11
// @description Removes the forced ProtonMail signature from the 'New message' textboxes
// @author      darkred
// @license     MIT
// @include     https://mail.protonmail.com/*
// @include     https://mail.proton.me/*
// @include     https://protonirockerxow.onion/*
// @include     https://protonmailrmez3lotccipshtkleegetolb73fuirgj7r4o4vfu7ozyd.onion/*
// @grant       none
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @supportURL  https://github.com/darkred/Userscripts/issues
// @icon        https://proton.me/favicons/favicon.ico
// ==/UserScript==

const elementToWatch = 'iframe[title="Email composer"]';
document.arrive(elementToWatch, function () {
	let iframe = this.contentDocument; // refers to the newly created element

	const config = {
		childList: true,
		subtree: true
	};

	const callback = function(mutationList, observer) {
		mutationList.forEach( (mutation) => {
			mutation.addedNodes.forEach( (node) => {
				if (node.className === 'protonmail_signature_block') {

					// DOM STRUCTURE:
					//
					// The 2 previous element siblings of the main signature element, '.protonmail_signature_block', are both <div> elements with <br>:
					//                                  <br>  | <br> | .protonmail_signature_block
					//
					// The '.protonmail_signature_block' itself has 3 <div> children which can be:
					// (when user signature doesn't exist) 2 with <br>, and the proton signature
					//                                  <br>  | <br> | .protonmail_signature_block-proton
					// (when user signature exists) the user signature (.protonmail_signature_block-user) , 1 with <br> , and the signature itself
					//       .protonmail_signature_block-user | <br> | .protonmail_signature_block-proton
					//
					// Our aim is:
					// 1. if there user signature exists, to also remove the 2 <br> elements before the main '.protonmail_signature_block' element.
					// 2. Regardless of whether user signature exists, to remove the last element ('.protonmail_signature_block-proton') and the <br> before it.

					const signatureUser   = '.protonmail_signature_block-user';
					const signatureProton = '.protonmail_signature_block-proton';

					if (node.querySelector(signatureUser).firstElementChild.innerText === '' ) {
						node.previousElementSibling.remove();
						node.previousElementSibling.remove();
					}

					node.querySelector(signatureProton).previousElementSibling.remove();
					node.querySelector(signatureProton).remove();

					observer.disconnect();
				}
			});

		});
	};

	const observer = new MutationObserver(callback);
	observer.observe(iframe, config);

});
