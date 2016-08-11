// ==UserScript==
// @name        StackExchange sites - convert dates to local timezone
// @namespace   darkred
// @match       *://*.stackoverflow.com/*
// @match       *://*.stackexchange.com/*
// @match       *://*.superuser.com/*
// @match       *://*.stackapps.com/*
// @match       *://*.askubuntu.com/*
// @match       *://*.mathoverflow.net/*
// @match       *://*.serverfault.com/*
// @version     2015.12.16b
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment-with-locales.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.1/moment-timezone-with-data.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.6/jstz.min.js
// @description Converts dates to your local timezone
// ==/UserScript==

'use strict';
/* global moment,jstz */


var dates1 = document.getElementsByClassName('relativetime');
var dates2 = document.getElementsByClassName('relativetime-clean');

var array1 = Array.prototype.slice.call(dates1, 0);
var array2 = Array.prototype.slice.call(dates2, 0);


var dates = array1.concat(array2);


// "2015-12-14 14:11:13 +0000"   (tooltip with added timezone for UTC, i.e. the timezone that the StackExchange sites use)
function toTimeZone(time, zone) {
    var format1 = ('YYYY-MM-DD HH:mm:ss Z');
    var format2 = ('YYYY-MM-DD HH:mm:ss');
    return moment(time, format1).tz(zone).format(format2);
}


function getLocalTimezone(){
    var tz = jstz.determine();    // Determines the time zone of the browser client
    return tz.name();             // Returns the name of the time zone eg "Europe/Berlin"
}


var localTimezone = getLocalTimezone();


function convertTitleDates() {
    var temp;


    for (var i = 0; i < dates.length; i++) {

        // "2015-12-14 14:11:13Z"   (tooltip ---> the default tooltip)
        temp = dates[i].title;
        temp = temp.substring(0, temp.length - 1);
        temp += ' +0000';

        var format0 = ('YYYY-MM-DD HH:mm:ss Z');

        if (moment(temp, format0, true).isValid()) {

            dates[i].title = toTimeZone(temp, localTimezone);


            // 2015-12-14 10:38:53   (title, i.e. tooltip fixed --> without the last Z)
            // Dec 3 at 10:38        (innerHTML)               MMM dd at HH:hh
            // Jun 27 '12 at 13:51  ---> for older years       MMM dd 'YY at HH:hh


            var title = dates[i].title;
            var day = title.substring(8, 10);   // the '8'
            var time = title.substring(11, 16);   // the '10:38'

            if (day.substring(0, 1) === '0') {  // if the 1st digit in day is '0' then dont' use it in the replacing of datetext
                day = day.substring(1, 2);
            }



            var datetext, dateTextArray;


            //var regex3 = /.*\ (.*)\ '.*\ at\ .*/;
            var regex3 = /.*\ .*\ '.*\ at\ .*/;
            if (dates[i].innerHTML.match(regex3)) {              // the new navigation

                // Jun 27 '12 at 13:51  ---> for older years

                datetext = dates[i].innerHTML;
                dateTextArray = datetext.split(' ');
                // var year;
                dateTextArray[1] = day;
                // dateTextArray[2] = year;
                dateTextArray[4] = time;


                dates[i].innerHTML = dateTextArray.join(' ');

            } else {

            // var regex2 = /(.*at\ ).*/;
            var regex2 = /.*at\ .*/;
            if (dates[i].innerHTML.match(regex2)) {             // old new navigation

                // Dec 8 at 10:38

                datetext = dates[i].innerHTML;
                dateTextArray = datetext.split(' ');
                dateTextArray[1] = day;
                dateTextArray[3] = time;

                dates[i].innerHTML = dateTextArray.join(' ');

            }


        }


        }
    }

}




convertTitleDates();


// for new navigation
new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log('CHANGE');
        dates1 = document.getElementsByClassName('relativetime');
        dates2 = document.getElementsByClassName('relativetime-clean');
        array1 = Array.prototype.slice.call(dates1, 0);
        array2 = Array.prototype.slice.call(dates2, 0);
        dates = array1.concat(array2);
        convertTitleDates();
    });
}).observe(
    document.querySelector('#qlist-wrapper'), {           // monitor #mainbar for changes  (1 mutation per tab switch -in new navigation-)
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
    }
);

// for old navigation
new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log('CHANGE');
        dates1 = document.getElementsByClassName('relativetime');
        dates2 = document.getElementsByClassName('relativetime-clean');
        array1 = Array.prototype.slice.call(dates1, 0);
        array2 = Array.prototype.slice.call(dates2, 0);
        dates = array1.concat(array2);
        convertTitleDates();
    });
}).observe(
    document.querySelector('#mainbar'), {              // monitor #mainbar for changes  (2 mutations per tab switch -in new navigation-)
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
    }
);


// for question view
new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log('CHANGE');
        dates1 = document.getElementsByClassName('relativetime');
        dates2 = document.getElementsByClassName('relativetime-clean');
        array1 = Array.prototype.slice.call(dates1, 0);
        array2 = Array.prototype.slice.call(dates2, 0);
        dates = array1.concat(array2);
        convertTitleDates();
    });
}).observe(
    document.querySelector('#question'), {         
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
    }
);
