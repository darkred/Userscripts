<u>Example link where the script applies to:</u> *(changelogs for the last 1 day interval in these examples)*  
**Inbound**: https://hg.mozilla.org/integration/mozilla-inbound/pushloghtml?startdate=1+day+ago&enddate=now  
  
It's a further modified version of [Firefox for desktop - list fixed bugs in Mercurial](https://greasyfork.org/en/scripts/13169-firefox-for-desktop-list-fixed-bugs-in-mercurial)  
meant for inbound users only.  
  
It doesn't show only the RESOLVED and VERIFIED bugs as in v5.5.2 (and it displays their status in the resulting table)  
The reason why is because in the inbound(hourly) builds  
the patches land on a hourly basis,  
so, in this way, it shows the bugs for which patches have landed in the given interval, even if they aren't considered fixed yet.  
  
  
[![](https://i.imgur.com/SbqOUemh.jpg)](https://i.imgur.com/SbqOUem.jpg)  
