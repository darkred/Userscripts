It's a modified version of [PirateBay Time Changer](http://userscripts-mirror.org/scripts/show/164849)

Additional features:
- Now you may may choose in Settings via a dropdown menu between: 
  - highlighting trusted, 
  - hiding non trusted, (optionally combined with the checkbox: `...when toggle, include those non-trusted which have comments`)
  - show all
- Added two keyboard shortcuts ( \` and \~ ) to toggle between: 
  - view trusted only, and view trusted incl. non-trusted with comments
  - view all
- Added an option to display torrent timestamps in relative format (and recalculates them for browse/search lists every 10 secs) _(enabled by default)_ 
_(the initial timestamps -converted to local timezone's offset- are tooltips: just hover mouse on a relative date to view)_, 
- Added to swap the verified icons position with that of the comments _(enabled by default)_, 
- Added an option to add a sortable 'Ratio' (seeds/peers) column _(enabled by default)_. 

You may also click on the e.g, `7/30 torrents are currently hidden) - click to toggle`  
to toggle highlight/hide *(and this is reflected in GM_config too)*.  
- Changes in the relevant texts in the script due to that TPB timezone is `GMT+1` *(and not `GMT` as the site wrongly displays in torrent pages)*  
- About the *"enhance the visibility of torrents based off of VIP/Trusted status"* feature:  
  - Torrents by "Helpers" are now also highlighted.  
  - Torrents by "Trusted" are now highlighted with this color: #F9D5DB *(initially it was #FECDFE)*  
  - You may hide non VIP/Trusted/Moderators/Helpers torrents (instead of changing their opacity) by (commenting out line 274 and) uncommenting line 272 and 273.  *(see v0.9.0)*


<u>Screenshots</u>:  
[![](https://i.imgur.com/aElkE5Ts.jpg)](https://i.imgur.com/aElkE5T.jpg) [![](https://i.imgur.com/LRIXDwys.jpg)](https://i.imgur.com/LRIXDwy.jpg) [![](https://s3.amazonaws.com/uso_ss/21237/thumb.jpg?1366305203)](http://s3.amazonaws.com/uso_ss/21237/large.jpg?1366305203) [![](https://i.imgur.com/lAJiCJcs.jpg)](https://i.imgur.com/lAJiCJc.jpg) [![](https://i.imgur.com/wyyJiujs.jpg)](https://i.imgur.com/wyyJiuj.jpg)

<br/>





Thanks to emptyparad0x for making a very useful script!


---




<u><b>Info for the script in http://userscripts-mirror.org/scripts/show/164849</b></u>

- This script changes the times everywhere on thepiratebay except for the comments. It changes the time shown in the browse/search lists and the torrent pages themselves (including the comments).
- At the bottom of the page, you will find the configuration menu for the script. This is where you will enter how you'd like your times displayed.
- The `TPB Timezone` allows for you to adjust the timezone that thepiratebay is currently displaying. As of 4/18/2013 the timezone is GMT+1, therefore its value should be left as it is, i.e. `(GMT+1) + 0`.
- After saving settings, the script will reload the page.

**Tech Info**  
This script uses GM_config and jQuery. It has not been tested for conflicts with other userscripts or languages besides English. It has been tested with GreaseMonnkey on Firefox and Tampermonkey on Chrome.
<br>
*It uses [Keypress](https://github.com/dmauro/Keypress/) keyboard input capturing utility and the jQuery plugin [tablesorter](http://mottie.github.io/tablesorter/docs/index.html) (forked by Rob Garrison (Mottie)) .*