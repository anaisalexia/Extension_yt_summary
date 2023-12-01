


var button_save = document.getElementById('one_button');
var button_display = document.getElementById('display');

var text = document.getElementById('text');





async function oc_function_save() {
    //send message to background script to get all the navigation data back
    var resp = await chrome.runtime.sendMessage({type: "save_all_navigation_data"}); 
  
}

async function oc_function_display() {
  //send message to background script to get all the navigation data back
  var resp = await chrome.runtime.sendMessage({type: "display_all_navigation_data"}); 
}

function displayPopUpInfo (info) {
  console.log('DATA DISPLAYED: ',info);

  // document.getElementById('text_2').textContent = 'Data displayed !';
  var json_data = JSON.parse(info.data);
  var data_keys = Object.keys(json_data);
  var text = '<ol>';
  for (var key of data_keys){
    if (json_data[key]['page_title']  == 'video'){
    
      text = text + '<li> <b> "' + json_data[key]['video_title'] + '" </b>'
      + '<ul>' 
      + '<li> Channel: ' + json_data[key]['channel'] + '</li>'
      + '<li> Length: ' + json_data[key]['video_length'] + '</li>'
      + '<li> Watch time: ' + json_data[key]['vision_time'] + '</li>'
      + '</ul>'
      + '</li>';
    }
    else{
      let time = json_data[key]['elapsed_time']/1000;
      let time_min = Math.floor(time/60);
      let time_sec = Math.floor(time%60);

      text = text + '<li> ' + json_data[key]['page_title'] 
      + '<ul>' 
      + '<li> Time spent: ' + time_min+':'+time_sec + '</li>'
      + '</ul>'
      + '</li>';
    }
  }
  text = text + '</ol>';
  document.getElementById('style-2').innerHTML = text;

};

function savePopUpInfo (info ) {
  console.log('DATA SAVED: ',info);

  // document.getElementById('text_2').textContent = 'Data displayed !';
  var json_data = JSON.parse(info.data);
  var data_keys = Object.keys(json_data);
  var text = '<ol>';
  for (var key of data_keys){
    if (json_data[key]['page_title']  == 'video'){
    
      text = text + '<li> <b> "' + json_data[key]['video_title'] + '" </b>'
      + '<ul>' 
      + '<li> Channel: ' + json_data[key]['channel'] + '</li>'
      + '<li> Length: ' + json_data[key]['video_length'] + '</li>'
      + '<li> Watch time: ' + json_data[key]['vision_time'] + '</li>'
      + '</ul>'
      + '</li>';
    }
    else{
      let time = json_data[key]['elapsed_time']/1000;
      let time_min = Math.floor(time/60);
      let time_sec = Math.floor(time%60);

      text = text + '<li> ' + json_data[key]['page_title'] 
      + '<ul>' 
      + '<li> Time spent: ' + time_min+':'+time_sec + '</li>'
      + '</ul>'
      + '</li>';
    }
  }
  text = text + '</ol>';
  document.getElementById('style-2').innerHTML = text;


  async function download(content, fileName, contentType) {
      var a = document.createElement("a");
      var file = new Blob([content], {type: contentType});
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
  }
  download(info.data, 'navigation_data.txt', 'text/plain');
};

button_save.addEventListener("click", oc_function_save);
// button_display.addEventListener("click", oc_function_display);
button_display.addEventListener("click", oc_function_display);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.msg === "for display") {
          console.log(request.data);
          displayPopUpInfo(request);
      }
      else if (request.msg === "for saving") {
        console.log(request.data);
        savePopUpInfo(request);
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