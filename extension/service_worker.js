// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.');
});

// SAVES ALL THE INFORMATION ABOUT THE NAVIGATION STEP OF THE USER
var AllNavigationData = {'action_ini':'pageloaded'}

var Indicator = {
  id_page_loaded: 0,
}

// characteristic of the loaded page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  let VideoPageData = {
    page_title:'',
    video_title:'',
    video_length: 0,
    video_vision_time: 0,
    url : '',
    elapsed_time:0
  };

  
  if (message.type == 'on_home_page') {
    let id = 'action_' + Indicator.id_page_loaded;
    AllNavigationData[id] = 'on the home page';
  }

    // we supposed that if there is a title, a new page(video) has been loaded

  else if (message.type == 'video_page_data'){
    VideoPageData.video_length = message.data.video_length;
    VideoPageData.video_title = message.data.video_title;
    VideoPageData.video_vision_time = message.data.vision_time;
    VideoPageData.url = message.data.url;
    VideoPageData.elapsed_time = message.data.elapsed_time;
    VideoPageData.page_title = message.data.page_title;

    let id = 'action_' + Indicator.id_page_loaded;
    AllNavigationData[id] = VideoPageData;
  }

  Indicator.id_page_loaded = Indicator.id_page_loaded + 1;

  }
);



chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  
  if (msg.type == 'display_all_navigation_data') {
    // Collect the necessary data. 
    console.log(msg.type)
    var response_data = {
      description: "All the data saved during the navigation",
      data: JSON.stringify(AllNavigationData),
    
    }
    

    // Directly respond to the sender (popup), 
    // through the specified callback.
    response(response_data);
  }
});

