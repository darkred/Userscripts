This script applies to blabbermouth.net.  

Blabbermouth only displays timestamps (just the date) in news listings and pages.  
**It doesn't display timestamps in cd/dvd reviews pages at all.** 
The script generates timestamps in relative format, in all cases.

In details: 

- in **news** and **cd/dvd reviews** pages:  

  It generates timestamps *(making use of the existing `published_time` data from inside the pages, e.g. `2020-02-20T19:10:22.000Z`)*  
in relative format. Also, it recalculates them every 1 minute.  

  It also shows a link to the Facebook comments next to the generated timestamp,  
with **the comment count from that fb iframe** <sup>1</sup> (i.e. `6 Comments`, not just "Comments" ).  


- in **news** listings:  

  As you scroll down each page, it retrieves the relevant target news page in the background in order to get the relevant `published_time` data from the page, and then generates timestamps (like before) in relative format.  

&nbsp;

<sup>1</sup> Compatibility note regarding that feature:

- Violentmonkey: the script works in ok with VM in its default settings.  
- Tampermonkey: in order to work with TM, you have to remove the `*://www.facebook.com/plugins/*` pattern from TM blacklist (it's blacklisted in TM settings by default).  
- Greasemonkey: not supported.

---

The script uses [moment.js](http://momentjs.com/).

[Hosted in GitHub](https://github.com/darkred/Userscripts)
