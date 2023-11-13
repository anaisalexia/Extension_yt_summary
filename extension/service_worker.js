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
var VideoPageData = {
  video_title:'',
  video_length: 0,
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  if (message.type == 'home_page') {
    let id = 'action_' + Indicator.id_page_loaded;
    AllNavigationData[id] = 'on the home page';
    console.log(stringify(AllNavigationData));
  }

    // we supposed that if there is a title, a new page(video) has been loaded
    // saves the informations of the page and the action that a new page as been loaded

  else if (message.type == 'video_title'){ 
    // updates the video characteristics
    VideoPageData.video_title = message.data;
    // add the new interaction to AllnavigationData
    let id = 'action_' + Indicator.id_page_loaded;
    AllNavigationData[id] = VideoPageData;
  }

  else if (message.type == 'video_length'){
    VideoPageData.video_length = message.data;
    let id = 'action_' + Indicator.id_page_loaded;
    AllNavigationData[id] = VideoPageData;
  }

  else if (message.type == 'video_page_data'){
    VideoPageData.video_length = message.data.video_length;
    VideoPageData.video_title = message.data.video_title;
    let id = 'action_' + Indicator.id_page_loaded;
    AllNavigationData[id] = VideoPageData;
  }

  }
);



chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  
  if (msg.type == 'display_all_navigation_data') {
    // Collect the necessary data. 
    console.log(msg.type)
    var response_data = {
      description: "All the data saved during the navigation",
      data: JSON.stringify(AllNavigationData)
    
    };

    // Directly respond to the sender (popup), 
    // through the specified callback.
    response(response_data);
  }
});

