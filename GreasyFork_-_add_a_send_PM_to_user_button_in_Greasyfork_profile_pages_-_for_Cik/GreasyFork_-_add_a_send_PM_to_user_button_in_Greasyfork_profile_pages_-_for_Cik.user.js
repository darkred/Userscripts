// ==UserScript==
// @name        GreasyFork - add a 'send PM to user' button in Greasyfork profile pages - for Citrus GFork
// @namespace   darkred
// @description It adds a 'send PM to user' button in Greasyfork profile pages
// @include     https://greasyfork.org/en/users/*
// @include     https://greasyfork.org/en/forum/messages/add
// @version     2016.10.03
// @grant       GM_getResourceURL
// @resource    icon http://i.imgur.com/ZU0xS0c.jpg
// @run-at      document-idle
// ==/UserScript==

if (document.querySelector('.user-profile-link > a:nth-child(1)') !== null){
	var yourProfileName = document.querySelector('.user-profile-link > a:nth-child(1)').innerHTML !== null;
}
if (document.querySelector('#user-profile > h1:nth-child(1)') !== null){
	var currentProfileName = document.querySelector('#user-profile > h1:nth-child(1)').textContent.replace('\'s Profile', '');
}
if (window.location.href.indexOf('users') > -1 // if current URL is a profile page
	&& yourProfileName != currentProfileName) { // ... and this profile page is not yours
	sessionStorage.setItem('recipient', currentProfileName); // store in sessionStorage the profileName (it will be inserted in the 'Recipients' textbox ) -after you press the button-
	var referenceNode = document.querySelector('#user-profile > h1:nth-child(1)');
	var a = document.createElement('input');
	referenceNode.appendChild(a);
	a.style.padding = '0px 12px';
	a.setAttribute('type', 'image');
	a.setAttribute('src', GM_getResourceURL('icon') );
	a.id = 'pmButton';
	a.title = 'Send PM to ' + currentProfileName;
	document.getElementById('pmButton').addEventListener('click', function() {
		window.open('https://greasyfork.org/en/forum/messages/add', '_self');
	});
}
if (window.location.href.indexOf('messages') !== -1) { // if current URL is a 'send PM' page
	// document.querySelector('#token-input-Form_To').value = sessionStorage.getItem('recipient') ; // .. then insert the stored value of 'recipient' in the 'Recipients' textbox
	document.querySelector('.token-input-token > p:nth-child(1)').innerText = sessionStorage.getItem('recipient') ; // .. then insert the stored value of 'recipient' in the 'Recipients' textbox
	document.querySelector('#Form_Body').focus();
}
