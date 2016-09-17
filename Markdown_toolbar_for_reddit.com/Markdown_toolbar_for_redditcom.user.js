// ==UserScript==
// @name        Markdown toolbar for reddit.com
// @namespace   darkred
// @author      wOxxOm, darkred
// @description Creates a Markdown toolbar whenever you make/edit text posts or comments in reddit.com.
// @include     https://www.reddit.com/*submit*
// @include     https://www.reddit.com/*comments*
// @icon        https://raw.githubusercontent.com/dcurtis/markdown-mark/master/png/66x40-solid.png
// @version     1.3
// @grant       GM_addStyle
//
//
// This is a modified version of the script "Markdown toolbar for GreasyFork and UserStyles.org" ()https://greasyfork.org/en/scripts/6779-markdown-toolbar-for-greasyfork-and-userstyles-org)
// Thanks a lot to wOxxOm for making that script.
//
// ==/UserScript==


var x;

// IF IT'S A SUBMIT PAGE
if (window.location.href.indexOf('submit') > - 1) {
  // THEN ADD TOOLBAR TO THE 'NEW POST' TEXTBOX
  x = document.querySelectorAll('div.md > textarea:nth-child(1)')[0].parentNode;
  addFeatures(x);
}
else {
  var textareas = document.querySelectorAll('textarea');

  // ADD TOOLBAR: TO EDITING YOUR POST, TO 'NEW COMMENT' FORM AND TO EDITING YOUR EXISTING COMMENT(S)
  for (i = 0; i < textareas.length - 2; i++) {
    x = document.querySelectorAll('textarea') [i].parentNode;
    addFeatures(x);
  }
}





function addFeatures(n) {

    n.parentNode.textAreaNode = x.firstChild;

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
          color: #333;}');


  // add buttons
  btnMake(n, '<b>B</b>', 'Bold', '**');
  btnMake(n, '<i>I</i>', 'Italic', '*');
  // btnMake(n, '<u>U</u>', 'Underline', '<u>','</u>');
  // btnMake(n, '<s>S</s>', 'Strikethrough', '<s>','</s>');
  btnMake(n, '<s>S</s>', 'Strikethrough', '~~');
  btnMake(n, '^', 'Superscript', '^','', true);
  btnMake(n, '\\n', 'Line break', '&nbsp;\n', '', true);
  btnMake(n, '---', 'Horizontal line', '\n\n---\n\n', '', true);
  btnMake(n, 'URL', 'Add URL to selected text',
          function(e) {
            try {edWrapInTag('[', ']('+prompt('URL'+':')+')', edInit(e.target))}
            catch(e) {};
          });
  // btnMake(n, 'Image', 'Convert selected https://url to inline image', '!['+'image'+'](', ')');
  btnMake(n, 'Table', 'Insert table template', '\n| head1 | head2 |\n|-------|-------|\n| cell1 | cell2 |\n| cell3 | cell4 |\n', '', true);
  btnMake(n, 'Code', 'Apply CODE markdown to selected text',
          function(e){
            var ed = edInit(e.target);
            if (ed.sel.indexOf('\n') < 0)
              edWrapInTag('`', '`', ed);
            else
              edWrapInTag(((ed.sel1==0) || (ed.text.charAt(ed.sel1-1) == '\n') ? '' : '\n') + '```' + (ed.sel.charAt(0) == '\n' ? '' : '\n'),
                          (ed.sel.substr(-1) == '\n' ? '' : '\n') + '```' + (ed.text.substr(ed.sel2,1) == '\n' ? '' : '\n'),
                          ed);
          });
}

function btnMake(afterNode, label, title, tag1, tag2, noWrap) {
  var a = document.createElement('a');
  a.className = 'Button';
  a.innerHTML = label;
  a.title = title;
  a.style.setProperty('float','right');

  a.addEventListener('click',
            typeof(tag1) == 'function'
                     ? tag1
                     : noWrap ? function(e){edInsertText(tag1, edInit(e.target))}
                             : function(e){edWrapInTag(tag1, tag2, edInit(e.target))});

  var nparent = afterNode.parentNode;
  a.textAreaNode = nparent.textAreaNode;
  nparent.insertBefore(a, nparent.firstElementChild);
}



function edInit(btn) {

  var ed = {node: btn.parentNode.textAreaNode } ;

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