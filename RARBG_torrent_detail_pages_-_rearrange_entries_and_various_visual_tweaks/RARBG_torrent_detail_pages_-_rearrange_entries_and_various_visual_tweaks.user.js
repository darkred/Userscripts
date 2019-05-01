// ==UserScript==
// @name        RARBG torrent detail pages - rearrange entries and various visual tweaks
// @namespace   darkred
// @version     2019.5.2.1
// @description Rearranges various entries, displays in bold the various rating values, renames more suitably a few entries and uses decimal rating for the users' ratings
// @author      darkred
// @license     MIT
// @include     /^(https?:)?\/\/(www\.)?(rarbg(\.(bypassed|unblockall|unblocked))?|rarbgaccess|rarbgget|rarbgmirror|rarbgproxy|rarbgproxied|rarbgprx|rarbgs|rarbgto|rarbgunblock|proxyrarbg|unblocktorrent)\.(to|com|org|is|xyz|lol|vc|link)\/(rarbg-proxy-unblock\/)?(torrent\/|torrents\.php).*$/
// @grant       none
// ==/UserScript==


/* eslint-disable quotes */


// The userscript makes use of the page's jQuery 1.11.3
// Unneeded:  require     http://code.jquery.com/ui/1.9.1/jquery-ui.min.js


function minsToHoursMins(totalMin) {
	var hours = Math.floor( totalMin / 60);
	var minutes = totalMin % 60;
	return hours + 'h ' + minutes + 'min'  ;
}


function tableLastRow(){
	return $('table[width="100%"][border="0"][cellspacing="1"]').children().last().children().last();
}



const isOnTorrentListPage = window.location.href.includes('torrents.php');

if (!isOnTorrentListPage) {





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





	var duration = $(".header2:contains('IMDb Runtime:')").next().html();
	$(".header2:contains('IMDb Runtime:')").next().html(minsToHoursMins(duration));



	// Add the title text to the IMDb link
	var titleElement = $(".header2:contains('Title')").parent();
	var titleText = $(titleElement).text().replace('Title:','');
	$( "a[href*='imdb.com']" ).html(titleText);




	// move Runtime inside IMDb Summary
	var runtimeNode = $(".header2:contains('IMDb Runtime:')");
	runtimeNode.parent().hide();
	var runtime = runtimeNode.next().html();
	var summaryNode = $(".header2:contains('IMDb Summary:')");
	if (runtime !== undefined) {
		summaryNode.next().text(function( index, string ) {
			return string + ' ( ' + runtime + ' )';
		});
	}


	// remove all '|' from the IMDb summary text
	$(".header2:contains('IMDb Summary:')").next().text(function( index,string ) {
		return string.replace(/\|/g,'');
	});


	// move PG Rating inside IMDb Summary
	var pgNode = $(".header2:contains('PG Rating:')");
	pgNode.parent().hide();
	var pg = pgNode.next().html();
	var summary = summaryNode.next().text();
	if (pg !== undefined) {
		summaryNode.next().text(summary + ' [ ' + pg + ' ]');
	}


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





	var vpn =           $(".header2:contains('VPN:')").parent();
	var mediaInfo =     $(".header2:contains('MediaInfo »')").parent();
	var trailer =       $(".header2:contains('Trailer:')").parent();
	var imdbLink =      $('img[src="https://dyncdn.me/static/20/img/imdb3.png"]').parent().parent();
	var ratingByUsers = $('.ratingblock').parent().parent();
	var category =      $(".header2:contains('Category:')").parent();
	var size =          $(".header2:contains('Size:')").parent();
	var showFiles =     $(".header2:contains('Show Files »')").parent();
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
	var showNFO =       $(".header2:contains('Show NFO »')").parent();				// example URL where the NFO is provided: https://rarbgproxy.org/torrent/fmzeqtk
	var hits =          $(".header2:contains('Hits:')").parent();
	var peers =         $(".header2:contains('Peers:')").parent();
	var hitAndRun =     $(".header2:contains('Hit&Run:')").parent();
	var tags =          $(".header2:contains('Tags')").parent();
	var releaseName =   $(".header2:contains('Release name:')").parent();


	// duplicate the 'Size' row right after the 'Title' row
	var sizeClone = size.clone();
	sizeClone.insertAfter( $(".header2:contains('Torrent:')").parent() );


	vpn.hide();  // The 'VPN' row is hidden because it's an ad.
	// trailer.hide(); // For reference: https://rarbgproxy.org/trailers.php is blocked by default in uBlock Origin (via EasyList)
	year.hide(); // The 'Year' row is hidden because that info is still contained in various other rows ('Release Name', 'IMDb' link title, 'Title')



	category        .insertAfter(tableLastRow());
	releaseName     .insertAfter(tableLastRow());
	showNFO         .insertAfter(tableLastRow());
	size            .insertAfter(tableLastRow());
	showFiles       .insertAfter(tableLastRow());
	mediaInfo       .insertAfter(tableLastRow());
	added           .insertAfter(tableLastRow());
	title           .insertAfter(tableLastRow());
	// year            .insertAfter(tableLastRow());
	// imdbRuntime     .insertAfter(tableLastRow());
	genres          .insertAfter(tableLastRow());
	director        .insertAfter(tableLastRow());
	actors          .insertAfter(tableLastRow());
	// pgRating        .insertAfter(tableLastRow());
	imdbLink        .insertAfter(tableLastRow());
	trailer         .insertAfter(tableLastRow());
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



} else {

	var links = document.querySelectorAll('a[onmouseover~="return"]');

	for(let i = 0; i < 8; i++) {

		links[i].addEventListener('mouseover', function(event){

			event.preventDefault();
			let tLink = this.getAttribute('href');

			var xhr = new XMLHttpRequest();
			xhr.open('GET', tLink, true);	// XMLHttpRequest.open(method, url, async)
			// xhr.open('GET', tLink, false);
			xhr.onload = function () {

				let container = document.implementation.createHTMLDocument().documentElement;
				container.innerHTML = xhr.responseText;

				let retrievedLink;
				retrievedLink = container.querySelector('.lista>a[href*="www.imdb.com"]').href;		// the 'download link' element in the retrieved page

				if (retrievedLink) {
					let currentDomainName = window.location.hostname;
					// https://rarbgproxy.org/torrents.php?imdb=tt7605074
					links[i].setAttribute('href', 'https://' + currentDomainName + '/torrents.php?imdb=' + retrievedLink.match(/.*(tt[0-9]*).*/)[1]);
				}

			};
			xhr.send();

		}, false);

	}

}
