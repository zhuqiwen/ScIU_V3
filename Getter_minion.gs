
/*
read all data from core tab and convert them into objects, with each using Doc_id as the hash key
each attribute is also an object that has two fields, range and value; range is a array of [row, column]
the sheet/tab be read must use first row as headers
*/
function getDataObject(tabName){
  var spreadsheet = initiateSpreadsheet('15XA7VvA04UtBGTjLLMOjxbrbjtgcJUP_QYpJE6dzTPQ');
  var tab = spreadsheet.getSheetByName(tabName);
  //all data in the first line, the headers, used to construct the data objects
  var dataRange = tab.getDataRange();
  var allData = dataRange.getValues();
  var headerArray = allData[0];
  var recordsArray = allData.slice(1);
  
  var dataObj = {};
  //insert a empty row, all values of 'NA', and row number is -1
  var emptyRow = {};
  var emptyRowNum = -1;
  for(var i = 0; i < headerArray.length; i++){
    var attributeObj = {};
    var columnNum = i + 1;
    attributeObj['range'] = {row: emptyRowNum, column: columnNum};
    attributeObj['value'] = 'N/A';
    
    emptyRow[headerArray[i]] = attributeObj;
    emptyRow['row'] = {value: emptyRowNum};
  }
  dataObj[emptyRowNum] = emptyRow;
  
  //insert real data
  for(var i = 0; i < recordsArray.length; i++){
    var record = recordsArray[i];
    var obj = {}
    var rowNum = i + 2;
    for(var j = 0; j < record.length; j++){
      var attributeObj = {};
      var columnNum = j + 1;
      //construct a range field consisting of row and column
      attributeObj['range'] = {row: rowNum, column: columnNum};
      attributeObj['value'] = record[j];
      obj[headerArray[j]] = attributeObj;
      obj['row'] = {value: rowNum};
    }
    //use row number as index; much easier to locate
    dataObj[rowNum] = obj;
  }
  return dataObj;
}



/*
This is the setting reader that read in settings from a dedicated spreadsheet

#######Important Convention########
In the settings spreadsheet, in any tab/sheet

1. No headers
2. Column A is key
3. Column B is value
4. NO empty value is allowed

*/

function readSettings(){
  var spreadsheet = initiateSpreadsheet('1R8ZDEs7MB4JEz7qyadOr1RHkYbPDVr928zG_HG0G_Js');
  var tabsArray = spreadsheet.getSheets();
  var settingsObject = {};
  for(var i = 0; i < tabsArray.length; i++){
    var currentTab = tabsArray[i];
    var tabName = currentTab.getName();
    settingsObject[tabName] = {};
    var dataArray = currentTab. getDataRange().getValues();
    
    for(var j = 0; j < dataArray.length; j++){
      var row = dataArray[j];
      var key = row[0];
      var value = row[1];
      settingsObject[tabName][key] = value;
    }
  }
  
  return settingsObject;
}




function initiateSpreadsheet(spreadsheetId, errorMessages, errorChecker){
  var file = DriveApp.getFileById(spreadsheetId);
  //no error checking for reading settings
  if(typeof errorMessages != 'undefined' || typeof errorChecker != 'undefined'){
    errorChecker.fileType(file, 'application/vnd.google-apps.spreadsheet', errorMessages);
  }
  return SpreadsheetApp.open(file);
}



function getValueFromSheet(sheetObject, row, column){
  return sheetObject.getRange(row, column).getValues();
}