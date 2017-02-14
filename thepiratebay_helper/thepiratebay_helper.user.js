// ==UserScript==
// @name        thepiratebay helper
// @namespace   darkred
// @authors     emptyparad0x, darkred
// @description Converts dates to local timezone on thepiratebay and optionally either highlight VIP/Trusted/Moderator/Helper torrents or hide non verified torrents altogether
// @version     0.9.6d
// @date        2017-02-14
// @include     /^https?://thepiratebay\.(org|se|gd|la|mn|vg)/search.*$/
// @include     /^https?://thepiratebay\.(org|se|gd|la|mn|vg)/browse/.*$/
// @include     /^https?://thepiratebay\.(org|se|gd|la|mn|vg)/recent.*$/
// @include     /^https?://thepiratebay\.(org|se|gd|la|mn|vg)/torrent.*$/
// @include     /^https?://thepiratebay\.(org|se|gd|la|mn|vg)/tv.*$/
// @include     /^https?://thepiratebay\.(org|se|gd|la|mn|vg)/music.*$/
// @include     /^https?://thepiratebay\.(org|se|gd|la|mn|vg)/top.*$/
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/keypress/2.1.3/keypress.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js
// ==/UserScript==



/* global $:false */
/* eslint-disable no-console, no-alert*/
/* global GM_config */
/* global moment */


//GM_config stuff
GM_config.init('TPB Helper settings',{
	timezone: {label: 'Text for Timezone:', type: 'text', cols: 10, default: 'EST'},
	use12hour: {label: 'Use AM/PM:', type: 'checkbox', default: false},
	am:	{label: 'Text for AM:', type: 'text', cols: 10, default: 'am'},
	pm:	{label: 'Text for PM:', type: 'text', cols: 10, default: 'pm'},
	tpboffset: {label: 'TPB Timezone offset    : (GMT+1)  +', type: 'int', default: 0},             // Initially it was:   tpboffset:    { label: 'TPB Timezone: GMT+', type: 'int', default: 1 },
	showYearOnTorrentPage: {label: 'Display Year On Torrent Page:', type: 'checkbox', default: false},
	enhanceVisibility: {label: 'Show all / Highlight trusted / Hide non-trusted:', section: ['Extras'], type: 'select', options: ['Show all', 'Highlight','Hide'], default: 'Show all'},
	relativeDates: {label: 'Display torrent timestamps in relative format:', type: 'checkbox', default: true}
},{
	save: function(){location.reload();}});

$('body').append(`<center><a id='TimeChangerConfig'>TPB Helper settings</a></center>`);
$('#TimeChangerConfig').click(function(){GM_config.open();}).css({'cursor': 'pointer'});

var timezone = GM_config.get('timezone');
var tpboffset = GM_config.get('tpboffset');
var use12hour = GM_config.get('use12hour');
var am = GM_config.get('am');
var pm = GM_config.get('pm');
var showYearOnTorrentPage = GM_config.get('showYearOnTorrentPage');
var enhanceVisibility = GM_config.get('enhanceVisibility');
var relativeDates = GM_config.get('relativeDates');

