This script applies to blabbermouth.net.  
Blabbermouth only displays timestamps in news listings and pages.  
**It doesn't display timestamps in cd/dvd reviews pages.** The script implements that.

In details: 

- in cd/dvd reviews pages:  

  It generates timestamps in cd/dvd reviews pages  
  *(making use of the existing `published_time` data from inside the pages, e.g. `2020-02-20T19:10:22.000Z`)*  
to relative format in local timezone. Also, it recalculates them every 10 seconds.

  It also shows a link to the Facebook comments next to the generated timestamp,  
with **the comment count from that FB iframe** <sup>1</sup> (i.e. "6 Comments", not just "Comments" ).  

- in news pages and listings:  

  it converts the existing timestamps to releative format.

&nbsp;

<sup>1</sup> 
Compatibility note regarding that feature:

- Violentmonkey: the script works in ok with default VM settings.  
- Tampermonkey: `*://www.facebook.com/plugins/*` is blacklisted in TM by default. in order the script to work, you have to remove that pattern from TM blacklist.  
- Greasemonkey: not supported.

---

The script uses [moment.js](http://momentjs.com/), [moment-timezone.js](http://momentjs.com/timezone/) and [jsTimezoneDetect](https://bitbucket.org/pellepim/jstimezonedetect) 

[Hosted in GitHub](https://github.com/darkred/Userscripts)
