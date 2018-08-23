function getCurrentUserEmail(){
  return Session.getActiveUser().getEmail();
}


function getTargetUserEmail(parameter){
  return parameter.userEmail;
}


function getSuccessMessage(){
  return HtmlService.createHtmlOutputFromFile('successMessageHtml');
}



function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}


function checkValidUser(parameter){
  var targetUserEmail = parameter.email;
  var currentUserEmail = getCurrentUserEmail();
  //check if current user is target user
  if(targetUserEmail != currentUserEmail){
    return handleErrorPage('You have not logged in as ' + targetUserEmail)
  }
}

function isPostEditor(parameter){
  var currentUserEmail = getCurrentUserEmail();
  //use post id to find the record in submissions sheet,
  //get editors' emails
  //check if currentUserEmail match either one
  //yes, return true
  //no, return false
  return true;
}


function submissionExists(parameter){
  
  var numKeys = Object.keys(parameter).length;
  var query = '';
  var cnt = 0;
  for(var field in parameter){
    cnt += 1;
    if(field != 'doc_url'){
      query += field + '=' + parameter[field];
      if(cnt < numKeys){
        query += '&';
      }
    }
    
  }
  Logger.log(query);
  var existingSubmissionsArray = finder.findRecordObj(query, raw_submissions);
  // row of -1 means empty result
  Logger.log(existingSubmissionsArray);
  Logger.log(existingSubmissionsArray.length >= 1 && existingSubmissionsArray[0].row.value != -1)
  return (existingSubmissionsArray.length >= 1 && existingSubmissionsArray[0].row.value != -1);
}


function alreadyApproved(recordObject){
  return (recordObject.approval_date.value != '');
}
