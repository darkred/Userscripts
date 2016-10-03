// ==UserScript==
// @name        GreasyFork - filter discussions on scripts by review type and author - for TS Citrus Gfork
// @namespace   darkred
// @author      darkred
// @contributors  decembre
// @description Filter discussions on scripts by review type and author via filter buttons, a hoverable dropdown menu or an autocomplete searchbox
// @include     https://greasyfork.org/*/scripts/*/feedback*
// @include     https://greasyfork.org/*/users/*
// @version     2.0.1
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_getResourceText
// @resource    jquery-ui.css  http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.js
//    This is partially based on this script (http://userscripts-mirror.org/scripts/show/97145) by kuehlschrank.
//    Thanks a lot to kuehlschrank for making another great script.
// ==/UserScript==



// the list of discussion authors


var allAuthorsRefs = $('#discussions > li > a:nth-child(2), #user-discussions-on-scripts-written > ul > li  a:nth-child(3)');

var allAuthorsUnique = [];

$.each(allAuthorsRefs, function(index, el) {
	let title = el.innerHTML;
	if (allAuthorsUnique.indexOf(title) === -1){
		allAuthorsUnique.push(title);
	}
});


// allAuthorsUnique.sort();


var filters = {
	'All' : '',
	'Questions' : 'discussion-question',
	'Bad' 		: 'discussion-bad',
	'Ok'  		: 'discussion-ok',
	'Good'		: 'discussion-good',
};




// -----------------------------------------------------------------------------------------------------------------------

// the filter buttons



function insertStyle() {
	var style = document.createElement('style');
	// style.textContent = 'li#filtered { display:none !important; } .filter-status { margin-left: 6px; position: fixed; top: 209px; right: 272px; } .filter-switches { display:initial; position: fixed; top: 240px; left:  -moz-calc(79%);	background: white; right: 287px; } *:hover > .filter-switches { display:block !important; position: fixed; top: 240px; background: white; right: 287px; } .filter-on, .filter-off {display:block !important; width: 97px;}} .filter-switches a { text-decoration:none !important; color:inherit; cursor:pointer; } .filter-switches a { margin-left: 8px; padding: 0 4px; } a.filter-on { background-color: white; color: #e6e6e6;   } a.filter-off { background-color:#ccffcc; color:#333333 }  ';
	style.textContent = 'li#filtered { display:none !important; } .filter-status { margin-left: 6px; position: fixed; top: -moz-calc(24%); left: -moz-calc(77%) } .filter-switches { display:initial; position: fixed; top: -moz-calc(26.5%); left: -moz-calc(78%);	background: white; right: 287px; } .filter-on, .filter-off {display:block !important; width: 97px;}} .filter-switches a { text-decoration:none !important; color:inherit; cursor:pointer; } .filter-switches a { margin-left: 8px; padding: 0 4px; } a.filter-on { background-color: white; color: #e6e6e6;   } a.filter-off { background-color:#ccffcc; color:#333333 }  ';
	style.type = 'text/css';
	document.querySelector('head').appendChild(style);
}





function insertStatus() {
	// CITRUS TWEAK
	var p = document.querySelector('#script-content > h3:nth-child(1)') || document.querySelector('#script-content > h3:first-of-type') || document.querySelector('#user-discussions-on-scripts-written > header:nth-child(1) > h3:nth-child(1)');		// --- > working on Script discussions
	if (p) {
		var status = document.createElement('span');
		status.className = 'filter-status';
		p.appendChild(status);
	}
}


function insertSwitches() {
	var span = document.createElement('span');
	span.className = 'filter-switches';

	for (var filter in filters) {
		if (filters.hasOwnProperty(filter)) {
			span.appendChild(createSwitch(filter, GM_getValue(filter, 'on') == 'on'));
		}
	}
	// CITRUS TWEAK
	var k = document.querySelector('#script-content > h3:nth-child(1)') || document.querySelector('#script-content > h3:first-of-type')  || document.querySelector('#control-panel > header:nth-child(1) > h3:nth-child(1)');		// --- > working on script discussions
	k.appendChild(span);
}


