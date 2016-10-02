// ==UserScript==
// @name        Metal Archives - group together entries for the same album in the Reviews section
// @namespace   darkred
// @description Groups together entries for the same album in the Reviews section
// @include     http://www.metal-archives.com/review/browse*
// @version     1
// @grant       GM_addStyle
// @run-at      document-idle
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// ==/UserScript==


function groupRatings(){

	var allAlbumTitlesRefs = $('#reviewList > tbody > tr > td:nth-child(3)'),
		AllBandRefs = $('#reviewList > tbody > tr > td:nth-child(2)'),
		duplicateTitles = [],
		bandAndAlbums = [];


	$(allAlbumTitlesRefs).each(function(index, el) {
		let bandAndTitleTemp = AllBandRefs[index].textContent + '|' + allAlbumTitlesRefs[index].textContent;
		bandAndAlbums.push(bandAndTitleTemp);
	});

	var bandAndAlbumsUnique = [];
	$.each(bandAndAlbums, function(index, val) {
		if (bandAndAlbumsUnique.indexOf(val) === -1){
			bandAndAlbumsUnique.push(val);
		} else {
			if (duplicateTitles.indexOf(val) === -1){
				duplicateTitles.push(val);
			}
		}
	});





	$.each(duplicateTitles, function(index, el) {

		var regex = /(.*)\|(.*)/;
		var band = el.match(regex)[1];
		var album = el.match(regex)[2];

		var toDelete = $(`tbody > tr > td:nth-child(2)`).filter(`:contains("` + band + `")`);
		toDelete = $(toDelete).next().filter(`:contains("` + album + `")`);
		toDelete = $(toDelete).parent();

		var	ratings = [];


		$.each($(toDelete), function(index, el) {
			ratings.push(parseInt($(el).children(':nth-child(4)').html().replace('%', '')));
		});

		var sum = 0;
		$.each(ratings, function(index, val) {
			sum += parseInt(val, 10);
		});
		var avg = sum/ratings.length;
		avg = Math.round(avg);

		// $(toDelete).first().children(':nth-child(4)').html(avg + '%~ (' + ratings.length + ')');
		$(toDelete).first().children(':nth-child(4)').html(avg + '%~ ');

		$(toDelete).first().children(':nth-child(5)').html('(' + ratings.length + ' authors)');
		$(toDelete).first().children(':nth-child(5)').css('color', '#A2787a');



		toDelete = toDelete.not($(toDelete).first());
		$.each($(toDelete), function(index, el) {
			$(el).remove();
		});

	});




}


// selector for the Rating column (4th column)
// GM_addStyle('#reviewList > tbody > tr > td:nth-child(4) {width: 70px;}');
// GM_addStyle('#reviewList > tbody > tr > td:nth-child(4) {width: 44px;}');




const target = document.querySelector('#reviewList'),
	observer = new MutationObserver((mutations) => {

		observer.disconnect();

		groupRatings();

		// Update entries count (substracting the removed duplicate entries) to the navigation buttons located to the start and to the end of the Reviews list
		var a = $('#reviewList_info');
		var entries = $('#reviewList > tbody > tr > td:nth-child(3) > A').length;
		$(a).html($(a).text().replace('of', '(' + entries + ')' ));
		a = $('div.dataTables_info:nth-child(7)');
		$(a).html($(a).text().replace('of', '(' + entries + ')' ));

		observer.observe(target, config);

	}),
	config = {childList: true};
observer.observe(target, config);
