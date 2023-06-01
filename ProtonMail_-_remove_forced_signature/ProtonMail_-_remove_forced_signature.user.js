// ==UserScript==
// @name        ProtonMail - remove forced signature
// @namespace   darkred
// @version     2023.6.1
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

				const refNode = 'protonmail_signature_block';

				if (node.className === refNode) {

					// DOM STRUCTURE:
					//
					// The 2 previous element siblings of the main signature element, '.protonmail_signature_block', both contain a <div> element with a <br> inside, i.e. <br>  =   <div> \ <br>  ) :
					//                                  <div> \ <br>  |  <div> \ <br>  |  .protonmail_signature_block
					//
					// The '.protonmail_signature_block' itself has either 3 or 2 <div> children which can be:
					//
					// (when user signature doesn't exist) the (empty) user signature , and the proton signature
					// .protonmail_signature_block-user.protonmail_signature_block-empty | .protonmail_signature_block-proton
					//
					// (when user signature exists) the user signature , 1 <div> \ <br> , and the signature itself
					//       .protonmail_signature_block-user                    |  <div> \ <br>  |  .protonmail_signature_block-proton
					//
					// The script's functionality is:
					// 1a. If user signature exists(=it's not empty), to remove the  <div> \ <br>  element before the last element ('.protonmail_signature_block-proton') ...
					// 1b. ... otherwise to remove the 2 <div> \ <br> elements before the main/reference '.protonmail_signature_block' element.
					// 2. To remove the last element ('.protonmail_signature_block-proton') itself.
					//
					// See DOM screenshots: https://imgur.com/a/VEI4nDQ


					const signatureProton = '.protonmail_signature_block-proton';


					if (!node.firstElementChild.classList.contains('protonmail_signature_block-empty')){
						node.querySelector(signatureProton).previousElementSibling.remove();
					} else {
						node.previousElementSibling.remove();
						node.previousElementSibling.remove();
					}

					node.querySelector(signatureProton).remove();


					observer.disconnect();
				}
			});

		});
	};

	const observer = new MutationObserver(callback);
	observer.observe(iframe, config);

});
