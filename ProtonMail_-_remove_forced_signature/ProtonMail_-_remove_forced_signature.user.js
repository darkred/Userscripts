// ==UserScript==
// @name        ProtonMail - remove forced signature
// @namespace   darkred
// @version     2022.5.25
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
					const parent = node.parentElement; // it's '#squire' and has 3 children: two with <br> and the signature itself

					node.previousSibling.remove(); 	// remove the element that contains a leftover newline (<br>)  ( children[1] )
					node.remove();  				// remove the signature element itself                         ( children[2] )

					// Simulate a 'Delete' key press on the message textarea to remove the remaining <br> element  ( children[0] )
					parent.firstChild.dispatchEvent(new KeyboardEvent('keydown', {'key':'Delete'} ));
					parent.firstChild.dispatchEvent(new KeyboardEvent( 'keyup' , {'key':'Delete'} ));

					observer.disconnect();
				}
			});

		});
	};

	const observer = new MutationObserver(callback);
	observer.observe(iframe, config);

});
