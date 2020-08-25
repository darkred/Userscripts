// ==UserScript==
// @name        BugMeNot
// @namespace   darkred
// @version     2017.12.15
// @description Integrates BugMeNot into any login form  (it retrieves all matching logins from bugmenot.com and autofills the login form)
// @authors     hosts, Matt McCarthy, darkred
// @license     MIT
// @include     http://*
// @include     https://*
// @exclude     http://bugmenot.com/*
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// @grant       GM.openInTab
// @grant       GM_openInTab
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @noframes
// @run-at      document-idle
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==

// // @grant       GM.listValues

// latest version by hosts: 01.03.09
// based on code found at http://www.oreillynet.com/pub/h/4171
// ----------------------------
// based on code by Matt McCarthy
// and included here with his gracious permission

/* global GM */



function copyProperties(to, from) {
	for (var i in from) {
		to[i] = from[i];
	}
}

function main() {
	processPasswordFields();
}

function getBmnWrapper(pwFieldIndex) {
	return document.getElementById('reify-bugmenot-bmnWrapper' + pwFieldIndex);
}


function processPasswordFields() {
	(async function() {
		var allInputs = document.getElementsByTagName('input');
		//allInputslength = allInputs.length;
		var bmnContainer = document.createElement('div');
		bmnContainer.id = 'reify-bugmenot-container';
		var bodyEl = document.getElementsByTagName('body')[0];
		if (!bodyEl) return;
		for (var i = 0; i < allInputs.length; i++) {
			var pwField = allInputs[i];
			// console.log(allInputs[i].type.toLowerCase());
			if (!(pwField.type && pwField.type.toLowerCase() == 'password')) {
				continue;
			}
			var previousTextFieldInd = getPreviousTextField(i, allInputs);
			if (previousTextFieldInd == - 1) {
				if (DEBUG) {
					console.log('Couldn\'t find text field before password input ' + i + '.');
					continue;
				}
			}
			var usernameField = allInputs[previousTextFieldInd];
			usernameField.blur();       // Workaround for when the Username textbox has focus by default on page load
			usernameField.setAttribute('usernameInputIndex', previousTextFieldInd);
			usernameField.setAttribute('passwordInputIndex', i);
			Utility.addEventHandler(usernameField, 'focus', usernameField_onfocus);
			Utility.addEventHandler(usernameField, 'blur', usernameField_onblur);
			Utility.addEventHandler(pwField, 'focus', pwField_onfocus);
			Utility.addEventHandler(pwField, 'blur', pwField_onblur);
			pwField.setAttribute('usernameInputIndex', previousTextFieldInd);
			pwField.setAttribute('passwordInputIndex', i);

			// var getLoginLink = menuLink(bmnUri, 'Get login from BugMeNot', 'Get a login from BugMeNot', getLoginLink_onclick, Style.menuLink, previousTextFieldInd, i, menuLink_onmouseover, menuLink_onmouseout);

			// console.log('counter2: ' + counter);
			if (counter === 0) {
			// counter = 0;
				var myprompt = 'Get login from BugMeNot' + ' (' + (counter + 1) + '/-)';
				var myprompt2 = 'Get a login from BugMeNot';
			} else {
			// var total = JSON.parse(await GM.getValue('allUsernames')).length
				var total;
				total = JSON.parse(await GM.getValue('allUsernames')).length ;
				// console.log('total: ' +  total + ' | ' + ' counter: ' + counter);
				// console.log(counter <= total);


				if (counter + 1 <= total) {
					myprompt = 'Try next login from BugMeNot' + ' (' + (counter + 1) + '/' + total + ')';
					myprompt2 = 'Try next login';
				} else {
					myprompt = 'No other logins';
					myprompt2 = 'No other logins available';
				}
			// })();

			}

			var getLoginLink = menuLink(bmnUri, myprompt, myprompt2, getLoginLink_onclick, Style.menuLink, previousTextFieldInd, i, menuLink_onmouseover, menuLink_onmouseout);
			var getLoginLinkWrapper = menuEntry(getLoginLink, Style.menuLinkWrapper);

			if (counter > 0) {
				var resetCounterLink = menuLink('', 'Reset login attempt counter', 'Resets the login attempt counter (reloads the page)', resetCounterLink_onclick, Style.menuLink, previousTextFieldInd, i, menuLink_onmouseover, menuLink_onmouseout);
				var resetCounterLinkWrapper = menuEntry(resetCounterLink, Style.menuLinkWrapper);
			}

			var fullFormLink = menuLink(bmnUri, 'More options', 'See more options for getting logins from BugMeNot.com ' + '(opens a new window)', openMenuLink_onclick, Style.menuLink, previousTextFieldInd, i, menuLink_onmouseover, menuLink_onmouseout);
			var fullFormLinkWrapper = menuEntry(fullFormLink, Style.menuLinkWrapper);

			var visitBmnLink = menuLink(bmnHomeUri, 'Visit BugMeNot', 'Go to the BugMeNot home page (opens a new window)', openMenuLink_onclick, Style.menuLink, previousTextFieldInd, i, menuLink_onmouseover, menuLink_onmouseout);
			var visitBmnLinkWrapper = menuEntry(visitBmnLink, Style.menuLinkWrapper);


			var bmnWrapper = document.createElement('div');
			bmnWrapper.id = 'reify-bugmenot-bmnWrapper' + i;
			bmnWrapper.className = 'reify-bugmenot-bmnWrapper';

			bmnWrapper.appendChild(getLoginLinkWrapper);
			if (counter > 0) {
				bmnWrapper.appendChild(resetCounterLinkWrapper);
			}
			bmnWrapper.appendChild(fullFormLinkWrapper);
			bmnWrapper.appendChild(visitBmnLinkWrapper);

			copyProperties(bmnWrapper.style, Style.bmnWrapper);
			bmnContainer.appendChild(bmnWrapper);
		}
		if (bmnContainer.hasChildNodes()) {
			bodyEl.appendChild(bmnContainer);
		}
	})();
}

