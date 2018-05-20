// ==UserScript==
// @name        Userstyles - filter deleted styles in your profile
// @namespace   darkred
// @version     1
// @description Filters deleted styles in your profile in userstyles.org
// @author      darkred
// @license     MIT
// @include     /^https:\/\/userstyles.org\/users\/[0-9]*/
// @grant       none
// ==/UserScript==


if (document.querySelector('#main-article > ul:nth-child(1) > li:nth-child(1) > a:nth-child(1)')) {		// if in your own profile

	var all = document.querySelectorAll('tr').length - 1;
	var deleted = document.querySelectorAll('.obsolete').length;
	var scripts = all - deleted;


	var parentElement = document.querySelector('#left-sidebar');

	var theFirstChild = parentElement.firstChild;

	var div = document.createElement('div');
	parentElement.insertBefore(div, theFirstChild);


	div.style.position = 'fixed';
	div.style.background = 'white';

	div.style.top = '210px';
	div.style.right = '257px';





	var a = document.createElement('a');
	div.appendChild(a);
	a.innerHTML = '<span style="width:70px;float:left;">' + 'All: ' + '</span>' + '<span style="float:right;">' + all + '</span>' + '<br/>';
	a.onclick = toggleAll;


	var b = document.createElement('a');
	div.appendChild(b);
	b.innerHTML = '<span style="width:70px;float:left;">' + 'Active: ' + '</span>' + '<span style="float:right;">' + scripts + '</span>' + '<br/>';
	b.onclick = toggleScripts;


	var c = document.createElement('a');
	div.appendChild(c);
	c.innerHTML = '<span style="width:70px;float:left;">' + 'Deleted:  ' + '</span>' + '<span style="float:right;">' + deleted  + '</span>' + '<br/>';
	c.onclick = toggledeleted;


	b.click();



}



function toggleAll(){
	a.style.fontWeight = 'bold'; b.style.fontWeight = 'normal'; c.style.fontWeight = 'normal';
	$('tr').show();
	$('.obsolete').parent().show();
}


function toggleScripts(){
	a.style.fontWeight = 'normal'; b.style.fontWeight = 'bold'; c.style.fontWeight = 'normal';
	$('tr').show();
	$('.obsolete').parent().hide();					// Initially hide the obsolete userstyles
}


function toggledeleted(){
	a.style.fontWeight = 'normal'; b.style.fontWeight = 'normal'; c.style.fontWeight = 'bold';
	$('tr').show();
	$('tr').not($('tr .obsolete').parent()).not($('tr:first')).hide();


}
