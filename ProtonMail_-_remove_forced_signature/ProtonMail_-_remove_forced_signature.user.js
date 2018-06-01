// ==UserScript==
// @name        ProtonMail - remove forced signature
// @namespace   darkred
// @license     MIT
// @description Removes the forced ProtonMail signature from the 'New message' textboxes
// @version     1
// @include     https://mail.protonmail.com/*
// @grant       none
// @require     https://github.com/uzairfarooq/arrive/raw/master/minified/arrive.min.js
// ==/UserScript==

// wait for the formatting toolbar element to be created
document.arrive('.squireToolbar-row-1', function () {
	// select the signature element and empty its innerHTML
	document.querySelector('.squireIframe').contentDocument.querySelector('div.protonmail_signature_block-proton').innerHTML = '';
	// document.querySelector('.squireIframe').contentDocument.querySelector('div.protonmail_signature_block-proton').remove();
});
