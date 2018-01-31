// ==UserScript==
// @name     Golem.de Article+
// @author Bccc1
// @version  1.0.0
// @license MIT
// @homepageURL https://github.com/Bccc1/golem-plus-webextension
// @supportURL https://github.com/Bccc1/golem-plus-webextension/issues
// @grant    none
// @match    https://golem.de/news/*
// ==/UserScript==


var image = document.querySelector("div#screen > div.g > figure#gasideimg > img");
var link = document.createElement("a");
link.href = image.src.replace("/sp_","/");
image.parentNode.insertBefore(link,image);
link.appendChild(image);
