// ==UserScript==
// @name        RARBG torrent detail pages - rearrange entries and various visual tweaks
// @namespace   darkred
// @license     MIT
// @description Rearranges various entries, displays in bold the various rating values, renames more suitably a few entries and uses decimal rating for the users' ratings
// @version     2018.6.9
// @include     /^https?:\/\/(www\.)?(rarbg|rarbgproxy|rarbgaccess|rarbgmirror|rarbgto)\.(to|com|org|is)\/torrent\/.*$/
// @grant       none
// ==/UserScript==


/* eslint-disable quotes */


// The userscript makes use of the page's jQuery 1.11.3
// Unneeded:  require     http://code.jquery.com/ui/1.9.1/jquery-ui.min.js




$(".header2:contains('Rotten Rating:')")    .html('RT Critics Avg:');
$(".header2:contains('RottenTomatoes:')")   .html('RT Tomatometer:');
$(".header2:contains('Rotten Plot:')")      .html('RT Critics Consensus:');
$(".header2:contains('IMDB Rating:')")      .html('IMDb Rating:');
$(".header2:contains('Plot:')")             .html('IMDb Summary:');
$(".header2:contains('IMDB Runtime:')")     .html('IMDb Runtime:');









// Rating by users - decimal rating
var ratingByUsersElement = document.querySelector('.ratingblock p');
var text = document.querySelector('.ratingblock p').innerHTML;
ratingByUsersElement.title = ratingByUsersElement.innerText;
var regex = /[\s]+<strong>[\s]+([\d.]+)<\/strong>\/([\d.]+)(.*)/;
var average = text.match(regex)[1] * 2;
var votes = text.match(regex)[2] * 2;
var rest = text.match(regex)[3];




// Rating by users - ten star rating (instead of five star)
document.querySelector('.unit-rating').style.width = document.querySelector('.unit-rating').style.width.replace('px','') * 2 + 'px';
document.querySelector('.current-rating').style.width = document.querySelector('.current-rating').style.width.replace('px','') * 2 + 'px';
document.querySelector('.current-rating').innerHTML = document.querySelector('.current-rating').innerHTML.replace('Currently ', '').replace(/([\d.]+)\/([\d.]+)/, function(m, s1, s2) { return 2 * s1 +  '/' + 2 * s2;});





function minsToHoursMins(totalMin) {
	var hours = Math.floor( totalMin / 60);
	var minutes = totalMin % 60;
	return hours + 'h ' + minutes + 'min'  ;
}

var duration = $(".header2:contains('IMDb Runtime:')").next().html();
$(".header2:contains('IMDb Runtime:')").next().html(minsToHoursMins(duration));



// Add the title text to the IMDb link
var titleElement = $(".header2:contains('Title')").parent();
var titleText = $(titleElement).text().replace('Title:','');
$( "a[href*='imdb.com']" ).html(titleText);


// The 'Trailers' row is now hidden because https://rarbgproxy.org/trailers.php is blocked by default in uBO, therefore it's useless.
$(".header2:contains('Trailer:')").parent().hide();



// move PG Rating inside IMDb Summary
var pg = $(".header2:contains('PG Rating:')").next().html();
$(".header2:contains('PG Rating:')").parent().hide();
var summary = $(".header2:contains('IMDb Summary:')").next().html();
$(".header2:contains('IMDb Summary:')").next().html(summary + ' [ ' + pg + ' ]');


// move Runtime inside IMDb Summary
var runtime = $(".header2:contains('IMDb Runtime:')").next().html();
$(".header2:contains('IMDb Runtime:')").parent().hide();
summary = $(".header2:contains('IMDb Summary:')").next().html();
$(".header2:contains('IMDb Summary:')").next().html(summary + ' ( ' + runtime + ' )');






// MAKING BOLD (start)
ratingByUsersElement.innerHTML = '  Rating: <strong>' + average + '</strong>/' + votes + rest;

var imdbRatingNode = $(".header2:contains('IMDb Rating:')").next();
if (imdbRatingNode.length > 0){
	$(imdbRatingNode).html($(imdbRatingNode).html().replace(/(.*)(\/.*)/, function(m, s1, s2) { return '<strong>'+ s1 + '</strong>' + s2;}));
}


$(".header2:contains('Metacritic:')").next().find(">:first-child").css("font-weight","Bold");
$(".header2:contains('RT Tomatometer:')").next().css("font-weight","Bold");


