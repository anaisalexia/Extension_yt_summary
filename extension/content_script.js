// Sauvegarder les donner si changement d'onglet 

// document.addEventListener('popstate', function (event) {
//   console.log('page changed');
// }); // not working




async function getTabId() { 
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.runtime.tabs.query(queryOptions);
  return tab.id;
 }


var VideoPageData = {
  page_title: '',
  video_title:'',
  video_length: '',
  vision_time: '',
  url:'',
  elapsed_time: '',
  video_description:'',
  video_tag:'',
  watch_date:'',
  channel:'',
  recommendation: {}
};


var current_url = window.location.toString();
var current_page = 'None';
var startDate = new Date();
var endDate = new Date();

async function get_description(){
  return new Promise((resolve) => {
    
      resolve( document.querySelector("#description-inline-expander > yt-attributed-string"));
    
  });
}

async function execute_contentscript(){

  for (let i = 0; i<= Object.keys(VideoPageData).length; i++){
    VideoPageData[Object.keys(VideoPageData)[i]] = '';
  }
  VideoPageData['recommendation'] = {};

  console.log('Content script loaded on YouTube page.');
  document.addEventListener("mousedown", mouse_clicked);
  
  let title = document.querySelector("head > title");

  // add time spend on home page
  if (title != null & title.textContent.split(' ').length <=2 & title.textContent.includes('YouTube') ){
    current_page = 'home';
    VideoPageData.page_title = 'home page';
    VideoPageData.url = current_url;
   

    console.log('Home page')
  }

  else if (current_url.includes('youtube.com/watch')){
    current_page = 'video';
    VideoPageData.page_title = 'video';

    let videoTitleElement = document.querySelector("h1.ytd-watch-metadata yt-formatted-string");
    let videoLength = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span:nth-child(2) > span.ytp-time-duration");
    let videoExpand = document.querySelector("#expand");
    let videoChannel = document.querySelector("#upload-info > #channel-name > #container > #text-container > #text > a"); //# pb #text > a est aussi présent dans des balises qui semblent tracer un historique =, ainsi la channel récupérer n'est pas la bonne  
    let videoRecommendationList = document.querySelectorAll("#video-title");
    let videoRecommendationChannel = document.querySelectorAll("#byline-container >  #channel-name > #container > #text-container > #text");

    videoExpand.click();
    var videoDescription = await get_description() ;

      
    let videoTag = document.querySelector("#info > a");

    

    
    // [...document.querySelectorAll('yt-formatted-string.ytd-rich-grid-media')].map(x => x.innerText)
    // https://copyprogramming.com/howto/javascript-javascript-retrieve-a-youtube-video-title

    VideoPageData.url = current_url;

    if (videoLength != null){
      console.log('Video Length:', videoLength.textContent);
      VideoPageData.video_length = videoLength.textContent;

      let time_array = VideoPageData.video_length.split(":");

      // if the new video has an add (ie video length shorter than 1 min)
      if (parseInt(time_array[0]) < 1){
        setTimeout(execute_contentscript, (parseInt(time_array[1])+1)*1000 );
      }
    }

    if (videoTitleElement != null) {
      console.log('Video Title:', videoTitleElement.textContent);
      VideoPageData.video_title = videoTitleElement.textContent;
      
    }

    if (videoDescription != null){
      // console.log('Video Title:', videoDescription.textContent);
      VideoPageData.video_description = videoDescription.textContent;
    }

    if (videoTag != null){
      console.log('Video Tags:', videoTag.textContent);
      VideoPageData.video_tag = videoTag.textContent;
    }

    if (videoChannel != null){
      console.log('Channel : ', videoChannel.textContent);
      VideoPageData.channel = videoChannel.textContent;
    }

    if (videoRecommendationList != null){

      console.log('Recommendations: ', videoRecommendationList);
      var item;
      var item_ch;
      for (let i = 0; i < 10; i++) {
        item = videoRecommendationList[i];
        item_ch = videoRecommendationChannel[i];
        VideoPageData.recommendation[i] = {'title':item.textContent,
                                          'channel':item_ch.textContent,
                                          'url':item.parentElement.parentElement.href};
        // VideoPageData.recommendation[i]['title'] = videoRecommendationList[i].textContent;
        // VideoPageData.recommendation[i]['channel'] = videoRecommendationChannel[i].textContent;
        // VideoPageData.recommendation[i]['url'] = videoRecommendationList[i].parentElement.parentElement.href;

        // console.log(item.parentElement.parentElement.href);
        // console.log({'title':item.textContent,
        // 'channel':item_ch.textContent,
        // 'url':item.parentElement.parentElement.href});
      console.log(VideoPageData.recommendation); // A FINIR AFFICHER LE RESULTAT

      }
    }

    VideoPageData.watch_date = startDate;
  }
  else{
    // on an other page
    current_page = 'other';
    VideoPageData.page_title = 'other';
    VideoPageData.url = current_url;
    console.log('other')
  }
  
}