//Custom Date Handlers
Date.prototype.addHours = function(h) {
	this.setTime(this.getTime() + (h*60*60*1000));
	return this;
};
Date.prototype.stdTimezoneOffset = function() {
	var jan = new Date(this.getFullYear(), 0, 1);
	var jul = new Date(this.getFullYear(), 6, 1);
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};
Date.prototype.dst = function() {
	return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

var d = new Date();
var tpbTimezoneAdder = (tpboffset * 60) + d.getTimezoneOffset();

if (d.dst){
	tpbTimezoneAdder += 60;
}

var hours = (tpbTimezoneAdder / 60);

var tpbTodayDate = new Date();

tpbTodayDate.addHours(hours);

var tpbTodayYear = tpbTodayDate.getFullYear();
var tpbTodayMonth = tpbTodayDate.getMonth();
var tpbTodayDay = tpbTodayDate.getDate();

var tpbYdayDate = new Date(tpbTodayDate);
tpbYdayDate.addHours(-24);

var tpbYdayYear = tpbYdayDate.getFullYear();
var tpbYdayMonth = tpbYdayDate.getMonth();
var tpbYdayDay = tpbYdayDate.getDate();

var yesterday = new Date();
yesterday.addHours(-24);

var torYear, torMonth, torDate, torHour, torMinute;
var dispTime = true;

// Time Parsing Function For Search/Browse pages
function parseTime(str){
	torYear = null;
	torMonth = null;
	torDate = null;
	torHour = null;
	torMinute = null;
	dispTime = true;

	if (str.indexOf('Today') > -1) {
		// Format is in 'Today hh:mm'
		torYear = tpbTodayYear;
		torMonth = tpbTodayMonth;
		torDate = tpbTodayDay;
		torHour = str.slice(11,13);
		torMinute = str.slice(14,16);
	}

	else if (str.indexOf('Y-day') > -1){
		// Format is in 'Y-day hh:mm'
		torYear = tpbYdayYear;
		torMonth = tpbYdayMonth;
		torDate = tpbYdayDay;
		torHour = str.slice(11,13);
		torMinute = str.slice(14,16);
	}

	else if ((str.indexOf('-') > -1) && (str.indexOf(':') > -1) && (str.length == 16)){
		// Format is in 'MM-DD hh:mm'
		torYear = tpbTodayYear;
		torMonth = str.slice(0,2)-1;
		torDate = str.slice(3,5);
		torHour = str.slice(11,13);
		torMinute = str.slice(14,16);
	}
	else if ((str.indexOf('-') > -1) && (str.length == 15)){
		// Format is in 'MM-DD YYYY'
		torYear = str.slice(11,15);
		torMonth = str.slice(0,2)-1;
		torDate = str.slice(3,5);
		torHour = hours;
		torMinute = '00';
		dispTime = false;
	}

	var torFullDate = new Date(torYear, torMonth, torDate, torHour, torMinute);

	torFullDate.addHours(-hours);
	var output = formatTime(torFullDate);
	return output;
}
// End Time Parsing Function For Search/Browse pages

// Time Format Function
function formatTime(tempDate, time_override, year_override){
	var t_output;
	if (tempDate.toDateString()==d.toDateString()){
		t_output = 'Today ';
	}
	else if (tempDate.toDateString()==yesterday.toDateString()){
		t_output = 'Y-day ';
	}
	else {
		t_output = ('0' + (tempDate.getMonth()+1)).slice(-2) +
			'-' + ('0' + tempDate.getDate()).slice(-2);

		if ((tempDate.getFullYear() != tpbTodayYear) || (year_override)){
			t_output = t_output + '-' + tempDate.getFullYear();
		}

		t_output += ' ';
	}

	if (dispTime || time_override){
		if (use12hour){
			var ampm;
			var temph;
			if (tempDate.getHours()>=12){
				ampm = pm;
				temph = (tempDate.getHours()-12);
			}
			else {
				ampm = am;
				temph = (tempDate.getHours());
			}
			if (temph===0){
				temph = 12;
			}
			tempDate.setHours(temph);
			t_output = t_output + tempDate.getHours() + ':' + ('0' + tempDate.getMinutes()).slice(-2) + ampm;
		}
		else {
			t_output = t_output + ('0' + tempDate.getHours()).slice(-2) + ':' + ('0' + tempDate.getMinutes()).slice(-2);
		}
		t_output = t_output + ' ' + timezone;
		t_output = t_output.trim();			// remove trailing spaces
	}
	return t_output;
}
// End Time Format Function

// Time Parsing Function for torrent pages
function parseTimeString(str){
	var torYear =  str.slice(0,4);
	var torMonth =  str.slice(5,7)-1;
	var torDate = str.slice(8,10);
	var torHour = str.slice(11,13);
	var torMinute = str.slice(14,16);
	var torSecond = str.slice(17,19);
	var FullDate = new Date(torYear, torMonth, torDate, torHour, torMinute, torSecond);
	return FullDate;
}
// End Time Parsing Function for torrent pages

//Change the time on the footer
$('p#footer, div#stats').each(function(){
	var f_str = $(this).html();
	// var f_strTime;
	var f_pos = f_str.indexOf('Last updated');
	if (f_pos > -1){
		f_pos += 13;
		var f_startString = f_str.slice(0,f_pos);
		var f_strTime = f_str.slice(f_pos,(f_pos+8));
		var f_endString = f_str.slice((f_pos+9),f_str.length);
		var f_footerDate = new Date();
		f_footerDate.setHours(f_strTime.slice(0,2));
		f_footerDate.setMinutes(f_strTime.slice(3,5));
		f_footerDate.setSeconds(f_strTime.slice(6,8));
		f_footerDate.addHours(-hours);
		f_strTime = formatTime(f_footerDate,true);
		$(this).html(f_startString + f_strTime + f_endString);
	}

});

//Check page
var url = window.location.href;
var host = window.location.host;
if (url.indexOf(host + '/torrent/') != -1) {
	//Change time on the torrent page
	var torPageFullDate = parseTimeString($('dt:contains(\'Uploaded\')').next().html());
	torPageFullDate.addHours(-hours);
	$('dt:contains(\'Uploaded\')').next().html(formatTime(torPageFullDate,true, showYearOnTorrentPage));
	jQuery.noConflict(); //Need this to run last in order to fix problem with thepiratebay comments
} else {
	// Change the times on the browse/search pages
	var allBody = document.body.innerHTML;
	if (allBody.indexOf('view=s') > -1){
		// Page is in Double View
		$('table#searchResult font').each(function(){
			var str = $(this).html();
			if (str.indexOf('Uploaded') > -1){
				var c_loc = str.indexOf(',');
				var strTime = str.slice(9,c_loc);
				if (strTime.indexOf('min')==-1) {
					//Do nothing with times displayed in "n Mins ago"
					var strLast = str.slice(c_loc, str.length);
					$(this).html('Uploaded ' + parseTime(strTime) + strLast);
				}
			}
		});
	}
	else if (allBody.indexOf('view=d') > -1){
		// Page is in Single View
		$('table#searchResult td:nth-child(3)').each(function(){
			if ($(this).html().indexOf('min')==-1){
			//Do nothing with times displayed in "n Mins ago"
				$(this).html(parseTime($(this).html()));
			}
		});
	}




	// Enhance trusted torrents
	if (enhanceVisibility == 'Highlight') {
		highlight();
	}



	// Hide non trusted torrents
	var counter = 0;
	if (enhanceVisibility == 'Hide') {

		hideNonTrusted();
//     alert (counter);
		if (counter > 0) {
			document.querySelector('#TimeChangerConfig').insertAdjacentHTML('afterend', '<br><i>' + counter  + ' non verified torrents hidden - click here or press ` to view all torrents</i>');
		}
		var flagHide = true;



		function toggleHide() {
			if (counter > 0) {
				if (flagHide == true) {
					// $('table#searchResult tbody tr').each(function() {
					$(getAllTableLines()).each(function() {
						$(this).children('td').show();
					});
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



		$('#TimeChangerConfig').nextAll().eq(1).on('click', toggleHide);

		var listener2 = new window.keypress.Listener();
		listener2.simple_combo('`', function() {
			toggleHide();
		});



	}





}



function getAllTableLines(){
	if (  ($('#searchResult > TBODY > TR:last-child td a:last-child img').attr('alt') === 'Next')) {	// if there's a Next button, i.e. the search results are multi plage
		return $('table#searchResult tbody tr').not('#searchResult > TBODY > TR:last-child');			// then ignore the last row of the table (the navigation links)
	} else {
		return $('table#searchResult tbody tr');
	}

}









function hideNonTrusted() {
	// var total = 0;
	// var counter = 0;
	// $('table#searchResult tbody tr').each(function() {
	$(getAllTableLines()).each(function() {
		// total++;
		if (($(this).html().indexOf('title="VIP"') > -1) ||
			($(this).html().indexOf('title="Trusted"') > -1) ||
			($(this).html().indexOf('title="Moderator"') > -1) ||
			($(this).html().indexOf('Helper') > -1) ||
			($(this).html().indexOf('src="https://piratebay.org/img/next.gif"') > -1)) {
			//do nothing
		} else {
			$(this).children('td').hide();
			counter++;
		}
	});

}



function highlight() {

	// $('table#searchResult tbody tr').each(function() {
	$(getAllTableLines()).each(function() {
		if ($(this).html().indexOf('title="VIP"') > -1) {
			$(this).children('td').css({
				'background-color': '#CFFECD'
			});
		} else if ($(this).html().indexOf('title="Trusted"') > -1) {
			$(this).children('td').css({
				'background-color': '#F9D5DB'
			}); // (initially it was FECDFE)   and then FECDD9
		} else if ($(this).html().indexOf('title="Moderator"') > -1) {
			$(this).children('td').css({
				'background-color': '#DCDCDC'
			});
		} else if ($(this).html().indexOf('Helper') > -1) { // Extra line
			$(this).children('td').css({
				'background-color': '#33CCCC'
			});
		} else if ($(this).html().indexOf('src="https://piratebay.org/img/next.gif"') > -1) {
			//do nothing
		} else {
			$(this).children('td').css({
				'opacity': '0.5'
			});
			$(this).children('td').css({
				'background-color': 'white'
			});
		}
	});


}







function convertDates() {
	var dates = document.querySelectorAll('#searchResult > TBODY > TR > TD:nth-child(3)');
	for (var i = 0; i < dates.length; i++) {
		var initial = dates[i].innerHTML;
		// var temp = initial.trim();					// remove trailing spaces
		var temp = initial.replace(timezone, '');	// remove timezone
		temp = temp.trim();							// remove trailing spaces
		if (temp.indexOf('Today') !== -1) {
			temp = temp.replace('Today', moment().format('MM-DD'));
		} else if (temp.indexOf('Y-day') !== -1) {
			temp = temp.replace('Y-day', moment().subtract(1, 'days').format('MM-DD'));
		}
		if (moment(temp, 'MM-DD HH:mm', true).isValid()) {
			dates[i].innerHTML = moment(temp, 'MM-DD HH:mm').fromNow();
			dates[i].title = initial;
		} else if (moment(temp, 'MM-DD-YYYY', true).isValid()) {
			dates[i].innerHTML = moment(temp, 'MM-DD-YYYY').fromNow();
			dates[i].title = initial;
		}
	}
}

if (relativeDates === true) {
	convertDates();
}