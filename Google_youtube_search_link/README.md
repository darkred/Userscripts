This script is a fork of [Google youtube search link](https://greasyfork.org/en/scripts/7784-google-youtube-search-link) by wOxxOm.  
Thanks to wOxxOm for the initial version.

---

This script applies to Google search (using any language).

It inserts a `YouTube` link next to the `Videos` one, i.e. `Videos | YouTube`  
in order to search for the given criteria in YouTube.   
_It doesn't rearrange the rest links (see note)._ 


i.e.  if you type something in google search that looks like you're searching for _images_,
the links will become:  
`All | Images | Videos | YouTube | etc`

If it looks like you're looking for _videos_, the links will become:  
`All | Videos | YouTube | Images | etc`

If you type something that looks like an _address_, the links will become:  
`All | Maps | Images | Videos | YouTube | News | More`

If you type something that's related to some recent _news_, the links will become:  
`All | News | Images | Videos | YouTube | Maps | More`

And, if you type a _book_ title then the links will become:    
`All | Images | Videos | YouTube | Books | News | More`


<br>

_Note: The initial script was offering:_
- _either (by default) to re-arrange links so that the Images, Videos, Youtube links to always be on 2nd, 3rd, 4th places,   
which was breaking the Google's default tabs order (which takes into account the kind of search criteria that you have entered)   
and is removed in this fork._
- _or to add the YouTube link after all existing links, to the right (with some spacing in between)._
