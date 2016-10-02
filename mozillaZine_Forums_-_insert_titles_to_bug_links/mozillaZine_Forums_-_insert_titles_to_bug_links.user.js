// ==UserScript==
// @name        mozillaZine Forums - insert titles to bug links
// @namespace   darkred
// @author      darkred, johnp_
// @description Inserts titles to bug links that are plain URLs, in forums.mozillazine.org
// @include     http://forums.mozillazine.org/viewtopic.php*
// @version     2.0.2
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @resource    icon http://i.imgur.com/3Y8dqYZ.gif
// ==/UserScript==

// v2.0: Script rewrite (based on johnp_'s contribution in the userscript 'Firefox for desktop - list fixed bugs in Mercurial'):
// now the REST API is used (one(1) network connection is made for all unique examined bug IDs)


 /* eslint-disable no-console */



var silent = false;
var debug = false;

time('MozillaBugzilla');


var regex = /^https:\/\/bugzilla\.mozilla\.org\/show_bug\.cgi\?id=([0-9]*).*$/;
var base_url = 'https://bugzilla.mozilla.org/rest/bug?include_fields=id,summary&id=';
var bugIds = [];
var bugCodes = [];
var bugTitles = [];
var links = document.getElementsByClassName('postlink');
var len = links.length;


for (let i = 0; i < len; i++) {
	let n = links[i].href.match(regex);
	let n2 = links[i].innerHTML;
	if (n !== null &&
		n2.match(/^#[0-9]*/) === null &&
		n2.indexOf('-') === -1) {
		let id = parseInt(n[1]);
		if (bugIds.indexOf(id) === -1) {
			bugIds.push(id);
		}
	}
}



var numBugs = bugIds.length;
var counter = 0;







var rest_url = base_url + bugIds.join();
time('MozillaBugzilla-REST');










// ADDING a spinning icon to the matching links
for (var i = 0; i < links.length; i++) {
	if (   links[i].href.match(regex)
		&& links[i].innerHTML.match(/#[0-9]*/) == null
		&& links[i].innerHTML.indexOf('-') == -1 ) {
		var elem = document.createElement('img');
		elem.src = GM_getResourceURL('icon');
		links[i].parentNode.insertBefore(elem, links[i].nextSibling);          // For spinning icon AFTER the link
		// links[i].parentNode.insertBefore(elem, links[i].previousSibling);   // For spinning icon BEFORE the link
	}
}













$.getJSON(rest_url, function(data) {
	timeEnd('MozillaBugzilla-REST');


	$.each(data.bugs, function(index) {
		let bug = data.bugs[index];

		log('----------------------------------------------------------------------------------------------------------------------------------');
		log((index + 1) + '/' + numBugs); // Progression counter

		log('BugNo: ' + bug.id + '\nTitle: ' + bug.summary);



		bugCodes.push(bug.id);
		bugTitles.push(bug.summary);


		counter++; // increase counter

		let i = bugIds.indexOf(bug.id);
		if (i !== -1) {bugIds[i] = null;}
	});
	log('==============\nReceived ' + counter + ' of ' + numBugs + ' bugs.');

	// process remaining bugs one-by-one
	var requests = [];
	time('MozillaBugzilla-missing');
	$.each(bugIds, function(index) {
		let id = bugIds[index];
		if (id !== null) {
			time('Requesting missing bug ' + id);
			let promise = $.getJSON('https://bugzilla.mozilla.org/rest/bug/' + id,
								function(json) {
				// I've not end up here yet, so cry if we do
									console.error('Request succeeded unexpectedly!');
									console.error('Please submit this information to the script authors:');
									timeEnd('Requesting missing bug ' + id);
									console.log(json);
									let bug = json.bugs[0];
									console.log(bug);
				// TODO: display as much information as possible
								});
			// Actually, we usually get an error
			promise.error(function(req, status, error) {
				timeEnd('Requesting missing bug ' + id);
				if (error == 'Authorization Required') {
					log('Bug ' + id + ' requires authorization!');
					log('https://bugzilla.mozilla.org/show_bug.cgi?id=' + id + ' requires authorization!');
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
		timeEnd('MozillaBugzilla-missing');

		// console.log(bugCodes);

		for (let z=0; z < links.length; z++) {
			for (let yy=0; yy < bugCodes.length; yy++) {

				if (regex.test(links[z].href)
					&& links[z].href.match(regex)[1] == bugCodes[yy]
					&& links[z].innerHTML.indexOf('-') == -1 ) {

					let temp = links[z].innerHTML.match(/([Bb]ug\ [a-zA-Z]*).*[0-9]*/i);
					var temp2 = links[z].href.match(/^https:\/\/bugzilla\.mozilla\.org\/show_bug\.cgi\?id=[0-9]*(.*)$/);
					if (temp !== null) {
						links[z].previousSibling.textContent += temp[1] + ' ';
						links[z].innerHTML = bugCodes[yy] + ' - ' + bugTitles[yy] + temp2[1];
					} else {
						links[z].innerHTML = bugCodes[yy] + ' - ' + bugTitles[yy] + temp2[1];
					}


					// REMOVE the spinning icon
					links[z].nextSibling.remove();           				 // For spinning icon AFTER the link
					// x.previousSibling.previousSibling.remove();           // For spinning icon BEFORE the link

				}
			}
		}





		log('ALL IS DONE');
		timeEnd('MozillaBugzilla');
	});
});







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
