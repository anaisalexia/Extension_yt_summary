
// chrome.runtime.onMessage.addListener(msg_received);

// function msg_received(message, sender, sendResponse) {

//   if (message.type == "clicked") {
//     browser.notifications.create({
//       type: "basic",
//       // iconUrl: browser.extension.getURL(".png"),
//       title: "You clicked a button!",
//       message: message.url,
//     });
//       return;
//   }

// }

// // get the button
// var one_button = document.getElementById("one_button");

// // add event 
// one_button.addEventListener("click", com_change_icon);

// function com_change_icon(){
//     // send message to the content script to change the web page
    
// }


// // // create communication instance and the function
// // let portFromCS;

// // function connected(p) {
// //   portFromCS = p;

// //   // sends a message to content script
// //   portFromCS.postMessage({ greeting: "hi there content script!" });

// //   // when a messafe is received from the content script (send an other message to the content script)
// //   portFromCS.onMessage.addListener((m) => {
// //     portFromCS.postMessage({
// //       greeting: `In background script, received message from content script: ${m.greeting}`,
// //     });
// //     text.textContent = 'clicked from background';

// //   });
// // }


// // // create connection
// // chrome.runtime.onConnect.addListener(connected);

// // var text = document.getElementById('text');

// // chrome.action.onClicked.addListener(() => {
// //   portFromCS.postMessage({ greeting: "they clicked the button!" });
// //   text.textContent = 'clicked from background';
// // });