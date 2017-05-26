// ==UserScript==
// @name        ixIRC - sortable search results
// @include     /https?:\/\/(www\.)?ixirc\.com\/\?(q|cid)=.*/
// @namespace   darkred
// @author      darkred, Mottie
// description  Makes the search results sortable
// @grant       none
// @run-at      document-idle
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.28.10/js/jquery.tablesorter.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js
// @require     https://cdn.rawgit.com/Mottie/tablesorter/master/js/parsers/parser-metric.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/mathjs/3.13.1/math.min.js
// 	Thanks a lot to Mottie for his help on using DateJs in a custom parser
// ==/UserScript==



/* global math */

// const kbCommified = true;
const kbCommified = false;



// CSS rules in order to show 'up' and 'down' arrows in each table header
var stylesheet = `
<style>
thead th {
		background-repeat: no-repeat;
		background-position: right center;
}
thead th.up {
		background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7);
}
thead th.down {
		background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7);
}

</style>`;
$('head').append(stylesheet);








(($) => {
	// jQuery fix for tables lacking a thead (http://aaron.jorb.in/blog/2010/03/jquery-fix-for-tables-lacking-a-thead/)
	$('#results-table')
		.prepend($('<thead></thead>')
		.append($('#results-table tr:first').remove()));


	// thanks a lot to Mottie for his help on this custom parser ( https://github.com/Mottie/tablesorter/issues/1402#issuecomment-302744234 )
	$.tablesorter.addParser({
		id: 'datejs',
		is: function() {
			return false;
		},
		format: function(s) {
			var str = s
				.replace('hr', 'hour')
				.replace('min', 'minute')
				.replace('sec', 'seconds')
				.replace('ago', ''),
				date = Date.parse ? Date.parse('-' + str) : s ? new Date(str) : s;
			return date instanceof Date && isFinite(date) ? date.getTime() : s;
		},
		type: 'numeric'
	});




	// Unneeded because I use parser-metric.js (above) instead of this custom parser "storageUnits"
	//
	// $.tablesorter.addParser({
	// 	// set a unique id
	// 	id: 'storageUnits',
	// 	// id: 'storageUnits',
	// 	is: function() {
	// 		return false;                                // return false so this parser is not auto detected
	// 	},
	// 	format: function(s) {
	// 		// format your data for normalization
	// 		var str = s;
	// 		var size, unit;
	// 		var regex = /([0-9.]+)\s([A-Z]{1,2})/;  // don't use ' ' for space, use \s instead !!!
	// 		size = Number(regex.exec(str)[1]);
	// 		unit = String(regex.exec(str)[2]);

	// 		if      (unit ===  'B') { return size * 1; }
	// 		else if (unit === 'KB') { return size * 1000; }
	// 		else if (unit === 'MB') { return size * 1000000; }
	// 		else if (unit === 'GB') { return size * 1000000000; }
	// 		else if (unit === 'TB') { return size * 1000000000000; }

	// 	},
	// 	// set type, either numeric or text
	// 	type: 'numeric'
	// });














	$('th:contains("Size")').addClass('size');
	$('th:contains("Posted")').addClass('posted');
	$('th:contains("Last Activity")').addClass('lastActivity');




	// Sources: https://mottie.github.io/tablesorter/docs/example-parsers-metric.html , and  the file 'parser-metric.js' from:  htttps://github.com/Mottie/tablesorter/tree/master/js/parsers
	// EITHER:
	// use the below line in order to use the option (i.e the parser by Mottie), i.e. line 226 ---> '.size': { sorter:'metric'},
	// OR:
	// comment out this line,
	// remove the unneeded @require from the top of the file: // @require     https://cdn.rawgit.com/Mottie/tablesorter/master/js/parsers/parser-metric.js   and
	// uncomment line 227: --->  '.size': { sorter:'storageUnits'},             (i.e. YOUR custom parser, see above, lines 71-100)
	// and comment out line 226.
	$('.size').attr('data-metric-name-abbr','b|B');













	// http://stackoverflow.com/questions/6784894/add-commas-or-spaces-to-group-every-three-digits
	function commafy(num) {
		var str = num.toString().split('.');
		if (str[0].length >= 5) {
			str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
		}
		if (str[1] && str[1].length >= 5) {
			str[1] = str[1].replace(/(\d{3})/g, '$1 ');
		}
		return str.join('.');
	}



	if (kbCommified === true){



		var sizes = $("tr td:nth-child(" + ($('th:contains("Size")').index()+1) + ")");
		$(sizes).each(function( index ) {
			var temp = $(this).text().replace('B','b').replace('K', 'k').replace(/\s/g,'');
			// console.log(temp);
			$(this).text(commafy(math.unit(temp).to('kb').toNumber()) + ' KB');
		});



		// $('head').append(stylesheet2);
		$('.size').css('cssText', 'text-align: center !important');
		sizes.css('text-align', 'right');
		sizes.attr('width','90px !important;');

	}



















	// http://stackoverflow.com/a/26343716/3231411
	$('#results-table').tablesorter ({
		cssAsc: 'up',
		cssDesc: 'down',
		headers: {
			'.size': { sorter:'metric'},
			// '.size': { sorter:'storageUnits'},
			'.posted': 	     { sorter:'datejs', sortInitialOrder : 'desc' },
			'.lastActivity': { sorter:'datejs', sortInitialOrder : 'desc' }

		}
	});

})(jQuery.noConflict(true));

