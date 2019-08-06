This userscript applies mainly to RARBG torrent detail pages, e.g. `https://rarbgproxy.org/torrent/fmzeqtk`: it rearranges various entries, displays in bold the various rating values, renames a few entries more suitably and uses decimal rating for the users' ratings.
Also, in torrent listings, the Recommended section now links to search by IMDb id (instead of each torrent page).
Finally, in search-by-IMDb-id pages (e.g. https://rarbgproxy.org/torrents.php?imdb=tt0448115) , the `IMDb` in "IMDb Rating" becomes a link to relevant IMDb movie page and the IMDb plot summary is displayed.

Notes:  
- The script makes use of the page's jQuery 1.11.3.
- The `Size` row gets duplicated below the 'Torrent' row.
- Regarding the `Rating` row: the five star rating is converted to ten star, both the stars themselves and the text value, but, if you hover the mouse over the stars to click to rate the movie, still only the first five stars are clickable, i.e. it's actually still five star rating.
- The `Runtime` and `PG rating` rows info is appended to the end of the 'IMDb summary' row text (the 'Runtime' info is converted from: e.g. '118' to: 1h 58min).
- The `Year` row becomes hidden because that info is still contained in various other rows ('Release Name', 'IMDb' link title, 'Title')
- The `VPN` row *(not shown in the 'initial' screenshot)* becomes hidden because it's an ad.
- Regarding the `Trailer` row: when using ad-blocking extensions, https://rarbgproxy.org/trailers.php is blocked by default via EasyList. So, in previous script versions the 'Trailer' row was getting hidden by the script. Since v2018.9.6.2 it's been restored (per https://greasyfork.org/en/forum/discussion/42158/x ) 
- The Recommended section (in torrent listings) would link to each torrent page. Now it links to search by IMDb id (per request: https://github.com/darkred/Userscripts/issues/8). 
- Also now, in search-by-IMDb-id pages (e.g. https://rarbgproxy.org/torrents.php?imdb=tt0448115) , the `IMDb` in "IMDb Rating" becomes a link to relevant IMDb movie page. Also, now, below it, the IMDb plot summary is displayed (retrieved from the relevant RARBG torrent page).

Screenshot comparison: 
Initial: 
[![](https://i.imgur.com/T2pb0tHl.jpg)](https://i.imgur.com/T2pb0tH.jpg)

With the script: 
[![](https://i.imgur.com/iBJt3Hwl.jpg)](https://i.imgur.com/iBJt3Hw.jpg)