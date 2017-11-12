// ==UserScript==
// @name        thepiratebay helper
// @namespace   darkred
// @authors     emptyparad0x, darkred
// @license     MIT
// @description Converts dates to local timezone on thepiratebay and optionally either highlight VIP/Trusted/Moderator/Helper torrents or hide non verified torrents altogether
// @version     0.9.6m
// @date        2017.11.13
// @include     /^https?://thepiratebay\.(org|se|gd|la|mn|vg)/(search|browse|user|recent|torrent|tv|music|top).*$/
// @grant       none
// @require     https://code.jquery.com/jquery-3.2.0.min.js
// @require     https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/keypress/2.1.4/keypress.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.28.5/js/jquery.tablesorter.min.js
// @run-at      document-idle
// ==/UserScript==

/* global $:false, GM_config, moment */



if (document.querySelector('.viewswitch > a:nth-child(1)') && document.querySelector('.viewswitch > a:nth-child(1)').outerHTML.indexOf('Single</a>') !== -1 ) {
	$('body').append(`<center>In order thepiratebay helper to work, please switch the view mode of the search results to single-line <i>(click: 'Single' in the table header, and then reload the page (F5)</i>)</center>`);
	throw new Error('Not in single-line view mode. The usercript exits.');
}




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
	tpboffset: {label: 'TPB Timezone offset    : (GMT+1)  +', type: 'int', default: 0},             // Initially it was:   tpboffset:    { label: 'TPB Timezone: GMT+', type: 'int', default: 1 },
	enhanceVisibility: {label: 'Show all / Highlight trusted / Hide non-trusted:',	section: ['Extras'], type: 'select', options: ['Show all', 'Highlight','Hide'], default: 'Show all'},
	keepNonTrustedWithComments: {label: '...when toggle, include those non-trusted which have comments:', type: 'checkbox', default: true},
	relativeDates: {label: 'Display torrent timestamps in relative format:', type: 'checkbox', default: true},
	swapVerifiedIconsWithComments: {label: 'Swap the verified icons with the Comments icon:', type: 'checkbox', default: true},
	sortableRtColumn: {label: 'Add a sortable Ratio column?', type: 'checkbox', default: true}
},{
	save: function(){location.reload();}
});

$('body').append(`<center><a id='TimeChangerConfig'>TPB Helper settings</a></center>`);
$('#TimeChangerConfig').click(function(){GM_config.open();}).css({'cursor': 'pointer'});

// var timezone = GM_config.get('timezone');
var tpboffset = GM_config.get('tpboffset');
var enhanceVisibility = GM_config.get('enhanceVisibility');
var keepNonTrustedWithComments = GM_config.get('keepNonTrustedWithComments');
var relativeDates = GM_config.get('relativeDates');
var sortableRtColumn = GM_config.get('sortableRtColumn');
var swapVerifiedIconsWithCommentsChoice = GM_config.get('swapVerifiedIconsWithComments');






// For the sortable Ratio column
function appendColumn() {
	var se, le, ratio;
	if (document.querySelector('.header > th:nth-child(7)')){
		document.querySelector('.header > th:nth-child(7)').insertAdjacentHTML('afterend', '<th><abbr title="Seeders">Rt</abbr></th>');
	}
	var entries = document.querySelectorAll('#searchResult > tbody:nth-child(2) > tr > td:nth-child(7)');
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
		ratio = (Math.round(10 * ratio) / 10);
		entries[i].insertAdjacentHTML('afterend', '<td>' + ratio + '</td>');
		entries[i].nextSibling.className = 'ratioCol';
		$('.ratioCol').css('text-align', 'right');
	}

	$('table#searchResult').tablesorter({
		headers: {
			0: {sorter: false},
			1: {sorter: false},
			2: {sorter: false},
			3: {sorter: false},
			4: {sorter: false},
			5: {sorter: false},
			6: {sorter: false},
			7: {sorter: true}
		}
	});

}

if (sortableRtColumn === true) {
	appendColumn();
}


if (swapVerifiedIconsWithCommentsChoice === true) {
	swapVerifiedIconsWithComments();
}


