// ==UserScript==
// @name              Markdown toolbar for GreasyFork
// @name:ru           Markdown-тулбар для GreasyFork
// @name:zh-CN        GreasyFork markdown
// @namespace         darkred
// @version           2.0.1
// @description       Select Markdown format by default, add help links, add toolbar formatting buttons for markdown
// @description:ru    Включает формат Markdown по умолчанию, добавляет справочные ссылки по форматам, добавляет панель кнопок форматирования markdown
// @description:zh-CN 在论坛默认使用 Markdown 格式，添加格式帮助链接及 Markdown 工具栏
// @author            wOxxOm, darkred
// @contributor       JixunMoe
// @license           MIT
// @icon              https://raw.githubusercontent.com/dcurtis/markdown-mark/master/png/66x40-solid.png
// @include           https://greasyfork.org/*discussions/*
// @include           https://greasyfork.org/*scripts/*/versions/new*
// @include           https://greasyfork.org/*scripts/*/feedback*
// @include           https://greasyfork.org/*script_versions/new*
// @include           https://greasyfork.org/*/conversations/*
// @include           https://greasyfork.org/en/users/edit
// @grant             GM_addStyle
// @run-at            document-start
// @supportURL        https://github.com/darkred/Userscripts/issues
// ==/UserScript==

/* jshint lastsemic:true, multistr:true, laxbreak:true, -W030, -W041, -W084 */


// Example URLS to test:
// https://greasyfork.org/en/discussions/new
// https://greasyfork.org/en/scripts/422887-markdown-toolbar-for-greasyfork/discussions/78139
// https://greasyfork.org/en/scripts/23493/versions/new
// https://greasyfork.org/en/scripts/422445-github-watcher/feedback
// https://greasyfork.org/en/users/2160-darkred/conversations/new
// https://greasyfork.org/en/users/edit





var inForum = location.href.indexOf('/discussions') > 0;

window.addEventListener('DOMContentLoaded', function(e) {
	if (inForum){
		var refElement = document.querySelector('div > div > .label-note') || document.querySelector('.label-note');
		addFeatures(refElement.insertAdjacentHTML('beforeend','<br>'));
		addFeatures(refElement);
	}
	else {

		if (nn = document.querySelectorAll('input[value="markdown"]'))
			for (var n, i=0; (i<nn.length) && (n=nn[i]); i++) {
				if (location.href.indexOf('/script_versions/')) {
					n.click();
				}
				n.click(); // posting a new script
				addFeatures(n.parentNode.appendChild(document.createElement('br')));
			}

		// addFeatures(document.querySelector('.form-control'));
	}

	new MutationObserver(function(mutations) {
		for (var i=0, ml=mutations.length, m; (i<ml) && (m=mutations[i]); i++) {
			for (var j=0, nodes=m.addedNodes, nl=nodes.length, n; (j<nl) && (n=nodes[j]); j++) {
				if (n.nodeType == 1) // Node.ELEMENT_NODE 1 An Element node like <p> or <div>.
					if (inForum) {
						if ((n.localName == 'label' && n.querySelector('input[value="Markdown"], input[value="Html"], input[value="markdown"], input[value="html"]'))
						|| (n = n.querySelector('input[value="Markdown"], input[value="markdown"]') || n.querySelector('input[value="Html"], input[value="html"]')))
							return addFeatures(n.closest('label'));
					} else {
						if (((n.localName == 'input') && (n.value.toLowerCase() == 'Markdown'))
						|| (n = n.querySelector('input[value="Markdown"], input[value="markdown"]'))) {
							if (location.href.indexOf('/script_versions/'))
								n.click();
							return addFeatures(n.parentNode.appendChild(document.createElement('br')));
						}
					}
			}
		}
	}).observe(document, {subtree:true, childList:true});
});



function insertAfter(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}



