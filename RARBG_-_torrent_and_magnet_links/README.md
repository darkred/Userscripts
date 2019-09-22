Adds a column with torrent and magnet links in RARBG lists: 
![](https://i.imgur.com/JpNCgIe.jpg)

Notes: 
- *(Initialy most of the ML links could be generated from the page itself ((i.e. from the filename of the thumbnail image that appeared when you mouseover on the torrent title, and that's because these filenames were the same as the relevant torrent hash)* ). Since 2/1/2019 that's no longer possible, due to the site's latest HTML changes).
- So, from now on, the script generates all links via XHR:
  - The DL/ML links will have: 
    - initially, as its destination (`href`) a: `javascript:void(0)` *(to avoid taking the user back to the top of the page, something that previously occured when I had a `#` as href, instead)*, 
    - as tooltip: "`DL/ML via XHR`".
  - As you click a DL/ML icon, the relevant target page will be retrieved via XHR in the background (so, after clicking an icon, it will now have the magnet link).  
  *(thanks to sxe [for the initial suggestion](https://greasyfork.org/en/forum/discussion/30691/x))*.
- Since 4/27/2019 it uses the [arrive.js](https://github.com/uzairfarooq/arrive) library in order to work in TV Browser pages too.