//Check page
var url = window.location.href;
var host = window.location.host;
if (url.indexOf(host + '/torrent/') !== -1) {
	if (relativeDates === true) {
		convertDatesInTorrentPage();
	}
} else {


	// Enhance trusted torrents
	if (enhanceVisibility === 'Highlight') {
		highlight();
	}



	// Hide non trusted torrents
	var counter = 0;
	if (enhanceVisibility === 'Hide') {

		hideNonTrusted();
		if (counter > 0) {
			document.querySelector('#TimeChangerConfig').insertAdjacentHTML('afterend', '<br><i>' + counter  + ' non verified torrents hidden <br/> click here or press ` to view all torrents with comments, <br/> or press ~ to view all</i>');
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

		if (swapVerifiedIconsWithCommentsChoice === true) {
			swapVerifiedIconsWithComments();
		}


		if (flagHide === true) {

			if (keepNonTrustedWithComments === true){
				hideNonTrustedAndWithoutComments();
			} else {
				hideNonTrusted();
			}

			$('#TimeChangerConfig').nextAll().eq(1).html('<i>click here (or press `) to view only verified torrents</i>');
			flagHide = false;

		} else {

			counter = 0;

			hideNonTrusted();

			$('#TimeChangerConfig').nextAll().eq(1).html('<i>' + counter  + ' non verified torrents hidden - click here or press ` to view all torrents</i>');
			flagHide = true;
		}
	}

}



function getAllTableLines(){
	if (  ($('#searchResult > tbody > tr:last-child td a:last-child img').attr('alt') === 'Next')) {	// if there's a Next button, i.e. the search results are multi plage
		return $('table#searchResult tbody tr').not('#searchResult > tbody > tr:last-child');			// then ignore the last row of the table (the navigation links)
	} else {
		return $('table#searchResult tbody tr');
	}

}




function swapVerifiedIconsWithComments(){

	// in order to swap the verified icons position with that of the comments
	$( '[title ~= "comments."]' ).each(function() {
		if (($(this).parent().parent().html().indexOf('title="VIP"') > -1) ||
			($(this).parent().parent().html().indexOf('title="Trusted"') > -1) ||
			($(this).parent().parent().html().indexOf('title="Moderator"') > -1) ||
			($(this).parent().parent().html().indexOf('Helper') > -1) ) {
			$(this).parent().children().last().insertBefore($(this));
		}
	});


	// // in order to move the verified icons before each uploader handle
	// $('img[title="VIP"], img[title="Trusted"], img[title="Moderator"], img[title="Helper"]').each(function() {
	// 	$(this).insertBefore($(this).parent().parent().parent().parent().children().last().children().first());
	// 	// $(this).insertAfter($(this).parent().parent().parent().parent().children().last().children().first());
	// });

}



// function restoreCommentIconsPosition(){
// 	$( '[title ~= "comments."]' ).each(function() {
// 		if (($(this).prev().html().indexOf('title="VIP"') > -1) ||
// 			($(this).prev().html().indexOf('title="Trusted"') > -1) ||
// 			($(this).prev().html().indexOf('title="Moderator"') > -1) ||
// 			($(this).prev().html().indexOf('Helper') > -1) ) {
// 			$(this).prev().insertAfter($(this));
// 		}
// 	});
// }





function hideNonTrusted() {
	$(getAllTableLines()).each(function() {
		if (   ($(this).html().indexOf('title="VIP"') === -1) &&
			($(this).html().indexOf('title="Trusted"') === -1) && ($(this).html().indexOf('title="Moderator"') === -1) &&
			($(this).html().indexOf('Helper') === -1) ){
			$(this).hide();
			counter++;
		}
	});
}




function hideNonTrustedAndWithoutComments() {
	$(getAllTableLines()).each(function() {
		if (($(this).html().indexOf('title="VIP"') === -1) &&
			($(this).html().indexOf('title="Trusted"') === -1) &&
			($(this).html().indexOf('title="Moderator"') === -1) &&
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
		if ($(this).html().indexOf('title="VIP"') > -1) {
			$(this).css({
				'background-color': '#CFFECD'
			});
		} else if ($(this).html().indexOf('title="Trusted"') > -1) {
			$(this).css({
				'background-color': '#F9D5DB'
			}); // (initially it was FECDFE)   and then FECDD9
		} else if ($(this).html().indexOf('title="Moderator"') > -1) {
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



function convertDates() {
	// alert();
	var dates = document.querySelectorAll('#searchResult > tbody > tr > td:nth-child(3)');
	for (var i = 0; i < dates.length; i++) {
		if (dates[i].title === '' ) {		// if it's the 1st time the function is called
			var initial = dates[i].innerHTML.replace(/&nbsp;/g, ' ').replace(/<\/?b>/g, '');
		} else {												// else (in consequent calls)
			initial = dates[i].title;
		}
		var temp = initial.trim();							// remove trailing spaces
		// 50 mins ago
		// Note: randomly, if the timestamps in browse/search lists are with in the 59 last mins (i.e. < 1 hour),
		// then they are displayed in relative format (in bold) i.e. already in GMT+1
		// instead of like this e.g. "Today 22:10", i.e. GMT, therefore it needs to be converted to GMT+1
		// 1 min ago
		if (temp.indexOf('mins ago') !== -1 || temp.indexOf('min ago') !== -1) {
			temp = moment().subtract(parseInt(temp), 'minutes');
			dates[i].setAttribute('relative', 'true');
		} else if (temp.indexOf('Today') !== -1) {
			// Today 22:10
			temp = temp.replace('Today', moment().format('MM-DD-YYYY'));
			temp = moment(temp, 'MM-DD-YYYY HH:mm');

		} else if (temp.indexOf('Y-day') !== -1) {
			// Y-day 22:02
			temp = temp.replace('Y-day', moment().subtract(1, 'days').format('MM-DD-YYYY'));
			temp = moment(temp, 'MM-DD-YYYY HH:mm');

		} else if (moment(temp, 'MM-DD HH:mm', true).isValid()) {
			// 03-24 07:32
			temp = moment(temp, 'MM-DD HH:mm');

		} else if (moment(temp, 'MM-DD YYYY', true).isValid()) {
			// 12-18 2016
			temp = moment(temp, 'MM-DD YYYY');

		} else {
			temp = moment(temp, 'MM-DD-YYYY HH:mm', true);
		}

		// if the displayed timestamp (from the page itself) is not in relative format and the 'offset' attribute is not set to true
		if (dates[i].getAttribute('offset') !== 'true' && dates[i].getAttribute('relative') !== 'true' ){
			temp.add(tpboffset + 1, 'hours');			// then add the offset (+1 hour) to 'temp'
			dates[i].setAttribute('offset', 'true');
		}



		// if the the examined time is later than now by 1 minutes or more  (e.g. for 1 min later it's: -1 min, -2 min, etc), i.e. it refers to yesterday,
		if (moment().diff(temp, 'minute') < 0 && dates[i].getAttribute('minus1day') !== 'true'){
			temp.subtract(1, 'days');					// ..then subtract 1 day from it
			dates[i].setAttribute('minus1day', 'true');
		}


		dates[i].innerHTML = temp.fromNow();
		dates[i].title = temp.format('MM-DD-YYYY HH:mm');


	}
}

if (relativeDates === true) {
	// recalculate the timestamps in relative format every 10 sec
	(function(){
		convertDates();
		setTimeout(arguments.callee, 1 * 10 * 1000);
	})();
}

function convertDatesInTorrentPage(){
	// FOR THE TORRENT TIMESTAMP
	// example: 2017-03-29 17:54:56 GMT
	var torrentTimestamp = document.querySelector('.col2 > dd:nth-child(2)');
	var initial = torrentTimestamp.innerHTML;
	torrentTimestamp.innerHTML = moment(initial, 'YYYY-MM-DD HH:mm:ss').add(tpboffset + 1, 'hour').fromNow();
	torrentTimestamp.title = initial;

	// FOR THE COMMENT TIMESTAMPS
	var dates = document.querySelectorAll('#comments > div[id^="comment-"] > p');
	for (var i = 0; i < dates.length; i++) {
		// example: 2016-11-23 17:53 CET
		var currentElement = dates[i].childNodes[2];
		initial = currentElement.nodeValue.trim().replace('at ', '').slice(0, -1);
		currentElement.nodeValue = ' ' + moment(initial, 'YYYY-MM-DD HH:mm zz').add(tpboffset + 1, 'hour').fromNow();
		currentElement.parentElement.title = initial;

	}
}