function menuEntry(linkEl, styleObj) {
	var p = document.createElement('p');
	copyProperties(p.style, styleObj);
	p.appendChild(linkEl);
	return p;
}

function menuLink(href, text, title, onclick, styleObj, usernameInputIndex, passwordInputIndex, onmouseover, onmouseout) {
	var newMenuLink = document.createElement('a');
	newMenuLink.href = href;
	newMenuLink.appendChild(document.createTextNode(text));
	newMenuLink.title = title;
	newMenuLink.setAttribute('usernameInputIndex', usernameInputIndex);
	newMenuLink.setAttribute('passwordInputIndex', passwordInputIndex);
	Utility.addEventHandler(newMenuLink, 'click', onclick);
	Utility.addEventHandler(newMenuLink, 'mouseover', onmouseover);
	Utility.addEventHandler(newMenuLink, 'mouseout', onmouseout);
	copyProperties(newMenuLink.style, styleObj);
	return newMenuLink;
}

function menuLink_onmouseover(event) {
	event = event || window.event;
	var target = event.currentTarget || event.srcElement;
	copyProperties(target.style, Style.menuLinkHover);
}

function menuLink_onmouseout(event) {
	event = event || window.event;
	var target = event.currentTarget || event.srcElement;
	copyProperties(target.style, Style.menuLink);
}

function getLoginLink_onclick(event) {
	var allInputs = document.getElementsByTagName('input');
	if ((!allInputs[this.getAttribute('passwordInputIndex')].value.length && !allInputs[this.getAttribute('usernameInputIndex')].value.length) || confirm('Overwrite the current login entry?')) {
		getLogin(bmnUri, this.getAttribute('usernameInputIndex'), this.getAttribute('passwordInputIndex'));
	}
	menuLink_onmouseout({
		currentTarget: this
	});
	event.preventDefault && event.preventDefault();
	return false;
}

function openMenuLink_onclick(event) {
	if (typeof GM.openInTab !== 'undefined') {
		GM.openInTab(this.href);
	} else {
		window.open(this.href);
	}
	menuLink_onmouseout({
		currentTarget: this
	});
	event.preventDefault && event.preventDefault();
	return false;
}

