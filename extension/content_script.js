
async function getTabId() { 
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.id;

 }

//instead of displaying everything on the extension
// Opening an extension page in a new tab
// A common pattern for extensions is to open an onboarding page in a new tab when the extension is installed. The following example shows how to do this.

// background.js:

// chrome.runtime.onInstalled.addListener(({reason}) => {
//   if (reason === 'install') {
//     chrome.tabs.create({
//       url: "onboarding.html"
//     });
//   }
// });

function execute_contentscript(){


  console.log('Content script loaded on YouTube page.');

  // // little test to try to access the page
  // let txt = document.querySelector("#text");
  // if (txt != null){
  //   txt.textContent = 'extension loaded';
  //   chrome.runtime.sendMessage({ type: 'home_page', data:{}});
  // }

  // RECORDING OF YT ACTIVITIES
  // let videoTitleElement = document.querySelector("#title > h1 > yt-formatted-string");
  
  let videoTitleElement = document.querySelector("h1.ytd-watch-metadata yt-formatted-string");
  let videoLength = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span:nth-child(2) > span.ytp-time-duration");

  // [...document.querySelectorAll('yt-formatted-string.ytd-rich-grid-media')].map(x => x.innerText)
  // https://copyprogramming.com/howto/javascript-javascript-retrieve-a-youtube-video-title

  var VideoPageData = {
    video_title:'no title',
    video_length: 'no length',
  };


  if (videoLength != null){
    console.log('Video Length:', videoLength.textContent);
    VideoPageData.video_length = videoLength.textContent;
  }

  if (videoTitleElement != null) {
    console.log('Video Title:', videoTitleElement.textContent);
    VideoPageData.video_title = videoTitleElement.textContent;
  }
// Envoyer le titre de la vidéo au background script pour la collecte ou le stockage.
chrome.runtime.sendMessage({ type: 'video_page_data', data: VideoPageData });




  // COMMUNICATION POPUP

  // Listen for messages from the popup.
  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    
    if (msg.type == 'save') {
      // Collect the necessary data. 
      console.log(msg.type)
      var domInfo = {
        text: "data trans"
      
      };

      // Directly respond to the sender (popup), 
      // through the specified callback.
      response(domInfo);
    }
  });

  
  document.addEventListener("mousedown", mouse_clicked);

}


setTimeout(execute_contentscript, 2000);

function mouse_clicked(MouseEvent){
  console.log('clicked')
  let target = MouseEvent.target;

  if (target.id == 'video-title'){
    // a video as been clicked
    // the content script need to be charged again
    console.log('script execution');
    setTimeout(execute_contentscript, 2000);
   // execute for the preceding page if there is no setTimeout ! permet de recupere durée de visionnage
  }

}
