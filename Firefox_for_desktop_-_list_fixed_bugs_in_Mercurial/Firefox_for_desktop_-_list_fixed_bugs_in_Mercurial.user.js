// ==UserScript==
// @name        Firefox for desktop - list fixed bugs in Mercurial
// @namespace   darkred
// @authors     darkred, johnp
// @license     MIT
// @description It generates a list of fixed bugs related to Firefox for desktop in Mozilla Mercurial pushlogs
// @version     4.2.8
// @date        2018.5.13
// @include     /^https?:\/\/hg\.mozilla\.org.*pushloghtml.*/
// @grant       GM_getResourceURL
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @resource    jqUI_CSS  http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/redmond/jquery-ui.min.css
// @resource    IconSet1  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-bg_glass_75_d0e5f5_1x400.png
// @resource    IconSet2  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-bg_glass_85_dfeffc_1x400.png
// @resource    IconSet3  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-bg_gloss-wave_55_5c9ccc_500x100.png
// @resource    IconSet4  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-bg_inset-hard_100_fcfdfd_1x100.png
// @resource    IconSet5  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-icons_217bc0_256x240.png
// @resource    IconSet6  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-icons_469bdd_256x240.png
// @resource    IconSet7  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-icons_6da8d5_256x240.png
// Thanks a lot to: johnp (your contribution is most appreciated!), wOxxOm and Brock Adams.
// ==/UserScript==







/* eslint-disable no-console, indent, no-mixed-spaces-and-tabs, complexity */


var silent = false;
var debug = false;

time('MozillaMercurial');




// the dialog will only be opened after all these promises have finished
var requests = [];


// theme for the jQuery dialog
if (typeof(GM_getResourceText) !== 'undefined' && typeof(GM_addStyle) !== 'undefined') {


	// https://stackoverflow.com/a/11532646/ , i.e. https://stackoverflow.com/a/11532646/3231411  (By Brock Adams)
	// Themes files URLs: https://cdnjs.com/libraries/jqueryui
	let iconSet1    = GM_getResourceURL ('IconSet1');
	let iconSet2    = GM_getResourceURL ('IconSet2');
	let iconSet3    = GM_getResourceURL ('IconSet3');
	let iconSet4    = GM_getResourceURL ('IconSet4');
	let iconSet5    = GM_getResourceURL ('IconSet5');
	let iconSet6    = GM_getResourceURL ('IconSet6');
	let iconSet7    = GM_getResourceURL ('IconSet7');
	let jqUI_CssSrc = GM_getResourceText ('jqUI_CSS');
	// jqUI_CssSrc     = jqUI_CssSrc.replace (/url\(images\/ui\-bg_.*00\.png\)/g, '');
	jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-bg_glass_75_d0e5f5_1x400\.png/g,         iconSet1);
	jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-bg_glass_85_dfeffc_1x400\.png/g,         iconSet2);
	jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-bg_gloss-wave_55_5c9ccc_500x100\.png/g,  iconSet3);
	jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-bg_inset-hard_100_fcfdfd_1x100\.png/g,   iconSet4);
	jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-icons_217bc0_256x240\.png/g,             iconSet5);
	jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-icons_469bdd_256x240\.png/g,             iconSet6);
	jqUI_CssSrc     = jqUI_CssSrc.replace (/images\/ui-icons_6da8d5_256x240\.png/g,             iconSet7);

	GM_addStyle (jqUI_CssSrc);


} else { // e.g. Greasemonkey: https://github.com/greasemonkey/greasemonkey/issues/2548
	// load jquery-ui css dynamically to bypass Content-Security-Policy restrictions
	let loadCss = $.get('https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/redmond/jquery-ui.min.css', function(css) {
		$('head').append('<style>' + css + '</style>');
	});
	requests.push(loadCss); // prevent a possible race condition where the dialog is opened before the css is loaded
}






var regex = /^https:\/\/bugzilla\.mozilla\.org\/show_bug\.cgi\?id=(.*)$/;
var base_url = 'https://bugzilla.mozilla.org/rest/bug?include_fields=id,summary,status,resolution,product,component,op_sys,platform,whiteboard&id=';
var bugIds = [];
var bugsComplete = [];