function addFeatures(n) {

	if (!n){
		return;
	}

/*
	if (inForum) {
*/
		var form = n.closest('form');
		// console.log(form)
		// span.current > a.write-tab
		// var form = n.querySelector('form');
		if (form.action.indexOf('/edit') < 0) {
			n.click();
		}

		n.parentNode.textAreaNode = form.querySelector('textarea.TextBox, textarea.previewable, div.previewable textarea');
		// add formatting help tooltips (the '(?)' )

		// .querySelector('input[value="html').firstElementChild

		// n.previousElementSibling.insertAdjacentHTML('beforeend',
		// n.querySelector('input[value="html"]').nextSibling.insertAdjacentHTML('beforeend',
		const newContent = document.createElement('a');
		newContent.innerHTML = '<a href="/help/allowed-markup" target="_blank" title="'+
					'* (name, title), a (href), abbr, b, blockquote (cite), br, center, cite, code, dd, del, dfn, div, dl, dt, em, '+
					'h1, h2, h3, h4, h5, h6, hr, i, ins, img (alt, height, src (https), width), kbd, li, mark, ol, p, pre, q (cite), '+
					'rp, rt, ruby, s, samp, small, span, strike, strong, tt, table, tbody, tfoot, thead, td, th, tr, sub, sup, '+
					'time (datetime, pubdate), u, ul, var">?</a>' ;


/*

	} else { // if not in forum
*/
		for (var wrapper=n; wrapper = wrapper.parentNode; )
			// if (t = wrapper.querySelector('textarea[id*="additional-info"]')) {
			if (t = wrapper.querySelector('textarea[id*="additional-info"], textarea[id*="conversation_messages_attributes_0_content"], textarea[id*="discussion_comments_attributes_0_text"], textarea[id*="comment_text"], textarea[id*="user_profile"]')) {
				n.parentNode.textAreaNode = t;
				break;
			}
		GM_addStyle('\
			.Button {\
					display: inline-block;\
					cursor: pointer;\
					margin: 0px;\
					font-size: 12px;\
					line-height: 1;\
					font-weight: bold;\
					padding: 4px 6px;\
					background: -moz-linear-gradient(center bottom , #CCC 0%, #FAFAFA 100%) repeat scroll 0% 0% #F8F8F8;\
					border: 1px solid #999;\
					border-radius: 2px;\
					white-space: nowrap;\
					text-shadow: 0px 1px 0px #FFF;\
					box-shadow: 0px 1px 0px #FFF inset, 0px -1px 2px #BBB inset;\
					color: #333;}'
					);

	// }




	// add buttons
	// debugger
	btnMake(n, '<b>'+__('B')+'</b>', __('Bold'), '**');
	btnMake(n, '<i>'+__('I')+'</i>', __('Italic'), '*');
	btnMake(n, '<u>'+__('U')+'</u>', __('Underline'), '<u>','</u>');
	btnMake(n, '<s>'+__('S')+'</s>', __('Strikethrough'), '<s>','</s>');
	btnMake(n, '&lt;br&gt;', __('Force line break'), '<br>','', true);
	btnMake(n, '---', __('Horizontal line'), '\n\n---\n\n', '', true);
	btnMake(n, __('URL'), __('Add URL to selected text'),
					function(e) {
						try {edWrapInTag('[', ']('+prompt(__('URL')+':')+')', edInit(e.target))}
						catch(ex) {}
					});
	btnMake(n, __('Image (https)'), __('Convert selected https://url to inline image'), '!['+__('image')+'](', ')');
	if (inForum)
		btnMake(n, __('Table'), __('Insert table template'), __('\n| head1 | head2 |\n|-------|-------|\n| cell1 | cell2 |\n| cell3 | cell4 |\n'), '', true);
	btnMake(n, __('Code'), __('Apply CODE markdown to selected text'),
					function(e){
						var ed = edInit(e.target);
						if (ed.sel.indexOf('\n') < 0)
							edWrapInTag('`', '`', ed);
						else
							edWrapInTag(((ed.sel1==0) || (ed.text.charAt(ed.sel1-1) == '\n') ? '' : '\n') + '```' + (ed.sel.charAt(0) == '\n' ? '' : '\n'),
													(ed.sel.substr(-1) == '\n' ? '' : '\n') + '```' + (ed.text.substr(ed.sel2,1) == '\n' ? '' : '\n'),
													ed);
					});




	var previewTab = document.querySelector('span > a.preview-tab > span');
	if (previewTab){
		previewTab.onclick = function(){
			document.querySelectorAll('.Button').forEach(element => element.style.display = 'none');
		};
	}

	var writeTab = document.querySelector('span > a.write-tab > span');
	if (writeTab){
		writeTab.onclick = function(){
			document.querySelectorAll('.Button').forEach(element => element.style.display = 'inline-block');
		};
	}




}




function btnMake(afterNode, label, title, tag1_or_cb, tag2, noWrap) {
	var a = document.createElement('a');
	a.className = 'Button';
	a.innerHTML = label;
	a.title = title;
	// if (inForum)
		// a.style.setProperty('float','right');
	a.addEventListener('click',
						typeof(tag1_or_cb) == 'function' ? tag1_or_cb :   					// if
						noWrap ? function(e){edInsertText(tag1_or_cb, edInit(e.target))} : 	// else if
						function(e){edWrapInTag(tag1_or_cb, tag2, edInit(e.target))} 		// else
	);

	/* INITIAL
	var nparent = afterNode.parentNode;
	a.textAreaNode = nparent.textAreaNode;
	inForum ? nparent.insertBefore(a, nparent.firstElementChild) : nparent.appendChild(a);
	*/

	var nparent;
	inForum ? nparent = afterNode : nparent = afterNode.parentNode;
	a.textAreaNode = nparent.textAreaNode || nparent.parentNode.querySelector('textArea');;
	// a.textAreaNode = nparent.textAreaNode || nparent.closest('textArea');
	nparent.appendChild(a);
}




