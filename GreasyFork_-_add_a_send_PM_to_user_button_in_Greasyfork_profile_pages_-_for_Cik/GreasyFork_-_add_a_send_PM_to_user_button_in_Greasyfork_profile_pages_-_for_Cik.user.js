// ==UserScript==
// @name         GreasyFork - add a 'send PM to user' button in Greasyfork profile pages - for Citrus GFork
// @namespace    darkred
// @license      MIT
// @version      2018.2.27
// @description  It adds a 'send PM to user' button in Greasyfork profile pages (it now works even without Citrus GFork).
// @author       darkred
// @include      https://greasyfork.org/*/users/*
// @include      https://greasyfork.org/*/forum/messages/add
// @include      https://sleazyfork.org/*/users/*
// @include      https://sleazyfork.org/*/forum/messages/add
// @require      https://greasyfork.org/scripts/24818-bililiterange/code/bililiteRange.js
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://greasyfork.org/scripts/24819-jquery-simulate/code/jquery-simulate.js
// @require      https://greasyfork.org/scripts/24820-jquery-simulate-ext/code/jquery-simulate-ext.js
// @require      https://greasyfork.org/scripts/24822-jquery-simulate-key-sequence-js/code/jquerysimulatekey-sequencejs.js
// @require      https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js
// @run-at       document-idle
// @grant        none
// ==/UserScript==

if (document.querySelector('.user-profile-link > a:nth-child(1)') !== null) {
	var yourProfileName = document.querySelector('.user-profile-link > a:nth-child(1)').innerHTML;
}
if (document.querySelector('.text-content > h2:nth-child(1)') !== null) {
	var targetProfileName = document.querySelector('.text-content > h2:nth-child(1)').textContent.replace('\'s Profile', '');
}
if (window.location.href.indexOf('users') !== -1 // if current URL is a profile page
	&& yourProfileName !== targetProfileName) { // ... and this profile page is not yours
	sessionStorage.setItem('recipient', targetProfileName); // store in sessionStorage the profileName (it will be inserted in the 'Recipients' textbox ) -after you press the button-
	var referenceNode = document.querySelector('.text-content > h2:nth-child(1)');
	var a = document.createElement('input');
	referenceNode.appendChild(a);
	a.style.padding = '0px 12px';
	a.setAttribute('type', 'image');
	// http://i.imgur.com/ZU0xS0c.jpg
	a.setAttribute('src', 'data:image/jpeg;base64,/9j/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAATABcDAREAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABwAICf/EACgQAAEEAQMCBQUAAAAAAAAAAAECAwQFEQAGEgcIEyEiMUEUNmGl4//EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDof1i6ryOlkCHIi0YvlvJdccjpl+A4203x5OAcFFQHMZx7A59skAMDvnyfsj9t/DQPnS/fUnqDtxyxmVQpJbb5YdgGT462jxSoBZ4p4qIWDxIyMjPn5ADTuZg3ibzZN1R0c+7kVf1q0twoy3gh1QZDZcCQfTkFWD5K4lPzoAqDXblqLJq7r+kVoxuFDiXA85AkOQ0KBBKm43h+lR/KylOfSkYGA0f2x0s6m2demdVz6gzLt+W1Gsm1oeCFNM+/IAqwQpPL5450DBoLQWg//9k=');
	a.id = 'pmButton';
	a.title = 'Send PM to ' + targetProfileName;
	var lang = String(window.location).match(/^https:\/\/greasyfork\.org\/([a-zA-Z-]+)\/.*$/)[1];
	document.getElementById('pmButton').addEventListener('click', function() {
		window.open('https://greasyfork.org/' + lang + '/forum/messages/add', '_self');
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
