# golem-plus-webextension

This can either be installed as webextension for Firefox or directly as UserScript in Greasemonkey.

Currently it tries to style the forum similar to Boost, an app to browse reddit.
It also adds Shortcuts to navigate between unread posts. j: next, k: previous.
A flaw of the indented view of the golem.de forum is that posts with a depth of 16 or higher aren't displayed correct but with a depth of ((depth-1)%15)+1. To circumvent this, if such an overflow is detected, the page is loaded as threadview in the background to retrieve the correct depths and then the page is loaded again in the correct view to reset the cookies to the correct view. This slows down the display, but only slightly, and this only happens seldomly.

## ToDo
- div.golem-forum_flattr > div.social-bar is too big. At least remove the style margin-bottom:1em from golem-forum_flattr. Or move flattr to the action bar.
- Detect Ads between comments. ATM with an adblocker there are blank gaps.
- Highlight name of OP
- Hightligh own name (thx Hotohori)
- 
