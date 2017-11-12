// ==UserScript==
// @name         GreasyFork - add a 'send PM to user' button in Greasyfork profile pages
// @namespace    darkred
// @license      MIT
// @description  It adds a 'send PM to user' button in Greasyfork profile pages
// @version      2016.11.4
// @include      https://greasyfork.org/*/users/*
// @include      https://greasyfork.org/*/forum/messages/add
// @grant        GM.getResourceUrl
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @resource     icon http://i.imgur.com/ZU0xS0c.jpg
// ==/UserScript==

if (window.location.href.indexOf('users') > -1 // if current URL is a profile page
	&& document.querySelector('.user-profile-link > a:nth-child(1)').innerHTML != document.querySelector('section.text-content:nth-child(1) > h2:nth-child(1)').innerHTML) { // ... and this profile page is not yours

	var profileName = document.querySelector('section.text-content:nth-child(1) > h2:nth-child(1)');
	sessionStorage.setItem('recipient', profileName); // store in sessionStorage the profileName (it will be inserted in the 'Recipients' textbox ) -after you press the button-

	var referenceNode = document.querySelector('section.text-content:nth-child(1) > h2:nth-child(1)');
	var a = document.createElement('input');

	a.style.padding = '0px 12px';
	a.setAttribute('type', 'image');
	a.id = 'pmButton';
	a.title = 'Send PM to ' + profileName;
	(async function() {
	  a.src = await GM.getResourceUrl('icon');
	})();
	referenceNode.appendChild(a);


	document.getElementById('pmButton').addEventListener('click', function() {
		window.open('https://greasyfork.org/en/forum/messages/add', '_self');
	});


}



if (window.location.href.indexOf('messages') > -1) { // if current URL is a 'send PM' page
	document.querySelector('#Form_To').innerHTML = sessionStorage.getItem('recipient'); // .. then insert the stored value of 'recipient' in the 'Recipients' textbox
}
