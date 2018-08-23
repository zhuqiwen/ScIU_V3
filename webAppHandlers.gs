//////////////////////////////PAGE HANDLERS/////////////////////////////////
/*
handle submission page
*/
function serveSubmissionPage(parameter){
  
  if((!checkValidUser(parameter)) && !settings.general.is_dev){
    return handleErrorPage('Ahooooo!You have not logged in as ' + parameter.email)
  }
  
  if(typeof parameter.for_month == 'undefined'){
    return handleErrorPage('forMonth Undefined');
  }
  
  if(typeof parameter.year == 'undefined'){
    return handleErrorPage('year Undefined');
  }
  
  var htmlBasic = HtmlService.createTemplateFromFile('webAppTemplateBasic');
  var currentUserEmail = getCurrentUserEmail();
  htmlBasic.greeting = 'Hi ' + parameter.author;
  htmlBasic.greetingMessage = 'This form is used to share your submission with ScIU. Once the submission is done, 2 editors will be assigned to help improve it. An Email of editor assigning will also be sent to you email: ' + currentUserEmail;
  var form = HtmlService.createTemplateFromFile('webAppTemplateSubmissionForm');
  form.submitterEmail = currentUserEmail;
  form.forMonth = parameter.for_month;
  form.year = parameter.year;
  form.author = parameter.author;
  htmlBasic.form = form.evaluate().getContent();
  
  return HtmlService.createHtmlOutput(htmlBasic.evaluate().getContent());
 
}

/*
handle approval page
*/
function serveApprovalPage(parameter){
  
  //the email in parameter should be one of the editor's email.
  //if not, an error should be returned
  
  if((!checkValidUser(parameter)) && !settings.general.is_dev){
    return handleErrorPage('You have not logged in as ' + parameter.email)
  }
  
  if(typeof parameter.post_id == 'undefined'){
    return handleErrorPage('doc id undefined');
  }
  
  if(typeof parameter.doc_link == 'undefined'){
    return handleErrorPage('doc link undefined');
  }

  if(typeof parameter.title == 'undefined'){
    return handleErrorPage('doc title undefined');
  }
  
  if(isPostEditor(parameter)){
    var htmlBasic = HtmlService.createTemplateFromFile('webAppTemplateBasic');
    var query = 'email=' + parameter.email;
    var editorInfo = finder.findRecordObj(query, members)[0];
    htmlBasic.greeting = 'Hi ' + editorInfo.prefered_name.value;
    htmlBasic.greetingMessage = 'This is the approval form';
    
    var form = HtmlService.createTemplateFromFile('webAppTemplateApprovalForm');
    form.postId = parameter.post_id;
    form.docLink = parameter.doc_link;
    form.title = parameter.title;
    
    htmlBasic.form = form.evaluate().getContent();
    
    return HtmlService.createHtmlOutput(htmlBasic.evaluate().getContent());
    
  }
  else{
    
    return handleErrorPage('You are not the editor of this post.')
  }
  
  
}


/*
handle error page
*/
function handleErrorPage(errorMessage){
  var errorTemplate = HtmlService.createTemplateFromFile('webAppTemplateError');
  errorTemplate.errorMessage = errorMessage;
  
  return HtmlService.createHtmlOutput(errorTemplate.evaluate().getContent());
}

///////////////////////////////////END OF PAGE HANDLERS////////////////////////////////////



//////////////////////////////////FORM HANDLERS/////////////////////////////////////////////

