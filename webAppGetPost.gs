// to save some work, parameter names shoul be all lower case and use underscore; they should also be exactly the same with sheet headers
function doGet(e){

  var parameter = e.parameter;
  var pageType = parameter.page_type;
  var userEmail = parameter.email;
  
  if(typeof parameter.time_sensitive != 'undefined'){
    Logger.log(parameter);
    return ContentService
    .createTextOutput("receipt({success: true, note: 'hahah'})")
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  //return error page, stating the value of pageType is missing
  if(typeof pageType == 'undefined'){
    return handleErrorPage('Page Type Undefined');
  }
  
  //error page for mismatch user email
  if(typeof userEmail == 'undefined'){
    return handleErrorPage('User Email Undefined');
  }
  
  switch(pageType){
    case 'submission':
      return serveSubmissionPage(parameter);
      break;
    case 'approval':
      return serveApprovalPage(parameter)
      break;
    default:
      return handleErrorPage('No Such Page Type');
      
  }
  
  
  

}

/*
receive form data from frontend
*/
function processForm(form){
    
  switch(form.form_type){
    case 'submission':
      return handleSubmission(form);
      break;
    case 'approval':
      return handleApproval(form)
      break;
    default:
      return handlePostError('form type not recognized');
  }

}





