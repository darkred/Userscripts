// ==UserScript==
// @name        GreasyFork - filter libraries in profiles
// @namespace   darkred
// @version     2018.9.6
// @description Filters libraries in GreasyFork profiles
// @author      darkred
// @license     MIT
// @include     https://greasyfork.org/*/users/*
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @grant       none
// ==/UserScript==


var all = document.querySelectorAll('li[data-script-type="public"], li[data-script-type="library"]').length;
var libraries = document.querySelectorAll('li[data-script-type="library"]').length;
var scripts = all - libraries;


var parentElement = document.querySelector('#script-list-sort');

var theFirstChild = parentElement.firstChild;

var div = document.createElement('div');
parentElement.insertBefore(div, theFirstChild);


div.style.position = 'fixed';
div.style.background = 'white';

div.style.top = '150px';
div.style.right = '287px';





var a = document.createElement('a');
div.appendChild(a);
a.innerHTML = '<span style="width:70px;float:left;">' + 'All: ' + '</span>' + '<span style="float:right;">' + all + '</span>' + '<br/>';
a.onclick = toggleAll;


var b = document.createElement('a');
div.appendChild(b);
b.innerHTML = '<span style="width:70px;float:left;">' + 'Scripts: ' + '</span>' + '<span style="float:right;">' + scripts + '</span>' + '<br/>';
b.onclick = toggleScripts;


var c = document.createElement('a');
div.appendChild(c);
c.innerHTML = '<span style="width:70px;float:left;">' + 'Libraries:  ' + '</span>' + '<span style="float:right;">' + libraries  + '</span>' + '<br/>';
c.onclick = toggleLibraries;


b.click();

function toggleAll(){
	a.style.fontWeight = 'bold'; b.style.fontWeight = 'normal'; c.style.fontWeight = 'normal';
	$('li[data-script-type="public"], li[data-script-type="library"]').show();
}


function toggleScripts(){
	a.style.fontWeight = 'normal'; b.style.fontWeight = 'bold'; c.style.fontWeight = 'normal';
	$('li[data-script-type="public"], li[data-script-type="library"]').hide();
	$('li[data-script-type="public"]').show();
}


function toggleLibraries(){
	a.style.fontWeight = 'normal'; b.style.fontWeight = 'normal'; c.style.fontWeight = 'bold';
	$('li[data-script-type="public"], li[data-script-type="library"]').hide();
	$('li[data-script-type="library"]').show();
}
