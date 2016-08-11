*By default RottenTomatoes pages uses base 10 rating for TOMATOMETER and base-5 for AUDIENCE SCORE.*
This script changes the latter's base-5 to base-10, and modifies both relevant tooltips, in order to be perceived more easily.
It modifies these 3 elements:

- appends the descriptive text `(=6 stars or higher)` to the text of the TOMATOMETER **tooltip** 
- modifies the text, from `3.5 stars or higher` into `7 stars or higher`, inside the AUDIENCE SCORE **tooltip** 
- multiplies the AUDIENCE SCORE **Average Rating** `x2`

*Note 1: since v2 the script modifies the elements immediately after they are displayed (not after page completely loads).
Note 2: this script uses the [setMutationHandler](setMutationHandler) function (by wOxxOm)*

<br>
Thanks a lot to wOxxOm: he initially wrote it ([v1](https://greasyfork.org/en/forum/discussion/comment/5975/#Comment_5975)) and he also offered improvements ([v2](http://stackoverflow.com/a/32413134/3231411) and [v3](https://greasyfork.org/en/forum/discussion/7583/x))