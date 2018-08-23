/*
general CRUD function on sheets
*/
function readRows(targetSheet, row, numRows){
  return targetSheet.getRange(row, 1, numRows, targetSheet.getLastColumn())
  .getValues();
}



function deleteRows(targetSheet, rowsArray){
  //if rowsArray contains only a record which has a row of -1
  //this means rowsArray is empty. just return.
  if(rowsArray.length == 1 && rowsArray[0].row.value == -1){
    return;
  }
  
  for(var i = rowsArray.length - 1; i >= 0; i--){
    targetSheet.deleteRow(rowsArray[i].row.value);
    SpreadsheetApp.flush();

  }
}



function appendRows(targetSheet, rowsArray){
  var firstEmptyRow = targetSheet.getLastRow() + 1;
  var lastColumn = targetSheet.getLastColumn();
  targetSheet
  .getRange(firstEmptyRow, 1, rowsArray.length, lastColumn)
  .setValues(rowsArray);

  SpreadsheetApp.flush();
  
  return targetSheet.getLastRow();

}
