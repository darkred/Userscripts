﻿// ==UserScript==
// @name        GreasyFork Bullshit Filter - for TS Citrus Gfork
// @namespace   darkred
// @author      kuehlschrank, darkred
// @description Hides scripts for popular browser games and social networks as well as scripts that use "foreign" characters in descriptions. Applies to posts in Forum too.
// @version     2017.5.15
// @icon        https://s3.amazonaws.com/uso_ss/icon/97145/large.png
// @grant       none
// @include     https://greasyfork.org/*/scripts
// @include     https://greasyfork.org/*/scripts/
// @include     https://greasyfork.org/*/scripts?page=*
// @include     https://greasyfork.org/*/scripts?per_page=*
// @include     https://greasyfork.org/*/scripts/search?*
// @include     https://greasyfork.org/*/scripts?set=*
// @include     https://greasyfork.org/*/scripts?sort=*
// @include     https://greasyfork.org/*/scripts?q=*
// @include     https://greasyfork.org/en/scripts?utf8=*
// @include     https://greasyfork.org/*/forum/
// @include     https://greasyfork.org/*/forum/discussions/*
// @run-at      document-idle
//    This is an edited version of this script (http://userscripts-mirror.org/scripts/show/97145) by kuehlschrank.
//    Thanks a lot to kuehlschrank for making another great script.
// ==/UserScript==

