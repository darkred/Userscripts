This script applies to blabbermouth.net.

Blabbermouth doesn't display timestamps in cd/dvd reviews pages and news pages (it only displays in news listings).
This script fixes that.

In details: 

- in cd/dvd reviews pages:  
  This script generates timestamps in cd/dvd reviews pages using the `published_time` data from inside the pages (e.g. `2020-02-20T19:10:22.000Z`)
and converts them to relative format in local timezone. Also, it recalculates them every 10 seconds.

  It also shows a link to the Facebook comments next to the generated timestamp,  
containing **the comment count** <sup>1</sup> from that FB iframe (i.e. it displays "6 Comments" instead of plain "comments" ).  

- in news pages:  
  the script just converts the existing timetamps to releative format.

&nbsp;

<sup>1</sup> 
Compatibility note regarding that last feature - it works in:

- Violentmonkey: ok with default settings.  
- Tampermonkey: `*://www.facebook.com/plugins/*` is blacklisted by default, that's why, in order the script to work, you have to remove that pattern from TM blacklist.  
- Greasemonkey: not supported.

---

The script uses [moment.js](http://momentjs.com/), [moment-timezone.js](http://momentjs.com/timezone/) and [jsTimezoneDetect](https://bitbucket.org/pellepim/jstimezonedetect) 

[Hosted in GitHub](https://github.com/darkred/Userscripts)
