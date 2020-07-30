// ==UserScript==
// @name        thepiratebay helper
// @namespace   darkred
// @version     2020.7.30
// @description Converts dates to local timezone on thepiratebay and optionally either highlight VIP/Trusted/Moderator/Helper torrents or hide non verified torrents altogether
// @authors     emptyparad0x, darkred
// @license     MIT
// @include     /^https?://thepiratebay\.(org|se|gd|la|mn|vg)/(search|browse|user|recent|torrent|description\.php|tv|music|top).*$/
// @grant       none
// @require     https://code.jquery.com/jquery-3.2.0.min.js
// @require     https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/keypress/2.1.4/keypress.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js
// @run-at      document-idle
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==

/* global GM_config, moment */


/*
if (document.querySelector('.viewswitch > a:nth-child(1)') && document.querySelector('.viewswitch > a:nth-child(1)').outerHTML.indexOf('Single</a>') !== -1 ) {
	$('body').append(`<center>In order thepiratebay helper to work, please switch the view mode of the search results to single-line <i>(click: 'Single' in the table header, and then reload the page (F5)</i>)</center>`);
	throw new Error('Not in single-line view mode. The usercript exits.');
}
*/



// Customize the strings in the locale to display "1 minute ago" instead of "a minute ago" (https://github.com/moment/moment/issues/3764#issuecomment-279928245)
moment.updateLocale('en', {
	relativeTime: {
		future: 'in %s',
		past:   '%s ago',
		s:  'seconds',
		m:  '1 minute',
		mm: '%d minutes',
		h:  '1 hour',
		hh: '%d hours',
		d:  '1 day',
		dd: '%d days',
		M:  '1 month',
		MM: '%d months',
		y:  '1 year',
		yy: '%d years'
	}
});




$('table td').css({ 'white-space': 'nowrap' });		// In order to prevent the text in all table cells from wrapping
$('#main-content').css({ 'overflow': 'visible' });	// Override the default rule which is 'hidden' ('#main-content' is the parent of the search results' 'table' element)



//GM_config stuff
GM_config.init('TPB Helper settings',{
	// timezone: {label: 'Text for Timezone:', type: 'text', cols: 10, default: 'EST'},
	// tpboffset: {label: 'TPB Timezone offset    : (GMT+1)  +', type: 'int', default: 0},             // Initially it was:   tpboffset:    { label: 'TPB Timezone: GMT+', type: 'int', default: 1 },
	enhanceVisibility: {label: 'Show all / Highlight trusted / Hide non-trusted:',	section: ['Extras'], type: 'select', options: ['Show all', 'Highlight','Hide'], default: 'Show all'},
	keepNonTrustedWithComments: {label: '...when toggle, include those non-trusted which have comments:', type: 'checkbox', default: true},
	relativeDates: {label: 'Display torrent timestamps in relative format:', type: 'checkbox', default: true},
	// swapVerifiedIconsWithComments: {label: 'Swap the verified icons with the Comments icon:', type: 'checkbox', default: true},
	RtColumn: {label: 'Add a Ratio column?', type: 'checkbox', default: true}
},{
	save: function(){location.reload();}
});

$('footer').append(`<center><a id='TimeChangerConfig'>TPB Helper settings</a></center>`);
$('#TimeChangerConfig').click(function(){GM_config.open();}).css({'cursor': 'pointer'});

// var timezone = GM_config.get('timezone');
// var tpboffset = GM_config.get('tpboffset');
var enhanceVisibility = GM_config.get('enhanceVisibility');
var keepNonTrustedWithComments = GM_config.get('keepNonTrustedWithComments');
var relativeDates = GM_config.get('relativeDates');
var RtColumn = GM_config.get('RtColumn');
// var swapVerifiedIconsWithCommentsChoice = GM_config.get('swapVerifiedIconsWithComments');






// For the Ratio column
function appendColumn() {
	var se, le, ratio;
	if (document.querySelector('span.list-header:nth-child(7)')){
		document.querySelector('span.list-header:nth-child(7)').insertAdjacentHTML('afterend', '<span class="list-item list-header item-seed"><label onclick="sortlist(7);" title="Seeds/Peers">Rt</label></span>');
	}
	var entries = document.querySelectorAll('li.list-entry > span:nth-child(7)');
	for (var i = 0; i < entries.length; i++) {
		se = parseInt(entries[i].previousElementSibling.innerHTML);   // Retrieve the content of the cell of the SE column and store it to variable se
		le = parseInt(entries[i].innerHTML);   // Retrieve the content of the cell of the LE column and store it to variable le
		if (se > 0 && le === 0){
			ratio = se;
		} else if (se === 0 || le === 0){
			ratio = 0;
		} else {
			ratio = se/le;
		}
		// ratio = (Math.round(10 * ratio) / 10);
		ratio = ratio.toFixed(1);
		entries[i].insertAdjacentHTML('afterend', '<span>' + ratio + '</span>');
		entries[i].nextSibling.className = 'list-item item-ratio';

		$('.item-ratio').css('text-align', 'right');
	}
}