var rtTomatometerNode = $(".header2:contains('RT Tomatometer:')").next();
if (rtTomatometerNode.length !== 0)
	$(rtTomatometerNode).html($(rtTomatometerNode).html().replace(/(.*) ([\d]+%)(.*)s ([\d]+%)/, function(m, s1, s2, s3, s4) { return s1 + '<strong>'+ s2 + '</strong>' + s3 + '<strong>'+ s4 + '</strong>' ;}));


var rtCriticsAvgNode = $(".header2:contains('RT Critics Avg:')").next();
if (rtCriticsAvgNode.length !== 0)
	$(rtCriticsAvgNode).html($(rtCriticsAvgNode).html().replace(/(.*)(\/.*)/, function(m, s1, s2) { return '<strong>'+ s1 + '</strong>' + s2;}));


var userRating = $(".header2:contains('Rating:')").filter(function() {
	return $.trim($(this).text()) === "Rating:";
}).parent();
userRating = $("p:contains('votes cast')");
$(userRating).css('font-size', '11px');
$(userRating).html($(userRating).html().replace('Rating:', ''));
$(userRating).replaceWith(function() {
	return "<div>" + this.innerHTML + "</div>";
});
// MAKING BOLD (end)






// 'Trailer' element already removed
var imdbLink =      $('img[src="//dyncdn.me/static/20/img/imdb3.png"]').parent().parent();
var ratingByUsers = $('.ratingblock').parent().parent();
var category =      $(".header2:contains('Category:')").parent();
var size =          $(".header2:contains('Size:')").parent();
var showHideFiles = $(".header2:contains('Show/Hide Files:')").parent();
var added =         $(".header2:contains('Added:')").parent();
var title =         $(".header2:contains('Title:')[align='right']").parent();
// var pgRating =      $(".header2:contains('PG Rating:')").parent();
var imdbRating =    $(".header2:contains('IMDb Rating:')").parent();
var metacritic =    $(".header2:contains('Metacritic:')").parent();
var RTCriticsAvg =  $(".header2:contains('RT Critics Avg:')").parent();
var RTTomatometer = $(".header2:contains('RT Tomatometer:')").parent();
var genres =        $(".header2:contains('Genres:')").parent();
var actors =        $(".header2:contains('Actors:')").parent();
var director =      $(".header2:contains('Director:')").parent();
// var imdbRuntime =   $(".header2:contains('IMDb Runtime:')").parent();
var year =          $(".header2:contains('Year:')").parent();
var imdbSummary =   $(".header2:contains('IMDb Summary:')").parent();
var RTCriticsCons = $(".header2:contains('RT Critics Consensus:')").parent();
var hits =          $(".header2:contains('Hits:')").parent();
var peers =         $(".header2:contains('Peers:')").parent();
var hitAndRun =     $(".header2:contains('Hit&Run:')").parent();
var tags =          $(".header2:contains('Tags')").parent();
var releaseName =   $(".header2:contains('Release name:')").parent();


year.hide();


function tableLastRow(){
	return $('table[width="100%"][border="0"][cellspacing="1"]').children().last().children().last();
}


releaseName     .insertAfter(tableLastRow());
category        .insertAfter(tableLastRow());
size            .insertAfter(tableLastRow());
showHideFiles   .insertAfter(tableLastRow());
added           .insertAfter(tableLastRow());
title           .insertAfter(tableLastRow());
// year            .insertAfter(tableLastRow());
// imdbRuntime     .insertAfter(tableLastRow());
genres          .insertAfter(tableLastRow());
director        .insertAfter(tableLastRow());
actors          .insertAfter(tableLastRow());
// pgRating        .insertAfter(tableLastRow());
imdbLink        .insertAfter(tableLastRow());
imdbSummary     .insertAfter(tableLastRow());
imdbRating      .insertAfter(tableLastRow());
RTTomatometer   .insertAfter(tableLastRow());
RTCriticsAvg    .insertAfter(tableLastRow());
RTCriticsCons   .insertAfter(tableLastRow());
metacritic      .insertAfter(tableLastRow());
ratingByUsers   .insertAfter(tableLastRow());
hits            .insertAfter(tableLastRow());
peers           .insertAfter(tableLastRow());
hitAndRun       .insertAfter(tableLastRow());
tags            .insertAfter(tableLastRow());
