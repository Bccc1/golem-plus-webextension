# ToDo
This section is my ToDo list. If you're currently paying attention to these words, you're probably not me and you should stop reading. Seriously, it's just a boring todo list.
## Forum
- div.golem-forum_flattr > div.social-bar is too big. At least remove the style margin-bottom:1em from golem-forum_flattr. Or move flattr to the action bar.
- Detect Ads between comments. ATM with an adblocker there are blank gaps.
- Highlight name of OP
- Hightligh own name (thx Hotohori)
- Add a search button to the navigation to show own posts.
- Add inline answer options similar to reddit
- Add quote-reflow to custom answer box
## Article
- Show article image in a lightbox or use golems fullscreen mode used in picture galleries

# Bugs
- Shortcuts are still active when typing (answer/quote feature)

## inline answer:

https://forum.golem.de/kommentare/handy/bluetooth-ohrstoepsel-im-vergleichstest-apples-airpods-lassen-hoeren-und-staunen/nicht-nachvollziehbar/116816,5060504,5060504,read.html#msg-5060504



https://forum.golem.de/read.php?116816,5060504,5060504#REPLY_SHOWEDITOR


div#mod_hide_reply_editor


schnell antwort -> edit feld klappt aus.
post verfassen.
Post klicken
im hintergrund wird die url vom antworten knopf geladen, form#post-form gesucht, text in div#post-body > fieldset > span.inputTextarea > textarea#body  eingefügt, input#post-finish "geklickt".

Dann wird das erstellte Posting in das DOM gepackt ohne die Seite neu zu laden. Optional wird das Ergebnis des post ausgewertet und im fehlerfall angezeigt.