if (RtColumn === true) {
	appendColumn();
	$('.list-item:last-child').css('text-align', 'right');  	// Select all Ratio values (=all last cells of all rows) and align them to the right


}

/*
if (swapVerifiedIconsWithCommentsChoice === true) {
	swapVerifiedIconsWithComments();
}
*/


//Check page
var url = window.location.href;
var host = window.location.host;
// if (url.indexOf(host + '/torrent/') !== -1) { 	// if current is a torrent page
if (url.indexOf(host + '/description.php') !== -1) { 	// if current is a torrent page
	if (relativeDates === true) {
		convertDatesInTorrentPage();
	}
} else {										// if current is search results


	// Enhance trusted torrents
	if (enhanceVisibility === 'Highlight') {
		highlight();
	}



	// Hide non trusted torrents
	var counter = 0;
	if (enhanceVisibility === 'Hide') {

		hideNonTrusted();	// the value of 'counter' increases inside the hideNonTrusted function execution
		if (counter > 0) {
			document.querySelector('#TimeChangerConfig').insertAdjacentHTML('afterend', '<br><i>' + counter  + ' non verified torrents hidden <br/> click here (or press `) to view all torrents with comments, <br/> or press ~ to view all</i>');
		}
		var flagHide = true;


		$('#TimeChangerConfig').nextAll().eq(1).on('click', toggleHide);

		var listener1 = new window.keypress.Listener();
		listener1.simple_combo('`', function() {
			toggleHide();
		});

		var listener2 = new window.keypress.Listener();
		listener2.simple_combo('~', function() {
			$(getAllTableLines()).each(function() {
				$(this).show();
			});
			$('#TimeChangerConfig').nextAll().eq(1).html('<i>click here (or press `) to view only verified torrents</i>');
			// if (swapVerifiedIconsWithCommentsChoice === true) {
			// 	restoreCommentIconsPosition();
			// }
		});



	}


}






function toggleHide() {

	if (counter > 0) {

		$(getAllTableLines()).each(function() {
			$(this).show();
		});

		// if (swapVerifiedIconsWithCommentsChoice === true) {
		// 	swapVerifiedIconsWithComments();
		// }


		if (flagHide === true) {

			if (keepNonTrustedWithComments === true){
				hideNonTrustedAndWithoutComments();
			} else {
				hideNonTrusted();
			}

			$('#TimeChangerConfig').nextAll().eq(1).html('<i>' + $('tbody > tr[style="display: none;"]').length  + '  torrents without comments hidden <br/>  click here (or press `) to view only verified torrents <br/> or press ~ to view all</i>');
			flagHide = false;

		} else {

			counter = 0;

			hideNonTrusted();

			$('#TimeChangerConfig').nextAll().eq(1).html('<i>' + counter  + ' non verified torrents hidden <br/> click here (or press `) to view all torrents with comments, <br/> or press ~ to view all</i>');
			flagHide = true;
		}
	}

}



function getAllTableLines(){
	if (  ($('#searchResult > tbody > tr:last-child td a:last-child img').attr('alt') === 'Next')) {	// if there's a Next button, i.e. the search results are multi plage
		// return $('table#searchResult tbody tr').not('#searchResult > tbody > tr:last-child');			// then ignore the last row of the table (the navigation links)
	} else {
		// return $('table#searchResult tbody tr');
		return $('#torrents > .list-entry');
	}

}




function swapVerifiedIconsWithComments(){

	// in order to swap the verified icons position with that of the comments
	$( '[title ~= "comments."]' ).each(function() {
		if (($(this).parent().parent().html().indexOf('alt="VIP"') > -1) ||
			($(this).parent().parent().html().indexOf('alt="Trusted"') > -1) ||
			($(this).parent().parent().html().indexOf('alt="Super Mod"') > -1) ||
			($(this).parent().parent().html().indexOf('Helper') > -1) ) {
			$(this).parent().children().last().insertBefore($(this));
		}
	});


	// // in order to move the verified icons before each uploader handle
	// $('img[alt="VIP"], img[alt="Trusted"], img[alt="Super Mod"], img[alt="Helper"]').each(function() {
	// 	$(this).insertBefore($(this).parent().parent().parent().parent().children().last().children().first());
	// 	// $(this).insertAfter($(this).parent().parent().parent().parent().children().last().children().first());
	// });

}



