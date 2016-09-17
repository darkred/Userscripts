// ==UserScript==
// @name        GreasyFork - add a 'send PM to user' button in Greasyfork profile pages
// @namespace   darkred
// @description It adds a 'send PM to user' button in Greasyfork profile pages
// @include     https://greasyfork.org/en/users/*
// @include     https://greasyfork.org/en/forum/messages/add
// @version     2015.12.23
// @grant       GM_getResourceURL
// @resource    icon http://i.imgur.com/ZU0xS0c.jpg
// ==/UserScript==

if (window.location.href.indexOf('users') > -1 // if current URL is a profile page
    && document.querySelector('.user-profile-link > a:nth-child(1)').innerHTML != document.querySelector('div.width-constraint:nth-child(2) > h2:nth-child(1)').innerHTML) { // ... and this profile page is not yours

    var profileName = document.querySelector('div.width-constraint:nth-child(2) > h2:nth-child(1)').innerHTML;
    sessionStorage.setItem('recipient', profileName); // store in sessionStorage the profileName (it will be inserted in the 'Recipients' textbox ) -after you press the button-

    var referenceNode = document.querySelector('div.width-constraint:nth-child(2) > h2:nth-child(1)');
    var a = document.createElement('input');
    referenceNode.appendChild(a);

    a.style.padding = '0px 12px';
    a.setAttribute('type', 'image');
    a.setAttribute('src', GM_getResourceURL('icon') );
    a.id = 'pmButton';
    a.title = 'Send PM to ' + profileName;

    document.getElementById('pmButton').addEventListener('click', function() {
        window.open('https://greasyfork.org/en/forum/messages/add', '_self');
    });


}



if (window.location.href.indexOf('messages') > -1) { // if current URL is a 'send PM' page
    document.querySelector('#Form_To').innerHTML = sessionStorage.getItem('recipient'); // .. then insert the stored value of 'recipient' in the 'Recipients' textbox
}
