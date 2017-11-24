// ==UserScript==
// @name         GreasyFork - add a 'send PM to user' button in Greasyfork profile pages
// @namespace    darkred
// @license      MIT
// @description  It adds a 'send PM to user' button in Greasyfork profile pages
// @version      2017.11.24
// @include      https://greasyfork.org/*/users/*
// @include      https://greasyfork.org/*/forum/messages/add
// @grant        none
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
	// http://i.imgur.com/ZU0xS0c.jpg
	a.setAttribute('src', 'data:image/jpeg;base64,/9j/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAATABcDAREAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABwAICf/EACgQAAEEAQMCBQUAAAAAAAAAAAECAwQFEQAGEgcIEyEiMUEUNmGl4//EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDof1i6ryOlkCHIi0YvlvJdccjpl+A4203x5OAcFFQHMZx7A59skAMDvnyfsj9t/DQPnS/fUnqDtxyxmVQpJbb5YdgGT462jxSoBZ4p4qIWDxIyMjPn5ADTuZg3ibzZN1R0c+7kVf1q0twoy3gh1QZDZcCQfTkFWD5K4lPzoAqDXblqLJq7r+kVoxuFDiXA85AkOQ0KBBKm43h+lR/KylOfSkYGA0f2x0s6m2demdVz6gzLt+W1Gsm1oeCFNM+/IAqwQpPL5450DBoLQWg//9k=');
	referenceNode.appendChild(a);


	document.getElementById('pmButton').addEventListener('click', function() {
		window.open('https://greasyfork.org/en/forum/messages/add', '_self');
	});


}



if (window.location.href.indexOf('messages') > -1) { // if current URL is a 'send PM' page
	document.querySelector('#Form_To').innerHTML = sessionStorage.getItem('recipient'); // .. then insert the stored value of 'recipient' in the 'Recipients' textbox
}
