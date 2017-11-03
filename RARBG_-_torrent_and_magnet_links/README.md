Adds a column with torrent and magnet links in RARBG lists: 
![](https://i.imgur.com/JpNCgIe.jpg)

Notes: 

- the script generates the magnet links in two ways: 
  - for most torrent entries, it generates it directly from the current page *(i.e. from the filename of the thumbnail image that appears when you mouseover on the torrent title, and that's because these filenames are the same as the relevant torrent hash)* . 
  - For some torrent entries however, the thumbnail filename is generic (i.e. it doesn't contain the torrent hash), so the magnet link cannot be generated directly.  
  In such cases, in order to get the magnet link, the target torrent page is retrieved via xhr:  
as you mouseover on the ML icon for such entries,  
initially it will have the current page's URL in the status bar with a `#` in its end (e.g. `https://rarbg.to/torrents.php#` )  
and the following tooltip will be displayed: "`ML generated via an ajax request`".  
During that time the target page will be retrieved via xhr in the background,  
and so if you click the ML icon (or just move the mouse away and re-mouseover), it will now have the magnet link.  
*(thanks for sxe [for the suggestion](https://greasyfork.org/en/forum/discussion/30691/x))*.
