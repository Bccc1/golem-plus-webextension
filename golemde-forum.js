// ==UserScript==
// @name     Golem.de Forum+
// @version  1
// @grant    none
// @match    https://forum.golem.de/kommentare/*read.html*
// @match    https://forum.golem.de/read.php?*
// ==/UserScript==


/*
TODO
div.golem-forum_flattr > div.social-bar muss irgendwie optisch angepasst werden. ist zu fett. Mindestens auf golem-forum_flattr aus dem style margin-bottom:1em rausnehmen. besser flattr in action bar verschieben.

Werbung zwischen den Kommentaren erkennen. (Momentan werden die mit einer depth von 0 dargestellt)

shortcuts reparieren
*/


/*
 * Detect if logged in. This is needed for the viewmode detection.
 */
var isLoggedIn = true;
if(document.querySelector("input[value=Login]")) isLoggedIn = false;
console.log("is logged in: "+isLoggedIn);

/*
 * Detect view mode. only do stuff if viewmode is indented.
 * Otherwise just display a info that this userscript requires indented view.
 */
var correctViewmode = true;


var preThreadLinks = document.querySelectorAll("p#pre-thread > a");
if(preThreadLinks){
  var changeViewModeLink;
  for(var i=0; i<preThreadLinks.length; i++){
    if(preThreadLinks[i].textContent == "Ansicht wechseln"){
      changeViewModeLink = preThreadLinks[i];
      break;
    }
  }
  if(changeViewModeLink){
    //extract number
    var nextViewMode = changeViewModeLink.href.slice(changeViewModeLink.href.lastIndexOf("#")-1,changeViewModeLink.href.lastIndexOf("#"));
    if(isLoggedIn){
      //logged in 3, links to 2
      if(nextViewMode == "2"){
        correctViewmode = true;
      }else {
        correctViewmode = false;
        var correctChangeViewModeLink = "";
        correctChangeViewModeLink += changeViewModeLink.href.slice(0,changeViewModeLink.href.lastIndexOf("#")-1);
        correctChangeViewModeLink += "3";
        correctChangeViewModeLink += changeViewModeLink.href.slice(changeViewModeLink.href.lastIndexOf("#"), changeViewModeLink.href.length);
        addChangeViewModeButton(correctChangeViewModeLink);
      }
      //p#pre-thread > a (innerHTML is Ansicht wechseln). access href. "https://forum.golem.de/read.php?115321,5007333,5007333,sv=2#msg-5007333"
      //extract viewmode
      changeViewModeLink.href.lastIndexOf("#")
    }else {
      //anonymous 2, links to 1
      if(nextViewMode == "1"){
        correctViewmode = true;
      }else {
        correctViewmode = false;
        var correctChangeViewModeLink = "";
        correctChangeViewModeLink += changeViewModeLink.href.slice(0,changeViewModeLink.href.lastIndexOf("#")-1);
        correctChangeViewModeLink += "2";
        correctChangeViewModeLink += changeViewModeLink.href.slice(changeViewModeLink.href.lastIndexOf("#"), changeViewModeLink.href.length);
        addChangeViewModeButton(correctChangeViewModeLink);
      }
      //"https://forum.golem.de/read.php?115321,5007333,5007333,anonymous_threaded_read=2#msg-5007333"
      //extract viewmode
    }
  }
}
console.log("correct Viewmode: "+correctViewmode);

function addChangeViewModeButton(link){
  console.log("called addChangeViewModeButton ");

  //link should already be the correct one
  var newNode = document.createElement("div");
  newNode.style.background = "#e3f1f6";
  newNode.style.border = "1px solid #d2e5ec";
  newNode.style.color = "#00abea";
  newNode.style.padding ="15px 20px";

  var textElement = document.createElement("p");
  var boldElement = document.createElement("b");
  var textContent = document.createTextNode("Das Golem.de Forum+ UserScript funktioniert nicht in dieser Ansicht.");
  var linkContent = document.createTextNode("Um zur passenden Ansicht zu wechseln, klicken Sie hier.");
  var linkElement = document.createElement("a");
  linkElement.style.color = "#00abea";
  linkElement.href=link;
  linkElement.appendChild(linkContent);
  textElement.appendChild(boldElement);
  boldElement.appendChild(textContent);
  newNode.appendChild(textElement);
  newNode.appendChild(linkElement);
  var referenceNode = document.querySelector("ol.list-pages");
  referenceNode.parentNode.insertBefore(newNode, referenceNode);
}



