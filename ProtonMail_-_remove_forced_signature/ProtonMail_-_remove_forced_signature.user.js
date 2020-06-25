// ==UserScript==
// @name        ProtonMail - remove forced signature
// @namespace   darkred
// @version     2020.06.23
// @description Removes the forced ProtonMail signature from the 'New message' textboxes
// @author      darkred
// @license     MIT
// @include     https://mail.protonmail.com/*
// @include     https://beta.protonmail.com/*
// @grant       none
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==

// wait for the formatting toolbar element to be created
document.arrive('.squireToolbar-row-1', function () {
	let editorIframe = document.querySelector('.squireIframe').contentDocument;
	editorIframe.querySelector('.protonmail_signature_block').remove();   // remove the signature element
	editorIframe.querySelector('body > div:last-child').remove();         // remove (the element that contains a) leftover newline (<br>)
});
