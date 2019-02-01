// ==UserScript==
// @name        GreasyFork Bullshit Filter
// @namespace   darkred
// @version     2019.2.2
// @description Hides scripts for popular browser games and social networks as well as scripts that use "foreign" characters in descriptions. Applies to posts in Forum too.
// @author      kuehlschrank, darkred, valacar
// @license     MIT
// @icon        https://raw.githubusercontent.com/darkred/Userscripts/master/GreasyFork_Bullshit_Filter/large.png
// @include     /^https:\/\/(greasy|sleazy)fork\.org\/(.*\/)?(scripts|forum|users).*$/
// @exclude     /^https:\/\/(greasy|sleazy)fork\.org\/(.*\/)((scripts\/\d+)|forum\/(discussion\/|profile|messages)).*$/
// @grant       none
//    This is an edited version of this script (http://userscripts-mirror.org/scripts/show/97145) by kuehlschrank.
//    Thanks a lot to kuehlschrank for making another great script.
//    Thanks a lot to valacar for the refactoring.
// ==/UserScript==


(function() {

	const DEBUGGING = 0;

	const filters = {
		'Non-ASCII': /[^\x00-\xBF\s]+/i,
		'Games': /\w+\.io|Aimbot|AntiGame|Agar|agar\.io|alis\.io|angel\.io|ExtencionRipXChetoMalo|AposBot|DFxLite|ZTx-Lite|AposFeedingBot|AposLoader|Blah Blah|Orc Clan Script|Astro\s*Empires|^\s*Attack|^\s*Battle|BiteFight|Blood\s*Wars|Bots|Bots4|Brawler|\bBvS\b|Business\s*Tycoon|Castle\s*Age|City\s*Ville|chopcoin\.io|Comunio|Conquer\s*Club|CosmoPulse|cursors\.io|Dark\s*Orbit|Dead\s*Frontier|Diep\.io|\bDOA\b|doblons\.io|DotD|Dossergame|Dragons\s*of\s*Atlantis|driftin\.io|Dugout|\bDS[a-z]+\n|elites\.io|Empire\s*Board|eRep(ublik)?|Epicmafia|Epic.*War|ExoPlanet|Falcon Tools|Feuerwache|Farming|FarmVille|Fightinfo|Frontier\s*Ville|Ghost\s*Trapper|Gladiatus|Goalline|Gondal|gota\.io|Grepolis|Hobopolis|\bhwm(\b|_)|Ikariam|\bIT2\b|Jellyneo|Kapi\s*Hospital|Kings\s*Age|Kingdoms?\s*of|knastv(o|oe)gel|Knight\s*Fight|\b(Power)?KoC(Atta?ck)?\b|\bKOL\b|Kongregate|Last\s*Emperor|Legends?\s*of|Light\s*Rising|lite\.ext\.io|Lockerz|\bLoU\b|Mafia\s*(Wars|Mofo)|Menelgame|Mob\s*Wars|Mouse\s*Hunt|Molehill\s*Empire|NeoQuest|MyFreeFarm|narwhale\.io|Neopets|Nemexia|\bOGame\b|Ogar(io)?|Pardus|Pennergame|Pigskin\s*Empire|PlayerScripts|pokeradar\.io|Popmundo|Po?we?r\s*(Bot|Tools)|PsicoTSI|Ravenwood|Schulterglatze|slither\.io|slitherplus\.io|slitheriogameplay|SpaceWars|splix\.io|\bSW_[a-z]+\n|\bSnP\b|The\s*Crims|The\s*West|torto\.io|Travian|Treasure\s*Isl(and|e)|Tribal\s*Wars|TW.?PRO|Vampire\s*Wars|vertix\.io|War\s*of\s*Ninja|World\s*of\s*Tanks|West\s*Wars|wings\.io|\bWoD\b|World\s*of\s*Dungeons|wtf\s*battles|Wurzelimperium/iu,
		'Social Networks': /Face\s*book|Google(\+| Plus)|\bHabbo|Kaskus|\bLepra|Leprosorium|MySpace|meinVZ|odnoklassniki|Одноклассники|Orkut|sch(ue|ü)ler(VZ|\.cc)?|studiVZ|Unfriend|Valenth|VK|vkontakte|ВКонтакте|Qzone|Twitter|TweetDeck/iu,
		'Clutter': /^\s*(.{1,3})\1+\n|^\s*(.+?)\n+\2\n*$|^\s*.{1,5}\n|do\s*n('|o)?t (install|download)|nicht installieren|(just)?(\s*a)?\s*test|^\s*.{0,4}test.{0,4}\n|\ntest(ing)?\s*|^\s*(\{@|Smolka|Hacks)|\[\d{4,5}\]|free\s*download|theme|(night|dark) ?(mode)?/iu
	};

	const commonCss = `
		.filter-status {
			margin-left: 6px;
		}

		.filter-switches {
			display: none;
		}

		:hover>.filter-switches {
			display: block;
		}

		.filter-on,
		.filter-off {
			display: block;
			width: 97px;
		}

		.filter-switches a {
			text-decoration: none;
			color: inherit;
			cursor: pointer;
		}

		.filter-switches a {
			margin-left: 8px;
			padding: 0 4px;
		}

		a.filter-on {
			background-color: #ffcccc;
			color: #333333;
			text-decoration: line-through;
		}

		a.filter-off {
			background-color: #ccffcc;
			color: #333333;
		}
	`;

	const isOnForum = window.location.href.includes('forum');

	const site = {};
	if (isOnForum) {
		site.css = '.ItemDiscussion.filtered { display: none; } .filter-on, .filter-off { color: black; } ' + commonCss;
		site.cssDebug = '.ItemDiscussion.filtered { background-color: khaki; } ' + commonCss;
		site.filterStatusLocation = '.PanelColumn';
		site.itemsToCheck = '.ItemDiscussion';
		site.itemType = 'discussions';
		site.removeFilter = function(el) {
			el.classList.remove('filtered');
		};
		site.applyFilter = function(el, activeFilter) {
			const temp = el.children[1].firstElementChild.innerText;
			if (temp && temp.match(activeFilter)) {
				el.classList.add('filtered');
				return true;
			}
			return false;
		};
	} else {
		site.css = 'li.filtered { display: none; } ' + commonCss;
		site.cssDebug = 'li.filtered { background-color: khaki; } ' + commonCss;
		site.filterStatusLocation = '#script-list-option-groups';
		site.itemsToCheck = 'article > h2';
		site.itemType = 'scripts';
		site.removeFilter = function(el) {
			el.parentNode.parentNode.classList.remove('filtered');
		};
		site.applyFilter = function(el, activeFilter) {
			if (el.innerText.match(activeFilter)) {
				el.parentNode.parentNode.classList.add('filtered');
				return true;
			}
			return false;
		};
	}

	insertStyle();
	insertStatus();
	filterScripts();
	insertSwitches();

	function insertStyle() {
		const style = document.createElement('style');
		style.textContent = DEBUGGING ? site.cssDebug : site.css;
		style.type = 'text/css';
		document.head.appendChild(style);
	}

	function insertStatus() {
		const p = document.querySelector(site.filterStatusLocation);
		if (p) {
			const status = document.createElement('span');
			status.className = 'filter-status';
			p.appendChild(status);
		}
	}

	function filterScripts() {
		const activeFilters = [];
		for (let filterType of Object.keys(filters)) {
			if (configGetValue(filterType, 'on') === 'on') {
				activeFilters.push(filters[filterType]);
			}
		}
		const nodes = document.querySelectorAll(site.itemsToCheck);
		let numFiltered = 0;
		for (let node of nodes) {
			site.removeFilter(node);
			for (let activeFilter of activeFilters) {
				let filtered = site.applyFilter(node, activeFilter);
				if (filtered) {
					numFiltered++;
					break;
				}
			}
		}
		const filterStatus = document.querySelector('.filter-status');
		if (filterStatus) {
			const numUnfiltered = document.querySelectorAll(site.itemsToCheck).length - numFiltered;
			filterStatus.textContent = `${numUnfiltered} ${site.itemType} (${numFiltered} filtered)`;
		}
	}

	function insertSwitches() {
		const span = document.createElement('span');
		span.className = 'filter-switches';
		for (let filterType of Object.keys(filters)) {
			span.appendChild(createSwitch(filterType, configGetValue(filterType, 'on') === 'on'));
		}
		const filterStatus = document.querySelector('.filter-status');
		if (filterStatus) {
			filterStatus.parentNode.appendChild(span);
		}
	}

	function createSwitch(label, isOn) {
		const a = document.createElement('a');
		a.className = isOn ? 'filter-on' : 'filter-off';
		a.textContent = label;
		a.addEventListener('click', function(e) {
			if (this.className === 'filter-on') {
				this.className = 'filter-off';
				configSetValue(this.textContent, 'off');
			} else {
				this.className = 'filter-on';
				configSetValue(this.textContent, 'on');
			}
			filterScripts();
			e.preventDefault();
		}, false);
		return a;
	}

	function configSetValue(name, value) {
		localStorage.setItem(name, value);
	}

	function configGetValue(name, defaultValue) {
		const value = localStorage.getItem(name);
		return value ? value : defaultValue;
	}

})();
