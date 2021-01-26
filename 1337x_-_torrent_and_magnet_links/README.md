Adds a column with torrent and magnet links in 1337x lists: 
![](https://i.imgur.com/S4nzRP8.jpg)

Notes: 

- The script generates all links via XHR:
  - The DL/ML links will have: 
    - initially, as its destination (`href`) a: `javascript:void(0)`, 
    - as tooltip: "`DL/ML via XHR`".
  - As you click a DL/ML icon, the relevant target page will be retrieved via XHR in the background (so, after clicking an icon, it will now have the magnet link).  
- Thanks to NotNeo: most of the CSS used is taken from this script https://greasyfork.org/en/scripts/373230-1337x-magnet-torrent-links-everywhere .