function resetCounterLink_onclick(){
	(async function() {
		GM.setValue('counter', 0);
	})();

	window.location.reload();
}


function usernameField_onfocus(event) {
	var allInputs = document.getElementsByTagName('input');
	event = event || window.event;
	var target = event.currentTarget || event.srcElement;
	target.setAttribute('hasFocus', true);
	showHideBmnWrapper(target, allInputs[target.getAttribute('passwordInputIndex')], true);
}

function usernameField_onblur(event) {
	var allInputs = document.getElementsByTagName('input');
	event = event || window.event || this;
	var target = event.currentTarget || event.srcElement;
	target.setAttribute('hasFocus', false);
	var fRef = hideIfNoFocus(allInputs[target.getAttribute('usernameInputIndex')], allInputs[target.getAttribute('passwordInputIndex')]);
	// race condition: wait for other element's onfocus
	setTimeout(fRef, BLUR_TIMEOUT);
}

function pwField_onfocus(event) {
	var allInputs = document.getElementsByTagName('input');
	event = event || window.event;
	var target = event.currentTarget || event.srcElement;
	target.setAttribute('hasFocus', true);
	showHideBmnWrapper(allInputs[target.getAttribute('usernameInputIndex')], target, true);
}

function pwField_onblur(event) {
	var allInputs = document.getElementsByTagName('input');
	event = event || window.event;
	var target = event.currentTarget || event.srcElement;
	target.setAttribute('hasFocus', false);
	var fRef = hideIfNoFocus(allInputs[target.getAttribute('usernameInputIndex')], allInputs[target.getAttribute('passwordInputIndex')]);
	// race condition: wait for other element's onfocus
	setTimeout(fRef, BLUR_TIMEOUT);
}

function hideIfNoFocus(usernameField, pwField) {
	return (function () {
		var bUsernameFocus = usernameField.getAttribute('hasFocus');
		if (typeof bUsernameFocus === 'string') {
			bUsernameFocus = (bUsernameFocus && bUsernameFocus != 'false');
		}
		var bPasswordFocus = pwField.getAttribute('hasFocus');
		if (typeof bPasswordFocus === 'string') {
			bPasswordFocus = (bPasswordFocus && bPasswordFocus != 'false');
		}
		if ((!bUsernameFocus) && (!bPasswordFocus)) {
			showHideBmnWrapper(usernameField, pwField, false);
		}
	});
}

function showHideBmnWrapper(usernameField, pwField, show) {
	var bmnWrapper = getBmnWrapper(pwField.getAttribute('passwordInputIndex'));
	if (show) {
		bmnWrapper.style.display = 'block';
		positionBmnWrapper(bmnWrapper, usernameField, pwField);
	} else {
		// console.log('hiding bugmenot wrapper');
		bmnWrapper.style.display = 'none';
		// Menu links may not get onmouseout event, so they get
		// stuck with the hover style unless we do this.
		var menuLinks = bmnWrapper.getElementsByTagName('div');
		for (var i = 0; i < menuLinks.length; i++) {
			copyProperties(menuLinks[i].style, Style.menuLink);
		}
	}
}

function positionBmnWrapper(bmnWrapper, usernameField, pwField) {
	var pwLeft = Utility.elementLeft(pwField);
	if (pwLeft + pwField.offsetWidth + bmnWrapper.offsetWidth +
Utility.scrollLeft() + 10 < Utility.viewportWidth()) {
		bmnWrapper.style.left = (pwLeft + pwField.offsetWidth + 2) + 'px';
		bmnWrapper.style.top = Utility.elementTop(pwField) + 'px';
	} else {
		bmnWrapper.style.left = (Utility.elementLeft(usernameField) -
	bmnWrapper.offsetWidth - 2) + 'px';
		bmnWrapper.style.top = Utility.elementTop(usernameField) + 'px';
	}
}