var table = document.getElementsByTagName('table')[0];
var links = table.getElementsByTagName('a');
var len = links.length;
for (let i = 0; i < len; i++) {
	let n = links[i].href.match(regex);
	if (n !== null && n.length > 0) {
		let id = parseInt(n[1]);
		if (bugIds.indexOf(id) === -1) {
			bugIds.push(id);
		}
	}
}

var numBugs = bugIds.length;
var counter = 0;

var rest_url = base_url + bugIds.join();


String.prototype.escapeHTML = function() {
	var tagsToReplace = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;'
	};

	return this.replace(/[&<>]/g, function(tag) {
		return tagsToReplace[tag] || tag;
	});
};



time('MozillaMercurial-REST');


$.getJSON(rest_url, function(data) {
	timeEnd('MozillaMercurial-REST');
	data.bugs.sort(function(a, b) {
		return (a.product + ': ' + a.component + ': ' + a.summary).localeCompare(b.product + ': ' + b.component + ': ' + b.summary);	// had to change '>' with '.localeCompare' because the sorting wasn't applied when run with Tampermonkey
	});
	$.each(data.bugs, function(index) {
		let bug = data.bugs[index];
		// process bug (let "shorthands" just to simplify things during refactoring)
		let status = bug.status;
		if (bug.resolution !== '') {status += ' ' + bug.resolution;}
		let product = bug.product;
		let component = bug.component;
		let platform = bug.platform;
		if (platform === 'Unspecified') {
			platform = 'Uns';
		}
		if (bug.op_sys !== '' && bug.op_sys !== 'Unspecified') {
			platform += '/' + bug.op_sys;
		}
		let whiteboard = bug.whiteboard === '' ? '[]' : bug.whiteboard;
		// todo: message???

		log('----------------------------------------------------------------------------------------------------------------------------------');
		log((index + 1) + '/' + numBugs); // Progression counter
		log('BugNo: ' + bug.id + '\nTitle: ' + bug.summary + '\nStatus: ' + status + '\nProduct: ' + product + '\nComponent: ' + component + '\nPlatform: ' + platform + '\nWhiteboard: ' + whiteboard);

		if (isRelevant(bug)) {
			// add html code for this bug
			// console.log(typeof bug.summary)
			bugsComplete.push('<a href="'
						// + 'https://bugzilla.mozilla.org/show_bug.cgi?id='+ bug.id + '"' + ' title="' + bug.id + ' (' + product + ': ' + component + ') ' +  bug.summary + '">#'
						+ 'https://bugzilla.mozilla.org/show_bug.cgi?id='+ bug.id + '"' + ' title="' + bug.id + ' - ' +  bug.summary + '">#'
						+ bug.id
						+ '</a>'
						+ ' (' + product + ': ' + component + ') '
						+ bug.summary.escapeHTML() + ' [' + platform + ']' + whiteboard.escapeHTML() + '<br>');
		}
		counter++; // increase counter
		// remove processed bug from bugIds
		let i = bugIds.indexOf(bug.id);
		if (i !== -1) {bugIds[i] = null;}
	});
	log('==============\nReceived ' + counter + ' of ' + numBugs + ' bugs.');

	// process remaining bugs one-by-one
	time('MozillaMercurial-missing');
	$.each(bugIds, function(index) {
		let id = bugIds[index];
		if (id !== null) {
			time('Requesting missing bug ' + id);
			let promise = $.getJSON('https://bugzilla.mozilla.org/rest/bug/' + id,
				function(json) {
					// I've not end up here yet, so cry if we do
					console.error('Request for bug ' + id + ' succeeded unexpectedly!');
					timeEnd('Requesting missing bug ' + id);
					console.error(json);
			});
			// Actually, we usually get an '401 Authorization Required' error
		promise.fail(function(req, status, error) {
			timeEnd('Requesting missing bug ' + id);
			if (error === 'Authorization Required') {
					log('Bug ' + id + ' requires authorization!');
					log('https://bugzilla.mozilla.org/show_bug.cgi?id=' + id + ' requires authorization!');
					let text = ' requires authorization!<br>';

					bugsComplete.push('<a href="'
						+ 'https://bugzilla.mozilla.org/show_bug.cgi?id='+ id + '">#'
						+ id + '</a>' + text);
				} else {
					console.error('Unexpected error encountered (Bug' + id + '): ' + status + ' ' + error);
				}
			});
			requests.push(promise);
		}
	});
	// wait for all requests to be settled, then join them together
	// Source: https://stackoverflow.com/questions/19177087/deferred-how-to-detect-when-every-promise-has-been-executed
	$.when.apply($, $.map(requests, function(p) {
		return p.then(null, function() {
			return $.Deferred().resolveWith(this, arguments);
		});
	})).always(function() {
		timeEnd('MozillaMercurial-missing');
		// Variable that will contain all values of the bugsComplete array, and will be displayed in the 'dialog' below
		var docu = '';
		docu = bugsComplete.join('');

		var div = document.createElement('div');
		$('div.page_footer').append(div);
		div.id = 'dialog';
		// GM_setClipboard (docu);            // This line stores the list content HTML code to clipboard (aimed for MozillaZine daily "The Official Win32 xxxxxxx builds" maintainer)
		// docu = '<div id="dialog_content" title="Relevant Bugs">' + docu + '</div>';
		docu = '<div id="dialog_content">' + docu + '</div>';
		div.innerHTML = docu;
		$('#dialog').hide();

		$(function() {
			$('#dialog').dialog({
				title: 'List of recently fixed bugs of Firefox for Desktop (' + bugsComplete.length + ')',
				width: '1350px'
			});
		});

		log('ALL IS DONE');
		timeEnd('MozillaMercurial');
	});
});