//for shortcut navigation
var currPos = -1;
var headerList = document.querySelectorAll(".message-new");


/*
 * Assign Depth for each post
 * div thread-detail ol li padding-left / 20 => depth
 */
var threadDetail = document.getElementById("thread-detail");
var liItems = threadDetail.querySelectorAll("div#thread-detail > ol > li[data-user-id]");   //threadDetail.getElementsByTagName("li");
var httpRequestRequired = false;

/*
 * Add optical highlights
 */
var colorLookup = [];
colorLookupDefault = "transparent";
colorLookup[0] = "#1ccdff";
colorLookup[1] = "#54ff00";
colorLookup[2] = "#ffc300";
colorLookup[3] = "#ff0000";
colorLookup[4] = "#c700ff";
// loop through 1 to 5 / second to last



/*
 * Stuff in here is the actual userscript.
 */
if(correctViewmode){

  for(var i=0; i < liItems.length; i++) {
    var depth = parseInt(liItems[i].style.paddingLeft,10) / 20;
    liItems[i].setAttribute("depth", depth);
    if(i>0 && depth == 1){
      //only the root element i=0 should have a depth of 1
      //if this condition is true, an overflow happened and a depth of 16 was interpreted as 1
      httpRequestRequired = true;
    }
  }

  // increase overall width by 10px;
  // document.getElementById("screen").style.width = "990px";
  // document.getElementById("forum-main").style.width = "630px";

  threadDetail.style.borderWidth="0px";
  threadDetail.style.backgroundColor="transparent";


  if(httpRequestRequired){
   requestThreadAsView(1,requestDepthsFromThreadViewListener);
   //the stuff from the else branch is called in a callback of requestDepthsFromThreadView
  }else {
   applyDepthAndAddActionBar();
   insertActionBarStyles();
  }


  //Shortcut Section
  if (document.addEventListener ){
    document.addEventListener('keydown', function(e) {
      if (e.which == 74) jumpToNext();
    });
  }

  if (document.addEventListener ){
    document.addEventListener('keydown', function(e) {
      if (e.which == 75) jumpToPrevious();
    });
  }

}


function applyDepthAndAddActionBar(){
  for(var i=0; i < liItems.length; i++) {
    var depth = parseInt(liItems[i].getAttribute("depth"),10);

    liItems[i].style.paddingLeft="20px";
    liItems[i].style.marginLeft= (depth-1)*5+"px";
    liItems[i].style.backgroundColor="rgb(249, 249, 249)";
    //liItems[i].style.borderLeftColor="orange";
    liItems[i].style.borderLeftWidth="5px";
    liItems[i].style.borderLeftStyle="solid";
    if(depth == 1){
      liItems[i].style.borderLeftColor=colorLookupDefault;
    }else{
      var colorLookupIndex = (depth - 2) % colorLookup.length;
      liItems[i].style.borderLeftColor=colorLookup[colorLookupIndex];
    }

    // move links to actionBar, which is only visible on :hover
    var links = liItems[i].getElementsByClassName("links")[0];
    var actionBar = document.createElement("div");
    if(links){
      actionBar.innerHTML=links.innerHTML;
      actionBar.classList.add("links");
      actionBar.classList.add("post-hover-class");
      actionBar.style.cssText=liItems[i].style.cssText;
      actionBar.style.backgroundColor="rgb(255, 249, 214)";
      links.parentNode.removeChild(links);

      //jump to parent
      actionBar.innerHTML=actionBar.innerHTML+"|"; //spacer
      var toParentBtn = document.createElement("a");
      toParentBtn.innerHTML="▲";
      toParentBtn.href="javascript:void(0);";
      toParentBtn.onclick=jumpToParent;
      toParentBtn.classList.add("link-class");
      actionBar.appendChild(toParentBtn);

      insertAfter(actionBar, liItems[i]);
    }else{
      //there are no links. Probably not logged in.
      //actionBar.style.backgroundColor="rgb(255, 0, 0)";
      //actionBar.innerHTML="Fehler: Das \"links\" Element konnte nicht gefunden werden.";
    }
  }
}

