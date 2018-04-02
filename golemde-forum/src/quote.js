import * as Utils from './utils.js'

var LOG = process.env.NODE_ENV === 'development' ? console.log.bind(console) : function () {};

//this is a good thread to test the feature as it contains loooots of quotes:
//https://forum.golem.de/kommentare/automobil/hyundai-ioniq-im-test-mit-hartmut-in-der-sauna/es-nervt-golem/116751,5058307,5058307,read.html#msg-5058307


export function processQuotes(){
    //TODO should these vars be passed as args?
    var threadDetail = document.getElementById('thread-detail');
    var liItems = threadDetail.querySelectorAll('div#thread-detail > ol > li[data-user-id]');

    Utils.insertCss("blockquote { background: #f9f9f9; border-left: 5px solid #ccc; margin: 0.5em 0px; padding: 0px 10px; font-family:'Droid Sans',arial,sans-serif;}");
    Utils.insertCss("blockquote author{ display: block;  font-weight:700;  color: #aaa; font-size: 12px; }");
    Utils.insertCss("blockquote author:hover{ color: #222; }");
    //TODO delete following 2 lines
    //var threadDetail = document.getElementById("thread-detail");
    //var liItems = threadDetail.querySelectorAll("div#thread-detail > ol > li[data-user-id]");
    for(var i=0; i < liItems.length; i++) {
      var quotes = liItems[i].querySelectorAll("span.GolemPhorumMessageQuote");
  
      for(var j=0; j < quotes.length; j++) {
        var quoteSpan = quotes[j];
        var author;
        var tmp = quoteSpan;
        var authorPos;
        var foundAuthor = false;
        for(authorPos=0; authorPos<7 && tmp.previousSibling;authorPos++){
            tmp = tmp.previousSibling;
            LOG('liItems['+i+'] quotes['+j+'] authorPos['+authorPos+'] tmp.previousSibling.nodeName: '+tmp.nodeName)
            if(tmp.nodeName.toLowerCase() === 'blockquote'){
                LOG('found blockquote, aborted')
                break;
            }
            if(tmp.textContent.search("schrieb:") != -1){
                foundAuthor = true;
                break;
            }
          
        }
        if(foundAuthor){
            LOG("authorPos is "+authorPos);
  
            for(var k=0;k<authorPos;k++){
                quoteSpan.previousSibling.parentNode.removeChild(quoteSpan.previousSibling);
            }
            author = document.createElement("author");
            author.textContent = quoteSpan.previousSibling.textContent;
            quoteSpan.previousSibling.parentNode.removeChild(quoteSpan.previousSibling);
        }
  
        //change span to quote
        var bq = document.createElement("blockquote");
        bq.innerHTML = quoteSpan.innerHTML;
  
        for(var k=0; k<bq.childNodes.length; k++){
            if(bq.childNodes[k].nodeType == Node.TEXT_NODE){
                var line = bq.childNodes[k];
                if(line.textContent.indexOf("> ") == 0){
                  line.textContent = line.textContent.slice(2,line.textContent.length);
                }else{
                  if(line.textContent == ">"){
                    line.textContent = "";
                  }else {
                    LOG("line should start with '>', but is: "+line.textContent);
                  }
                }
            }
        }
  
        if(author) bq.insertAdjacentElement('afterbegin', author);
        author = null;
        quoteSpan.parentNode.replaceChild(bq, quoteSpan);
      }
    }
}
