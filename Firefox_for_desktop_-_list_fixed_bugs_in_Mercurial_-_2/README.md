This userscript applies to Mozilla Mercurial pushlog pages.

It generates a list of only the bugs related to Firefox for desktop in Mozilla Mercurial pushlogs.
It's basically for creating lists similar to the "The Official Win32 xxxxxxx builds"
in [Firefox Builds • mozillaZine Forums](http://forums.mozillazine.org/viewforum.php?f=23) but for any date interval.

<u>Example links where the script applies to:</u> *(changelogs for the last 1 day interval in these examples)*
**Nightly**: https://hg.mozilla.org/mozilla-central/pushloghtml?startdate=1+day+ago&enddate=now
**Inbound**: https://hg.mozilla.org/integration/mozilla-inbound/pushloghtml?startdate=1+day+ago&enddate=now
**fx-team**: https://hg.mozilla.org/integration/fx-team/pushloghtml?startdate=1+day+ago&enddate=now
**Aurora**: https://hg.mozilla.org/releases/mozilla-aurora/pushloghtml?startdate=1+day+ago&enddate=now
**Beta**: https://hg.mozilla.org/releases/mozilla-beta/pushloghtml?startdate=1+day+ago&enddate=now
**Release**: https://hg.mozilla.org/releases/mozilla-release/pushloghtml?startdate=1+day+ago&enddate=now

Also, (about the "enddate" value when you do such a search):
instead of putting "now" you may put the changeset of your currently installed build (via `about:buildconfig`|click on that link)
so that you may view only the bugs that have been fixed <u>till your current build</u> - *not those that have been fixed til the current time <u>in the relevant branch</u>*.

For example: (for inbound) instead of using:
`https://hg.mozilla.org/integration/mozilla-inbound/pushloghtml?startdate=1+day+ago&enddate=now`
you may enter this: *(it's for the changeset of [this build](https://hg.mozilla.org/integration/mozilla-inbound/rev/c4dd82aa903d89b3835ceb38cf0341a4190c383e))*
`https://hg.mozilla.org/integration/mozilla-inbound/pushloghtml?startdate=1+day+ago&enddate=c4dd82aa903d`

<br/>
Screenshots of the resulting list:
[![](https://i.imgur.com/vRuWsuQh.jpg)](https://i.imgur.com/vRuWsuQ.jpg)
and screenshot of progress logging in Web Console:
[![](https://i.imgur.com/D2sUx46h.jpg)](https://i.imgur.com/D2sUx46.jpg)

During the procedure, you may open the Web Console (Ctrl+Shift+K) to monitor progress.

Notes:

1. The requests for each link are done asynchronously, i.e. Firefox UI is not locked and frozen until the request completes. Also, the procedure completes quickly (multiple connections).
After [v4](https://greasyfork.org/en/scripts/13169-firefox-for-desktop-list-fixed-bugs-in-mercurial?version=85976) (thanks to johnp) it now uses the Bugzilla REST API, therefore resulting in huge reduction to the procedure duration (a few seconds for parsing hundreds of bugs), i.e.:
 - requests from Bugzila only those fields that it requires *(not entire HTML pages)*,
 - uses one network connection for all examined bugs *(using the format=multiple GET-Parameter)* and
 - parses the response as JSON*

2. Since v4.2 it now stores the list content HTML code to clipboard.
(_You may uncomment (line 11 and) 157 to enable this new feature_)
This feature is aimed to MozillaZine daily "The Official Win32 xxxxxxx builds" maintainer :
so, you may do these easy steps in order to produce the Nightly thread:
 - Go to e.g. http://www.garyshood.com/htmltobb/, paste the HTML code, and press "Submit HTML":
it will be converted to BBCode. Copy that to clipboard (Ctrl+C).
 - Then, open Notepad++, paste the newly copied content. Now, by following ![this](http://stackoverflow.com/a/26224391), you may append numbering to each line. [i](i.e. first, select all `Ctrl+A`. Then go to `Edit->Column Editor`. Choose the "Number to Insert" button, then choose the starting value (`1`) and the increment (`1`). It will add numbering to each line)[/i]
 - Finally, by pressing Alt+dragging down, you may do a vertical selection ([screenshot](https://i.imgur.com/GhrnacT.png)),
so that you may append a dot (`.`) _(and a space where necessary)_ after each line numbering.

3. You may also check [v5.5.2](https://greasyfork.org/en/scripts/13169-firefox-for-desktop-list-fixed-bugs-in-mercurial) (for all channels) or [v5.5.3](https://greasyfork.org/en/scripts/15715-firefox-for-desktop-list-modified-bugs-in-mercurial-inbound) (especially for inbound users) :
since v5 the results are displayed as a sortable table (instead of a plain list),
showing in an extra column the "Last Modified Date" of each bug, the values of which are converted to relative time (_e.g, "1 hour ago"_) taking account the user's timezone. (I've created a custom sorter for this extra column).
By default it's sorted by "Modified Date" and "Product:Component"(and by "Summary") - _as a mozilla-inbound user I find this most practical because this way I can check whether any notable bugs have been just fixed, and therefore if it's worth downloading the latest m-i build_.
But, you may sort the table as you wish: you can sort multiple columns simultaneously by holding down the Shift key and clicking a 2nd, 3rd or even 4th column header.


<br/>**The procedure:**
- gets all bug links in the page and de-duplicates them
- sends 1 request to Bugzilla for all the above bug links, requesting only the few fields that it requires
_(id, summary, status, resolution, product, component, op sys, platform, whiteboard, last change time)_
- filters out the irrelevant bugs based on the response
- finally it displays the results in a sortable table using a jQuery dialog
where it's sorted by default by *Modified Date*, *Product: Component* and *Summary*.
*(for the "Modified Date" column, the following libraries are used: [tablesorter](http://mottie.github.io/tablesorter/docs/), [moment.js](http://momentjs.com/), [moment-timezone.js](http://momentjs.com/timezone/), [jsTimezoneDetect](https://bitbucket.org/pellepim/jstimezonedetect), [date.js](http://www.datejs.com/)) and [Keypress](https://github.com/dmauro/Keypress/)*.

<br/>
**What it considered relevant/irrelevant**:
*(info provided kindly by winapp2 and Josa, both maintainers (the first no longer) of the "[Official Win32 build](http://forums.mozillazine.org/viewforum.php?f=23)" threads)*


<u>Relevant `Status` values</u>
- RESOLVED
- RESOLVED FIXED
- VERIFIED
- VERIFIED FIXED

<u>Relevant `Product` values</u>
- Add-on SDK
- Cloud Services
- Core
- Firefox
- Hello (Loop)
- Toolkit


<u>Relevant `Component` value</u> (belonging to Product: Core)
- Embedding:APIs

<u>Irrelevant `Component` values</u> (all belonging to Product: Core)
- AutoConfig
- Build Config
- DMD
- Embedding: GRE Core
- Embedding: Mac
- Embedding: MFC Embed
- Embedding: Packaging
- Hardware Abstraction Layer
- mach
- Nanojit
- QuickLaunch
- Widget: Gonk

Irrelevant are also considered bugs with <u>restricted access</u> <i>(you may find the bugs which were filtered out for being private, by opening Web Console and enter 'requires authorization' in the 'Filter output' textbox. Then you may click on the relevant links to open them (those that you have access to).</i>


<br/>
Thanks a lot to:
- wOxxOm for his help in [here](https://greasyfork.org/en/forum/discussion/6616/help-with-making-a-function-wait-until-all-gm-xmlhttprequest-requests-are-fully-completed),
- Brock Adams for his help on [this](http://stackoverflow.com/questions/33347825/jquery-ui-dialog-in-a-userscript-for-greasemonkey-missing-close-button) i.e. [this](http://stackoverflow.com/a/25468298/3231411), and
- johnp for modifying my code thus offering [v4](http://forums.mozillazine.org/viewtopic.php?p=14397041#p14397041) and [v4.1](http://forums.mozillazine.org/viewtopic.php?p=14397041#p14397041) that is [here](http://pastebin.com/5LwQUsLF). Your contribution is most appreciated!