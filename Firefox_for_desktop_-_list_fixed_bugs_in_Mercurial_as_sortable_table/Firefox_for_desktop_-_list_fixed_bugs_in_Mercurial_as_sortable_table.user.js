// ==UserScript==
// @name        Firefox for desktop - list fixed bugs in Mercurial as sortable table
// @namespace   darkred
// @version     5.5.9.1
// @description It generates a sortable table list of fixed bugs related to Firefox for desktop in Mozilla Mercurial pushlogs
// @authors     darkred, johnp
// @license     MIT
// @date        2018.5.16
// @include     /^https?:\/\/hg\.mozilla\.org.*pushloghtml.*/
// @grant       GM_getResourceURL
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.24.3/js/jquery.tablesorter.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment-with-locales.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.1/moment-timezone-with-data.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.6/jstz.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/keypress/2.1.3/keypress.min.js
// @resource    jqUI_CSS  http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/redmond/jquery-ui.min.css
// @resource    IconSet1  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-bg_glass_75_d0e5f5_1x400.png
// @resource    IconSet2  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-bg_glass_85_dfeffc_1x400.png
// @resource    IconSet3  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-bg_gloss-wave_55_5c9ccc_500x100.png
// @resource    IconSet4  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-bg_inset-hard_100_fcfdfd_1x100.png
// @resource    IconSet5  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-icons_217bc0_256x240.png
// @resource    IconSet6  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-icons_469bdd_256x240.png
// @resource    IconSet7  https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/redmond/images/ui-icons_6da8d5_256x240.png
// Thanks a lot to: johnp (your contribution is most appreciated!), wOxxOm and Brock Adams.
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==


/* esli nt-disable no-console, indent, no-mixed-spaces-and-tabs, complexity */
/* eslint-disable no-console, complexity */
/* global jstz, moment */


var silent = false;
var debug = false;

time('MozillaMercurial');





// CSS rules in order to show 'up' and 'down' arrows in each table header
var stylesheet = `
<style>
thead th {
	background-repeat: no-repeat;
	background-position: right center;
}
thead th.up {
	padding-right: 20px;
	background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7);
}
thead th.down {
	padding-right: 20px;
	background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7);
}
</style>`;

$('head').append(stylesheet);



var stylesheet2 =
`<style>


/* in order to highlight hovered table row */
#tbl tr:hover{ background:#F6E6C6 !important;}

/* in order the table headers to be larger and bold */
#tbl th {text-align: -moz-center !important; font-size: larger; font-weight: bold; }

/* in order to remove unnecessairy space between rows */
#dialog > div > table > tbody {line-height: 14px;}


#tbl > thead > tr > th {border-bottom: solid 1px};}


#tbl td:nth-child(1) {text-align: -moz-right;}


/* in order the 'product/component' to be aligned to the left */
#tbl td:nth-child(2) {text-align: -moz-left;}

/* in order the 'Product/Component' cells to appear truncated */
#tbl td:nth-child(2) {white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width:280px;}   /* initially it was max-width:1px; */

/* in order the 'Modified' cells to have fixed width (via being displayed truncated but with max-width:100px)  (in order to avoid having to display "Modified__") */
#tbl td:nth-child(3) {white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width:700px;}   /* initially it was max-width:1px; */

/* in order the 'Modified' cells to have fixed width (via being displayed truncated but with max-width:100px)  (in order to avoid having to display "Modified__") */
#tbl td:nth-child(4) {white-space: nowrap; text-overflow:ellipsis; overflow: hidden; max-width:100px;}   /* initially it was max-width:1px; */

/* in order the bug list to have width 1500px */
.ui-dialog {width:1200px !important;}

</style>`;
$('head').append(stylesheet2);







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






// theme for the jQuery dialog
// $('head').append(
//     '<link ' +
//     'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/redmond/jquery-ui.min.css" ' +
//     // 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.min.css" ' +                 // uncomment this line (and comment line 89)  in order to change theme
//     'rel="stylesheet" type="text/css">'
// );
// var newCSS = GM_getResourceText ('customCSS');
// GM_addStyle (newCSS);
$.ajax({
	url:'http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/redmond/jquery-ui.min.css',
	success:function(data){
		$('<style></style>').appendTo('head').html(data);
	}
});

