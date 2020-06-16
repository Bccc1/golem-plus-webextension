# golem-plus-webextension

This can either be installed as webextension for Firefox or directly as UserScript in Greasemonkey.

Currently it tries to style the forum similar to Boost, an app to browse reddit.
It also adds Shortcuts to navigate between unread posts. j: next, k: previous.
A flaw of the indented view of the golem.de forum is that posts with a depth of 16 or higher aren't displayed correct but with a depth of ((depth-1)%15)+1. To circumvent this, if such an overflow is detected, the page is loaded as threadview in the background to retrieve the correct depths and then the page is loaded again in the correct view to reset the cookies to the correct view. This slows down the display, but only slightly, and this only happens seldomly.

![Preview of Style the script creates](https://raw.githubusercontent.com/Bccc1/golem-plus-webextension/master/doc/Screenshot-01.png)

## How to compile the sources yourself
I'm only releasing a new version if I think it could be at least a bit stable. Maybe I'll build a nightly build with TravisCI sometime, but for now, if you want to benefit from all those experimental broken things I've hacked in, you'll have to build the script yourself. 

The userscript is developed using node, npm, fusebox and some other node modules. 
This means, you have to install node and npm.
In a shell/cmd cd to the folder golemde-forum and execute 'npm install'.
This installs all dependencies.
To build the userscript, execute 'node fuse dist'. It will create a 'golemde-forum.user.js' in 'golemde-forum\dist'.

As I'm using this project to learn all this js stuff and never used node/npm/fusebox before, the config may be wierd, but I'm open for improvement suggestions ;)