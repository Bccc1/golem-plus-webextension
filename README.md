# golem-plus-webextension

This can either be installed as webextension for Firefox or directly as UserScript in Greasemonkey.

Currently it tries to style the forum similar to Boost, an app to browse reddit.
It also adds Shortcuts to navigate between unread posts. j: next, k: previous.
A flaw of the indented view of the golem.de forum is that posts with a depth of 16 or higher aren't displayed correct but with a depth of ((depth-1)%15)+1. To circumvent this, if such an overflow is detected, the page is loaded as threadview in the background to retrieve the correct depths and then the page is loaded again in the correct view to reset the cookies to the correct view. This slows down the display, but only slightly, and this only happens seldomly.

![Preview of Style the script creates](https://raw.githubusercontent.com/Bccc1/golem-plus-webextension/master/doc/Screenshot-01.png)


## ToDo
This section is my ToDo list. If you're currently paying attention to these words, you're probably not me and you should stop reading. Seriously, it's just a boring todo list.
### Forum
- div.golem-forum_flattr > div.social-bar is too big. At least remove the style margin-bottom:1em from golem-forum_flattr. Or move flattr to the action bar.
- Detect Ads between comments. ATM with an adblocker there are blank gaps.
- Highlight name of OP
- Hightligh own name (thx Hotohori)
- Add a search button to the navigation to show own posts.
- Add inline answer options similar to reddit
- Add quote-reflow to custom answer box
### Article
- Make article image clickable and change link to bigger picture. (thumb is div.screen > div.g > figure.gasideimg > img  https://www.golem.de/1801/sp_132385-152538-i_rc.jpg, large is https://www.golem.de/1801/132385-152538-i_rc.jpg)

## Bugs
- Shortcuts are still active when typing (answer/quote feature)
