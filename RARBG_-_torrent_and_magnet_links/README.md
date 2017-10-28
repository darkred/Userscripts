Adds a column with torrent and magnet links in RARBG lists:  
![](https://i.imgur.com/JpNCgIe.jpg)

Notes: 

- the script generates the magnet links in two ways: 
  - for most torrent entries, it generates it from the filename of the thumbnail images that appears when you mouseover on the torrent title  
*(because these filenames are the same as the relevant torrent hash)*.  
  - For some torrents however, the thumbnail filename is generic (i.e. it doesn't contain the torrent hash), so the magnet link cannot be generated directly.  
In such cases the target torrent page is retrieved via xhr, in order to get the magnet link:  
as you mouseover on the ML icon for such entries, initially it will have the current page's URL in the status bar  
and the following tooltip will be displayed: "`ML generated via an ajax request`".  
During that time the target page will be retrieved via xhr in the background,  
and so if you click the ML icon (or just move the mouse away and re-mouseover), it will now have the magnet link.