var regex = /^https:\/\/bugzilla\.mozilla\.org\/show_bug\.cgi\?id=(.*)$/;
var base_url = 'https://bugzilla.mozilla.org/rest/bug?include_fields=id,summary,status,resolution,product,component,op_sys,platform,whiteboard,last_change_time&id=';
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





		// 2015-11-09T14:40:41Z
		function toRelativeTime(time, zone) {
			var format2 = ('YYYY-MM-DD HH:mm:ss Z');
			return moment(time, format2).tz(zone).fromNow();
		}


		function getLocalTimezone(){
			var tz = jstz.determine();    // Determines the time zone of the browser client
			return tz.name();             // Returns the name of the time zone eg "Europe/Berlin"
		}




		var changetime;
		var localTimezone = getLocalTimezone();

		if (bug.last_change_time !== '') {
			var temp = toRelativeTime(bug.last_change_time, localTimezone);
			if (temp.match(/(an?) .*/)) {
				changetime = temp.replace(/an?/, 1);
			} else {
				changetime = temp;
			}
		// changetime
		} else {
			changetime = '';
		}








		log('----------------------------------------------------------------------------------------------------------------------------------');
		log((index + 1) + '/' + numBugs); // Progression counter
		log('BugNo: ' + bug.id + '\nTitle: ' + bug.summary + '\nStatus: ' + status + '\nProduct: ' + product + '\nComponent: ' + component + '\nPlatform: ' + platform + '\nWhiteboard: ' + whiteboard);

		if (isRelevant(bug)) {
			// add html code for this bug
			bugsComplete.push('<tr><td><a href="'
						// + 'https://bugzilla.mozilla.org/show_bug.cgi?id='+ bug.id + '">'
						+ 'https://bugzilla.mozilla.org/show_bug.cgi?id='+ bug.id + '"' + ' title="' + bug.id + ' - ' +  bug.summary + '">#'
						+ bug.id
						+ '</a></td>'
						+ '<td nowrap>(' + product + ': ' + component + ') </td>'
						+ '<td>'+bug.summary.escapeHTML() + ' [' + platform + ']' + whiteboard.escapeHTML() + '</td>'
						+ '<td>' + changetime + '</td></tr>');  // previously had a <br> at the end;
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
					// log("Bug " + id + " requires authorization!");
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
		docu = ' <table id="tbl" style="width:100%">' +
				'<thead>' +
				'<tr><th>BugNo</th>' +
				'<th>Product/Component</th>' +            // '<th>Product/Component_________</th>' +
				'<th>Summary</th>' +
				'<th>Modified</th></tr>' +              // '<th>Modified__</th></tr>' +
				'</thead>' +
				'<tbody>' + docu + '</tbody></table>';




		var div = document.createElement('div');
		$('div.page_footer').append(div);
		div.id = 'dialog';
		docu = '<div id="dialog_content">' + docu + '</div>';
		div.innerHTML = docu;
		$('#dialog').hide();

		$(function() {
			$('#dialog').dialog({
				title: 'List of fixed bugs of Firefox for desktop (' + bugsComplete.length + ')',
				width: '1350px'
			});
		});






		// THE CUSTOM PARSER MUST BE PUT BEFORE '$('#tbl').tablesorter ( {'' or else it wont work !!!!
		// add parser through the tablesorter addParser method  (for the "Last modified" column)
		$.tablesorter.addParser({
			// set a unique id
			id: 'dates',
			is: function(s) {
				return false;                                // return false so this parser is not auto detected
			},
			format: function(s) {
				// format your data for normalization
				if (s !== ''){
					var number1, number2;

					// format your data for normalization
					number1 = Number((/(.{1,2}) .*/).exec(s)[1]);


					if (s.match(/A few seconds ago/)) { number2 = 0;}
					else if (s.match(/(.*)seconds?.*/)) { number2 = 1;}
					else if (s.match(/(.*)minutes?.*/)) {number2 = 60;}
					else if (s.match(/(.*)hours?.*/)) { number2 = 3600;}
					else if (s.match(/(.*)days?.*/)) { number2 = 86400;}
					else if (s.match(/(.*)months?.*/)) { number2 = 30 * 86400;}
					else if (s.match(/(.*)years?.*/)) {number2 = 365 * 30 * 86400;}
					return number1 * number2;

				}
			},
			// set type, either numeric or text
			type: 'numeric'
		});



		// make table sortable
		$('#tbl').tablesorter({
			cssAsc: 'up',
			cssDesc: 'down',
			sortList: [[3, 0],[1, 0],[2, 0]], // in order the table to be sorted by default by column 3 'Modified', then by column 1 'Product/Component' and then by column 2 'Summary'
			headers: {3: {sorter: 'dates'}},
			initialized: function() {
				var mytable = document.getElementById('tbl');
				for (let i = 2, j = mytable.rows.length + 1; i < j; i++) {
					if (mytable.rows[i].cells[3].innerHTML !== mytable.rows[i - 1].cells[3].innerHTML) {
						for (let k = 0; k < 4; k++) {
							mytable.rows[i - 1].cells[k].style.borderBottom = '1px black dotted';
						}
					}
				}
			}
		});






		log('ALL IS DONE');
		timeEnd('MozillaMercurial');





	});

});