// We have a uri param rather than assuming it's for the current
// page so this function can be modular and potentially used
// for pages other than the current one.
function getLogin(uri, usernameInputIndex, passwordInputIndex) {

	(async function() {

		var allInputs = document.getElementsByTagName('input');
		var usernameField = allInputs[usernameInputIndex];
		var pwField = allInputs[passwordInputIndex];
		waitOrRestoreFields(usernameField, pwField, false);
		// var hostUri = location.hostname;
		var firstAttempt = retrievals == 0;
		var submitData = 'submit=This+login+didn%27t+work&num=' + retrievals +
'&site=' + encodeURI(location.hostname);



		// console.log(uri + ' ' +  usernameInputIndex + ' ' + passwordInputIndex);
		if (counter === 0){
			console.log('( retrieving logins from bugmenot.com via XHR... )');
			// (async function(){
			GM.xmlHttpRequest({
				method: firstAttempt ? 'get' : 'post',
				headers: firstAttempt ? null :
					{
						'Content-type': 'application/x-www-form-urlencoded'
					},
				data: firstAttempt ? null : submitData,
				url: firstAttempt ? uri : bmnView,
				// synchronous: true,
				onload: function (responseDetails) {
					if (responseDetails.status == 200) {
						waitOrRestoreFields(usernameField, pwField, true);
						// decoded = decodeit(responseDetails.responseText);
						var decoded = responseDetails.responseText;
						var doc = textToXml(decoded);
						if (!(doc && doc.documentElement)) {
							return Errors.say(Errors.malformedResponse);
						}



						var allUsernames = doc.documentElement.querySelectorAll('dd:nth-child(2) > kbd');
						var allPasswords = doc.documentElement.querySelectorAll('dd:nth-child(4) > kbd');
						var allUsernamesArray = [];
						var allPasswordsArray = [];
						for (var i = 0; i < allUsernames.length; i++) {
							allUsernamesArray.push(allUsernames[i].innerHTML);
							allPasswordsArray.push(allPasswords[i].innerHTML);
						}

						var temp = '';
						for (var j = 0; j < allUsernamesArray.length; j++){
							temp += (j + 1) + ': ' + allUsernamesArray[j] + ', ' + allPasswordsArray[j] + '\n';
						}
						console.log('Found logins (' + allUsernamesArray.length + '):\n' + temp);

						(async function() {
							GM.setValue('allUsernames', JSON.stringify(allUsernamesArray));
							GM.setValue('allPasswords', JSON.stringify(allPasswordsArray));
						})();
						//
						// var accountInfo = doc.documentElement.getElementsByTagName('td') [0];
						var accountInfo = doc.documentElement.getElementsByTagName('kbd') [0];
						if (!(accountInfo)) {
							return Errors.say(Errors.noLoginAvailable);
						}
						usernameField.value = accountInfo.childNodes[0].nodeValue;
						// var pwsField = doc.documentElement.getElementsByTagName('td') [1];
						var pwsField = doc.documentElement.getElementsByTagName('kbd') [1];
						pwField.value = pwsField.childNodes[0].nodeValue;
						retrievals++;
					} else {
						return Errors.say(Errors.xmlHttpFailure);
					}
				},
				onerror: function (responseDetails) {
					waitOrRestoreFields(usernameField, pwField, true);
					Errors.say(Errors.xmlHttpFailure);
				}
			});
		// })();

		} else {


			var retrievedUsernames = [];
			var retrievedPasswords = [];
			// (async function() {
			retrievedUsernames = JSON.parse(await GM.getValue('allUsernames'));
			retrievedPasswords = JSON.parse(await GM.getValue('allPasswords'));
			var temp = '';
			for (var j = 0; j < retrievedUsernames.length; j++){
				temp += (j + 1) + ': ' + retrievedUsernames[j] + ', ' + retrievedPasswords[j] + '\n';
			}
			console.log('Found logins (' + retrievedUsernames.length + '):\n' + temp);
			usernameField.value = retrievedUsernames[counter];
			pwField.value = retrievedPasswords[counter];
		// })();



		}




		counter = parseInt(counter);
		counter++;                                          // (after all is done..)
		GM.setValue('counter', counter);                    // .. store just increased counter and..
		GM.setValue('lastURL', String(window.location));    // .. store current location as lastURL



	})();

}

