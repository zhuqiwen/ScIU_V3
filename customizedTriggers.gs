///*
//NOTICE: this event is a spreadsheet event, instead of a form event; thus, e.source will return the spreadsheet, not the form
//*/
//function submissionFormOnSubmitTrigger(e){
//  var response = e.response;
//  var itemResponses = response.getItemResponses();
//  var values = [];
//  for(var i = 0; i < itemResponses.length; i++){
//    Logger.log(itemResponses[i].getItem().getTitle());
//    Logger.log(itemResponses[i].getResponse());
//
//  }
//  //delete submission form
//  //delete submission form record in form queue sheet
//  //insert a row in raw_submission sheet
//  //send email to managing editor
//  
//  //delete the triiger via triggerUid
//  
//  
//}
//
//
//function approvalFormOnSubmitTrigger(e){
//}