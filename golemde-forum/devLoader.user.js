// ==UserScript==
// @name         DevLoader Golem.de Forum+
// @namespace    github.com/Bccc1
// @version      1.0
// @description  Loades the webpack-userscript-bundle from the dev-server
// @author       freund17
// @match    https://forum.golem.de/kommentare/*read.html*
// @match    https://forum.golem.de/read.php?*
// @match    https://forum.golem.de/sonstiges/bolzplatz/*read.html*
// @noframes
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==


(function() {
    'use strict';

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://localhost:4444/golemde-forum.js',
        onload: function(response) {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.innerHTML = response.responseText;
            document.getElementsByTagName('body')[0].appendChild(s);
        }
    });
})();
