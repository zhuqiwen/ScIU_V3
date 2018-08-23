function Finder() {
  
  //query is a url parameter like string: field1=value1&field2=value2
  //apare from '=', '<', '>', '<=', '>=' and '<>' will be supported in future.
  //DEPRECATED: not support OR between values of a field
//  addMethod(this, 'findRecordObj', function(queryString, dataObject){
//    var queryObjArray = this.getQueryObj(queryString); 
//    var results = [];
//    //iterate all condition in queryObj, and only all fit returns a true
//    //currently, only support '=' operand; other operands support will be the future work
//    for(var row in dataObject){
//      var record = dataObject[row];
//      var fit = true;
//      for(var i = 0; i < queryObjArray.length; i++){
//        var queryObj = queryObjArray[i];
//        var field = queryObj.field;
//        var value = queryObj.value;
//
//        if(record[field].value != value){
//          fit = false;
//          break;
//        }
//      }
//
//      if(fit == true){
//        //results is an object of the same type of dataObject passed in
//        results.push(record);
//      }
//    }
//    
//    //if not found, push the emptyRow object
//    if(results.length == 0){
//      results.push(dataObject[-1]);
//    }
//    
//    return results;
//  });
  
  
  
  addMethod(this, 'findRecordObj', function(queryString, dataObject){
    var queryObjArray = this.getQueryObj(queryString); 
//    Logger.log(queryObjArray);
    var results = [];
   
    //iterate all condition in queryObj, and only all fit returns a true
    //currently, only support '=' operand; other operands support will be the future work
    for(var row in dataObject){
      var record = dataObject[row];
//      var fit = false;
      var fitCount = 0;
      for(var i = 0; i < queryObjArray.length; i++){
        var queryObj = queryObjArray[i];
        var field = queryObj.field;
        var value = queryObj.value;

        //support OR for multiple values in one field
        var valuesArray = value.split('||');
        var fit = false;
        for(var j = 0; j < valuesArray.length; j++){
//          Logger.log('##################');
//          Logger.log(record.row.value);
//          Logger.log(field);
//          Logger.log(valuesArray[j]);
//          Logger.log('##################');
          if(record[field].value == valuesArray[j]){
            fit = true;
            Logger.log('Yahoo!');
//            break;
          }
        }
        
        if(fit == true){
          fitCount += 1;
        }

        //fit == false means for a certain field, all values do not match
//        if(fit == false){
//          break;
//        }
      }

      if(fitCount == queryObjArray.length){
        //results is an object of the same type of dataObject passed in
        results.push(record);
      }
    }
    
    //if not found, push the emptyRow object
    if(results.length == 0){
      results.push(dataObject[-1]);
    }
    
    return results;
  });
  
  
  // returns an array of query object
  addMethod(this, 'getQueryObj', function(queryString){    
    var queryArray = queryString.split('&');
    var result = [];
    for(var i = 0; i < queryArray.length; i++){
      //add support to other oprands, apart from '='
      var queryItem = queryArray[i];
      var obj = {};
      var operand = '=';
      var tmp = queryItem.split(operand);
      obj['field'] = tmp[0];
      obj['value'] = tmp[1];
      obj['operand'] = operand;
      result.push(obj);
    }
    
    return result;
  });
  
}

function finderTest(){
  var emailData = pullData4Email(2, headersArray);

  var query = 'to=' 
    + emailData.author_email + '||'
    + emailData.editor1_email + '||'
    + emailData.editor2_email
    + '&type='
    + 'approvalDueReminder' + '||'
    + 'approvalDueReminderFinal'
    + '&note='
    + emailData.post_id;
    
  var oldEmailsArray = finder.findRecordObj(query, email_queue);
  Logger.log(oldEmailsArray.length);
  for(var i = 0; i < oldEmailsArray.length; i++){
//    Logger.log(oldEmailsArray[i]);
  }

}
