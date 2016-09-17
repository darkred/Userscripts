This script applies to StackExchange sites stackoverflow.com, stackexchange.com, superuser.com, etc.  
The timezone that the StackExchange sites use is UTC i.e. +0000 ([source](http://meta.stackexchange.com/questions/2941/why-are-the-time-stamps-in-utc-instead-of-localized-for-the-client))  
So, this script converts the dates to your local timezone, in both:  
- tooltips `2015-12-14 14:11:13Z`, and in  
- date text like `Dec 14 at 14:11`.  

*It also recalculates them whenever the page changes.*  

<br>
*It uses the [jsTimezoneDetect](https://bitbucket.org/pellepim/jstimezonedetect) JavaScript script (for getting the local timezone),  
and the [Moment.js](http://momentjs.com/) and [Moment-Timezone](http://momentjs.com/timezone/) JavaScript libraries (for converting the dates).  
Also note: `jsTimezoneDetect` does not do geo-location, nor does it care very much about historical time zones.  
e.g. it may get "Europe/Berlin" when the user is in fact in "Europe/Stockholm" (they are both identical in modern time).  


Known issues:  
1.  While you are on the superuser.com homepage, every 1 minute the activity indicator which will show when new posts are asked or answered.  
  Also, every relative timestamp, e.g. `answered 1 min ago` will become `answered 2 min ago`, and so on.  
  Well, while using the script, the latter feature, i.e. "*the relative timestamps being increased every 1 min*" becomes broken, and they don't get updated anymore.  
2. if you reopen Firefox e.g. stackexchange.com,  then session restore uses the timestamps for the tooltips from cache, so the script uses these cached values (refreshing the page (F5) fixes the issue).*  


Relative post I made in stackapps.com  
[Here's a script to convert dates to local timezone in Stack Exchange sites](http://stackapps.com/questions/6711/heres-a-script-to-convert-dates-to-local-timezone-in-stack-exchange-sites)  

[Hosted in GitHub](https://github.com/darkred/Userscripts)