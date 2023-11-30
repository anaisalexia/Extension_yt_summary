


var button_save = document.getElementById('one_button');
var button_display = document.getElementById('display');

var text = document.getElementById('text');

const savePopUpInfo = async info => {
    document.getElementById('text_2').textContent = 'Data saved !'
    document.getElementById('scroll').innerHTML = await info.data;

    async function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    download(await info.data, 'navigation_data.txt', 'text/plain');
  };



async function oc_function_save() {
    //send message to background script to get all the navigation data back
    chrome.runtime.sendMessage({type: "display_all_navigation_data"}); 

}


async function oc_function_display() {
  //send message to background script to get all the navigation data back
  var resp = await chrome.runtime.sendMessage({type: "display_all_navigation_data"},displayPopUpInfo); 
  resp.then(displayPopUpInfo(displayPopUpInfo));
  
}
function displayPopUpInfo (info) {
  console.log('data',info);
  document.getElementById('text_2').textContent = 'Data displayed !';
  document.getElementById('scroll').innerHTML = info.data;
};

button_save.addEventListener("click", oc_function_save);
// button_display.addEventListener("click", oc_function_display);
button_display.addEventListener("click", oc_function_display);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.msg === "saved_data") {
          console.log(request.data);
          displayPopUpInfo(request);
      }
  }
);



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