function edInit(btn) {
	var ed = {node: btn.textAreaNode || btn.parentNode.textAreaNode};
	ed.sel1 = ed.node.selectionStart;
	ed.sel2 = ed.node.selectionEnd,
	ed.text = ed.node.value;
	ed.sel = ed.text.substring(ed.sel1, ed.sel2);
	return ed;
}

function edWrapInTag(tag1, tag2, ed) {
	ed.node.value = ed.text.substr(0, ed.sel1) + tag1 + ed.sel + (tag2?tag2:tag1) + ed.text.substr(ed.sel2);
	ed.node.setSelectionRange(ed.sel1 + tag1.length, ed.sel1 + tag1.length + ed.sel.length);
	ed.node.focus();
}

function edInsertText(text, ed) {
	ed.node.value = ed.text.substr(0, ed.sel2) + text + ed.text.substr(ed.sel2);
	ed.node.setSelectionRange(ed.sel2 + text.length, ed.sel2 + text.length);
	ed.node.focus();
}

var __ = (function (l, langs) {
	var lang = langs[l] || langs[l.replace(/-.+/, '')];
	return lang ? function (text) { return lang[text] || text; }
		: function (text) { return text }; // No matching language, fallback to english
})(location.pathname.match(/^\/(.+?)\//)[1], {
	// Can be full name, or just the beginning part.
	'zh-CN': {
		'Bold': '粗体',
		'Italic': '斜体',
		'Underline': '下划线',
		'Strikethrough': '删除线',
		'Force line break': '强制换行',
		'Horizontal line': '水平分割线',
		'URL': '链接',
		'Add URL to selected text': '为所选文字添加链接',
		'Image (https)': '图片 (https)',
		'Convert selected https://url to inline image': '将所选地址转换为行内图片',
		'image': '图片描述', // Default image alt value
		'Table': '表格',
		'Insert table template': '插入表格模板',
		'Code': '代码',
		'Apply CODE markdown to selected text': '将选中代码围起来',

		'\n| head1 | head2 |\n|-------|-------|\n| cell1 | cell2 |\n| cell3 | cell4 |\n':
		'\n| 表头 1 | 表头 2 |\n|-------|-------|\n| 表格 1 | 表格 2 |\n| 表格 3 | 表格 4 |\n'
	},
	'ru': {
		'B': 'Ж',
		'I': 'К',
		'U': 'Ч',
		'S': 'П',
		'Bold': 'Жирный',
		'Italic': 'Курсив',
		'Underline': 'Подчеркнутый',
		'Strikethrough': 'Перечеркнутый',
		'Force line break': 'Новая строка',
		'Horizontal line': 'Горизонтальная линия',
		'URL': 'ссылка',
		'Add URL to selected text': 'Добавить ссылку к выделенному тексту',
		'Image (https)': 'Картинка (https)',
		'Convert selected https://url to inline image': 'Преобразовать выделенный https:// адрес в картинку',
		'image': 'картинка', // Default image alt value
		'Table': 'Таблица',
		'Insert table template': 'Вставить шаблон таблицы',
		'Code': 'Код',
		'Apply CODE markdown to selected text': 'Пометить выделенный фрагмент как программный код',

		'\n| head1 | head2 |\n|-------|-------|\n| cell1 | cell2 |\n| cell3 | cell4 |\n':
		'\n| заголовок1 | заголовок2 |\n|-------|-------|\n| ячейка1 | ячейка2 |\n| ячейка3 | ячейка4 |\n'
	},
	'fr': {
		'B': 'G',
		'I': 'I',
		'U': 'S',
		'S': 'B',
		'Bold': 'Gras',
		'Italic': 'Italique',
		'Underline': 'Souligné',
		'Strikethrough': 'Barré',
		'Force line break': 'Forcer le saut de ligne',
		'Horizontal line': 'Ligne horizontale',
		'URL': 'URL',
		'Add URL to selected text': 'Ajouter URL au texte sélectionné',
		'Image (https)': 'Image (https)',
		'Convert selected https://url to inline image': 'Convertir https://url sélectionnés en images',
		'image': 'image', // Default image alt value
		'Table': 'Tableau',
		'Insert table template': 'Insérer un modèle de table',
		'Code': 'Code',
		'Apply CODE markdown to selected text': 'Appliquer CODE markdown au texte sélectionné',

		'\n| head1 | head2 |\n|-------|-------|\n| cell1 | cell2 |\n| cell3 | cell4 |\n':
		'\n| En-tête 1 | En-tête 2 |\n|-------|-------|\n| cellule 1 | cellule 2 |\n| cellule 3 | cellule 4 |\n'
	}
});
