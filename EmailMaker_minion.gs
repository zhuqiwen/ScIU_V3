function Email(){  
  
  addMethod(this, 'generateDocLink', function(linkText, linkURL){
    var link = '<a href="' + linkURL + '">';
    link += linkText;
    link += '</a>';
    
    return link;
  });
  
  /*
  a helper function to put values into slots in template
  a slot is like #{variable}#
  */
  addMethod(this, 'renderTemplate', function(template, obj){
    for(var key in obj){
      if(obj[key] != 'undefined'){
        template = template.replace('#{' + key + '}#', obj[key]);
      }
    }
    
    return template;
  });
  
  //subject template passed from settings spreadsheet
  //valueObj contains attributes of needed information
  addMethod(this, 'generateSubject', function(subjectTemplate, valueObj){
    return this.renderTemplate(subjectTemplate, valueObj);
  });
  
  
  //message template passed from settings spreadsheet
  //valueObj contains attributes of needed information
  addMethod(this, 'generateMessageBody', function(messageTemplate, valueObj){
    return this.renderTemplate(messageTemplate, valueObj);
  });
  
  
  
  addMethod(this, 'generateGreating', function(soloReceipient){
    return 'Hi, ' + soloReceipient + '!<br /><br />';
  });
  
  
  addMethod(this, 'generateGreating', function(firstReceipient, secondReceipient){
    return 'Hi, ' + firstReceipient + ' and ' + secondReceipient + '!<br /><br />';
  });

  
  addMethod(this, 'sendMail', function(recipients, subject, emailBody, cc){
    if(settings.general.is_dev){
      var to = 'johnsonzhuqw@gmail.com';
    }
    else{
      var to = recipients
    }
    
    MailApp.sendEmail({
      to: to,
      subject: subject,
      htmlBody: emailBody, 
      cc: cc
    });
  });
  
  
  
  /*
  emailObject must have attributes of to, subject, htmlBody, cc
  */
  addMethod(this, 'sendMail', function(emailObj){
    //check if values are missing for attributes of to, subject, and htmlBody
    for(var f in emailObj){
      if(f == 'cc'){
        continue;
      }
      
      if(emailObj[f] == '' || typeof emailObj[f] == 'undefined'){
        throw f + ' is empty or undefined';
      }
    }
    
    if(settings.general.is_dev){
      emailObj.to = 'johnsonzhuqw@gmail.com';
      emailObj.cc = '';
    }    
    
    emailObj = JSON.parse(JSON.stringify(emailObj));
    MailApp.sendEmail(emailObj);
  });
  
  
  addMethod(this, 'prepareEmailObject', function(data, bodyTemplate, subjectTemplate, recipientType){
    
    var obj = {};
    obj['subject'] = this.renderTemplate(subjectTemplate, data);
    obj['htmlBody'] = this.renderTemplate(bodyTemplate, data);
    
    switch(recipientType){
      case 'author':
        obj['to'] = data.author_email;
//        obj['cc'] = emailData.editor1_email + ',' + emailData.editor2_email;
        break;
      case 'editor1':
        obj['to'] = data.editor1_email;
//        obj['cc'] = emailData.author_email + ',' + emailData.editor2_email;
        break;
      case 'editor2':
        obj['to'] = data.editor2_email;
//        obj['cc'] = emailData.editor1_email + ',' + emailData.author_email;
        break;
      default:
        throw 'Unknown recipient type';
        return;
    }
    
    obj['cc'] = settings.general.officalEmail;
    
    return obj;
    
  });






}