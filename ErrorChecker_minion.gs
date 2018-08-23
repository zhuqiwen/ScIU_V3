function ErrorChecker(){
  addMethod(this, 'fileType', function(file, desiredType, errorMessages){
    var fileType = file.getMimeType();
    if(fileType != desiredType){
      throw(errorMessages.fileTypeWrongMessage);
    }
  });
  
  addMethod(this, 'tabExistence', function(tabsArray, tabName, errorMessages){
    var givenTabContained = false;
    for(var i = 0; i < tabsArray.length; i++){
      var tab = tabsArray[i];
      if(tab.getName() == tabName){
        givenTabContained = true;
      }
    }
    if(givenTabContained == false){
      throw(errorMessages.tabNameWrongMessage);
    }
  });
  
  addMethod(this, 'rangeType', function(rangeString, errorMessages){
    if(typeof rangeString != 'string'){
      throw(errorMessages.rangeTypeWrongMessage);
    }
  });
  
  addMethod(this, 'rangeFormat', function(rangeString, errorMessages){
    var cnt = 0;
    for(var i = 0; i < rangeString.length; i++){
      if(rangeString[i] == ':'){
        cnt ++;
      }
    }
    cnt = parseInt(cnt);
    if(cnt != 1){
      throw(errorMessages.rangeFormatWrongMessage);
    }
  });
}




