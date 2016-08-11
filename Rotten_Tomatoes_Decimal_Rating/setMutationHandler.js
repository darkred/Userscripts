/* EXAMPLE:
	
	setMutationHandler(document, '.container p.some-child', function(nodes) {
		// single node:
		nodes[0].remove();
		
		// or multiple nodes:
		nodes.forEach(function(node) {
			node.style.display = 'none';
		});

		//this.disconnect(); // disconnect the observer, this is useful for one-time jobs
		return true; // continue enumerating current batch of mutations
	});
*/

// ==UserScript==
// @name          setMutationHandler
// @description   MutationObserver wrapper to wait for the specified CSS selector
// @namespace     wOxxOm.scripts
// @author        wOxxOm
// @grant         none
// @version       2.0.4
// ==/UserScript==

function setMutationHandler(baseNode, selector, cb, options) {
	var ob = new MutationObserver(function(mutations) {
		for (var i=0, ml=mutations.length, m; (i<ml) && (m=mutations[i]); i++)
			switch (m.type) {
				case 'childList':
					if (m.addedNodes[0] && m.addedNodes[0].nodeType == 3) { // Node.TEXT_NODE
						if (m.target.matches(selector) && !cb.call(ob, [m.target], m))
							return;
						continue;
					}
					for (var j=0, nodes=m.addedNodes, nl=nodes.length, n; (j<nl) && (n=nodes[j]); j++)
						if (n.nodeType == 1) 
							if ((n = n.matches(selector) ? [n] : n.querySelectorAll(selector)) && n.length)
								if (!cb.call(ob, Array.prototype.slice.call(n), m))
									return;
					break;
				case 'attributes':
					if (m.target.matches(selector) && !cb.call(ob, [m.target], m))
						return;
					break;
				case 'characterData':
					if (m.target.parentNode && m.target.parentNode.matches(selector) && !cb.call(ob, [m.target.parentNode], m))
						return;
					break;
			}
	});
	ob.observe(baseNode, options || {subtree:true, childList:true}); 
	return ob;
}
