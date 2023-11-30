// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.');
});

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



// SAVES ALL THE INFORMATION ABOUT THE NAVIGATION STEP OF THE USER
// var AllNavigationData = {'action_ini':'pageloaded'}

chrome.storage.session.set({ action_ini: 'script loaded' })



// characteristic of the loaded page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  if (message.type == 'on_home_page') {

    let id = new Date();
    chrome.storage.session.set({ [id]: message.data })

  }

    // we supposed that if there is a title, a new page(video) has been loaded

  else if (message.type == 'video_page_data'){

    let id = new Date();
    chrome.storage.session.set({ [id]: message.data }).then(() => {
      console.log("Value is set",id);
    });
    
  }
  }
);

var AllNavigationData_storage = {};

chrome.runtime.onMessage.addListener(async (msg, sender, response) => {
  // First, validate the message's structure.
  
  if (msg.type == 'display_all_navigation_data') {
    // Collect the necessary data. 
    console.log(msg.type)
    
   
    AllNavigationData_storage = await  chrome.storage.session.get(null);
    AllNavigationData_storage.then(send_msg());
    
      
    

    }
    // response(JSON.stringify(response_data));

    // Directly respond to the sender (popup), 
    // through the specified callback.
  }
);

function send_msg(){
  chrome.runtime.sendMessage(
    {msg: 'saved_data',
    description: "All the data saved during the navigation",
     data : JSON.stringify(AllNavigationData_storage) }
    )
 }



// window.addEventListener('unload', function(event) {
//   // localStorage.setItem("Saved", "yes");
//   console.log('SAved');
// });
// console.log("Saved:", localStorage.getItem('Saved'));


// //  Initialisation porte
// const portMap = new Map();
// const resolveMap = new Map();
// let messageId = 0;

// chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete') {
//     const response = await send(tabId, {message: 'dataready', action: 'foo'});
//     console.log(response);
//   }
// });

// function onPortDisconnected(port) {
//   portMap.delete(port.sender.tab.id);
// }

// function onPortMessage(msg, port) {
//   resolveMap.get(msg.id)(msg.data);
//   resolveMap.delete(msg.id);
// }

// function send(tabId, data) {
//   return new Promise(resolve => {
//     const id = ++messageId;
//     let port = portMap.get(tabId);
//     if (!port) {
//       port = chrome.tabs.connect(tabId, {frameId: 0});
//       port.onDisconnect.addListener(onPortDisconnected);
//       port.onMessage.addListener(onPortMessage);
//       portMap.set(tabId, port);
//     }
//     resolveMap.set(id, resolve);
//     port.postMessage({id, data});
//   });
// }




