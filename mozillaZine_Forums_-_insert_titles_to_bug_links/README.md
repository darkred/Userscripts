This userscript applies to forums.mozillazine.org.
It inserts titles to bug links that are plain URLs, in forums.mozillazine.org
i.e. instead of showing:
[https://bugzilla.mozilla.org/show_bug.cgi?id=1147820](https://bugzilla.mozilla.org/show_bug.cgi?id=1147820) it shows: [1147820 - [meta] Improve Storage ](https://bugzilla.mozilla.org/show_bug.cgi?id=1147820)
It also converts links with titles like [Bug 1147820](https://bugzilla.mozilla.org/show_bug.cgi?id=1147820)

Note: the request for each link is done asynchronously, i.e. Firefox UI is not locked and frozen until the request completes.

v1.1 Now, a spinning icon appears at the end of each bug link during the title request procedure:
During  the request :        ![](https://i.imgur.com/pQVnJyI.jpg)
After appending title![](https://i.imgur.com/9MwgmlB.jpg)