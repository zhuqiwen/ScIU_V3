
function calculateDaysFromToday(dateValue){
  var date = new Date(dateValue);
  var today = new Date();
    
  return  (today - date) / 86400000;
}

// e is a event object
function checkIfAnyEmpty(e, columnArray){
  var emptyColumns = [];
  var activeSheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  for(var i = 0; i < columnArray.length; i++){
//    var blank = activeSheet.getRange(row, columnArray[i]).isBlank();
    if(activeSheet.getRange(row, columnArray[i]).isBlank()){
      emptyColumns.push(columnArray[i]);
    }
  }
  
  return emptyColumns;
}

function setCellsBackground(e, columnArray, color){
  var row = e.range.getRow();
  var activeSheet = e.source.getActiveSheet();
  for(var i = 0; i < columnArray.length; i++){
    activeSheet.getRange(row, columnArray[i]).setBackground(color);
  }
  
  SpreadsheetApp.flush();

}



/*
pull data from the submissions sheet for rendering emails
*/
function pullData4Email(row, fieldsArray){
  var dataObj = {};
  for(var i = 0; i < fieldsArray.length; i++){
    dataObj[fieldsArray[i]] = submissionsSheet.getRange(row, headersToColumns[fieldsArray[i]]).getValue();
  }
  
  return dataObj;
}


/*
date has to either be a string of 'yyyy-mm-dd' or a standard Date objec
*/
function generateDate(numberOfDays, beforeOrAfter, date){
//  numberOfDays = parseInt(numberOfDays);
  
  if(typeof date == 'string'){
    date = new Date(date);
    Logger.log(date);
  }
  
  var newDate = new Date(date);
  
  if(beforeOrAfter == 'before'){
    newDate.setDate(date.getDate() - numberOfDays);
  }
  
  if(beforeOrAfter == 'after'){
    newDate.setDate(date.getDate() + numberOfDays);
  }

  return newDate;    
}



function showMissingDataAlert(e, columnsArray){
  e.range.clearContent();
  setCellsBackground(e, columnsArray, settings.warning.bgColor);  
  var ui = SpreadsheetApp.getUi();
  ui.alert(
    'Required Infomation Missing',
    'Please fill red-marked cells and re-select the editor assigning date.',
    ui.ButtonSet.OK);
}


/*
NOTICE: Google App Scripts does NOT support str.startsWith(), str.endsWith(), and str.includes();
*/
//function swapEditors(emailData){
//  var newEmailData = {};
//  for(var f in emailData){
//    if(f.indexOf('editor1') == 0){
//      var newF = f.replace('editor1', 'editor2');
//      newEmailData[newF] = emailData[f];
//      continue;
//    }
//    if(f.indexOf('editor2') == 0){
//      var newF = f.replace('editor2', 'editor1');
//      newEmailData[newF] = emailData[f];
//      continue;
//    }
//    
//    newEmailData[f] = emailData[f]  
//  }
//  
//  return newEmailData;
//}

function swapEditors(emailTemplate){
  var tmpStr = 'u7ykei98';
  var newTemplate = emailTemplate.replace(/editor1/g, tmpStr)
  .replace(/editor2/g, 'editor1')
  .replace(new RegExp(tmpStr, 'g'), 'editor2');
  
  return newTemplate;
}



function daysBetween(startDate, endDate){
  var timeDiff  = (new Date(endDate)) - (new Date(startDate));
  return Math.abs(Math.round(timeDiff / (1000 * 60 * 60 * 24)));
}


function jijitest(){
//  var d = new Date('2018-09-09');
//  var n = new Date();
//  var nn = new Date();
//  n.setDate(d.getDate() - 7);
//  nn.setDate(d - (7 * 86400000));
//  Logger.log(d);
//  Logger.log(n);
//  Logger.log(nn);
  Logger.log(generateDate(7, 'before', new Date("December 01, 2018 11:20:25")));
}