/*
handle submission post
*/
function handleSubmission(parameter){
  //save data to raw_submission sheet
  
  
  //sent mamaging editor an immediate email
  //return  
//  delete parameter.timestamp;
  delete parameter.form_type;

  
  
  var messageBody = 'Submission by ' + parameter.author + '(' + parameter.author_email + ') for the month of ' + parameter.commitment_month + ' in ' + parameter.year;
  //check if the same submission exists in raw_submissions
  if(submissionExists(parameter)){
    var errorMessage = messageBody + ' already exists.';
    return handlePostError(errorMessage);
  }
  /*
  insert a row into raw_submissions sheet
  */
  //proceed, for-loop the sheet header, make valuesArrya, apply appendRows()
  var headers = rawSubmissionsSheet.getRange(1, 1, 1, rawSubmissionsSheet.getLastColumn()).getValues()[0];
  var row = [];
  parameter['timestamp'] = new Date();
  for(var i = 0; i < headers.length; i ++){
    if(typeof parameter[headers[i]] == 'undefined'){
      return handlePostError(headers[i] + ' is missing in parameters');
    }  
    row.push(parameter[headers[i]]);
  }
  var lastRowNumber = appendRows(rawSubmissionsSheet, [row]);  
  
  /*
  insert a row into submissions sheet
  */
  //find last row number of column of post_id: this is a hack -- the column of post_id has to always be column A
  var lastRowNumber = submissionsSheet.getRange("A1:A").getValues().filter(String).length;
  //calculate post_id
  var post_id = lastPostIdFromV2 + lastRowNumber;
  //make post_id a link
  var tmpData = {
    docUrl: parameter.doc_url,
    postId: post_id
  };
    var formula = '=HYPERLINK("#{docUrl}#",#{postId}#)';
  parameter['post_id'] = email.renderTemplate(formula, tmpData);
  delete parameter.doc_url;
  parameter['submission_due'] = new Date(parameter.commitment_month + " 01 " + parameter.year);
  parameter['submission_date'] = today;
  delete parameter.timestamp;
  //for-loop parameter keys, set value useing sheet.getRange(row, headersArray[key]).setValue();
  var parameterKeysList = Object.keys(parameter);
  Logger.log(parameterKeysList);
  Logger.log(headersToColumns);
  for(var i = 0; i < parameterKeysList.length; i++){
    var key = parameterKeysList[i];
    Logger.log(headersToColumns[key]);
    submissionsSheet.getRange(lastRowNumber + 1, headersToColumns[key]).setValue(parameter[key]);
  }
  
  
  
  //send a email to managing editor,
  var emailBody = messageBody + ' at row ' + (lastRowNumber + 1);
  email.sendMail(settings.general.managing_editor_email, 'New Submisstion Received', emailBody, '');
  
  var message = messageBody + ' has been reveived. Thanks.';
  var response = {
    greeting: "Good Job! " + parameter.author,
    greetingMessage: message,
    cardBody: '<div style="height:300px;margin: auto;text-align: center;padding: 50px 0;font-size: 9rem;">&#10003;</div>'
  };
  return response;
  
  
}




/*
handle approval post
*/
function handleApproval(parameter){
  
  //find post id and author email
  var query = 'post_id=' + parameter.post_id;
  var record = finder.findRecordObj(query, submissions)[0];

  var eRow = record.row.value;
  if(eRow == -1){
    return 'This post is missing; please contact managing editor.';
  }
  
  //check if the post has been approved
  if(alreadyApproved(record)){
    return handlePostError('This post has been approved. No need to approve it again.');
  }
  
  //populate approval date
  submissionsSheet.getRange(eRow, headersToColumns.approval_date).setValue(today);
  //send author and managing editor an immediate email about the approval
  // to author, and cc 2 editors and the managing editor
  var emailData = pullData4Email(eRow, headersArray);
  var to = emailData.author_email;
  var cc = emailData.editor1_email + ',' + emailData.editor2_email + ',' + settings.general.managing_editor_email;
  var subjectTemplate = 'Notice of Approval: Porst ##{post_id}#';
  var subject = email.renderTemplate(subjectTemplate, emailData);
  var emailTemplate = 'approval notice / vonfirmation templare';
  var emailBody = email.renderTemplate(emailTemplate, emailData);
  email.sendMail(to, subject, emailBody, cc);
//  return 'Your approval has been reveiced, and the author will receive a notice about the approval as well.';
  
  var response = {
    greeting: "Thanks For Your Work!",
    greetingMessage: "Your approval has been reveiced, and the author will receive a notice about the approval as well.",
    cardBody: '<div style="height:300px;margin: auto;text-align: center;padding: 50px 0;font-size: 9rem;">&#10003;</div>'
  };
  return response;
}


/*
handle post errors
*/
function handlePostError(errorMessage){
  return errorMessage;
}



/////////////////////////////////END OF FORM HANDLERS//////////////////////////////////////////


