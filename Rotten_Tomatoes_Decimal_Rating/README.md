*By default RottenTomatoes pages uses base 10 rating for TOMATOMETER and base-5 for AUDIENCE SCORE.*
This script changes the latter's base-5 to base-10, and modifies both relevant tooltips, in order to be perceived more easily.
It modifies these 3 elements:

- multiplies `x2` the AUDIENCE SCORE **Average Ratings**,
- appends `(=6 stars or higher)` to the TOMATOMETER **descriptive text**,
- modifies`3.5 stars or higher` to `7 stars or higher`, in the AUDIENCE SCORE **descriptive text**.

*Note 1: this script uses the [setMutationHandler](https://greasyfork.org/en/scripts/12228-setmutationhandler) function (by wOxxOm)
Note 2: after the new rottentomatoes.com layout (Feb. 25, 2019), since v4 the `// @run-at      document-start` rule is no longer needed.*

&nbsp;

Thanks a lot to wOxxOm: he initially wrote it ([v1](https://greasyfork.org/en/forum/discussion/comment/5975/#Comment_5975) and he also offered improvements ([v2](http://stackoverflow.com/a/32413134/3231411), [v3](https://greasyfork.org/en/forum/discussion/7583/x) and v4).

[Hosted in GitHub](https://github.com/darkred/Userscripts)
