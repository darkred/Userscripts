// ==UserScript==
// @name        GreasyFork - add a 'send PM to user' button in Greasyfork profile pages - for Citrus GFork
// @namespace   darkred
// @description It adds a 'send PM to user' button in Greasyfork profile pages
// @include     https://greasyfork.org/en/users/*
// @include     https://greasyfork.org/en/forum/messages/add
// @version     2016.11.12
// @grant       GM_getResourceURL
// @resource    icon http://i.imgur.com/ZU0xS0c.jpg
// @run-at      document-idle
// @require     https://greasyfork.org/scripts/24818-bililiterange/code/bililiteRange.js
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @require     https://greasyfork.org/scripts/24819-jquery-simulate/code/jquery-simulate.js
// @require     https://greasyfork.org/scripts/24820-jquery-simulate-ext/code/jquery-simulate-ext.js
// @require     https://greasyfork.org/scripts/24822-jquery-simulate-key-sequence-js/code/jquerysimulatekey-sequencejs.js
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js?version=139586
// ==/UserScript==

if (document.querySelector('.user-profile-link > a:nth-child(1)') !== null) {
	var yourProfileName = document.querySelector('.user-profile-link > a:nth-child(1)').innerHTML;
}
if (document.querySelector('#user-profile > h1:nth-child(1)') !== null) {
	var currentProfileName = document.querySelector('#user-profile > h1:nth-child(1)').textContent.replace('\'s Profile', '');
}
if (window.location.href.indexOf('users') !== -1 // if current URL is a profile page
	&& yourProfileName !== currentProfileName) { // ... and this profile page is not yours
	sessionStorage.setItem('recipient', currentProfileName); // store in sessionStorage the profileName (it will be inserted in the 'Recipients' textbox ) -after you press the button-
	var referenceNode = document.querySelector('#user-profile > h1:nth-child(1)');
	var a = document.createElement('input');
	referenceNode.appendChild(a);
	a.style.padding = '0px 12px';
	a.setAttribute('type', 'image');
	a.setAttribute('src', GM_getResourceURL('icon'));
	a.id = 'pmButton';
	a.title = 'Send PM to ' + currentProfileName;
	document.getElementById('pmButton').addEventListener('click', function() {
		window.open('https://greasyfork.org/en/forum/messages/add', '_self');
	});
}

if (window.location.href.indexOf('messages') !== -1) { // if current URL is a 'send PM' page
	document.querySelector('#token-input-Form_To').focus();
	document.querySelector('#token-input-Form_To').style.width = 'auto';

	// 	document.querySelector('#token-input-Form_To').value = sessionStorage.getItem('recipient');
	var recipient = sessionStorage.getItem('recipient');
	$('#token-input-Form_To').simulate('key-sequence', { sequence: recipient, delay: 1 });

	document.arrive('.token-input-selected-dropdown-item', function () {
		triggerMouseEvent (document.querySelector('.token-input-selected-dropdown-item'), 'mousedown');
	});

}


function triggerMouseEvent (node, eventType) {
	var clickEvent = document.createEvent ('MouseEvents');
	clickEvent.initEvent (eventType, true, true);
	node.dispatchEvent (clickEvent);
}
