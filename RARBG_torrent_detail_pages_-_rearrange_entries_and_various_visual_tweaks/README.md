This userscript applies to RARBG torrent detail pages.  
It rearranges various entries, displays in bold the various rating values, renames a few entries more suitably and use decimal rating for the users' ratings.

Screenshot comparison:  
Initial:  
[![](https://i.imgur.com/a92zxpTl.jpg)](https://i.imgur.com/a92zxpT.jpg)

With the script:  
[![](https://i.imgur.com/y8shpp8l.jpg)](https://i.imgur.com/y8shpp8.jpg)

Notes:  
- The script makes use of the page's jQuery 1.11.3.
- The `VPN` row *(not shown in the 'initial' screenshot)* is hidden because it's an ad.
- The `Runtime` and `PG rating` rows info is still there, appended to the end of the 'IMDb summary' text (the 'Runtime' info is converted from: e.g. '118' to: 1h 58min).
- The `Year` row is hidden because that info is still contained in various other rows ('Release Name', 'IMDb' link title, 'Title')
- For reference, regarding the 'Trailer' row: When using ad-blocking extensions, https://rarbgproxy.org/trailers.php is blocked by default(via EasyList).
