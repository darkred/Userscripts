// ==UserScript==
// @name        GitHub - Confirmations before submitting issues and comments
// @namespace   darkred
// @author      darkred
// @description Creates a confirmation popup whenever attempting to create an issue or post comment via Ctrl+Enter in GitHub
// @include     https://github.com/*
// @version     2017.4.26
// @grant       none
// ==/UserScript==



(function () {
	function init() {


		// For submitting issues in issue title textbox via Ctrl+Enter or Enter

		var targArea1 = document.querySelector('#issue_title'); // New issue title
		function manageKeyEvents1(zEvent) {
			targArea1.blur();
			targArea1.focus();
			if ((zEvent.ctrlKey && zEvent.keyCode === 13) || zEvent.keyCode === 13) {
				if (confirm('Are you sure?') === false) {
					zEvent.stopPropagation();
					zEvent.preventDefault();
				} else {
					var btn = document.querySelector('.btn-primary');                        // 'Submit new issue' button
					btn.click();
				}
			}
		}
		if (targArea1 !== null) {targArea1.addEventListener('keydown', manageKeyEvents1);}


		// ------------------------------------------------------------------------------------------------


		// For submitting issues in issue body textarea via Ctrl+Enter
		var targArea2 = document.querySelector('#issue_body');          // New issue textarea
		function manageKeyEvents2(zEvent) {
			targArea2.blur();
			targArea2.focus();
			if (zEvent.ctrlKey && zEvent.keyCode === 13) {
				if (confirm('Are you sure?') === false) {
					zEvent.stopPropagation();
					zEvent.preventDefault();
				} else {
					var btn1 = document.querySelector('.btn-primary');
					if (btn1) {btn1.click();}
				}
			}
		}
		if (targArea2 !== null) { targArea2.addEventListener('keydown', manageKeyEvents2); }


		// ------------------------------------------------------------------------------------------------


		// For submitting issues in new comment textarea via Ctrl+Enter
		var targArea3 = document.querySelector('#new_comment_field');   // New comment textarea
		function manageKeyEvents3(zEvent) {
			targArea3.blur();
			targArea3.focus();
			if (zEvent.ctrlKey && zEvent.keyCode === 13) {
				if (confirm('Are you sure?') === false) {
					zEvent.stopPropagation();
					zEvent.preventDefault();
				} else {
					var btn2 = document.querySelector('#partial-new-comment-form-actions button');
					if (btn2) {btn2.click();}
				}
			}
		}
		if (targArea3 !== null) { targArea3.addEventListener('keydown', manageKeyEvents3); }





	}
	init();
	document.addEventListener('pjax:end', init); // for the History API
})();
