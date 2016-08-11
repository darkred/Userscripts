// ==UserScript==
// @name        mozillaZine Forums - inserts titles to bug links
// @namespace   rikkie
// @description Inserts titles to bug links that are plain URLs, in forums.mozillazine.org
// @include     http://forums.mozillazine.org/viewtopic.php*
// @version     1.2
// @grant       GM_xmlhttpRequest
// ==/UserScript==

var links = document.getElementsByClassName('postlink');


for (i = 0; i < links.length; i++) {
  if (links[i].innerHTML.match(/https:\/\/bugzilla\.mozilla\.org\/show_bug\.cgi\?id=*/)) {

    var elem = document.createElement("img");
    elem.setAttribute("src", "http://i.imgur.com/3Y8dqYZ.gif");
    links[i].parentNode.insertBefore(elem, links[i].nextSibling);          // For spinning icon AFTER the link  
    // links[i].parentNode.insertBefore(elem, links[i].previousSibling);   // For spinning icon BEFORE the link
    
    
    insertTitle(links[i]);
  };
  
 if (links[i].innerHTML.match(/Bug\ ......./i) ) {

    var elem = document.createElement("img");
    elem.setAttribute("src", "http://i.imgur.com/3Y8dqYZ.gif");
    links[i].parentNode.insertBefore(elem, links[i].nextSibling);          // For spinning icon AFTER the link  
    // links[i].parentNode.insertBefore(elem, links[i].previousSibling);   // For spinning icon BEFORE the link
    
    
    insertTitle(links[i],true);
  };
  
};


function insertTitle(x,y) {
  if (y==true) {var target = x.href }
    else {var target = x.innerHTML }
  
  var details = GM_xmlhttpRequest({
    method: 'GET',
    url: target,
    synchronous: false,                         // Asynchronous request
    onload: function (response) {      
      var matches = response.responseText.match(/<title>(.*)<\/title>/);
      var regex = /<title>(.*)<\/title>/;
      var title = regex.exec(matches[0]);
      x.nextSibling.remove();                  // For spinning icon AFTER the link  
      // x.previousSibling.previousSibling.remove();           // For spinning icon BEFORE the link                  
      x.innerHTML = title[1];
    }
  })
}