function waitOrRestoreFields(usernameField, pwField, restore) {
	document.documentElement.style.cursor = restore ? 'default' : 'progress';
	usernameField.value = restore ? '' : 'Loading...';
	//usernameField.disabled = !restore;
	//pwField.disabled = !restore;
}

function getPreviousTextField(pwFieldIndex, allInputs) {
	//var allInputs = document.getElementsByTagName("input");
	for (var i = pwFieldIndex; i >= 0 && i < allInputs.length; i--)
		if (allInputs[i].type && (allInputs[i].type.toLowerCase() == 'text' || allInputs[i].type.toLowerCase() == 'email'))
			return i;
	return - 1;
}

/*
function decodeit(codedtext) {
	var regexkey = /var key = (.*?)\;/;
	var match = regexkey.exec(codedtext);
	if (match != null) {
		var key = parseInt(match[1]);
	} else {
		alert('decoded key cannot be found\nbugmenot site has changed');
	}
	var codedtext = codedtext.replace(/<script>d\('(.*?)'\)\;<\/script>/gi, aaa);
	//alert (codedtext);
	return codedtext;
	function aaa(str, strInput, offset, s) {
		return d(strInput);
	}
	function decoder(data) {
		var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
		var o1,
			o2,
			o3,
			h1,
			h2,
			h3,
			h4,
			bits,
			i = 0,
			enc = '';
		do {
			h1 = b64.indexOf(data.charAt(i++));
			h2 = b64.indexOf(data.charAt(i++));
			h3 = b64.indexOf(data.charAt(i++));
			h4 = b64.indexOf(data.charAt(i++));
			bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
			o1 = bits >> 16 & 255;
			o2 = bits >> 8 & 255;
			o3 = bits & 255;
			if (h3 == 64) enc += String.fromCharCode(o1);
			else if (h4 == 64) enc += String.fromCharCode(o1, o2);
			else enc += String.fromCharCode(o1, o2, o3);
		} while (i < data.length);
		return enc;
	}
	function d(strInput) {
		strInput = decoder(strInput);
		var strOutput = '';
		var intOffset = (key + 112) / 12;
		for (i = 4; i < strInput.length; i++) {
			thisLetter = strInput.charAt(i);
			thisCharCode = strInput.charCodeAt(i);
			newCharCode = thisCharCode - intOffset;
			strOutput += String.fromCharCode(newCharCode);
		}
		return strOutput;
	}
}
*/

function textToXml(t) {
	try {
		if (typeof DOMParser !== 'undefined') {
			//t = toString(t);
			//          var dp = new DOMParser( );
			//          return dp.parseFromString(t, "text/xml");
			var parser = new DOMParser();
			//var t = t.replace(/<\?xml.*?\?>/g, ""); // strip <?xml ?> tag
			//t = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<rando>" + t + "</rando>";
			//t = t.replace(/&(?!\w*;)/g, "&");
			//alert(t);
			//alert(parser.parseFromString(t, "application/xml"));
			// return parser.parseFromString(t, 'application/xml');   // <--- the previous value
			return parser.parseFromString(t, 'text/html');
		}
		else {
			return null;
		}
	}
	catch (e) {
		return null;
	}
}





































var Style = {
	menuLink: {
		border: 'none',
		backgroundColor: '#fff',
		color: '#000',
		display: 'block',
		padding: '2px',
		margin: '0',
		// width: '12em',
		width: '17em',
		fontSize: '8pt',
		fontWeight: 'normal',
		textDecoration: 'none'
	},
	menuLinkHover: {
		backgroundColor: '#316AC5',
		color: '#fff'
	},
	menuLinkWrapper: {
		textAlign: 'left',
		padding: '1px',
		margin: 0
	},
	bmnWrapper: {
		display: 'none',
		fontFamily: 'tahoma, verdana, arial, sans-serif',
		whiteSpace: 'nowrap',
		position: 'absolute',
		zIndex: 1000,
		padding: '2px',
		border: '1px solid #ACA899',
		backgroundColor: '#fff',
		opacity: '0.9',
		filter: 'alpha(opacity=90)'
	}
};


















