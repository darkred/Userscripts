Adds a column with torrent and magnet links in 1337x lists:  
![](https://i.imgur.com/goYAFQH.jpg)

Notes:

- The script generates all links via XHR:
  - The DL/ML links will have:  
     - as tooltip: "`ml/dl via xhr`".
     - as destination (href):
         - initially: `javascript:void(0)` *(to avoid taking the user back to the top of the page, which occurred if having `#`, instead)*,
         - as you click a ml/dl icon, the relevant target URL will be retrieved via XHR in the background.  
- Thanks to: 
  - NotNeo: most of the CSS is from his [1337X - Magnet/Torrent links everywhere](https://greasyfork.org/en/scripts/373230-1337x-magnet-torrent-links-everywhere) script,
  - barn852 for [this](https://greasyfork.org/en/scripts/420754-1337x-torrent-and-magnet-links/discussions/96026) contribution .
- Tampermonkey and Violentmonkey are supported - Greasemonkey is NOT supported.

[Hosted at GitHub](https://github.com/darkred/Userscripts)
