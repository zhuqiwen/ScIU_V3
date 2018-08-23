var ini = initialize();
var settings = ini.settings;
var members = ini.members;
var submissions = ini.submissions;
var email_queue = ini.email_queue;
var raw_submissions = ini.raw_submissions;


var finder = new Finder();
var email = new Email();



var workflowSpreadsheet = SpreadsheetApp.openById(settings.workflowSpreadsheetInfo.id);
var emailQueueSheet = workflowSpreadsheet.getSheetByName('email_queue');
var emailSentBoxSheet = workflowSpreadsheet.getSheetByName('email_sent_box');
var submissionsSheet = workflowSpreadsheet.getSheetByName('submissions');
var rawSignupSheet = workflowSpreadsheet.getSheetByName('raw_signup');
var rawSubmissionsSheet = workflowSpreadsheet.getSheetByName('raw_submissions');
var membersSheet = workflowSpreadsheet.getSheetByName('members');

var triggerLog = workflowSpreadsheet.getSheetByName('trigger_log');


var headersArray = submissionsSheet.getRange(1, 1, 1, submissionsSheet.getLastColumn()).getValues()[0];
var headersToColumns = {};
for(var i = 0; i < headersArray.length; i++){
  headersToColumns[headersArray[i]] = i + 1;
}

var submissionsHeadersArray = headersArray;


var rawSignupHeadersArray = rawSignupSheet.getRange(1, 1, 1,rawSignupSheet.getLastColumn()).getValues()[0];
var rawSignupHeadersToColumns = {};
for(var i = 0; i < rawSignupHeadersArray.length; i++){
  rawSignupHeadersToColumns[rawSignupHeadersArray[i]] = i + 1;
}


var membersHeadersArray = membersSheet.getRange(1, 1, 1,membersSheet.getLastColumn()).getValues()[0];
var membersHeadersToColumns = {};
for(var i = 0; i < membersHeadersArray.length; i++){
  membersHeadersToColumns[membersHeadersArray[i]] = i + 1;
}


var nowDate = new Date();
var today = new Date();
var nowHour = nowDate.getHours();




var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
  ];
  
var month_num_mapping = {
  'January': '01',
  'February': '02',
  'March': '03',
  'April': '04',
  'May': '05',
  'June': '06',
  'July': '07',
  'August': '08',
  'September': '09',
  'October': '10',
  'November': '11',
  'December': '12'
};

// used to help generate editing reminder emails for author and 2 editors
var editingReminderTasksObj = {
  editor1:{
    approvalDueReminder:{
      template: settings.emailTemplatesEditor.approvalDueReminder,
      subject: settings.emailSubjects.editorEditingReminder
    },
    approvalDueReminderFinal:{
      template: settings.emailTemplatesEditor.approvalDueReminderFinal,
      subject: settings.emailSubjects.editorEditingRemiderFinal
    }
  },
  editor2:{
    approvalDueReminder:{
      template: swapEditors(settings.emailTemplatesEditor.approvalDueReminder),
      subject: settings.emailSubjects.editorEditingReminder
    },
    approvalDueReminderFinal:{
      template: swapEditors(settings.emailTemplatesEditor.approvalDueReminderFinal),
      subject: settings.emailSubjects.editorEditingRemiderFinal
    }
  },
  author:{
    approvalDueReminder:{
      template: settings.emailTemplatesAuthor.approvalDueReminder,
      subject: settings.emailSubjects.authorEditingReminder
    },
    approvalDueReminderFinal:{
      template: settings.emailTemplatesAuthor.approvalDueReminderFinal,
      subject: settings.emailSubjects.authoEditingrReminderFinal
    }
  }
};



var lastPostIdFromV2 = 99;