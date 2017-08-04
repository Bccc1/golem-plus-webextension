/*
 * Dies ist eine JavaScript-Umgebung.
 *
 * Geben Sie etwas JavaScript ein und führen Sie einen Rechtsklick aus oder wählen Sie aus dem Ausführen-Menü:
 * 1. Ausführen, um den ausgewählten Text zu evaluieren (Strg+R),
 * 2. Untersuchen, um den Objekt-Inspektor auf das Resultat anzuwenden (Strg+I), oder
 * 3. Anzeigen, um das Ergebnis in einem Kommentar hinter der Auswahl einzufügen. (Strg+L)
 */

/*
 * Assign Depth for each post
 * div thread-detail ol li padding-left / 20 => depth
 */
var threadDetail = document.getElementById("thread-detail");
var liItems = threadDetail.getElementsByTagName("li");

for(var i=0; i < liItems.length; i++) {
  parseInt(liItems[i].style.paddingLeft,10);
  var depth = parseInt(liItems[i].style.paddingLeft,10) / 20;
  liItems[i].setAttribute("depth", depth);
}

// increase overall width by 10px;
// document.getElementById("screen").style.width = "990px";
// document.getElementById("forum-main").style.width = "630px";

threadDetail.style.borderWidth="0px";
threadDetail.style.backgroundColor="transparent";

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
  actionBar.innerHTML=links.innerHTML;
  actionBar.classList.add("links");
  actionBar.classList.add("post-hover-class");
  actionBar.style.cssText=liItems[i].style.cssText;
  actionBar.style.backgroundColor="rgb(255, 249, 214)";
  insertAfter(actionBar, liItems[i]);
  links.parentNode.removeChild(links);


  /*
  * add buttons
  */

  //jump to parent
  actionBar.innerHTML=actionBar.innerHTML+"|"; //spacer
  var toParentBtn = document.createElement("a");
  toParentBtn.innerHTML="▲";
  toParentBtn.href="javascript:void(0);";
  toParentBtn.onclick=jumpToParent;
  toParentBtn.classList.add("link-class");
  actionBar.appendChild(toParentBtn);

//   var cs = window.getComputedStyle(liItems[i],null);
//
//   // liItems[i].style.display="table";
//   var innerhtml = liItems[i].innerHTML;
//   liItems[i].innerHTML = "";
//   var content = document.createElement("div");
//   content.innerHTML = innerhtml;
//   content.style.display="table-cell";
//   content.style.paddingLeft="10px";
//   content.style.paddingTop=cs.paddingTop;
//   content.style.paddingBottom=cs.paddingBottom;
//   liItems[i].style.paddingTop="0px";
//   liItems[i].style.paddingBottom="0px";
//
//   var spacer = document.createElement("div");
//   spacer.style.marginLeft=liItems[i].style.paddingLeft;
//   liItems[i].style.paddingLeft="0px";
//   spacer.style.width="1px";
//   spacer.style.height="1px";
//   spacer.style.float="left";
//
//   var sidebar = document.createElement("div");
//   sidebar.style.display="table-cell";
//   sidebar.style.width="5px";
//
//   if(depth == 1){
//     sidebar.style.backgroundColor=colorLookupDefault;
//   }else{
//     var colorLookupIndex = (depth - 2) % colorLookup.length;
//     sidebar.style.backgroundColor=colorLookup[colorLookupIndex];
//   }
//
//   liItems[i].appendChild(spacer);
//   liItems[i].appendChild(sidebar);
//   liItems[i].appendChild(content);
}


  // add styleclass for .post-hover-class
  insertCss('.post-hover-class { display: none; }');
  insertCss('.post-hover-class a { color: rgb(76, 76, 76); }');
  insertCss('li:hover + .post-hover-class { display: block; padding: 10px 20px; }');
  insertCss('.post-hover-class:hover { display: block; padding: 10px 20px; }');
  insertCss('.link-class:hover { text-decoration: none; }');


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
