
current_config = {};

function submit_fi(){
  // document.getElementById('clickme').disabled = true;
  // reset();
  //let share = document.getElementById('share').checked;
  //document.getElementById('share').hidden = true;
  // port.postMessage({ status: 'START'});
  var fi_calc = document.getElementsByName("calc");
  if((fi_calc[0].checked && fi_calc[0].value == "fi") || (fi_calc[1].checked && fi_calc[1].value == "fi")){
    const fi_input = document.getElementById('fi_number');
    current_config.fi_number = fi_input.value;
    current_config.salary = null;
  }else{
    const salary_input = document.getElementById('salary');
    current_config.fi_number = null;
    current_config.salary = salary_input.value;
  }

  chrome.storage.sync.set({ 'config' : current_config }, function() {
      chrome.tabs.query({}, tabs => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { "from" : "change_calc", "off" : current_config.off });
          });

      });
    });
}

function toggle_on_off(){
  current_config.off = !current_config.off;
  chrome.storage.sync.set({ 'config' : current_config }, function() {
      setButton(current_config.off);

      chrome.tabs.query({}, tabs => {
          tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, current_config);
        });
      });
      // window.close();
  });
}

function setButton(off){
  const toggle_button = document.getElementById('toggle_button');
  if(off){
    toggle_button.innerText = "Turn on";
  }else{
    toggle_button.innerText = "Turn off";
  }
}

document.getElementById('toggle_button').addEventListener('click', toggle_on_off);

document.getElementById('update_button').addEventListener('click', submit_fi);

document.addEventListener('DOMContentLoaded', function() {

    chrome.storage.sync.get(['config'], function(items) {

       current_config = items.config || {}; 

       const fi_input = document.getElementById('fi_number');

       const fi_radio = document.getElementById('fi_radio');

       const salary_radio = document.getElementById('salary_radio');


       if(current_config.fi_number){
        fi_radio.checked = true;
        fi_input.value = current_config.fi_number;
       }else{
        fi_radio.checked = false;
        fi_input.value = 1000000;
       }

       const salary_input = document.getElementById('salary');

       if(current_config.salary){
        salary_radio.checked = true;
        salary_input.value = current_config.salary;
       }else{
        if(!items.config){
          salary_radio.checked = true;
        }else{
          salary_radio.checked = false;
        }
         salary_input.value = 50000;
       }

       setButton(current_config.off);
    });

}, false);

