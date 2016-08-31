// ==UserScript==
// @name        Userstyles Bullshit Filter
// @namespace   darkred
// @author      kuehlschrank, darkred
// @description Hides scripts for popular browser games and social networks as well as scripts that use "foreign" characters in descriptions.
// @version     1
// @icon        https://s3.amazonaws.com/uso_ss/icon/97145/large.png
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @include     https://userstyles.org/styles/browse*
//    This is an edited version of this script (http://userscripts-mirror.org/scripts/show/97145) by kuehlschrank.
//    Thanks a lot to kuehlschrank for making another great script.
// ==/UserScript==

// GM_addStyle("body { color: white; background-color: black; } img { border: 0; }");

// GM_addStyle('.filter-status, .filter-switches {position: fixed !important}');
// GM_addStyle('.filter-status {top: 314px !important; left: 460px !important;}');
// GM_addStyle('.filter-switches {top: 350 !important; left: 460px !important;}');


(function() {
	var filters = {
		'Games': /AntiGame|Agar|agar.io|ExtencionRipXChetoMalo|AposBot|DFxLite|ZTx-Lite|AposFeedingBot|AposLoader|Blah Blah|Orc Clan Script|Astro\s*Empires|^\s*Attack|^\s*Battle|BiteFight|Blood\s*Wars|Bots|Bots4|Brawler|\bBvS\b|Business\s*Tycoon|Castle\s*Age|City\s*Ville|Comunio|Conquer\s*Club|CosmoPulse|Dark\s*Orbit|Dead\s*Frontier|Diep\.io|\bDOA\b|Dossergame|Dragons\s*of\s*Atlantis|Dugout|\bDS[a-z]+\n|Empire\s*Board|eRep(ublik)?|Epic.*War|ExoPlanet|Falcon Tools|Feuerwache|Farming|FarmVille|Fightinfo|Frontier\s*Ville|Ghost\s*Trapper|Gladiatus|Goalline|Gondal|Grepolis|Hobopolis|\bhwm(\b|_)|Ikariam|\bIT2\b|Jellyneo|Kapi\s*Hospital|Kings\s*Age|Kingdoms?\s*of|knastv(ö|oe)gel|Knight\s*Fight|\b(Power)?KoC(Atta?ck)?\b|\bKOL\b|Kongregate|Last\s*Emperor|Legends?\s*of|Light\s*Rising|Lockerz|\bLoU\b|Mafia\s*(Wars|Mofo)|Menelgame|Mob\s*Wars|Mouse\s*Hunt|Molehill\s*Empire|NeoQuest|MyFreeFarm|Neopets|Nemexia|\bOGame\b|Ogar(io)?|Pardus|Pennergame|Pigskin\s*Empire|PlayerScripts|Popmundo|Po?we?r\s*(Bot|Tools)|PsicoTSI|Ravenwood|Schulterglatze|slither\.io|SpaceWars|\bSW_[a-z]+\n|\bSnP\b|The\s*Crims|The\s*West|Travian|Treasure\s*Isl(and|e)|Tribal\s*Wars|TW.?PRO|Vampire\s*Wars|War\s*of\s*Ninja|West\s*Wars|\bWoD\b|World\s*of\s*Dungeons|wtf\s*battles|Wurzelimperium/i,
		'Social Networks': /Face\s*book|Google(\+| Plus)|\bHabbo|Kaskus|\bLepra|Leprosorium|MySpace|meinVZ|odnoklassniki|Одноклассники|Orkut|sch(ue|ü)ler(VZ|\.cc)?|studiVZ|Unfriend|Valenth|vkontakte|VK|ВКонтакте|Qzone|Twitter|TweetDeck/i,
		'Non-ASCII': /[^\x00-\x7F\s]+/i,
		'Clutter': /^\s*(.{1,3})\1+\n|^\s*(.+?)\n+\2\n*$|^\s*.{1,5}\n|do\s*n('|o)?t (install|download)|nicht installieren|just(\s*a)?\s*test|^\s*.{0,4}test.{0,4}\n|\ntest(ing)?\s*|^\s*(\{@|Smolka|Hacks)|\[\d{4,5}\]|free\s*download/i
	};
	if (typeof GM_getValue == 'undefined' || (typeof GM_getValue.toString == 'function' && GM_getValue.toString().indexOf('not supported') > -1)) {
		GM_getValue = my_GM_getValue;
		GM_setValue = my_GM_setValue;
	}
	insertStyle();
	insertStatus();
	filterScripts();
	insertSwitches();

	// Note: you may uncomment line 42 (and comment out line 43), in order the filtered styles to be highlighted khaki -instead of hiding them- so that you can check which styles have been filtered
	function insertStyle() {
		var style = document.createElement('style');
		// style.textContent = 'article#filtered { background-color:khaki; !important; } .filter-status { margin-left: 6px; } .filter-switches { display:none; } *:hover > .filter-switches { display:block !important; } .filter-on, .filter-off {display:block !important; width: 105px;} .filter-switches a { text-decoration:none !important; color:inherit; cursor:pointer; } .filter-switches a { margin-left: 8px; padding: 0 4px; } a.filter-on { background-color:#ffcccc; color:#333333; text-decoration:line-through !important } a.filter-off { background-color:#ccffcc; color:#333333 }  ';
		style.textContent = 'article#filtered { display:none !important; } .filter-status { margin-left: 6px; } .filter-switches { display:none; } *:hover > .filter-switches { display:block !important; } .filter-on, .filter-off {display:block !important; width: 105px;} .filter-switches a { text-decoration:none !important; color:inherit; cursor:pointer; } .filter-switches a { margin-left: 8px; padding: 0 4px; } a.filter-on { background-color:#ffcccc; color:#333333; text-decoration:line-through !important } a.filter-off { background-color:#ccffcc; color:#333333 }  ';
		style.type = 'text/css';
		document.querySelector('head').appendChild(style);
	}

	function insertStatus() {
		var p = document.querySelector('#left-sidebar');
		if (p) {
			var status = document.createElement('span');
			status.className = 'filter-status';
			p.appendChild(status);
		}
	}

	function filterScripts() {
		var activeFilters = [];
		for (var filter in filters) {
			if (filters.hasOwnProperty(filter) && GM_getValue(filter, 'on') == 'on') {
				activeFilters.push(filters[filter]);
			}
		}
		var nodes = document.querySelectorAll('article .style-brief'),
			numActiveFilters = activeFilters.length,
			numFiltered = 0;
		for (var i = 0, numNodes = nodes.length, td = null; i < numNodes && (td = nodes[i]); i++) {
			td.id = '';
			for (var j = 0; j < numActiveFilters; j++) {
				// if (td.textContent.match(activeFilters[j])) {
				if (td.textContent.replace(/Updated[\s\S]*/, '').replace(/[\s]*/, '').match(activeFilters[j])) {
					td.id = 'filtered';
					numFiltered++;
					break;
				}
			}
		}
		document.querySelector('.filter-status').textContent = document.querySelectorAll('article .style-brief').length - numFiltered + ' styles (' + numFiltered + ' filtered)';
	}

	function insertSwitches() {
		var span = document.createElement('span');
		span.className = 'filter-switches';
		for (var filter in filters) {
			if (filters.hasOwnProperty(filter)) {
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
			if (this.className == 'filter-on') {
				this.className = 'filter-off';
				// this.innerHTML = this.textContent + '<br>';
				GM_setValue(this.textContent, 'off');
				// GM_setValue(this.textContent.replace(/\ \((.*)/g, ''), 'off');
			} else {
				this.className = 'filter-on';
				GM_setValue(this.textContent, 'on');
				// this.innerHTML = '<strike>' + this.textContent +  '</strike><br>';
				// GM_setValue(this.textContent.replace(/\ \((.*)/g, ''), 'on');
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