function insertActionBarStyles(){
  // add styleclass for .post-hover-class
  insertCss('.post-hover-class { display: none; }');
  insertCss('.post-hover-class a { color: rgb(76, 76, 76); }');
  insertCss('li:hover + .post-hover-class { display: block; padding: 10px 20px; }');
  insertCss('.post-hover-class:hover { display: block; padding: 10px 20px; }');
  insertCss('.link-class:hover { text-decoration: none; }');
}



/**
view is a number indicating the viewmode, with 1=thread view, 2=just the posts, 3=the posts indendented.
The listener is an optional callback that is called, once the page loaded.
The page content can be accessed in the listener with this.responseXML
*/
function requestThreadAsView(view,listener){
  var url = window.location.href;
  var appendix = url.slice(url.lastIndexOf("/")+1,url.length);
  //after that appendix is "115321,5007333,5007333,read.html#msg-5007333"
  if(isLoggedIn){
    appendix = appendix.replace("read.html", "sv="+view);
    //after that appendix is "115321,5007333,5007333,sv=1#msg-5007333"
  }else {
    //if not logged in, the url should use anonymous_threaded_read instead of sv
    //and the viewmode numbers are different: 1 thread, 2 indented, 3 plain
    switch (view) {
      case 2:
        view = 3;
        break;
      case 3:
        view = 2;
        break;
      default:
        view = 1;
    }
    appendix = appendix.replace("read.html", "anonymous_threaded_read="+view);
  }

  var oReq = new XMLHttpRequest();
  if(listener){
    oReq.addEventListener("load", listener);
    oReq.open("GET", "https://forum.golem.de/read.php\?"+appendix);
    oReq.responseType = "document";
  }else {
    oReq.open("HEAD", "https://forum.golem.de/read.php\?"+appendix);
  }
  oReq.send();
}

function requestDepthsFromThreadViewListener () {
  var tableListthread = this.responseXML.getElementsByClassName("table-listthread")[0];
  var nodes = tableListthread.querySelectorAll("tbody > tr:not(:first-child)");

  // table.table-listthread > tbody > alle tr außer dem ersten sind die nodes
  //die anzahl der img objecte in node > td > div.indent scheint die depth zu sein


  //defaultView: li > h4 die id vom h4 ist msg-5007355
  //thread view: tr > td > h3 die id vom h3 ist msg-5007355

  //Performance wise this is shit, but I'm lazy.
  //go trough all li items, search for the message id in the nodes, apply depth. if messageId can't be found in nodes, mark the post and log it.

  for(var l=0; l < liItems.length; l++) {
    var header = liItems[l].getElementsByTagName("h4")[0];
    var msgId = header.id;
    var found = false;
    for(var n=0; n < nodes.length; n++) {
      var nodeMsgId = nodes[n].querySelectorAll("td > h3")[0].id;
      if(nodeMsgId == msgId){
        var imgNodes = nodes[n].querySelectorAll("td > div.indent > img");
        var depth = imgNodes.length;
        liItems[l].setAttribute("depth", depth);
        found = true;
        break;
      }
    }
    if(!found){
      console.log("msgId "+msgId+" could not be mapped");
    }
  }


  requestThreadAsView(3); //reset view to correct mode

  applyDepthAndAddActionBar();
  insertActionBarStyles();
}




function insertCss( code ) {
    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        // IE
        style.styleSheet.cssText = code;
    } else {
        // Other browsers
        style.innerHTML = code;
    }

    document.getElementsByTagName("head")[0].appendChild( style );
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function jumpToParent(){
  var li = this.parentElement.parentElement;
  var depthOfThis = parseInt(li.getAttribute("depth"),10);
  if(depthOfThis==1) {return;} //if first post, do nothing
  var msgId = li.getElementsByClassName("head2")[0].getAttribute("id");



  var index = -1;
  for(var i=0; i < liItems.length; i++) {
    if(liItems[i].getElementsByClassName("head2")[0].getAttribute("id")==msgId){
      index=i;
      break;
    }
  }
  for(var i=index-1; i >= 0; i--){
    var tmpDepth = parseInt(liItems[i].getAttribute("depth"),10);
    if(tmpDepth+1==depthOfThis){
      liItems[i].scrollIntoView();
      break;
    }
  }
}






