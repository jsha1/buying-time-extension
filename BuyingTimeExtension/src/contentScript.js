function doConvert(){
  chrome.storage.sync.get(['config'], function(items) {

    let FI_NUMBER;
    let income_per_year;
    if(items.config){

      if(items.config.off){
        return;
      }

      FI_NUMBER = items.config.fi_number || 1000000;
      income_per_year = items.config.salary || 50000;
    }else{
      FI_NUMBER = 1000000;
      income_per_year = 50000;
    }

    const income_per_hour = (income_per_year / 2080);

    const FI_PER_HOUR = (FI_NUMBER / 2080);
    //const FI_PER_HOUR = FI_NUMBER / 2088;

    // if(!document.body.innerText.match(/\$((\d+,?)*(.\d\d)?)/)){
    //   return;
    // }

    findAndReplaceDOMText(document.body, {
      find: /\$((\d+,?)+(.\d\d)?)/g,
      replace: function(portion, match) {

        if(portion.index != 0){
          return "";
        }
        
        const dollar_amount_item = parseFloat(match[1].replace(",",""));
        const m = moment();

        moment.relativeTimeThreshold('m', 60);
        moment.relativeTimeThreshold('h', 24*5);
        moment.relativeTimeThreshold('d', 31*6);
        moment.relativeTimeThreshold('M', 12*1000); 

        if(items.config && items.config.fi_number){
          const hours_forever_saved = dollar_amount_item / FI_PER_HOUR;
          convertToWorkday(m, hours_forever_saved);
          // m.subtract(hours_forever_saved, 'hour');
          return convertString(m.fromNow().replace(" ago","/year"));
        }else{
          const item_cost_in_hours = dollar_amount_item / income_per_hour;
          convertToWorkday(m, item_cost_in_hours);
          // m.subtract(item_cost_in_hours, 'hour');
          return convertString(m.fromNow(true));
        }      
      }
    });

  });
}

//no years allowed.
function convertString(string){

  return string
  .replace("hour","work hour")
  .replace("an work","a work")
  .replace("day","work day")
  .replace("month","work month");
}

function convertToWorkday(m, item_cost_in_hours){

  if(item_cost_in_hours <= 24*5){
    m.subtract(item_cost_in_hours, 'hour'); 
  }else if(item_cost_in_hours <= 24*31*6){
    m.subtract(item_cost_in_hours / 8, 'days'); 
  }else{
    m.subtract(item_cost_in_hours / 160, 'months'); 
  }

  return m;
}

doConvert();

is_disabled = false;
chrome.runtime.onMessage.addListener(message => {
    // do something with msgObj
    //just restarting atm which will get current config from storage
    if(message.off){
      is_disabled = true;
      location.reload();
    }else if(message.from === "change_calc"){
      location.reload();
    }else if(message.off === false){
      is_disabled = false;
    }

    if(!is_disabled){
      doConvert();
    }
});

console.log("contentScript.js");



