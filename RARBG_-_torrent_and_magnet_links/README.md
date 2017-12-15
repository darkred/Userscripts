Adds a column with torrent and magnet links in RARBG lists: 
![](https://i.imgur.com/JpNCgIe.jpg)

Notes: 

- the script generates the magnet links in two ways: 
  - for most torrent entries, it generates it directly from the current page  
  *(i.e. from the filename of the thumbnail image that appears when you mouseover on the torrent title, and that's because these filenames are the same as the relevant torrent hash)* .  
  - For some torrent entries however, the thumbnail filename is generic (i.e. it doesn't contain the torrent hash),  
  therefore the magnet link cannot be generated directly.  
  In such cases, in order to get the magnet link, the target torrent page is retrieved via XHR :  
initially the ML links will have as its destination(`href`) the current page's URL with a `#` in its end (e.g. `https://rarbg.to/torrents.php#` )  
and as you mouseover on any such ML icon, the following tooltip will be displayed: "`ML via XHR`", and the relevant target page will be retrieved via XHR in the background.  
So at the time you click the ML icon (or just move the mouse away and re-mouseover), it will now have the magnet link.  
*(thanks to sxe [for the suggestion](https://greasyfork.org/en/forum/discussion/30691/x))*.
