// ==UserScript==
// @name        ProtonMail - remove forced signature
// @namespace   darkred
// @version     1
// @description Removes the forced ProtonMail signature from the 'New message' textboxes
// @author      darkred
// @license     MIT
// @include     https://mail.protonmail.com/*
// @grant       none
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js

// ==/UserScript==

// wait for the formatting toolbar element to be created
document.arrive('.squireToolbar-row-1', function () {
	// select the signature element and empty its innerHTML
	document.querySelector('.squireIframe').contentDocument.querySelector('div.protonmail_signature_block-proton').innerHTML = '';
	// document.querySelector('.squireIframe').contentDocument.querySelector('div.protonmail_signature_block-proton').remove();
});
