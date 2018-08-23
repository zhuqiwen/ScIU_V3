/*
the initializer is called by every triggered functions to provide basic things such as dataObject, settingsObjects, and etc.
*/

function initialize(){
  var settingsObject = readSettings();
  var membersObject = getDataObject('members');
  var submissionsObject = getDataObject('submissions');
  var emailQueueObject = getDataObject('email_queue');
  var rawSubmissionsObject = getDataObject('raw_submissions');
  
  return {
    settings: settingsObject,
    members: membersObject,
    submissions: submissionsObject,
    email_queue: emailQueueObject,
    raw_submissions: rawSubmissionsObject
  };
}