function createSwitch(label, isOn) {
	var a = document.createElement('a');
	a.className = isOn ? 'filter-on' : 'filter-off';
	a.textContent = label;
	a.addEventListener('click', function(e) {
		// console.log(this);




		if (this.innerHTML !== 'All'){


			if (this.className == 'filter-on') {
				this.className = 'filter-off';
				GM_setValue(this.textContent, 'off');
			} else {
				this.className = 'filter-on';
				GM_setValue(this.textContent, 'on');
			}
			document.querySelector('.filter-switches > a:nth-child(1)').className = 'filter-on';
			GM_setValue('All', 'on');
			filterScripts();


		} else if (this.innerHTML === 'All' && this.className === 'filter-on'){
			this.className = 'filter-off';
			GM_setValue(this.textContent, 'off');
			document.querySelector('.filter-switches > a:nth-child(2)').className = 'filter-off';
			GM_setValue('Questions', 'off');
			document.querySelector('.filter-switches > a:nth-child(3)').className = 'filter-off';
			GM_setValue('Bad', 'off');
			document.querySelector('.filter-switches > a:nth-child(4)').className = 'filter-off';
			GM_setValue('Ok', 'off');
			document.querySelector('.filter-switches > a:nth-child(5)').className = 'filter-off';
			GM_setValue('Good', 'off');
			var nodes = $('#discussions > li, .discussion-list > li');
			$.each(nodes, function(index, val) {
				$(val).attr('id', '');
			});
			var hidden = $('#discussions > li:hidden, .discussion-list > li:hidden').length;
			document.querySelector('.filter-status').textContent = (nodes.length - hidden) + ' (' + hidden + ' filtered)';


		}



		e.preventDefault();
	}, false);
	return a;
}



function filterScripts() {



	var activeFilters = [];
	for (var filter in filters) {
		if (filters.hasOwnProperty(filter) && GM_getValue(filter, 'on') == 'on') {
			activeFilters.push(filters[filter]);
		}
	}
	var nodes = $('#discussions > li, .discussion-list > li'),
		numActiveFilters = activeFilters.length;
	for (var i = 0, numNodes = nodes.length, td = null; i < numNodes && (td = nodes[i]); i++) {
		td.id = '';
		for (var j = 0; j < numActiveFilters; j++) {
			if (td.className === activeFilters[j]) {
				td.id = 'filtered';
				break;
			}
		}
	}
	var hidden = $('#discussions > li:hidden, .discussion-list > li:hidden').length;
	document.querySelector('.filter-status').textContent = (nodes.length - hidden) + ' (' + hidden + ' filtered)';
}








insertStyle();
insertStatus();
filterScripts();
insertSwitches();




var target = document.querySelector('.filter-status');
var observer = new MutationObserver((mutations) => {


		if (document.querySelector('.filter-switches > a:nth-child(2)').className === 'filter-off' &&
		document.querySelector('.filter-switches > a:nth-child(3)').className === 'filter-off' &&
		document.querySelector('.filter-switches > a:nth-child(4)').className === 'filter-off' &&
		document.querySelector('.filter-switches > a:nth-child(5)').className === 'filter-off'){
			document.querySelector('.filter-switches > a:nth-child(1)').className = 'filter-off';
			GM_setValue('All', 'off');
			let nodes = $('#discussions > li, .discussion-list > li');
			$.each(nodes, function(index, val) {
				$(val).attr('id', '');
			});
		}




	}),
	config = {
		childList: true,
	};
observer.observe(target, config);









// -----------------------------------------------------------------------------------------------------------------------

// the hoverable dropdown menu












var parentElement = document.querySelector('#script-content > h3:nth-child(1)')  || document.querySelector('#script-content > h3:first-of-type') || document.querySelector('#control-panel > header:nth-child(1) > h3:nth-child(1)');
var theFirstChild = parentElement.firstChild;
var div = document.createElement('div');
parentElement.insertBefore(div, theFirstChild);



// the two last properties (height and oveerflow) ware adeed to the dropdown menu
GM_addStyle(`

 /* Dropdown Button */
.dropbtn {
	background-color: #4CAF50;
	color: white;
	padding: 16px;
	font-size: 16px;
	border: none;
	cursor: pointer;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
	position: fixed !important;
	display: inline-block;
	top: -moz-calc(30%);			/* extra */
	left:  -moz-calc(86%);			/* extra */
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
	display: none;
	position: absolute;
	background-color: #f9f9f9;
	min-width: 160px;
	box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	height: 400px;
	width: -moz-max-content;	/* extra */
	overflow: auto;
}

/* Links inside the dropdown */
.dropdown-content a {
	color: black;
 /* padding: 12px 16px;	*/
	text-decoration: none;
	display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {background-color: #f1f1f1}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
	display: block;
}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {
	background-color: #3e8e41;
}

div.ui-widget {
	position: fixed !important;
	display: inline-block;
	position: fixed;
	top: -moz-calc(24.2%);
	left: -moz-calc(86%);
}


`);







