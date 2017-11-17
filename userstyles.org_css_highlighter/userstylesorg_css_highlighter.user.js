// ==UserScript==
// @name        userstyles.org css highlighter
// @namespace   darkred
// @version     2017.16.11
// @license     MIT
// @description Formats and highlights CSS code shown after [Show CSS] clicking. (works with the new userstyles.org layout).
// @author      trespassersW
// @contributor darkred
//
// @released    2013-11-20
// @updated     2017-10-20
//
// 17.10.19 Modified by darkred to work in the new userstyles.org layout.
// 16.08.28 + keeps highliting status between sessions; 16.08.28.1 - some instead of each
// 2.1.1 2016-01-04 + ctrl-clik copies CSS code to clipboard
// 2.0.1 cut extra empty lines
// 2.0 dark grey background;
// 1.3 icons for toggle button; tiny optimization
// 1.1 fresh versions of formater/hiliter; switching  butifying on/off; fixed &lt;/&amp; issue
//
// @include     http://userstyles.org/styles/*
// @include     https://userstyles.org/styles/*
// @include     http://web.archive.org/web/20170222172435/https://userstyles.org/styles/118959/darksearch-for-google
// @grant       GM.setClipboard
// @require     https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js?version=139586
// @require     https://cdn.rawgit.com/greasemonkey/gm4-polyfill/d58c4f6fbe5702dbf849a04d12bca2f5d635862d/gm4-polyfill.js
// ==/UserScript==

/* globals Prism, cssbeautify */

