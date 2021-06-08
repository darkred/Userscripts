// ==UserScript==
// @name        ProtonMail - remove forced signature
// @namespace   darkred
// @version     2021.6.9
// @description Removes the forced ProtonMail signature from the 'New message' textboxes
// @author      darkred
// @license     MIT
// @include     https://mail.protonmail.com/*
// @include     https://protonirockerxow.onion/*
// @grant       none
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @supportURL  https://github.com/darkred/Userscripts/issues
// @icon        https://protonmail.com/images/favicon.ico
// ==/UserScript==

const elementToWatch = 'iframe[title="Editor"]';
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
					const parent = node.parentElement;

					node.previousSibling.remove(); 	// remove (the element that contains a) leftover newline (<br>)
					node.remove();  				// remove the signature element itself

					// Simulate a 'Delete' key press on the message textarea
					parent.children[0].dispatchEvent(new KeyboardEvent('keydown', {'key':'Delete'} ));
					parent.children[0].dispatchEvent(new KeyboardEvent( 'keyup' , {'key':'Delete'} ));

					observer.disconnect();
				}
			});

		});
	};

	const observer = new MutationObserver(callback);
	observer.observe(iframe, config);

});
