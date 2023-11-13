var button_save = document.getElementById('one_button');
var text = document.getElementById('text');

const setPopupInfo = info => {
    document.getElementById('text_2').textContent = info.description;
    document.getElementById('scroll').innerHTML = info.data;
  };


function oc_function_save() {
    // send message to service worker
    text.textContent = 'button clicked for saving !';

    //send message to background script to get all the navigation data back
    chrome.runtime.sendMessage({type: "display_all_navigation_data"},setPopupInfo); 

}

button_save.addEventListener("click", oc_function_save);


//How to send message to content script

    // chrome.tabs.query({
    //     active: true,
    //     currentWindow: true
    //   }, tabs => {
    //     // ...and send a request for the DOM info...
    //     chrome.tabs.sendMessage(
    //         tabs[0].id,
    //         {type: "save"},
    //         // ...also specifying a callback to be called 
    //         //    from the receiving end (content script).
    //         setPopupInfo);
    //   });