var a = '<div class="dropdown">\
  <button onclick="myFunction()" class="dropbtn">Filter by author</button>\
  <div id="myDropdown" class="dropdown-content">';

a += `<a onclick="showOnly('All')">All</a>`;
for (var i = 0; i < allAuthorsUnique.length; i++) {
	a += '<a onclick="showOnly(\'' + (allAuthorsUnique[i]) + '\')">' + allAuthorsUnique[i] + '</a>';
}
a += '</div></div>';

div.innerHTML = a;


var el = $('#myDropdown > a:nth-child(1)');
$(el).click(function(event) {
	document.querySelector('#authors').value = '';/* Act on the event */
});





var myF = `
function showOnly(author){
	$('.dropbtn').html('Filter by author (All)');
	if (author === 'All'){
		document.querySelector('.dropbtn').innerHTML = 'Filter by author (All)';
		var a = '#discussions > li > a:nth-child(2), #user-discussions-on-scripts-written > ul > li  a:nth-child(3)';
		$(a).parent().show();

		let nodes = $('#discussions > li, .discussion-list > li');
		let hidden = $('#discussions > li:hidden, .discussion-list > li:hidden').length;
		$('.filter-status').text( (nodes.length - hidden) + ' (' + hidden + ' filtered)');
		return;
	} else {
		$('.dropbtn').html('Filter by author (' + author + ')');
		a = '#discussions > li > a:nth-child(2), #user-discussions-on-scripts-written > ul > li  a:nth-child(3)';
		$(a).parent().show();
		a = '#discussions > li > a:nth-child(2)';
		$(a).not(a + ':contains("' + author + '")' ).parent().hide();
		a = '#user-discussions-on-scripts-written > ul > li  a:nth-child(3)';
		$(a).not(a + ':contains("' + author + '")' ).parent().hide();

		let nodes = $('#discussions > li, .discussion-list > li');
		let hidden = $('#discussions > li:hidden, .discussion-list > li:hidden').length;
		$('.filter-status').text( (nodes.length - hidden) + ' (' + hidden + ' filtered)');
	}
}
`;



var newScript = document.createElement('script');
newScript.innerHTML = myF;
document.body.appendChild(newScript);



// --------------------------------------------------------------------------------------

// the autocomplete searchbox




var cssTxt  = GM_getResourceText ('jquery-ui.css');

GM_addStyle (cssTxt);





$('.dropdown').before(`
<div class="ui-widget">
<form id="myform">
	<label for="authors">Enter an author:</label>
	<input type="text" id="authors" name="valueId" /></p>
</form>
</div>
	`);




// allAuthorsUnique.sort();										// sort array case sensitive

allAuthorsUnique.sort(function (a, b) {							// sort array case insensitive
	return a.toLowerCase().localeCompare(b.toLowerCase());
});



$( `#authors` ).autocomplete({source: allAuthorsUnique });



$('#myform').on('submit', function(e){
	e.preventDefault();
	showOnly($('#authors').val());
});



function showOnly(author){
	$('.dropbtn').html('Filter by author (All)');
	if (author === 'All'){
		document.querySelector('.dropbtn').innerHTML = 'Filter by author (All)';
		var a = '#discussions > li > a:nth-child(2), #user-discussions-on-scripts-written > ul > li  a:nth-child(3)';
		$(a).parent().show();

		let nodes = $('#discussions > li, .discussion-list > li');
		let hidden = $('#discussions > li:hidden, .discussion-list > li:hidden').length;
		$('.filter-status').text( (nodes.length - hidden) + ' (' + hidden + ' filtered)');
		return;
	} else {
		$('.dropbtn').html('Filter by author (' + author + ')');
		a = '#discussions > li > a:nth-child(2), #user-discussions-on-scripts-written > ul > li  a:nth-child(3)';
		$(a).parent().show();
		a = '#discussions > li > a:nth-child(2)';
		$(a).not(a + ':contains("' + author + '")' ).parent().hide();
		a = '#user-discussions-on-scripts-written > ul > li  a:nth-child(3)';
		$(a).not(a + ':contains("' + author + '")' ).parent().hide();

		let nodes = $('#discussions > li, .discussion-list > li');
		let hidden = $('#discussions > li:hidden, .discussion-list > li:hidden').length;
		$('.filter-status').text( (nodes.length - hidden) + ' (' + hidden + ' filtered)');
	}
}
