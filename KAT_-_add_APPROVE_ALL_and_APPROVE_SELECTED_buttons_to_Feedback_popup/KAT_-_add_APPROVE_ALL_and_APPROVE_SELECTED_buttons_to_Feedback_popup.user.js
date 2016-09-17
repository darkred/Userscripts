// ==UserScript==
// @name        KAT - add APPROVE ALL and APPROVE SELECTED buttons to Feedback popup
// @namespace   darkred
// @author      darkred
// @include     https://kat.cr/*
// @description Adds 'APPROVE ALL' and 'APPROVE SELECTED' buttons inside the 'Torrents awaiting feedback' popup
// @version     2015.12.30
// @grant       none
// ==/UserScript==





function approveAll() {
    var x = document.getElementsByClassName('ka-thumbs-up');
    for (var i = 2; i < x.length; i++) {
        x[i].click();
    }
}


function approveSelected() {
    var x = document.getElementsByClassName('torrentboxes');
    var y = document.querySelectorAll("table > tbody > tr > td > div > form > div > a > i.ka-thumbs-up ");
    for (var i = 0; i < x.length; i++) {
		if (x[i].checked){
            y[i].click();
		}
    }
}






document.querySelector('.showFeedback > a').addEventListener('click', function() {


        new MutationObserver(function(mutations, observer) {
            if (document.querySelector('#fancybox-wrap') ) {
                  observer.disconnect();
                  console.log('TRUE');



            // add button "APPROVE SELECTED"
            var parentElement = document.querySelector('div.buttonsline:nth-child(10)');
            var theFirstChild = parentElement.firstChild;
            var button1 = document.createElement('BUTTON');
            parentElement.insertBefore(button1, theFirstChild);
            button1.id = 'mybutton1';
            button1.innerHTML = 'APPROVE SELECTED';
            button1.className = 'siteButton bigButton';

            button1.addEventListener('click', function() {
                approveSelected();
                // document.querySelector('#fancybox-close').click(); // uncomment this line to also close the popup after approving all torrents.
            });



            // add button "APPROVE ALL"
            parentElement = document.querySelector('div.buttonsline:nth-child(10)');
            theFirstChild = parentElement.firstChild;
            var button2 = document.createElement('BUTTON');
            parentElement.insertBefore(button2, theFirstChild);
            button2.id = 'mybutton2';
            button2.innerHTML = 'APPROVE ALL';
            button2.className = 'siteButton bigButton';
            button2.style = 'margin-right: 4px';

            button2.addEventListener('click', function() {
                approveAll();
                document.querySelector('#fancybox-close').click(); // uncomment this line to also close the popup after approving all torrents.
            });




            // add button "DISCARD ALL"
            parentElement = document.querySelector('button.siteButton:nth-child(3)');
            theFirstChild = parentElement.firstChild;
            var button3 = document.createElement('BUTTON');
            parentElement.parentNode.insertBefore(button3, theFirstChild.nextSibling);
            button3.id = 'mybutton3';
            button3.innerHTML = 'DISCARD ALL';
            button3.className = 'siteButton bigButton';

            button3.addEventListener('click', function() {
                document.querySelector('th.lasttd:nth-child(1) > input:nth-child(1)').click();
                document.querySelector('button.siteButton:nth-child(3)').click();
                // document.querySelector('#fancybox-close').click(); // uncomment this line to also close the popup after approving all torrents.
            });




        }
    }).observe(
        document.querySelector('#fancybox-wrap'), {
            attributes: true,
            attributeFilter: ['style'],
        }
    );




});
