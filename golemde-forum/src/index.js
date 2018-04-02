'use strict';
import * as Utils from './utils.js'
require('./main.css')

var LOG = process.env.NODE_ENV === 'development' ? console.log.bind(console) : function () {};


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
if(document.querySelector('input[value=Login]')){ isLoggedIn = false; }
LOG('is logged in: '+isLoggedIn);

/*
 * Detect view mode. only do stuff if viewmode is indented.
 * Otherwise just display a info that this userscript requires indented view.
 */
var correctViewmode = true;


var preThreadLinks = document.querySelectorAll('p#pre-thread > a');
if(preThreadLinks){
  var changeViewModeLink;
  for(var i=0; i<preThreadLinks.length; i++){
    if(preThreadLinks[i].textContent == 'Ansicht wechseln'){
      changeViewModeLink = preThreadLinks[i];
      break;
    }
  }
  if(changeViewModeLink){
    //wir sind nur im richtigen, wenn in div#thread-detail ol li der style padding-left gesetzt ist
    var firstLi = document.querySelector('div#thread-detail ol li');
    if(firstLi && firstLi.style.paddingLeft){
      correctViewmode = true;
    }else {
      LOG('change view');
      //change view
      correctViewmode = false;
      var correctChangeViewModeLink = '';
      correctChangeViewModeLink += changeViewModeLink.href.slice(0,changeViewModeLink.href.lastIndexOf('#')-1);
      correctChangeViewModeLink += isLoggedIn ? '3' : '2'; //logged in and anonymous access use different numbers for the same view modes
      correctChangeViewModeLink += changeViewModeLink.href.slice(changeViewModeLink.href.lastIndexOf('#'), changeViewModeLink.href.length);
      addChangeViewModeButton(correctChangeViewModeLink);
    }
  }
}
LOG('correct Viewmode: '+correctViewmode);

function addChangeViewModeButton(link){
  LOG('called addChangeViewModeButton ');

  //link should already be the correct one
  var newNode = document.createElement('div');
  newNode.style.background = '#e3f1f6';
  newNode.style.border = '1px solid #d2e5ec';
  newNode.style.color = '#00abea';
  newNode.style.padding ='15px 20px';

  var textElement = document.createElement('p');
  var boldElement = document.createElement('b');
  var textContent = document.createTextNode('Das Golem.de Forum+ UserScript funktioniert nicht in dieser Ansicht.');
  var linkContent = document.createTextNode('Um zur passenden Ansicht zu wechseln, klicken Sie hier.');
  var linkElement = document.createElement('a');
  linkElement.style.color = '#00abea';
  linkElement.href=link;
  linkElement.appendChild(linkContent);
  textElement.appendChild(boldElement);
  boldElement.appendChild(textContent);
  newNode.appendChild(textElement);
  newNode.appendChild(linkElement);
  var referenceNode = document.querySelector('ol.list-pages');
  referenceNode.parentNode.insertBefore(newNode, referenceNode);
}


//for shortcut navigation
var currPos = -1;
var headerList = document.querySelectorAll('.message-new');


/*
 * Assign Depth for each post
 * div thread-detail ol li padding-left / 20 => depth
 */
var threadDetail = document.getElementById('thread-detail');
var liItems = threadDetail.querySelectorAll('div#thread-detail > ol > li[data-user-id]');   //threadDetail.getElementsByTagName('li');
var httpRequestRequired = false;

/*
 * Add optical highlights
 */
var colorLookup = [];
var colorLookupDefault = 'transparent';
colorLookup[0] = '#1ccdff';
colorLookup[1] = '#54ff00';
colorLookup[2] = '#ffc300';
colorLookup[3] = '#ff0000';
colorLookup[4] = '#c700ff';
// loop through 1 to 5 / second to last



/*
 * Stuff in here is the actual userscript.
 */
