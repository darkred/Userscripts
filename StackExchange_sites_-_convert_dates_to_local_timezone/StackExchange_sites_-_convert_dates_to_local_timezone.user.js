// ==UserScript==
// @name        StackExchange sites - convert dates to local timezone
// @namespace   darkred
// @version     2019.8.28
// @description Converts dates to your local timezone
// @author      darkred
// @license     MIT
// @include     /^(https?:)?\/\/(www\.)?((3dprinting|academia|ai|alcohol|android|anime|apple|arduino|astronomy|aviation|bicycles|bioinformatics|biology|bitcoin|blender|boardgames|bricks|buddhism|chemistry|chess|chinese|christianity|civicrm|codegolf|codereview|coffee|communitybuilding|computergraphics|conlang|cooking|craftcms|crafts|crypto|cs|cseducators|cstheory|datascience|dba|devops|diy|drupal|dsp|earthscience|ebooks|economics|electronics|elementaryos|ell|emacs|engineering|english|eosio|esperanto|ethereum|expatriates|expressionengine|fitness|freelancing|french|gamedev|gaming|gardening|genealogy|german|gis|graphicdesign|ham|hardwarerecs|hermeneutics|hinduism|history|homebrew|hsm|interpersonal|iot|iota|islam|italian|japanese|joomla|judaism|korean|languagelearning|latin|law|lifehacks|linguistics|literature|magento|martialarts|math|matheducators|mathematica|mechanics|medicalsciences|meta|monero|money|movies|music|musicfans|mythology|networkengineering|opendata|opensource|or|outdoors|parenting|patents|pets|philosophy|photo|physics|pm|poker|politics|portuguese|psychology|puzzling|quant|quantumcomputing|raspberrypi|retrocomputing|reverseengineering|robotics|rpg|rus|russian|salesforce|scicomp|scifi|security|sharepoint|sitecore|skeptics|softwareengineering|softwarerecs|sound|space|spanish|sports|sqa|stats|stellar|sustainability|tex|tezos|tor|travel|tridion|ukrainian|unix|ux|vegetarianism|vi|video|webapps|webmasters|windowsphone|woodworking|wordpress|workplace|worldbuilding|writing)\.stackexchange\.com|(es|ja|pt|ru)\.stackoverflow\.com|(askubuntu|serverfault|stackapps|stackoverflow|superuser)\.com|mathoverflow\.net).*$/
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.26/moment-timezone-with-data.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.6/jstz.min.js
// ==/UserScript==

/* eslint-disable quotes, no-console */
/* global jstz, moment */


var localTimezone = jstz.determine().name();
var serverTimezone = 'Europe/Berlin';		// GMT+1

function convertDates(dates) {
	// var dates = document.querySelectorAll('.relativetime, .rep-time');
	var temp, temp2;
	for (var i = 0; i < dates.length; i++) {

		// 2019-08-24 03:26:50Z
		temp = moment(dates[i].title, 'YYYY-MM-DD HH:mm:ssZ', true);
		if (temp.isValid()) {
			dates[i].title = moment.tz(dates[i].title, serverTimezone).tz(localTimezone);
		}

		// Example URLS:
		// older, but of the same year:  https://stackoverflow.com/questions?tab=newest&page=1200
		// older, of previous years:     https://stackoverflow.com/questions?tab=newest&page=120000
		// Example timestamps:
		// Aug 7 at 6:45
		// Aug 24 at 12:23
		// Oct 24 '18 at 9:56
		// Oct 24 '18 at 13:57
		temp2 = dates[i].innerHTML.replace('at ', '').replace('\'', '') + ' Z';

		var formatNoYear = 'MMM D H:mm Z';
		var formatWithYear = 'MMM D YY H:mm Z';

		var newMoment1 = moment(temp2, formatNoYear, true);
		var newMoment2 = moment(temp2, formatWithYear, true);

		if (newMoment1.isValid()){
			dates[i].innerHTML = moment.tz(newMoment1, serverTimezone).tz(localTimezone).format('MMM D [at] H:mm');
		} else if (newMoment2.isValid()){
			dates[i].innerHTML = moment.tz(newMoment2, serverTimezone).tz(localTimezone).format("MMM D [']YY [at] H:mm");
		}
	}
}


var dates = document.querySelectorAll('.relativetime, .rep-time');
convertDates(dates);


// The part below is pointless to enable because the site's built-in feature that "the relative timestamps being increased every 1 min" becomes broken when this script is running
/*
// recalculate the relative times every 10 sec
(function(){
	convertDates(dates);
	setTimeout(arguments.callee, 1 * 60 * 1000);
})();
*/


var target = document.querySelectorAll('#question-mini-list, #questions, .rep-breakdown')[0],
	observer = new MutationObserver(function (mutations) {
		convertDates();
	}),
	config = {
		characterData: true,
		subtree: true
	};
observer.observe(target, config);