var Errors = {
	noLoginAvailable: 'Sorry, but BugMeNot.com had no login available ' +
'for this site.\nIf you\'re feeling helpful, you can click "More ' +
'options" to provide a login for future visitors.',
	malformedResponse: 'Sorry, but I couldn\'t understand the response ' +
'from BugMeNot.com.\nThe service might be unavailable.',
	siteBlocked: 'Sorry, but I couldn\'t understand the response ' +
'from BugMeNot.com.\nThe service might be unavailable.',
	xmlHttpFailure: 'There was an error in contacting BugMeNot.com.\n' +
'The server may be unavailable or having internal errors.',
	say: function (msg) {
		alert(msg);
		return false;
	}
};

var Utility = {
	elementTop: function (el) {
		return Utility.recursiveOffset(el, 'offsetTop');
	},
	elementLeft: function (el) {
		return Utility.recursiveOffset(el, 'offsetLeft');
	},
	recursiveOffset: function (el, prop) {
		var dist = 0;
		while (el.offsetParent)
		{
			dist += el[prop];
			el = el.offsetParent;
		}
		return dist;
	},
	viewportWidth: function () {
		return Utility.detectAndUseAppropriateObj('clientWidth');
	},
	viewportHeight: function () {
		return Utility.detectAndUseAppropriateObj('clientHeight');
	},
	scrollLeft: function () {
		return Utility.detectAndUseAppropriateObj('scrollLeft');
	},
	scrollTop: function () {
		return Utility.detectAndUseAppropriateObj('scrollTop');
	},
	detectAndUseAppropriateObj: function (prop) {
		if (document.documentElement && document.documentElement[prop]) {
			return document.documentElement[prop];
		}
		else if (document.body && document.body[prop]) {
			return document.body[prop];
		} else {
			return - 1;
		}
	},
	addEventHandler: function (target, eventName, eventHandler) {
		if (target.addEventListener) {
			target.addEventListener(eventName, eventHandler, false);
		} else if (target.attachEvent) {
			target.attachEvent('on' + eventName, eventHandler);
		}
	}
};
























// new logins gotten from the current page (reset on every page load)
var retrievals = 0;
// millisecond delay between a field losing focus and checking to see
// if any other of our fields has focus. If this is too low, the menu
// won't work because it will get "display: none" and its onclick
// won't fire.
// var BLUR_TIMEOUT = 150;
const BLUR_TIMEOUT = 250;

//http://www.bugmenot.com/view/orasisx.net
//phoneRegex = /(?:http://)(.*)/.*?/;
//doma= location.href.match( phoneRegex );

// myString = location.href;
// domainnameRE = new RegExp('(?:https?://)(.*?)/.*?', 'i');
// domainname = myString.match(domainnameRE)
// domainname = domainname[1];
//alert (domainname);
const myString = location.href;
const domainnameRE = new RegExp('(?:https?://)(www\\.)?(.*?)/.*?', 'i');
const domainname = myString.match(domainnameRE)[2];

// var allInputs = null;
const bmnView = 'http://bugmenot.com/view';
const bmnUri = bmnView + '/' + domainname;
const bmnHomeUri = 'http://bugmenot.com/';
const DEBUG = false;
// var bmnWrappers = new Object();


var counter ;


// If the current domain name doesn't match the stored lastURL, then reset the counter
var lastURL;
(async function() {
	lastURL = await GM.getValue('lastURL', '');
	// console.log('lastURL: ' + lastURL);
	if (lastURL.indexOf(domainname) === -1){
		counter = 0;
		GM.setValue('counter', 0);
		// console.log('CASE 0');
	} else {
		counter = parseInt(await GM.getValue('counter', 0));
		// console.log('counter1: ' + counter);
	}
	// console.log(await GM.listValues());

	main();
})();




// main();



// to do
// http://www.bugmenot.com/view/thecavernforum.com  Site Blocked
