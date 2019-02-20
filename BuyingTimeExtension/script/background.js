chrome.webRequest.onCompleted.addListener(function(details){

    if(details.type === "xmlhttprequest" && details.method === "GET"){
      console.log("found an ajax call");
       chrome.tabs.query({}, tabs => {
          tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { "from": "background" });
        });
      });
     }

  },
  {urls: ["<all_urls>"]},
  ["responseHeaders"]
);