function get_vision_time(VideoPageData){
  let videoVisionTime = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span:nth-child(2) > span.ytp-time-current");
  VideoPageData.vision_time = videoVisionTime.textContent;
}

function get_new_url(){
  console.log('in timeout url');
  return new Promise ((resolve) => {
    setTimeout(()=>{  resolve(window.location.toString()); },2000);
   });
}


setTimeout(execute_contentscript, 2000);


async function mouse_clicked(MouseEvent){
  console.log('clicked')
  let target = MouseEvent.target;
  console.log(target,target.classList,Array.from(target.classList).includes('ytd-compact-video-renderer'));

  // in cas of a page change
  if (current_page=='video'){
    console.log('get vision time)');
    get_vision_time(VideoPageData);
  }
/* <div class="ytp-ad-text ytp-ad-skip-button-text-centered ytp-ad-skip-button-text" id="ad-text:7" style>Ignorer</div> */

  //if an add is skipped
  if ( Array.from(target.classList).includes('ytp-ad-skip-button-modern') 
  ||  Array.from(target.classList).includes('ytp-ad-skip-button-text-centered')
  ||  Array.from(target.classList).includes('ytp-ad-skip-button-text')
  ||  Array.from(target.classList).includes('ytp-ad-skip-button-icon-modern'))
  {

    console.log('add skiped');
    current_url = window.location.toString();
    setTimeout(execute_contentscript, 2000,VideoPageData);
    return;
  }

  //let some time for the page to be loaded
  

  let new_url = await get_new_url();
  // console.log(new_url,new_url != current_url);

  if (new_url != current_url){
    endDate = new Date();
    let elapsedTime = endDate.getTime() - startDate.getTime();

    // a new page has been loaded
    console.log('new url',new_url);
    current_url = window.location.toString();
    console.log(elapsedTime)

    VideoPageData.elapsed_time = elapsedTime;
    chrome.runtime.sendMessage({ type: 'video_page_data', data: VideoPageData });



    startDate = new Date();

    

    setTimeout(execute_contentscript, 100);


  }
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




  // // COMMUNICATION POPUP
  // // Listen for messages from the popup.
  // chrome.runtime.onMessage.addListener((msg, sender, response) => {
    
  //   if (msg.type == 'save') {
  //     // Collect the necessary data. 
  //     console.log(msg.type)
  //     var domInfo = {
  //       text: "data trans"
      
  //     };

  //     // Directly respond to the sender (popup), 
  //     // through the specified callback.
  //     response(domInfo);
  //   }
  // });


  
// // TO communicate with the port initiated in background script
// chrome.runtime.onConnect.addListener(port => {
//   port.onMessage.addListener(msg => {
//     console.log(msg.data);
//     // send a response if needed, may be a simple object/array
//     port.postMessage({id: msg.id, data: 'gotcha'}); 
//   });
// // });


// var port = chrome.runtime.connect({name: "knockknock"});
// port.postMessage({joke: "Knock knock"});
// port.onMessage.addListener(function(msg) {
//   if (msg.question === "Who's there?")
//     port.postMessage({answer: "Madame"});
//   else if (msg.question === "Madame who?")
//     port.postMessage({answer: "Madame... Bovary"});
// });



// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name === "knockknock");
//   port.onMessage.addListener(function(msg) {
//     if (msg.joke === "Knock knock")
//       port.postMessage({question: "Who's there?"});
//     else if (msg.answer === "Madame")
//       port.postMessage({question: "Madame who?"});
//     else if (msg.answer === "Madame... Bovary")
//       port.postMessage({question: "I don't get it."});
//   });
// });