// function restoreCommentIconsPosition(){
// 	$( '[title ~= "comments."]' ).each(function() {
// 		if (($(this).prev().html().indexOf('alt="VIP"') > -1) ||
// 			($(this).prev().html().indexOf('alt="Trusted"') > -1) ||
// 			($(this).prev().html().indexOf('alt="Super Mod"') > -1) ||
// 			($(this).prev().html().indexOf('Helper') > -1) ) {
// 			$(this).prev().insertAfter($(this));
// 		}
// 	});
// }





function hideNonTrusted() {
	$(getAllTableLines()).each(function() {
		if (($(this).html().indexOf('alt="VIP"') === -1) &&
			($(this).html().indexOf('alt="Trusted"') === -1) && ($(this).html().indexOf('alt="Super Mod"') === -1) &&
			($(this).html().indexOf('Helper') === -1) ){
			$(this).hide();
			counter++;
		}
	});
}




function hideNonTrustedAndWithoutComments() {
	$(getAllTableLines()).each(function() {
		if (($(this).html().indexOf('alt="VIP"') === -1) &&
			($(this).html().indexOf('alt="Trusted"') === -1) &&
			($(this).html().indexOf('alt="Super Mod"') === -1) &&
			($(this).html().indexOf('Helper') === -1) &&
			($(this).html().indexOf('icon_comment.gif') === -1) ){
			$(this).hide();
			counter++;
		}
	});
}






function highlight() {

	// $('table#searchResult tbody tr').each(function() {
	$(getAllTableLines()).each(function() {
		if ($(this).html().indexOf('alt="VIP"') > -1) {
			$(this).css({
				'background-color': '#CFFECD'
			});
		} else if ($(this).html().indexOf('alt="Trusted"') > -1) {
			$(this).css({
				'background-color': '#F9D5DB'
			}); // (initially it was FECDFE)   and then FECDD9
		} else if ($(this).html().indexOf('alt="Super Mod"') > -1) {
			$(this).css({
				'background-color': '#DCDCDC'
			});
		} else if ($(this).html().indexOf('Helper') > -1) { // Extra line
			$(this).css({
				'background-color': '#33CCCC'
			});
		} else if ($(this).html().indexOf('src="https://piratebay.org/img/next.gif"') > -1) {
			//do nothing
		} else {
			$(this).css({
				'opacity': '0.5'
			});
			$(this).css({
				'background-color': 'white'
			});
		}
	});


}



// 2020-07-30

function convertDates() {
	// alert();
	// var dates = document.querySelectorAll('#searchResult > tbody > tr > td:nth-child(3)');
	var dates = document.querySelectorAll('#st > span.list-item.item-uploaded');
	for (var i = 0; i < dates.length; i++) {
		if (dates[i].title === '' ) {		// if it's the 1st time the function is called
			var initial = dates[i].innerHTML.replace(/&nbsp;/g, ' ').replace(/<\/?b>/g, '');
		} else {												// else (in consequent calls)
			initial = dates[i].title;
		}

		var temp = initial.trim();							// remove trailing spaces
		var today = moment().format('YYYY-MM-DD');

		if (temp === today) {
			dates[i].title = initial;
			dates[i].innerHTML = 'Today';
		} else {
			temp = moment(temp, 'YYYY-MM-DD', true);
			dates[i].innerHTML = temp.fromNow();
			// dates[i].setAttribute('relative', 'true');
			dates[i].title = temp.format('YYYY-MM-DD');
		}


	}
}

/*
if (relativeDates === true) {
	// recalculate the timestamps in relative format every 10 sec
	(function(){
		convertDates();
		setTimeout(arguments.callee, 1 * 10 * 1000);
	})();
}
*/
convertDates();

function convertDatesInTorrentPage(){

	var torrentTimestamp = document.querySelector('#uld');
	var initial = torrentTimestamp.innerHTML;
	var today = moment().format('YYYY-MM-DD');

	if (initial === today) {
		torrentTimestamp.title = initial;
		torrentTimestamp.innerHTML = 'Today';
	} 	else {
		torrentTimestamp.innerHTML = moment(initial, 'YYYY-MM-DD', true).fromNow();
		torrentTimestamp.title = initial;
	}


	// FOR THE COMMENT TIMESTAMPS  ----> Currently as of 7/30/20 "Currently, you can't comments in TPB torrents.  (https://pirates-forum.org/Thread-TPB-comments-new-account?pid=301381#pid301381) "
	var dates = document.querySelectorAll('#comments > div[id^="comment-"] > p');
	for (var i = 0; i < dates.length; i++) {
		// example: 2016-11-23 17:53 CET
		var currentElement = dates[i].childNodes[2];
		initial = currentElement.nodeValue.trim().replace('at ', '').slice(0, -1);
		currentElement.parentElement.title = initial;

	}
}