document.arrive('#button_middle > .css_button', function() {



	(function() {
		'use strict';


		var Light = 0,
			Dark = 1;
		// choose color scheme according to your taste:
		var scheme = 1; // 0 for light; 1 for dark

		//function _L(s){console.log(s);}
		var sb;

		if (location.href.indexOf('s.org/styles/') < 0 ||
			!(sb = document.querySelector('#button_middle > .css_button'))
		) { return; } // else alert();




		var bt, tc, sc, vc, highlighted;
		var hiId = '<!--userstyles.org css highlighter-->';

		// CSSBeautify (C) 2013 Sencha Inc. Author: Ariya Hidayat.
		(function(){function a(s,f){var h,m=0,i=s.length,t,e='',p,g,q,k,o,y,u,d,r=true,j=false,n;h=arguments.length>1?f:{};if(typeof h.indent==='undefined'){h.indent='    ';}if(typeof h.openbrace==='string'){r=(h.openbrace==='end-of-line');}if(typeof h.autosemicolon==='boolean'){j=h.autosemicolon;}function l(z){return(z===' ')||(z==='\n')||(z==='\t')||(z==='\r')||(z==='\f');}function b(z){return(z==='\'')||(z==='"');}function c(z){return(p>='a'&&p<='z')||(p>='A'&&p<='Z')||(p>='0'&&p<='9')||'-_*.:#[]'.indexOf(z)>=0;}function x(){var z;for(z=y;z>0;z-=1){e+=h.indent;}}function w(){e=n(e);if(r){e+=' {';}else{e+='\n';x();e+='{';}if(g!=='\n'){e+='\n';}y+=1;}function v(){var z;y-=1;e=n(e);if(e.length>0&&j){z=e.charAt(e.length-1);if(z!==';'&&z!=='{'){e+=';';}}e+='\n';x();e+='}';t.push(e);e='';}if(String.prototype.trimRight){n=function(z){return z.trimRight();};}else{n=function(z){return z.replace(/\s+$/,'');};}o={Start:0,AtRule:1,Block:2,Selector:3,Ruleset:4,Property:5,Separator:6,Expression:7,URL:8};y=0;k=o.Start;d=false;t=[];s=s.replace(/\r\n/g,'\n');while(m<i){p=s.charAt(m);g=s.charAt(m+1);m+=1;if(b(u)){e+=p;if(p===u){u=null;}if(p==='\\'&&g===u){e+=g;m+=1;}continue;}if(b(p)){e+=p;u=p;continue;}if(d){e+=p;if(p==='*'&&g==='/'){d=false;e+=g;m+=1;}continue;}if(p==='/'&&g==='*'){d=true;e+=p;e+=g;m+=1;continue;}if(k===o.Start){if(t.length===0){if(l(p)&&e.length===0){continue;}}if(p<=' '||p.charCodeAt(0)>=128){k=o.Start;e+=p;continue;}if(c(p)||(p==='@')){q=n(e);if(q.length===0){if(t.length>0){e='\n\n';}}else{if(q.charAt(q.length-1)==='}'||q.charAt(q.length-1)===';'){e=q+'\n\n';}else{while(true){g=e.charAt(e.length-1);if(g!==' '&&g.charCodeAt(0)!==9){break;}e=e.substr(0,e.length-1);}}}e+=p;k=(p==='@')?o.AtRule:o.Selector;continue;}}if(k===o.AtRule){if(p===';'){e+=p;k=o.Start;continue;}if(p==='{'){q=n(e);w();k=(q==='@font-face')?o.Ruleset:o.Block;continue;}e+=p;continue;}if(k===o.Block){if(c(p)){q=n(e);if(q.length===0){if(t.length>0){e='\n\n';}}else{if(q.charAt(q.length-1)==='}'){e=q+'\n\n';}else{while(true){g=e.charAt(e.length-1);if(g!==' '&&g.charCodeAt(0)!==9){break;}e=e.substr(0,e.length-1);}}}x();e+=p;k=o.Selector;continue;}if(p==='}'){v();k=o.Start;continue;}e+=p;continue;}if(k===o.Selector){if(p==='{'){w();k=o.Ruleset;continue;}if(p==='}'){v();k=o.Start;continue;}e+=p;continue;}if(k===o.Ruleset){if(p==='}'){v();k=o.Start;if(y>0){k=o.Block;}continue;}if(p==='\n'){e=n(e);e+='\n';continue;}if(!l(p)){e=n(e);e+='\n';x();e+=p;k=o.Property;continue;}e+=p;continue;}if(k===o.Property){if(p===':'){e=n(e);e+=': ';k=o.Expression;if(l(g)){k=o.Separator;}continue;}if(p==='}'){v();k=o.Start;if(y>0){k=o.Block;}continue;}e+=p;continue;}if(k===o.Separator){if(!l(p)){e+=p;k=o.Expression;continue;}if(b(g)){k=o.Expression;}continue;}if(k===o.Expression){if(p==='}'){v();k=o.Start;if(y>0){k=o.Block;}continue;}if(p===';'){e=n(e);e+=';\n';k=o.Ruleset;continue;}e+=p;if(p==='('){if(e.charAt(e.length-2)==='l'&&e.charAt(e.length-3)==='r'&&e.charAt(e.length-4)==='u'){k=o.URL;continue;}}continue;}if(k===o.URL){if(p===')'&&e.charAt(e.length-1!=='\\')){e+=p;k=o.Expression;continue;}}e+=p;}e=t.join('')+e;return e;}if(typeof exports!=='undefined'){module.exports=exports=a;}else{if(typeof window==='object'){window.cssbeautify=a;}}}());
		// Prism (c) Lea Verou, MIT License
		(function(){var e=/\blang(?:uage)?-(?!\*)(\w+)\b/i,t=self.Prism={util:{type:function(e){return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1];},clone:function(e){var n=t.util.type(e);switch(n){case'Object':var r={};for(var i in e){e.hasOwnProperty(i)&&(r[i]=t.util.clone(e[i]));}return r;case'Array':return e.slice();}return e;}},languages:{extend:function(e,n){var r=t.util.clone(t.languages[e]);for(var i in n){r[i]=n[i];}return r;},insertBefore:function(e,n,r,i){i=i||t.languages;var s=i[e],o={};for(var u in s){if(s.hasOwnProperty(u)){if(u==n){for(var a in r){r.hasOwnProperty(a)&&(o[a]=r[a]);}}o[u]=s[u];}}return i[e]=o;},DFS:function(e,n){for(var r in e){n.call(e,r,e[r]);t.util.type(e)==='Object'&&t.languages.DFS(e[r],n);}}},highlight:function(e,r){return n.stringify(t.tkize(e,r));},tkize:function(e,n){var r=t.tk,i=[e],s=n.rest;if(s){for(var o in s){n[o]=s[o];}delete n.rest;}e:for(var o in n){if(!n.hasOwnProperty(o)||!n[o]){continue;}var u=n[o],a=u.inside,f=!!u.lookbehind||0;u=u.pattern||u;for(var l=0;l<i.length;l++){var c=i[l];if(i.length>e.length){break e;}if(c instanceof r){continue;}u.lastIndex=0;var h=u.exec(c);if(h){f&&(f=h[1].length);var p=h.index-1+f,h=h[0].slice(f),d=h.length,v=p+d,m=c.slice(0,p+1),g=c.slice(v+1),y=[l,1];m&&y.push(m);var b=new r(o,a?t.tkize(h,a):h);y.push(b);g&&y.push(g);Array.prototype.splice.apply(i,y);}}}return i;},hooks:{all:{},add:function(e,n){var r=t.hooks.all;r[e]=r[e]||[];r[e].push(n);},run:function(e,n){var r=t.hooks.all[e];if(!r||!r.length){return;}for(var i=0,s;s=r[i++];){s(n);}}}},n=t.tk=function(e,t){this.type=e;this.content=t;};n.stringify=function(e){if(typeof e==='string'){return e;}if(Object.prototype.toString.call(e)=='[object Array]'){return e.map(n.stringify).join('');}var r={type:e.type,content:n.stringify(e.content),tag:'span',classes:['tk',e.type],attributes:{}};t.hooks.run('wrap',r);var i='';for(var s in r.attributes){i+=s+'="'+(r.attributes[s]||'')+'"';}return'<'+r.tag+' class="'+r.classes.join(' ')+'" '+i+'>'+r.content+'</'+r.tag+'>';};})();

		Prism.languages.css = {
			com: /\/\*[\w\W]*?\*\//g, // whose guilt?
			atr: /@[\w-]+?(\s+[^;{]+)?(?=\s*{|\s*;)/gi,
			url: /url\((["']?).*?\1\)/gi,
			sel: /[^{}\s][^{}]*(?=\s*\{)/g,
			pro: /(\b|\B)[a-z-]+(?=\s*:)/ig,
			str: /("|')(\\?.)*?\1/g,
			imp: /!important\b/gi,
			pun: /[{};:]/g
		};

		/*
		.com comment, .atr at-rule, .sel selector, .imp !important,
		.pun punctuation, .url url, .str string
		*/
		var prismCSS;
		if (scheme === Dark) {
			prismCSS = `
			.tk.com {
			  color:#69A;
			}
			.tk.pun {
			  color:#8FC;
			}
			.tk.pro {
			  color:#5cf;
			}
			.tk.sel {
			  color:#7F5;
			}
			.tk.str {
			  color:#F63;
			}
			.tk.atr {
			  color:#F8C;
			}
			.tk.imp {
			  color:#e90;
			}
			.tk.url{
			  color:#B87;
			}
			#css_text_area_div.hiBeautted {
			background-color:#293134 !important;
			color: #e0e2e4 !important;}
			`;
		} else {
			prismCSS = `
			.tk.com {
			  color:slategray;
			}
			.tk.pun {
			  color:#488;
			}
			.tk.pro {
			  color:#05A;
			}
			.tk.sel {
			  color:#470;
			}
			.tk.str {
			  color:#E30;
			}
			.tk.atr {
			  color:#905;
			}
			.tk.imp {
			  color:#e90;
			/*font-weight:bold;*/
			}
			.tk.url{
			  color:#a75;
			}
			`;}

		prismCSS += `
			#css_text_area_div {
				padding: 1.2em .8em !important;
			}
			#css_text_area_div.hiBeautted {
				white-space: pre-wrap !important;
				word-wrap: break-word!important;
			}
			#hiBeauty:before{
				content:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAC4jAAAuIwF4pT92AAACjklEQVR42pXTz0/TYBgH8Nf/gaMJhoAXZzx7NhJviiZ6wmiWXRbRxBjjSYEQN8PPjbGxsWwgOjQYCVHWQoQM2IYDYbCta1e6tfvRTRMVjffnsW9HFkGzuMPnfd68ab79vk1KfD7fYrlcxv8lCAJWKhWUZVnfh8PhXwaD4TLxer2LqqoCRR88vv/zjFIUBXmeh0P6fmRkhCETExOsWiyAkt6jMC+k6gb962Xj4+MM8Xg8bCnowwNrh+6bpQOLyS1s5Loul4shbrebLc874EdPO4V0FncjDTVyOp0M0Wqx6pshOHh0nsLv2izurDceRGup2yH4/KJH042VQB+ostRQ0NjYWDVISb7H3LK5aqULC1kO0+5V5B0hnbS0W/cb6UF0KcSeQeXdOQrplOPLIN5dwOw9BjQouSN1GzkcjmqQEu3D0tvWGnlnCfnbcyga56vsa3UbjY6OMoSmybFhkAInKZRmTkGe24BE5ywmb7wGDWac63Ub6UF0kQoShDNrFEbFMJTUEixnshjkJdBgUslDWlAgFN2nMLol/R1kt9uZQHoazbvGmlUxhmciGTTEsrr7cRGHn+fwVndRd/NxDmWlVLuazWYLEvqf+FNe6Ny6TiGdH4QItK0ksC3EwekQh12bPDz15uDaQ4XCqw+ykJVLtUYDAwMsGRwcZNx7TrgSuUQhnUv8OjQHN7F5cRs0aI4m4IlTgvY7OQovmvePBFkslgXS39/PxpUdnOYmdQFuGvOlPHr2BLTFeV1oX8bIpwL65xTdq6CiBeghKEkSmkymIWK1WllRFIHjOEilUphMpuAQHptHzhOJJIUbGx9/NjU1nSVGo2nW73/5dWpqpiGTk4Evvb3WtZaW1guEkBO/ARQgDsZ2Sv7VAAAAAElFTkSuQmCC);
				opacity:.75;
				display: block;
				position: absolute;
				top: 0px;
				left: 33%;
				z-index: 1;
			}
			#hiBeauty.hiBeautted:before{
				content:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAC4jAAAuIwF4pT92AAACf0lEQVR42qWSW09aURCF9x9srJd6ARGqtf0nVUHkJreDtCrIRX/AjlFjQjUxISpXNdZ7DeC7rX1a0xm6TU6IjQ99+DIz+8xayVl7q06nox8eHoiBqb29fX5xRzxUu93WDJqNBj5NTeLjew8+TLgwOe6ExzEG9+gIXMNDcA4NwDHwFo16DbLfg1atVkszxMgBGey9fYbZ7e7beq3u7+81QxcXF9goFmmjWKD1Qh7r+TwVczkq5NaosJZFPpulfDaDXGaVcqsrtLayzH9RJ9GKh7q7u9MMzs7OsJxO4+vSEr6kUoyFtJXEUjKBVCKOVDwGKxZFMrrIRJBYjOD46AiiFQ91c3Ojb29viYGpvb19fnFHPNTV1ZW+vr7G4eEhpj3ubsgTHLBzaBDTbhfk22uIh+Js9OXlJTEwtbe3zy/uiIc6Pz/XDNVqNcmIOCOSjNKWRZwRcUYkGVnxGCX/ZkSNep1YA9EZtOKQNUOV42MYEzawOOQkG7BJPE5sAjahBAfNIVO1WiG5HNEZtGo2m/rk5AT/g3ioer2uGfpWKmHKPUGTrnHyOB1wj42Sa2SYnO8GyTHYj9H+PhrpeyOvXGIg1kB0Bq0qlYpmiEG1WiWDvbfP3fq8b6qgFV+7PuKHtb+/j0gwiHAwgFBgAaEFP4L+eQTmfQj4vFjweuH3zsE/N4v52Rn4Zj5jZ3sLohUPVS6XNUN7e3tImYAtvqVk95ZilOiGHAUHTXF+zbFImGLhEEXDIezsbJNoxUMdHBxohhiY2tvb53/taLW5uekrlUqPzE/mF/PE/H6FJ7MrmkfxUNlsdpcpZzKZU67fmR/ct7i2mY7A83OVs5bZkd1To939A6wgCBc2cNwFAAAAAElFTkSuQmCC);
			}
			#css_text_area_div {
				position: relative !important;
			}
			#hiBeauty {
				padding: 0;
				margin: 0;
				width: auto;
				cursor: pointer;
				border: none
			}
			`;

		function hiStat(x) {
			vc.className = bt.className = x;
			bt.setAttribute('title', x ? 'raw text' : 'highlight');
			if (locStor) locStor.setItem('HiliteUsoCod', !!x);
		}

		function isBeauty() {
			sc = document.getElementById('stylish-code');
			if (!sc || !(sc.textContent)) return -1;
			if (sc.innerHTML.substr(0, hiId.length) === hiId) {
				if (bt.className) {
					sc.innerHTML = '';
					sc.textContent = tc;
					hiStat('');
				} else hiStat('hiBeautted');
				return 1;
			}
			hiStat('');
			return 0;
		}

		function hiBeauty(e) {
			sc = document.getElementById('stylish-code');
			if (e) {
				e.preventDefault(), e.stopPropagation();
				if (e.shiftKey || e.altKey) return;
				if (e.ctrlKey) { // 2016-01-04
					GM.setClipboard(sc.textContent);
					window.status = 'CSS copied to clipboard';
					return;
				}
			}
			if (isBeauty() !== 0) return;
			if (!(highlighted && tc && tc === sc.textContent)) {
				tc = sc.textContent;
				// console.log(tc);
				highlighted = cssbeautify(tc, {
					//     autosemicolon: true ,
					//     openbrace: "newline",
					indent: '\u0020\u0020' // 14-02-26 o_0
					// indent: "    " // 14-02-26 o_0
					//     indent: "\u00a0\u00a0"
				});
				// console.log(highlighted);

				highlighted = highlighted.replace(/\n(\s*)@\s+/g, '\n$1@'); // 2014-03-12 dirty patch
				highlighted = highlighted.replace(/,\n\n+/g, ',\n'); // 2014-03-12 4freecyber
				highlighted = highlighted.replace(/\n\n+/g, '\n\n'); // 2014-02-25
				highlighted = highlighted.replace(/&/g, '&amp;').replace(/</g, '&lt;');
				highlighted = hiId +
					Prism.highlight(highlighted, Prism.languages.css) /* */ ;
			}
			// console.log(highlighted);
			sc.innerHTML = highlighted;
			hiStat('hiBeautted');
		}

		/* * /
		function insAfter(n,e){
		  if(e.nextElementSibling)
		   return e.parentNode.insertBefore(n,e.nextElementSibling);
		  return e.parentNode.appendChild(n);
		}  /* */

		function insBefore(n, e) {
			return e.parentNode.insertBefore(n, e);
		}

		function cE(t, aA, eL, ht) {
			var n = document.createElement(t);
			for (var at in aA)
				if (aA.hasOwnProperty(at)) n.setAttribute(at, aA[at]);
			if (eL) n.addEventListener(eL[0], eL[1], eL[2] ? true : false);
			if (ht) n.innerHTML = ht;
			return n;
		}

		function sbclik() {

			if (document.querySelector('#stylish-code').outerHTML.indexOf('<textarea') !== -1) {
				document.querySelector('#stylish-code').outerHTML = document.querySelector('#stylish-code').outerHTML.replace('<textarea', '<code');
				document.querySelector('#stylish-code').style.whiteSpace = 'pre-wrap';
				document.querySelector('#stylish-code').style.display = 'block';
				document.querySelector('#stylish-code').style.width = '715px';
				document.querySelector('#stylish-code').style.overflowX = 'hidden';
				document.querySelector('#stylish-code').style.border = '1px';
				document.querySelector('#stylish-code').style.borderStyle = 'solid';
				document.querySelector('#stylish-code').style.borderColor = 'black';
				document.querySelector('#stylish-code').style.marginLeft = '-12px';
			}

			if (!bt) {
				vc = document.getElementById('stylish-code');
				if (!vc) return;
				var pz = cE('style');
				pz.textContent = prismCSS;
				document.head.appendChild(pz);
				bt = cE('div', { id: 'hiBeauty', title: 'Highlight' }, ['click', hiBeauty], '');
				insBefore(bt, vc);
			}
			bt.className = '';
			//if(HiliteOn) alert('HiOn'),HiliteOn=0;
		}

		sb.addEventListener('mousedown', sbclik, false);

		var locStor, HiliteUsoCod = false;
		try { // localStorage throws 'security error' when cookies are disabled
			locStor = localStorage;
			HiliteUsoCod = locStor.getItem('HiliteUsoCod') === 'true';
			// see SQlite manager -> %FFpath%\webappstore.sqlite -> find -> key -> contains HiliteUso
		} catch (e) { locStor = false; }



		document.arrive('#stylish-code', function() {
			var toggle = document.querySelector('#hiBeauty');
			if (toggle.title === 'Highlight' && localStorage.getItem('HiliteUsoCod') === 'true') {
				toggle.click();
			}
		});


		document.querySelector('.css_button').addEventListener('click', function() {
			if (document.querySelector('.css_button').firstChild.className === 'css_open') {
				document.querySelector('#stylish-code').style.display = 'none';
				document.querySelector('#hiBeauty').style.display = 'none';
			} else {
				document.querySelector('#stylish-code').style.display = 'block';
				document.querySelector('#hiBeauty').style.display = 'initial';
			}
		});




	})();



});