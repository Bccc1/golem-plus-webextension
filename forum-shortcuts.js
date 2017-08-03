// use http://ted.mielczarek.org/code/mozilla/bookmarklet.html to generate a bookmarklet
// or crunch using http://www.brainjar.com/js/crunch/demo.html and then use http://mrcoles.com/bookmarklet/


document.addEventListener('keydown', function (e) {
	if(e.which == 74) JumpToNextComment();
});

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
	}
}


function HighlightMessage(messageId){
	alert("highlight #".concat(messageId));
}