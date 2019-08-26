// ==UserScript==
// @name        StackExchange sites - convert dates to local timezone
// @namespace   darkred
// @version     2019.8.26
// @description Converts dates to your local timezone
// @author      darkred
// @license     MIT
// @include     /^(https?:)?\/\/(www\.)?((3dprinting|academia|ai|alcohol|android|anime|apple|arduino|astronomy|aviation|bicycles|bioinformatics|biology|bitcoin|blender|boardgames|bricks|buddhism|chemistry|chess|chinese|christianity|civicrm|codegolf|codereview|coffee|communitybuilding|computergraphics|conlang|cooking|craftcms|crafts|crypto|cs|cseducators|cstheory|datascience|dba|devops|diy|drupal|dsp|earthscience|ebooks|economics|electronics|elementaryos|ell|emacs|engineering|english|eosio|esperanto|ethereum|expatriates|expressionengine|fitness|freelancing|french|gamedev|gaming|gardening|genealogy|german|gis|graphicdesign|ham|hardwarerecs|hermeneutics|hinduism|history|homebrew|hsm|interpersonal|iot|iota|islam|italian|japanese|joomla|judaism|korean|languagelearning|latin|law|lifehacks|linguistics|literature|magento|martialarts|math|matheducators|mathematica|mechanics|medicalsciences|meta|monero|money|movies|music|musicfans|mythology|networkengineering|opendata|opensource|or|outdoors|parenting|patents|pets|philosophy|photo|physics|pm|poker|politics|portuguese|psychology|puzzling|quant|quantumcomputing|raspberrypi|retrocomputing|reverseengineering|robotics|rpg|rus|russian|salesforce|scicomp|scifi|security|sharepoint|sitecore|skeptics|softwareengineering|softwarerecs|sound|space|spanish|sports|sqa|stats|stellar|sustainability|tex|tezos|tor|travel|tridion|ukrainian|unix|ux|vegetarianism|vi|video|webapps|webmasters|windowsphone|woodworking|wordpress|workplace|worldbuilding|writing)\.stackexchange\.com|(es|ja|pt|ru)\.stackoverflow\.com|(askubuntu|serverfault|stackapps|stackoverflow|superuser)\.com|mathoverflow\.net).*$/
// @grant       none
// @require     http://momentjs.com/downloads/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.6/moment-timezone-with-data-2010-2020.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.6/jstz.min.js
// ==/UserScript==


/* global jstz, moment */


var localTimezone = jstz.determine().name();
var serverTimezone = 'Europe/Berlin';		// GMT+1


function convertDates() {
	var dates = document.querySelectorAll('.relativetime, .rep-time');
	var temp;
	for (var i = 0; i < dates.length; i++) {
		temp = moment(dates[i].title, 'YYYY-MM-DD HH:mm:ssZ', true);
		if (temp.isValid()) {
			dates[i].title = moment.tz(dates[i].title, serverTimezone).tz(localTimezone);
		}
	}
}


convertDates();

var target = document.querySelectorAll('#question-mini-list, .rep-breakdown')[0],
	observer = new MutationObserver(function (mutations) {
		convertDates();
	}),
	config = {
		characterData: true,
		subtree: true
	};
observer.observe(target, config);