if(correctViewmode){

  for(var i=0; i < liItems.length; i++) {
    var depth = parseInt(liItems[i].style.paddingLeft,10) / 20;
    liItems[i].setAttribute('depth', depth);
    if(i>0 && depth == 1){
      //only the root element i=0 should have a depth of 1
      //if this condition is true, an overflow happened and a depth of 16 was interpreted as 1
      httpRequestRequired = true;
    }
  }

  // increase overall width by 10px;
  // document.getElementById('screen').style.width = '990px';
  // document.getElementById('forum-main').style.width = '630px';

  threadDetail.style.borderWidth='0px';
  threadDetail.style.backgroundColor='transparent';


  if(httpRequestRequired){
    LOG('httpRequestRequired')
    requestThreadAsView(1,function(){
      requestDepthsFromThreadViewListener.call(this);
      applyDepthAndAddActionBar();
    });
  }else {
   applyDepthAndAddActionBar();
  }


  //Shortcut Section
  if (document.addEventListener ){
    document.addEventListener('keydown', function(e) {
    // only bind event to text-accepting elements, if they have been explicitly selected
    if ( this !== e.target &&
        ( /textarea|select/i.test( e.target.nodeName ) || e.target.type === 'text') ) {
        return;
    }
      if (e.which == 74) jumpToNext();
    });
  }

  if (document.addEventListener ){
    document.addEventListener('keydown', function(e) {
      // only bind event to text-accepting elements, if they have been explicitly selected
      if ( this !== e.target &&
          ( /textarea|select/i.test( e.target.nodeName ) || e.target.type === 'text') ) {
          return;
      }
      if (e.which == 75) jumpToPrevious();
    });
  }

}


function applyDepthAndAddActionBar(){
  for(var i=0; i < liItems.length; i++) {
    var depth = parseInt(liItems[i].getAttribute('depth'),10);

    liItems[i].style.paddingLeft='20px';
    liItems[i].style.marginLeft= (depth-1)*5+'px';
    liItems[i].style.backgroundColor='rgb(249, 249, 249)';
    //liItems[i].style.borderLeftColor='orange';
    liItems[i].style.borderLeftWidth='5px';
    liItems[i].style.borderLeftStyle='solid';
    if(depth == 1){
      liItems[i].style.borderLeftColor=colorLookupDefault;
    }else{
      var colorLookupIndex = (depth - 2) % colorLookup.length;
      liItems[i].style.borderLeftColor=colorLookup[colorLookupIndex];
    }

    // move links to actionBar, which is only visible on :hover
    var links = liItems[i].getElementsByClassName('links')[0];
    var actionBar = document.createElement('div');
    if(links){
      actionBar.innerHTML=links.innerHTML;
      actionBar.classList.add('links');
      actionBar.classList.add('post-hover-class');
      actionBar.style.cssText=liItems[i].style.cssText;
      actionBar.style.backgroundColor='rgb(255, 249, 214)';
      links.parentNode.removeChild(links);

      //jump to parent
      actionBar.innerHTML=actionBar.innerHTML+'|'; //spacer
      var toParentBtn = document.createElement('a');
      toParentBtn.innerHTML='▲';
      toParentBtn.href='javascript:void(0);';
      toParentBtn.onclick=jumpToParent;
      toParentBtn.classList.add('link-class');
      actionBar.appendChild(toParentBtn);

      insertAfter(actionBar, liItems[i]);
    }else{
      //there are no links. Probably not logged in.
      //actionBar.style.backgroundColor='rgb(255, 0, 0)';
      //actionBar.innerHTML='Fehler: Das \"links\" Element konnte nicht gefunden werden.';
    }
  }
}


/**
 * Request the current thread in a different viewmode. If no listener is provided, the result is discarded.
 * 
 * @param {*} view view is a number indicating the viewmode, with 1=thread view, 2=just the posts, 3=the posts indendented.
 * @param {*} listener The listener is an optional callback that is called, once the page loaded.
 * The page content can be accessed in the listener with this.responseXML
 */
function requestThreadAsView(view,listener){

  //TODO this functionality sucks -.- it seems you can access the anon read pages as logged in user. in those cases, this won't work.

  LOG('entered requestThreadAsView');
  var requestURL = '';
  var url = window.location.href;
  if(url.indexOf('read.php') != -1){
    //we are already in switchview mode. only need to change the number
    if(isLoggedIn){
      requestURL = url.slice(0,url.indexOf('sv=')+3) + view + url.slice(url.indexOf('sv=')+4,url.length);
    }else{
      requestURL = url.slice(0,url.indexOf('anonymous_threaded_read=')+24) + view + url.slice(url.indexOf('anonymous_threaded_read=')+25,url.length);
    }
  }else{
    //we need to build a new url to switch the view
    var appendix = url.slice(url.lastIndexOf('/')+1,url.length);
    if(isLoggedIn){
      appendix = appendix.replace('read.html', 'sv='+view);
    }else {
      view = getSwitchViewValueAsAnonRead(view);
      appendix = appendix.replace('read.html', 'anonymous_threaded_read='+view);
    }
    requestURL = 'https://forum.golem.de/read.php?'+appendix;
  }


  var oReq = new XMLHttpRequest();
  if(listener){
    oReq.addEventListener('load', listener);
    oReq.open('GET', requestURL);
    oReq.responseType = 'document';
  }else {
    oReq.open('HEAD', requestURL);
  }
  oReq.send();
}