function clamp(num, min, max) {
   return num <= min ? min : num >= max ? max : num;
 }



jumpToNext = function() {
  currPos++;
  headerList = document.querySelectorAll(".message-new");
  currPos = clamp(currPos,0,headerList.length-1);
  //console.warn(list.length);
  var currElem = headerList[currPos];
  highlightEntry(currElem);
  currElem.scrollIntoView();
  //window.scrollBy(0, -60);

}

jumpToPrevious = function() {
  currPos--;
  headerList = document.querySelectorAll(".message-new");
  currPos = clamp(currPos,0,headerList.length-1);
  //console.warn(list.length);
  var currElem = headerList[currPos];
  highlightEntry(currElem);
  currElem.scrollIntoView();
  //window.scrollBy(0, -60);
}

function JumpToNextComment(){
	//thread id = first messageId of thread
	threadId = document.querySelector("h4:first-of-type").id;
	forumId = document.querySelector("#gsu").elements["forum_id"].value;
	lastVisitedMessageKey = "lastVisitedMessage,f:"+forumId+",t:"+threadId;

	if(sessionStorage[lastVisitedMessageKey]){
		//if this is a page refresh, ignore sessionStorage.lastVisitedMessage and do the same as in the else branch
		var lastVisitedMessageHeader = document.getElementById(sessionStorage[lastVisitedMessageKey]);
		if(lastVisitedMessageHeader != null && lastVisitedMessageHeader.classList.contains("message-new")){
		   //normal behaviour, go to next message-new
			var headerList = document.querySelectorAll(".message-new");
			for (var i = 0; i < headerList.length; ++i) {
				var item = headerList[i];
				if(item.id==sessionStorage[lastVisitedMessageKey]){
					console.log("found something");
					var header = headerList[i+1];
					if(header){
						sessionStorage[lastVisitedMessageKey] = header.id;
						header.scrollIntoView();
						HighlightMessage(header.id);
					}
					break;
				}
			}
		}else{
			//this is a page refresh, ignore sessionStorage.lastVisitedMessage and do the same as in the else branch
			var header = document.querySelector(".message-new");
			sessionStorage[lastVisitedMessageKey] = header.id;
			header.scrollIntoView();
			HighlightMessage(header.id);
		}
	}else{
		var header = document.querySelector(".message-new");
		sessionStorage[lastVisitedMessageKey] = header.id;
		header.scrollIntoView();
		HighlightMessage(header.id);
    highlightEntry(header);
	}
}


function HighlightMessage(messageId){
	alert("highlight #".concat(messageId));
}

highlightEntry = function(element) {
  element.style.color = "red";
  var parent = element.parentNode;
  parent.style.backgroundColor = "#fffcd8";
  origBGColor     = {r:249, g:249, b:249};
  yellowishColor  = {r:255, g:252, b:216};
  whiteColor      = {r:255, g:255, b:255};
  blackColor      = {r:  0, g:0,   b:  0};
  redColor        = {r:255, g:0,   b:  0};
  blueishColor    = {r: 51, g:122, b:183};
  setTimeout(function() {
    fade(parent, 'background-color', yellowishColor, origBGColor, 1000);
  }, 500);
  setTimeout(function() {
    fade(element, 'color', redColor, blackColor, 1000);
  }, 500);
}

// linear interpolation between two values a and b
// u controls amount of a/b and is in range [0.0,1.0]
lerp = function(a, b, u) {
  return (1 - u) * a + u * b;
};

fade = function(element, property, start, end, duration) {
  var interval = 10;
  var steps = duration / interval;
  var step_u = 1.0 / steps;
  var u = 0.0;
  var theInterval = setInterval(function() {
    if (u >= 1.0) {
      clearInterval(theInterval)
    }
    var r = parseInt(lerp(start.r, end.r, u));
    var g = parseInt(lerp(start.g, end.g, u));
    var b = parseInt(lerp(start.b, end.b, u));
    var colorname = 'rgb(' + r + ',' + g + ',' + b + ')';
    element.style.setProperty(property, colorname);
    u += step_u;
  }, interval);
};
