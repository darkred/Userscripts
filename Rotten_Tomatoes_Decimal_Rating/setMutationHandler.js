// ==UserScript==
// @name          setMutationHandler
// @description   MutationObserver wrapper to wait for the specified CSS selector
// @namespace     wOxxOm.scripts
// @author        wOxxOm
// @grant         none
// @version       3.0.2
// ==/UserScript==

function setMutationHandler(target, selector, handler, options) {
// or    setMutationHandler(selector, handler, options) {
// or    setMutationHandler(options) {
	if (typeof arguments[0] == 'string') {
		options = arguments[2] || {};
		handler = arguments[1];
		selector = arguments[0];
		target = document;
	} else if (arguments.length == 1 && target && typeof target.handler == 'function') {
		options = arguments[0];
		handler = options.handler;
		selector = options.selector;
		target = options.target || document;
	} else if (!(target instanceof Node)) {
		throw 'Bad params for setMutationHandler.\n' +
			'A: [optional Node] target, [String] selector, [Function] handler, [optional Object] options\n' +
			'B: [Object] options\n' +
			'Options: target, selector, handler, processExisting, childList, attributes, characterData, subtree, attributeOldValue, characterDataOldValue, attributeFilter';
	} else
    	options = options || {};

	if (options.processExisting && target.querySelector(selector))
		handler.call(null, Array.prototype.slice.call(target.querySelectorAll(selector)));
	if (!options.attributes && !options.characterData && !options.childList && options.subtree === undefined)
		options.childList = options.subtree = true;

	var cb;
	if (/^#[\w\d-]+$/.test(selector)) {
		selector = selector.substr(1);
		cb = MOhandlerForId;
	} else {
		cb = MOhandler;
	}
	var observer = new MutationObserver(cb);
	observer.observe(target, options || {subtree:true, childList:true});
	return observer;

	function MOhandler(mutations) {
		if (mutations.length > 100 && !document.querySelector(selector))
			return;
		var found = [];
		for (var i=0, m; (m = mutations[i++]); ) {
			switch (m.type) {
				case 'childList':
					var nodes = m.addedNodes, nl = nodes.length;
					var textNodesOnly = true;
					for (var j=0; j < nl; j++) {
						var n = nodes[j];
						textNodesOnly &= n.nodeType == 3; // TEXT_NODE
						if (n.nodeType != 1) // ELEMENT_NODE
							continue;
						if (n.matches(selector))
							found.push(n);
						else if (n.querySelector(selector)) {
							n = n.querySelectorAll(selector);
							if (n.length < 1000)
								found.push.apply(found, n);
							else
								found = found.concat(found.slice.call(n));
						}
					}
					if (textNodesOnly && m.target.matches(selector))
						found.push(m.target);
					break;
				case 'attributes':
					if (m.target.matches(selector))
						found.push(m.target);
					break;
				case 'characterData':
					if (m.target.parentNode && m.target.parentNode.matches(selector))
						found.push(m.target.parentNode);
					break;
			}
		}
		if (!found.length)
			return;
		if (handler.call(observer, found) === false)
			observer.disconnect();
	}

	function MOhandlerForId(mutations) {
		var el = document.getElementById(selector);
		if (el && target.contains(el))
			if (handler.call(observer, [el]) === false)
				observer.disconnect();
	}
}