if (window.location.href.indexOf('forum') === -1) {
(function() {
	var filters = {
		'Games': /AntiGame|Agar|agar\.io|alis\.io|angel\.io|ExtencionRipXChetoMalo|AposBot|DFxLite|ZTx-Lite|AposFeedingBot|AposLoader|Blah Blah|Orc Clan Script|Astro\s*Empires|^\s*Attack|^\s*Battle|BiteFight|Blood\s*Wars|Bots|Bots4|Brawler|\bBvS\b|Business\s*Tycoon|Castle\s*Age|City\s*Ville|chopcoin\.io|Comunio|Conquer\s*Club|CosmoPulse|cursors\.io|Dark\s*Orbit|Dead\s*Frontier|Diep\.io|\bDOA\b|doblons\.io|DotD|Dossergame|Dragons\s*of\s*Atlantis|driftin\.io|Dugout|\bDS[a-z]+\n|elites\.io|Empire\s*Board|eRep(ublik)?|Epic.*War|ExoPlanet|Falcon Tools|Feuerwache|Farming|FarmVille|Fightinfo|Frontier\s*Ville|Ghost\s*Trapper|Gladiatus|Goalline|Gondal|gota\.io|Grepolis|Hobopolis|\bhwm(\b|_)|Ikariam|\bIT2\b|Jellyneo|Kapi\s*Hospital|Kings\s*Age|Kingdoms?\s*of|knastv(ö|oe)gel|Knight\s*Fight|\b(Power)?KoC(Atta?ck)?\b|\bKOL\b|Kongregate|Last\s*Emperor|Legends?\s*of|Light\s*Rising|lite\.ext\.io|Lockerz|\bLoU\b|Mafia\s*(Wars|Mofo)|Menelgame|Mob\s*Wars|Mouse\s*Hunt|Molehill\s*Empire|NeoQuest|MyFreeFarm|narwhale\.io|Neopets|Nemexia|\bOGame\b|Ogar(io)?|Pardus|Pennergame|Pigskin\s*Empire|PlayerScripts|pokeradar\.io|Popmundo|Po?we?r\s*(Bot|Tools)|PsicoTSI|Ravenwood|Schulterglatze|slither\.io|slitherplus\.io|slitheriogameplay|SpaceWars|splix\.io|\bSW_[a-z]+\n|\bSnP\b|The\s*Crims|The\s*West|torto\.io|Travian|Treasure\s*Isl(and|e)|Tribal\s*Wars|TW.?PRO|Vampire\s*Wars|vertix\.io|War\s*of\s*Ninja|West\s*Wars|wings\.io|\bWoD\b|World\s*of\s*Dungeons|wtf\s*battles|Wurzelimperium/i,
		'Social Networks': /Face\s*book|Google(\+| Plus)|\bHabbo|Kaskus|\bLepra|Leprosorium|MySpace|meinVZ|odnoklassniki|Одноклассники|Orkut|sch(ue|ü)ler(VZ|\.cc)?|studiVZ|Unfriend|Valenth|VK|vkontakte|ВКонтакте|Qzone|Twitter|TweetDeck/i,
		'Non-ASCII':/[^\x00-\x7F\s]+/i,
		'Clutter':/^\s*(.{1,3})\1+\n|^\s*(.+?)\n+\2\n*$|^\s*.{1,5}\n|do\s*n('|o)?t (install|download)|nicht installieren|just(\s*a)?\s*test|^\s*.{0,4}test.{0,4}\n|\ntest(ing)?\s*|^\s*(\{@|Smolka|Hacks)|\[\d{4,5}\]|free\s*download/i
	};
	if(typeof GM_getValue == 'undefined' || (typeof GM_getValue.toString == 'function' && GM_getValue.toString().indexOf('not supported') > -1)) {
		GM_getValue = my_GM_getValue;
		GM_setValue = my_GM_setValue;
	}


	insertStyle();
	insertStatus();
	filterScripts();
	insertSwitches();


	var target = document.querySelector('#script-table > tbody:nth-child(2)');
	var observer = new MutationObserver((mutations) => {
		insertStyle();
		insertStatus();
		filterScripts();
		insertSwitches();
	}),
		config = {
			childList: true,
			subtree: true,
		};
	observer.observe(target, config);





	// Note: you may uncomment line 37-81 and comment out line 36, in order the filtered scripts to be highlighted red -instead of hiding them- so that you can check which scripts have been filtered
	function insertStyle() {
		var style = document.createElement('style');
		// style.textContent = 'tr.filtered > td:nth-child(2)  {background-color:red !important;} .filter-status {margin-left:6px; position:fixed; top:calc(0%); left:calc(13.5%)} .filter-switches {display:none; position:fixed; top:calc(2.5%); left:calc(14%)} *:hover > .filter-switches {display:block !important; position:fixed; top:calc(2.5%); left:calc(14%)} .filter-on,.filter-off {display:block !important; width:105px}} .filter-switches a {text-decoration:none !important; color:inherit; cursor:pointer} .filter-switches a {margin-left:8px; padding:0 4px} a.filter-on {background-color:#ff6161; color:#333333; text-decoration:line-through !important} a.filter-off {background-color:#97ca97;color:#333333; ';
		style.textContent = `   tr.filtered {
									display: none !important;
								}
								.filter-status {
									margin-left: 6px;
									position: fixed;
									top: calc(0%);
									left: calc(13.5%);
								}
								.filter-switches {
									display: none;
									position: fixed;
									top: calc(2.5%);
									left: calc(14%);
								}
								*:hover > .filter-switches {
									display: block !important;
									position: fixed;
									top: calc(2.5%);
									left: calc(14%);
								}
								.filter-on,
								.filter-off {
									display: block !important;
									width: 105px;
								}
								}
								.filter-switches a {
									text-decoration: none !important;
									color: inherit;
									cursor: pointer;
								}
								.filter-switches a {
									margin-left: 8px;
									padding: 0 4px;
								}
								a.filter-on {
									background-color: #ea6e6e;
									color: #333333;
									text-decoration: line-through !important
								}
								a.filter-off {
									background-color: #6da46b;
									color: #333333;
		}`;
		style.type = 'text/css';
		document.querySelector('head').appendChild(style);
	}

	function insertStatus() {
		var p = document.querySelector('#main-header');
		if(p) {
			var status = document.createElement('span');
			status.className = 'filter-status';
			p.appendChild(status);
		}
	}

	function filterScripts() {
		var activeFilters = [];
		for(var filter in filters) {
			if(filters.hasOwnProperty(filter) && GM_getValue(filter, 'on') == 'on') {
				activeFilters.push(filters[filter]);
			}
		}
		var nodes = document.querySelectorAll('tbody > tr > td > div.thetitle'),
			numActiveFilters = activeFilters.length,
			numFiltered = 0;
		for(var i = 0, numNodes = nodes.length, td = null; i < numNodes && (td = nodes[i]); i++) {
			td.parentNode.parentNode.classList.remove('filtered');
			for(var j = 0; j < numActiveFilters; j++) {
				var temp = td.parentNode.firstChild.firstChild.textContent + ' ' + td.parentNode.lastChild.textContent;	// store script's name and description (with a space between) to variable 'temp'
				if(temp.match(activeFilters[j])) {
					td.parentNode.parentNode.classList.add('filtered');
					numFiltered++;
					break;
				}
			}
		}

		document.querySelector('.filter-status').textContent = (document.querySelectorAll('tbody > tr > td > div.thetitle').length - numFiltered) + ' scripts (' + numFiltered + ' filtered)';
	}

	function insertSwitches() {
		var span = document.createElement('span');
		span.className = 'filter-switches';
		for(var filter in filters) {
			if(filters.hasOwnProperty(filter)) {
				span.appendChild(createSwitch(filter, GM_getValue(filter, 'on') == 'on'));
			}
		}
		document.querySelector('.filter-status').parentNode.appendChild(span);
	}

	function createSwitch(label, isOn) {
		var a = document.createElement('a');
		a.className = isOn ? 'filter-on' : 'filter-off';
		a.textContent = label;
		a.addEventListener('click', function(e) {
			if(this.className == 'filter-on') {
				this.className = 'filter-off';
				GM_setValue(this.textContent, 'off');
			} else {
				this.className = 'filter-on';
				GM_setValue(this.textContent, 'on');
			}
			filterScripts();
			e.preventDefault();
		}, false);
		return a;
	}

	function my_GM_setValue(name, value) {
		localStorage.setItem(name, value);
	}

	function my_GM_getValue(name, defaultValue) {
		var value;
		if (!(value = localStorage.getItem(name))) {
			return defaultValue;
		}
		return value;
	}

})();


} else {


(function() {
	var filters = {
		'Non-ASCII':/[^\x00-\x7F\s]+/i,
		'Games': /AntiGame|Agar|agar\.io|alis\.io|angel\.io|ExtencionRipXChetoMalo|AposBot|DFxLite|ZTx-Lite|AposFeedingBot|AposLoader|Blah Blah|Orc Clan Script|Astro\s*Empires|^\s*Attack|^\s*Battle|BiteFight|Blood\s*Wars|Bots|Bots4|Brawler|\bBvS\b|Business\s*Tycoon|Castle\s*Age|City\s*Ville|chopcoin\.io|Comunio|Conquer\s*Club|CosmoPulse|cursors\.io|Dark\s*Orbit|Dead\s*Frontier|Diep\.io|\bDOA\b|doblons\.io|DotD|Dossergame|Dragons\s*of\s*Atlantis|driftin\.io|Dugout|\bDS[a-z]+\n|elites\.io|Empire\s*Board|eRep(ublik)?|Epic.*War|ExoPlanet|Falcon Tools|Feuerwache|Farming|FarmVille|Fightinfo|Frontier\s*Ville|Ghost\s*Trapper|Gladiatus|Goalline|Gondal|gota\.io|Grepolis|Hobopolis|\bhwm(\b|_)|Ikariam|\bIT2\b|Jellyneo|Kapi\s*Hospital|Kings\s*Age|Kingdoms?\s*of|knastv(ö|oe)gel|Knight\s*Fight|\b(Power)?KoC(Atta?ck)?\b|\bKOL\b|Kongregate|Last\s*Emperor|Legends?\s*of|Light\s*Rising|lite\.ext\.io|Lockerz|\bLoU\b|Mafia\s*(Wars|Mofo)|Menelgame|Mob\s*Wars|Mouse\s*Hunt|Molehill\s*Empire|NeoQuest|MyFreeFarm|narwhale\.io|Neopets|Nemexia|\bOGame\b|Ogar(io)?|Pardus|Pennergame|Pigskin\s*Empire|PlayerScripts|pokeradar\.io|Popmundo|Po?we?r\s*(Bot|Tools)|PsicoTSI|Ravenwood|Schulterglatze|slither\.io|slitherplus\.io|slitheriogameplay|SpaceWars|splix\.io|\bSW_[a-z]+\n|\bSnP\b|The\s*Crims|The\s*West|torto\.io|Travian|Treasure\s*Isl(and|e)|Tribal\s*Wars|TW.?PRO|Vampire\s*Wars|vertix\.io|War\s*of\s*Ninja|West\s*Wars|wings\.io|\bWoD\b|World\s*of\s*Dungeons|wtf\s*battles|Wurzelimperium/i,
		'Social Networks': /Face\s*book|Google(\+| Plus)|\bHabbo|Kaskus|\bLepra|Leprosorium|MySpace|meinVZ|odnoklassniki|Одноклассники|Orkut|sch(ue|ü)ler(VZ|\.cc)?|studiVZ|Unfriend|Valenth|VK|vkontakte|ВКонтакте|Qzone|Twitter|TweetDeck/i,
		'Clutter':/^\s*(.{1,3})\1+\n|^\s*(.+?)\n+\2\n*$|^\s*.{1,5}\n|do\s*n('|o)?t (install|download)|nicht installieren|just(\s*a)?\s*test|^\s*.{0,4}test.{0,4}\n|\ntest(ing)?\s*|^\s*(\{@|Smolka|Hacks)|\[\d{4,5}\]|free\s*download/i
	};
	if(typeof GM_getValue == 'undefined' || (typeof GM_getValue.toString == 'function' && GM_getValue.toString().indexOf('not supported') > -1)) {
		GM_getValue = my_GM_getValue;
		GM_setValue = my_GM_setValue;
	}


	insertStyle();
	insertStatus();
	filterScripts();
	insertSwitches();




	// Note: you may uncomment line 37-81 and comment out line 36, in order the filtered scripts to be highlighted red -instead of hiding them- so that you can check which scripts have been filtered
	function insertStyle() {
		var style = document.createElement('style');
		// style.textContent = 'tr.filtered > td:nth-child(2)  {background-color:red !important;} .filter-status {margin-left:6px; position:fixed; top:calc(0%); left:calc(13.5%)} .filter-switches {display:none; position:fixed; top:calc(2.5%); left:calc(14%)} *:hover > .filter-switches {display:block !important; position:fixed; top:calc(2.5%); left:calc(14%)} .filter-on,.filter-off {display:block !important; width:105px}} .filter-switches a {text-decoration:none !important; color:inherit; cursor:pointer} .filter-switches a {margin-left:8px; padding:0 4px} a.filter-on {background-color:#ff6161; color:#333333; text-decoration:line-through !important} a.filter-off {background-color:#97ca97;color:#333333; ';
		style.textContent = `   .ItemDiscussion.filtered {
									display: none !important;
								}
								.filter-status {
									margin-left: 6px;
									position: fixed;
									top: calc(0%);
									left: calc(13.5%);
								}
								.filter-switches {
									display: none;
									position: fixed;
									top: calc(2.5%);
									left: calc(14%);
								}
								*:hover > .filter-switches {
									display: block !important;
									position: fixed;
									top: calc(2.5%);
									left: calc(14%);
								}
								.filter-on,
								.filter-off {
									display: block !important;
									width: 105px;
								}
								}
								.filter-switches a {
									text-decoration: none !important;
									color: inherit;
									cursor: pointer;
								}
								.filter-switches a {
									margin-left: 8px;
									padding: 0 4px;
								}
								a.filter-on {
									background-color: #ea6e6e;
									color: #333333;
									text-decoration: line-through !important
								}
								a.filter-off {
									background-color: #6da46b;
									color: #333333;
		}`;
		style.type = 'text/css';
		document.querySelector('head').appendChild(style);
	}

	function insertStatus() {
		var p = document.querySelector('#Head');
		if(p) {
			var status = document.createElement('span');
			status.className = 'filter-status';
			p.appendChild(status);
		}
	}

	function filterScripts() {
		var activeFilters = [];
		for(var filter in filters) {
			if(filters.hasOwnProperty(filter) && GM_getValue(filter, 'on') == 'on') {
				activeFilters.push(filters[filter]);
			}
		}
		var nodes = document.querySelectorAll('.ItemDiscussion'),
			numActiveFilters = activeFilters.length,
			numFiltered = 0;
		for(var i = 0, numNodes = nodes.length, td = null; i < numNodes && (td = nodes[i]); i++) {
			td.classList.remove('filtered');
			for(var j = 0; j < numActiveFilters; j++) {
				var temp = td.children[1].firstElementChild.innerText;
				if(temp.match(activeFilters[j])) {
					td.classList.add('filtered');
					numFiltered++;
					break;
				}
			}
		}

		document.querySelector('.filter-status').innerText = (document.querySelectorAll('.ItemDiscussion').length - numFiltered) + ' discussions (' + numFiltered + ' filtered)';
	}



	function insertSwitches() {
		var span = document.createElement('span');
		span.className = 'filter-switches';
		for(var filter in filters) {
			if(filters.hasOwnProperty(filter)) {
				span.appendChild(createSwitch(filter, GM_getValue(filter, 'on') == 'on'));
			}
		}
		document.querySelector('.filter-status').parentNode.appendChild(span);
	}

	function createSwitch(label, isOn) {
		var a = document.createElement('a');
		a.className = isOn ? 'filter-on' : 'filter-off';
		a.textContent = label;
		a.addEventListener('click', function(e) {
			if(this.className == 'filter-on') {
				this.className = 'filter-off';
				GM_setValue(this.textContent, 'off');
			} else {
				this.className = 'filter-on';
				GM_setValue(this.textContent, 'on');
			}
			filterScripts();
			e.preventDefault();
		}, false);
		return a;
	}

	function my_GM_setValue(name, value) {
		localStorage.setItem(name, value);
	}

	function my_GM_getValue(name, defaultValue) {
		var value;
		if (!(value = localStorage.getItem(name))) {
			return defaultValue;
		}
		return value;
	}

})();

}
