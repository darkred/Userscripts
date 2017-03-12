This userscript applies to metal-archives.com(Metal Archives), in discography pages.  

It splits the 'Reviews' column into 'Reviews' and 'Ratings' and makes the tables in all discography tabs sortable  
(just click on each of the table headers).  
*Tip: you can sort multiple columns simultaneously by holding down the `Shift` key and clicking a 2nd, 3rd or even 4th column header.*  
(<u>Note</u>: since version 2.0 the [visual glitch/delay](http://i.stack.imgur.com/ABMts.gif) that occured as you switched sub-tabs (tables) appears no more)  

Example *(see screenshots below)* :  
http://www.metal-archives.com/bands/Kamelot/166 (DISCOGRAPHY > MAIN tab)  
-the script works in all DISCOGRAPHY tabs-

Tested with Greasemonkey 3.3.
<br>

This userscript uses jQuery (the version that the page itself loads),  
the jQuery plugin [tablesorter](http://mottie.github.io/tablesorter/docs/index.html) (forked by Rob Garrison (Mottie))  
and the JavaScript library [Mutation Summary](https://github.com/rafaelw/mutation-summary) (by Rafael Weinstein).  

Thanks a lot to Rob Garrison and Brock Adams for their invaluable help  ([1](http://stackoverflow.com/questions/26331773/javascript-in-an-html-table-how-to-select-part-of-text-matching-some-regex-f), [2](http://stackoverflow.com/questions/26416049/greasemonkey-using-the-waitforkeyelements-utility-how-to-call-a-function-aft), [3](https://github.com/Mottie/tablesorter/issues/990), [4](http://stackoverflow.com/questions/32233895/using-waitforkeyelements-is-it-possible-to-prevent-the-key-element-from-being-d))

Screenshots  
![initially](https://greasyfork.org/system/screenshots/screenshots/000/001/815/original/1.jpg?1440546373) ![with the script](https://greasyfork.org/system/screenshots/screenshots/000/001/816/original/2_.jpg?1440546373) ![with the script (here sorted by Ratings(avg) in descending order)](https://greasyfork.org/system/screenshots/screenshots/000/001/817/original/3_.jpg?1440546373)