function isRelevant(bug) {
	if (!bug.id) {return false;}
	if (bug.status && bug.status !== 'RESOLVED' && bug.status !== 'VERIFIED') {
		log('    IRRELEVANT because of it\'s Status --> ' + bug.status);

		return false;
	}
	if (bug.component && bug.product && bug.component === 'Build Config' && (bug.product === 'Toolkit' || bug.product === 'Firefox')) {
		log('    IRRELEVANT because of it\'s Product --> ' + bug.product + 'having component --> ' + bug.component);

		return false;
	}
	if (      bug.product                       &&
			  bug.product !== 'Add-on SDK'      &&
			  bug.product !== 'Cloud Services'  &&
			  bug.product !== 'Core'            &&
			  bug.product !== 'Firefox'         &&
			  bug.product !== 'Hello (Loop)'    &&
			  bug.product !== 'Toolkit') {
		log('    IRRELEVANT because of it\'s Product --> ' + bug.product);

		return false;
	}
	if (bug.component && bug.component === 'AutoConfig'       ||
			   bug.component === 'Build Config'               ||
			   bug.component === 'DMD'                        ||
			   bug.component === 'Embedding: GRE Core'        ||
			   bug.component === 'Embedding: Mac'             ||
			   bug.component === 'Embedding: MFC Embed'       ||
			   bug.component === 'Embedding: Packaging'       ||
			   bug.component === 'Hardware Abstraction Layer' ||
			   bug.component === 'mach'                       ||
			   bug.component === 'Nanojit'                    ||
			   bug.component === 'QuickLaunch'                ||
			   bug.component === 'Widget: Gonk') {
		log('    IRRELEVANT because of it\'s Component --> ' + bug.component);

		return false;
	}

	log('    OK  ' + 'https://bugzilla.mozilla.org/show_bug.cgi?id=' + bug.id);

	return true;
}

function log(str) {
	if (!silent) {
		console.log(str);
	}
}

function time(str) {
	if (debug) {
		console.time(str);
	}
}

function timeEnd(str) {
	if (debug) {
		console.timeEnd(str);
	}
}

// $(function() {
$('#dialog').dialog({
	modal: false,
	title: 'Draggable, sizeable dialog',
	position: {
		my: 'top',
		at: 'top',
		of: document,
		collision: 'none'
	},
	width: 'auto',
	minWidth: 400,
	minHeight: 200,
	zIndex: 3666
})
	.dialog('widget').draggable('option', 'containment', 'none');

//-- Fix crazy bug in FF! ...
$('#dialog').parent().css({
	position: 'fixed',
	top: 0,
	left: '4em',
	width: '75ex'
});
