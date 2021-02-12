This script applies to RARBG lists: 
- it converts torrent timestamps to relative format in local timezone. Also, it recalculates them every 1 min. 
- The initial timestamps are still available as tooltips (on mouse hover), also converted to local timezone.

Note: there's a timestamp on the footer of each RARBG page e.g. `Mon, 02 Nov 2020 12:23:26 +0100`.  
Based on that, the script takes that for the server the UTC/UTC DST offsets are `+01:00 +01:00` (=no DST),  
therefore the timezone in the above case `GMT-1`.  

Examples:

> +01:00  +01:00 (=no DST) ---> 'Etc/GMT-1';  
> +02:00  +02:00 (=no DST) ---> 'Etc/GMT-2';

It uses [moment.js](http://momentjs.com/) and [moment-timezone.js](http://momentjs.com/timezone/).

Screenshot comparison:  
Initial:  
![](https://i.imgur.com/vdv2xjR.jpg)  
With the script:  
![](https://i.imgur.com/iTuWa4d.jpg)

[Hosted in GitHub](https://github.com/darkred/Userscripts)
