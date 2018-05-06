// ==UserScript==
// @name        RARBG torrent detail pages - rearrange entries and various visual tweaks
// @namespace   darkred
// @license     MIT
// @description Rearranges various entries, displays in bold the various rating values, properly remames a few entries and use decimal rating for the users' ratings
// @version     2018.5.6
// @include     /^https?:\/\/(www\.)?(rarbg|rarbgproxy|rarbgaccess|rarbgmirror|rarbgto)\.(to|com|org|is)\/torrent\/.*$/
// @grant       none
// ==/UserScript==


/* eslint-disable quotes */


// The userscript makes use of the page's jQuery 1.11.3
// Unneeded:  require     http://code.jquery.com/ui/1.9.1/jquery-ui.min.js



// Decimal Rating

var node = document.querySelector('.ratingblock p');
var text = document.querySelector('.ratingblock p').innerHTML;
node.title = node.innerText;
var regex = /[\s]+<strong>[\s]+([\d.]+)<\/strong>\/([\d.]+)(.*)/;

var average = text.match(regex)[1] * 2;
var votes = text.match(regex)[2] * 2;
var rest = text.match(regex)[3];

node.innerHTML = '  Rating: <strong>' + average + '</strong>/' + votes + rest;

// ---------------------------------------------------------



// The main script

var title = $(".header2:contains('Title')").parent().text().replace('Title:','');

$( "a[href*='imdb.com']" ).html(title);
$(".header2:contains('Title')").parent().remove();

var trailer = $(".header2:contains('Trailer:')").parent();
var imdbLink = $( "a[href*='imdb.com']" ).parent().parent();
var imdbRating = $(".header2:contains('IMDB Rating:')").parent();
var userRating = $(".header2:contains('Rating:')").filter(function() {
	return $.trim($(this).text()) === "Rating:";
}).parent();
// var target = $(".header2:contains('Rotten Rating:')").parent();
// if (target.length === 0) {
// 	target = $(".header2:contains('Genres:')").parent();
// }
// var target = $(".header2:contains('Genres:')").parent();

// $(trailer).insertBefore(target);
// $(imdbLink).insertBefore(target);
// $(imdbRating).insertBefore(target);
// $(userRating).insertBefore(target);


var target = $(".header2:contains('Added:')").parent();

$(imdbRating).insertAfter(target);
$(imdbLink).insertAfter(target);
$(trailer).insertAfter(target);
// $(userRating).insertAfter(target);

var target2 = $(".header2:contains('Genres:')").parent();
$(userRating).insertBefore(target2);



$(".header2:contains('Rotten Rating:')").html('RT Critics Avg:');
$(".header2:contains('RottenTomatoes:')").html('RT Tomatometer:');

$(".header2:contains('RT Tomatometer:')").parent().insertBefore($(".header2:contains('RT Critics Avg:')").parent());



// MAKING BOLD
var imdbRatingNode = $(".header2:contains('IMDB Rating:')").next();
$(imdbRatingNode).html($(imdbRatingNode).html().replace(/(.*)(\/.*)/, function(m, s1, s2) { return '<strong>'+ s1 + '</strong>' + s2;}));


var rtTomatometerNode = $(".header2:contains('RT Tomatometer:')").next();
if (rtTomatometerNode.length !== 0)
	$(rtTomatometerNode).html($(rtTomatometerNode).html().replace(/(.*)\ ([\d]+%)(.*)\ ([\d]+%)/, function(m, s1, s2, s3, s4) { return s1 + '<strong>'+ s2 + '</strong>' + s3 + '<strong>'+ s4 + '</strong>' ;}));


var rtCriticsAvgNode = $(".header2:contains('RT Critics Avg:')").next();
if (rtCriticsAvgNode.length !== 0)
	$(rtCriticsAvgNode).html($(rtCriticsAvgNode).html().replace(/(.*)(\/.*)/, function(m, s1, s2) { return '<strong>'+ s1 + '</strong>' + s2;}));


// var userRating = $("p:contains('votes cast')");
userRating = $("p:contains('votes cast')");
$(userRating).css('font-size', '11px');
$(userRating).html($(userRating).html().replace('Rating:', ''));
// $(userRating).html($(userRating).html().replace('<p', '<div>'));

$(userRating).replaceWith(function() {
	return "<div>" + this.innerHTML + "</div>";
});





$(".header2:contains('Rotten Plot:')").parent().insertAfter($(".header2:contains('RT Critics Avg:')").parent());
$(".header2:contains('Rotten Plot:')").html('RT Critics Consensus:');

$(".header2:contains('IMDB Rating:')").html('IMDb Rating:');


$(".header2:contains('Plot:')").parent().insertAfter($(".header2:contains('IMDb Rating:')").parent());
$(".header2:contains('Plot:')").html('IMDb Summary:');