//if not logged in, the viewmode numbers are different: 1 thread, 2 indented, 3 plain
function getSwitchViewValueAsAnonRead(view){
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
  return view;
}

function requestDepthsFromThreadViewListener () {
  var tableListthread = this.responseXML.getElementsByClassName('table-listthread')[0];

  var nodes = tableListthread.querySelectorAll('tbody > tr:not(:first-child)');

  // table.table-listthread > tbody > alle tr außer dem ersten sind die nodes
  //die anzahl der img objecte in node > td > div.indent scheint die depth zu sein


  //defaultView: li > h4 die id vom h4 ist msg-5007355
  //thread view: tr > td > h3 die id vom h3 ist msg-5007355

  //Performance wise this is shit, but I'm lazy.
  //go trough all li items, search for the message id in the nodes, apply depth. if messageId can't be found in nodes, mark the post and log it.

  for(var l=0; l < liItems.length; l++) {
    var header = liItems[l].getElementsByTagName('h4')[0];
    var msgId = header.id;
    var found = false;
    for(var n=0; n < nodes.length; n++) {
      var nodeMsgId = nodes[n].querySelectorAll('td > h3')[0].id;
      if(nodeMsgId == msgId){
        var imgNodes = nodes[n].querySelectorAll('td > div.indent > img');
        var depth = imgNodes.length;
        liItems[l].setAttribute('depth', depth);
        found = true;
        break;
      }
    }
    if(!found){
      LOG('msgId '+msgId+' could not be mapped');
    }
  }

  requestThreadAsView(3); //reset view to correct mode
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function jumpToParent(){
  var li = this.parentElement.parentElement;
  var depthOfThis = parseInt(li.getAttribute('depth'),10);
  if(depthOfThis==1) {return;} //if first post, do nothing
  var msgId = li.getElementsByClassName('head2')[0].getAttribute('id');



  var index = -1;
  for(var i=0; i < liItems.length; i++) {
    if(liItems[i].getElementsByClassName('head2')[0].getAttribute('id')==msgId){
      index=i;
      break;
    }
  }
  for(var i=index-1; i >= 0; i--){
    var tmpDepth = parseInt(liItems[i].getAttribute('depth'),10);
    if(tmpDepth+1==depthOfThis){
      liItems[i].scrollIntoView();
      break;
    }
  }
}


function jumpToNext() {
  currPos++;
  headerList = document.querySelectorAll('.message-new');
  currPos = Utils.clamp(currPos,0,headerList.length-1);
  //console.warn(list.length);
  var currElem = headerList[currPos];
  if(currElem){
    highlightEntry(currElem);
    currElem.scrollIntoView();
    //window.scrollBy(0, -60);
  }
}

function jumpToPrevious() {
  currPos--;
  headerList = document.querySelectorAll('.message-new');
  currPos = Utils.clamp(currPos,0,headerList.length-1);
  //console.warn(list.length);
  var currElem = headerList[currPos];
  if(currElem){
    highlightEntry(currElem);
    currElem.scrollIntoView();
    //window.scrollBy(0, -60);
  }
}

function highlightEntry(element) {
  if(!element){
    LOG('element is undefined');
  }else{
    element.style.color = 'red';
    var parent = element.parentNode;
    parent.style.backgroundColor = '#fffcd8';
    var origBGColor     = {r:249, g:249, b:249};
    var yellowishColor  = {r:255, g:252, b:216};
    var blackColor      = {r:  0, g:0,   b:  0};
    var redColor        = {r:255, g:0,   b:  0};
    
    setTimeout(function() {
      Utils.fade(parent, 'background-color', yellowishColor, origBGColor, 1000);
    }, 500);
    setTimeout(function() {
      Utils.fade(element, 'color', redColor, blackColor, 1000);
    }, 500);
  }
}