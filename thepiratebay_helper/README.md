It's a modified version of [PirateBay Time Changer](http://userscripts-mirror.org/scripts/show/164849)

Additional features:
- Now you may may choose in Settings via a dropdown menu between: 
  - highlighting trusted, 
  - hiding non trusted, or 
  - show all
- Added a keyboard shortcut \` to toggle highlight/hide.  
You may also click on the e.g, `7/30 torrents are currently hidden) - click to toggle`  
to toggle highlight/hide *(and this is reflected in GM_config too)*.  
- Changes in the relevant texts in the script due to that TPB timezone is `GMT+1` *(and not `GMT` as the site wrongly displays in torrent pages)*  
- About the *"enhance the visibility of torrents based off of VIP/Trusted status"* feature:  
  - Torrents by "Helpers" are now also highlighted.  
  - Torrents by "Trusted" are now highlighted with this color: #F9D5DB *(initially it was #FECDFE)*  
  - You may hide non VIP/Trusted/Moderators/Helpers torrents (instead of changing their opacity) by (commenting out line 274 and) uncommenting line 272 and 273.  *(see v0.9.0)*


<u>Screenshots</u>:
[![](https://i.imgur.com/UjfPtJis.jpg)](https://i.imgur.com/UjfPtJi.jpg) [![](https://i.imgur.com/sTLd6rjs.jpg)](https://i.imgur.com/sTLd6rj.jpg) [![](https://s3.amazonaws.com/uso_ss/21237/thumb.jpg?1366305203)](http://s3.amazonaws.com/uso_ss/21237/large.jpg?1366305203) [![](https://i.imgur.com/lAJiCJcs.jpg)](https://i.imgur.com/lAJiCJc.jpg) [![](https://i.imgur.com/wyyJiujs.jpg)](https://i.imgur.com/wyyJiuj.jpg)

<br/>





Thanks to emptyparad0x for making a very useful script!


---




<u><b>Info for the script in http://userscripts-mirror.org/scripts/show/164849</b></u>

- This script changes the times everywhere on thepiratebay except for the comments. It changes the time shown in the browse/search lists, the footer, and the torrent pages themselves.
- At the bottom of the page, you will find the configuration menu for the script. This is where you will enter how you'd like your times displayed.
- The `Text for Timezone` field is what will be displayed after the time. This defaults to EST, but can be changed to whatever you like. It can also be left blank.
- The `Use AM/PM` checkbox determines if your times will be displayed in a 12 hour format.
- The `Text for AM/PM` fields are how the script will denote AM/PM. If you'd like a space between the time and the denotation, enter a space before the AM or PM in these fields (e.g. " am" without the quotes).
- The `TPB Timezone` allows for you to adjust the timezone that thepiratebay is currently displaying. As of 4/18/2013 the timezone is GMT+1, therefore its value should be left as it is, i.e. `(GMT+1) + 0`.
- After saving settings, the script will reload the page.

**Tech Info**
This script uses GM_config and jQuery. It has not been tested for conflicts with other userscripts or languages besides English. It has been tested with GreaseMonnkey on Firefox and Tampermonkey on Chrome.
<br>
*It uses [Keypress](https://github.com/dmauro/Keypress/) keyboard input capturing utility.*