var flag = 1;

// bind keypress of ` so that when pressed, the separators between groups of the same timestamps to be removed, in order to sort manually
var listener = new window.keypress.Listener();
listener.simple_combo('`', function() {
	// console.log('You pressed `');
	if (flag === 1) {
		flag = 0;
		// remove seperators
		var mytable = document.getElementById('tbl');
		for (let i = 2, j = mytable.rows.length + 1; i < j; i++) {
			for (let k = 0; k < 4; k++) {
				mytable.rows[i - 1].cells[k].style.borderBottom = 'none';
			}
		}
		var sorting = [[1, 0], [2, 0]]; // sort by column 1 'Product/Component' and then by column 2 'Summary'
		$('#tbl').trigger('sorton', [sorting]);
	} else {
		if (flag === 0) {
			flag = 1;
			// console.log('You pressed ~');
			sorting = [[3, 0], [1, 0], [2, 0]]; // sort by column 3 'Modified Date, then by '1 'Product/Component' and then by column 2 'Summary'
			$('#tbl').trigger('sorton', [sorting]);
			mytable = document.getElementById('tbl');
			for (let i = 2, j = mytable.rows.length + 1; i < j; i++) {
				if (mytable.rows[i].cells[3].innerHTML !== mytable.rows[i - 1].cells[3].innerHTML) {
					for (let k = 0; k < 4; k++) {
						mytable.rows[i - 1].cells[k].style.borderBottom = '1px black dotted';
					}
				}
			}
		}
	}
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
	if (bug.product &&
		bug.product !== 'Add-on SDK'      &&
		bug.product !== 'Cloud Services'  &&
		bug.product !== 'Core'            &&
		bug.product !== 'Firefox'         &&
		bug.product !== 'Hello (Loop)'    &&
		bug.product !== 'Toolkit') {
		log('    IRRELEVANT because of it\'s Product --> ' + bug.product);
		return false;
	}
	if (bug.component &&
		bug.component === 'AutoConfig'                 ||
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


$('#dialog').dialog({
	modal: false,
	title: 'Draggable, sizeable dialog',
	position: {
		my: 'top',
		at: 'top',
		of: document,
		collision: 'none'
	},
	// width: 1500,               // not working
	zIndex: 3666
}).dialog('widget').draggable('option', 'containment', 'none');

//-- Fix crazy bug in FF! ...
$('#dialog').parent().css({
	position: 'fixed',
	top: 0,
	left: '4em',
	width: '75ex'
});
