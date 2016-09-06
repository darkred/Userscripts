// ==UserScript==
// @name        Firefox for desktop - list fixed bugs in Mercurial
// @namespace   darkred
// @authors     darkred, johnp
// @description It generates a list of fixed bugs related to Firefox for desktop in Mozilla Mercurial pushlogs
// @include     /^https?:\/\/hg\.mozilla\.org.*pushloghtml.*/
// @version     4.2
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_setClipboard
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// ==/UserScript==

/* global $:false */
/* eslint-disable no-console */


var silent = false;
var debug = false;

time("MozillaMercurial");

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

// theme for the jQuery dialog
$("head").append(
    '<link ' +
    'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/redmond/jquery-ui.min.css" ' +
    // 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.min.css" ' +                 // uncomment this (and comment #19)  in order to change theme
    'rel="stylesheet" type="text/css">'
);


var regex = /^https:\/\/bugzilla\.mozilla\.org\/show_bug\.cgi\?id=(.*)$/;
var base_url = "https://bugzilla.mozilla.org/rest/bug?include_fields=id,summary,status,resolution,product,component,op_sys,platform,whiteboard&id=";
var bugIds = [];
var bugsComplete = [];

var table = document.getElementsByTagName("table")[0];
var links = table.getElementsByTagName("a");
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
time("MozillaMercurial-REST");
$.getJSON(rest_url, function(data) {
  timeEnd("MozillaMercurial-REST");
  data.bugs.sort(function(a, b) {
    return (a.product + ": " + a.component) > (b.product + ": " + b.component);
  });
  $.each(data.bugs, function(index) {
    let bug = data.bugs[index];
    // process bug (let "shorthands" just to simplify things during refactoring)
    let status = bug.status;
    if (bug.resolution !== "") {status += " " + bug.resolution;}
    let product = bug.product;
    let component = bug.component;
    let platform = bug.platform;
    if (platform == 'Unspecified') {
      platform = 'Uns';
    }
    if (bug.op_sys !== "" && bug.op_sys !== "Unspecified") {
      platform += '/' + bug.op_sys;
    }
    let whiteboard = bug.whiteboard === "" ? "[]" : bug.whiteboard;
    // todo: message???

     log('----------------------------------------------------------------------------------------------------------------------------------');
     log((index + 1) + "/" + numBugs); // Progression counter
     log('BugNo: ' + bug.id + '\nTitle: ' + bug.summary + '\nStatus: ' + status + '\nProduct: ' + product + '\nComponent: ' + component + '\nPlatform: ' + platform + '\nWhiteboard: ' + whiteboard);

    if (isRelevant(bug)) {
      // add html code for this bug
      bugsComplete.push('<a href="'
                        + 'https://bugzilla.mozilla.org/show_bug.cgi?id='+ bug.id + '">#'
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
  log("==============\nReceived " + counter + " of " + numBugs + " bugs.");

  // process remaining bugs one-by-one
  var requests = [];
  time("MozillaMercurial-missing");
  $.each(bugIds, function(index) {
    let id = bugIds[index];
    if (id !== null) {
      time("Requesting missing bug " + id);
      let promise = $.getJSON("https://bugzilla.mozilla.org/rest/bug/" + id,
                function(json) {
        // I've not end up here yet, so cry if we do
        console.error("Request succeeded unexpectedly!");
        console.error("Please submit this information to the script authors:");
        timeEnd("Requesting missing bug " + id);
        console.log(json);
        let bug = json.bugs[0];
        console.log(bug);
        // TODO: display as much information as possible
      });
      // Actually, we usually get an error
      promise.error(function(req, status, error) {
        timeEnd("Requesting missing bug " + id);
        if (error == "Authorization Required") {
          // log("Bug " + id + " requires authorization!");
          log("https://bugzilla.mozilla.org/show_bug.cgi?id=" + id + " requires authorization!");
          let text = " requires authorization!<br>";

          bugsComplete.push('<a href="'
                        + 'https://bugzilla.mozilla.org/show_bug.cgi?id='+ id + '">#'
                        + id + '</a>' + text);
        } else {
          console.error("Unexpected error encountered (Bug" + id + "): " + status + " " + error);
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
    timeEnd("MozillaMercurial-missing");
    // Variable that will contain all values of the bugsComplete array, and will be displayed in the 'dialog' below
    var docu = '';
    docu = bugsComplete.join('');

    var div = document.createElement('div');
    $('div.page_footer').append(div);
    div.id = 'dialog';
    // GM_setClipboard (docu);            // This line stores the list content HTML code to clipboard (aimed for MozillaZine daily "The Official Win32 xxxxxxx builds" maintainer)
    docu = '<div id="dialog_content" title="Relevant Bugs">' + docu + '</div>';
    div.innerHTML = docu;
    $("#dialog").hide();

    $(function() {
      $("#dialog").dialog({
        title: 'List of recently fixed bugs of Firefox for Desktop (' + bugsComplete.length + ')',
        width: '1350px'
      });
    });

    log('ALL IS DONE');
    timeEnd("MozillaMercurial");
  });
});

function isRelevant(bug) {
    if (!bug.id) {return false;}
    if (bug.status && bug.status != 'RESOLVED' && bug.status != 'VERIFIED') {
        log('    IRRELEVANT because of it\'s Status --> ' + bug.status);

        return false;
    }
    if (bug.component && bug.product && bug.component == 'Build Config' && (bug.product == 'Toolkit' || bug.product == 'Firefox')) {
        log('    IRRELEVANT because of it\'s Product --> ' + bug.product + 'having component --> ' + bug.component);

        return false;
    }
    if (bug.product && bug.product != 'Add-on SDK'  &&
              bug.product != 'Cloud Services'       &&
              bug.product != 'Core'                 &&
              bug.product != 'Firefox'              &&
              bug.product != 'Hello (Loop)'         &&
              bug.product != 'Toolkit') {
        log('    IRRELEVANT because of it\'s Product --> ' + bug.product);

        return false;
    }
    if (bug.component && bug.component == 'AutoConfig'       ||
               bug.component == 'Build Config'               ||
               bug.component == 'DMD'                        ||
               bug.component == 'Embedding: GRE Core'        ||
               bug.component == 'Embedding: Mac'             ||
               bug.component == 'Embedding: MFC Embed'       ||
               bug.component == 'Embedding: Packaging'       ||
               bug.component == 'Hardware Abstraction Layer' ||
               bug.component == 'mach'                       ||
               bug.component == 'Nanojit'                    ||
               bug.component == 'QuickLaunch'                ||
               bug.component == 'Widget: Gonk') {
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
$("#dialog").dialog({
        modal: false,
        title: "Draggable, sizeable dialog",
        position: {
            my: "top",
            at: "top",
            of: document,
            collision: "none"
        },
        width: "auto",
        minWidth: 400,
        minHeight: 200,
        zIndex: 3666
    })
    .dialog("widget").draggable("option", "containment", "none");

//-- Fix crazy bug in FF! ...
$("#dialog").parent().css({
    position: "fixed",
    top: 0,
    left: "4em",
    width: "75ex"
});
