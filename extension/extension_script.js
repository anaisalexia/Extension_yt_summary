var button_save = document.getElementById('one_button');
var button_display = document.getElementById('display');

var text = document.getElementById('text');

const savePopUpInfo = info => {
    document.getElementById('text_2').textContent = 'Data saved !'
    document.getElementById('scroll').innerHTML = info.data;

    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    download(info.data, 'navigation_data.txt', 'text/plain');
  };

const displayPopUpInfo = info => {
  document.getElementById('text_2').textContent = 'Data displayed !'
  document.getElementById('scroll').innerHTML = info.data;
};

function oc_function_save() {
    //send message to background script to get all the navigation data back
    chrome.runtime.sendMessage({type: "display_all_navigation_data"},savePopUpInfo); 

}

function oc_function_display() {
  //send message to background script to get all the navigation data back
  chrome.runtime.sendMessage({type: "display_all_navigation_data"},displayPopUpInfo); 

}

button_save.addEventListener("click", oc_function_save);
button_display.addEventListener("click", oc_function_display);




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