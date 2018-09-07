This userscript applies to RARBG torrent detail pages.  
It rearranges various entries, displays in bold the various rating values, renames a few entries more suitably and use decimal rating for the users' ratings.

Screenshot comparison:  
Initial:  
[![](https://i.imgur.com/fCmbgmol.jpg)](https://i.imgur.com/fCmbgmo.jpg)

With the script:  
[![](https://i.imgur.com/eDQB7M4l.jpg)](https://i.imgur.com/eDQB7M4.jpg)

Notes:  
- The script makes use of the page's jQuery 1.11.3.
- Regarding the `Rating` row: the five star rating is converted to ten star, both the stars themselves and the text value, but, if you hover the mouse over the stars to click to rate the movie, still only the first five stars are clickable, i.e. it's actually still five star rating.
- The `Runtime` and `PG rating` rows info is appended to the end of the 'IMDb summary' row text (the 'Runtime' info is converted from: e.g. '118' to: 1h 58min).
- The `Year` row becomes hidden because that info is still contained in various other rows ('Release Name', 'IMDb' link title, 'Title')
- The `VPN` row *(not shown in the 'initial' screenshot)* becomes hidden because it's an ad.
- Regarding the `Trailer` row: when using ad-blocking extensions, https://rarbgproxy.org/trailers.php is blocked by default via EasyList. So, in previous script versions the 'Trailer' row was getting hidden by the script. Since v2018.9.6.2 it's been restored (per https://greasyfork.org/en/forum/discussion/42158/x ) .
