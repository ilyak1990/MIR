function buildHTML(title, content, type, status, issued, completed, initiator, totalrec, totalcontact, totalresponded) {


  var html = '<tr>Summary</tr><table class="aGrid"><tr><th>Title</th> <th>Content</th> <th>Type</th> <th>Status</th> <th>Initiator</th> <th>Issued:</th> <th>Completed</th></tr>' //table's headers
  html += '<tr><td>' + title + '</td><td>' + content + '</td><td>' + type + '</td><td>' + status + '</td><td>' + initiator + '</td><td>' + issued + '</td><td>' + completed + '</td></tr></table>'

  html += '<tr>Statistics</tr><table class="aGrid" ><tr><th>Total Recipients</th> <th>Total Contacted</th> <th>Total Responded</th></tr>' //table's headers
  html += '<tr><td>' + totalrec + '</td><td>' + totalcontact + '</td><td>' + totalresponded + '</td></tr></table>'

  rbv_api.println(html)

  rbv_api.setFieldValue('message', {!id}, 'Report_HTML', html) //set the uuid

      
}

function getNodes(response, value) {

  var get = rbv_api.evalXpath(response, value);
  if (get.item(0) !== null) {


    var final = get.item(0).getNodeValue();
    return final;
  }
  else { return 'N/A'; }


}



function buildPayload() //this is standard accross all payloads
{

  //recipients are the basic recipients XML syntax
  //basic is envelope wrapped around all calls

  var basic = '<?xml version="1.0" encoding="UTF-8"?>'
  basic += '<soapenv:Envelope  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"        xmlns:xsd="http://www.w3.org/2001/XMLSchema"        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body>'


  var createNotification = '<getNotificationReports xmlns="http://www.mir3.com/ws">'
  createNotification += '<apiVersion>4.3</apiVersion><authorization>'
  createNotification += '<username>' + '{!#SETTINGS.MIR_3_Username}' + '</username><password>' + '{!#SETTINGS.MIR_3_Password}' + '</password>'; //change this per account 
  createNotification += '</authorization>'
  createNotification += '<notificationReportUUID>' + '{!UUID#text}' + '</notificationReportUUID></getNotificationReports>' //firing off by title





  basic += createNotification + '</soapenv:Body></soapenv:Envelope>'



  var response = rbv_api.sendJSONRequest('https://ca.mir3.com/services/v1.2/mir3', basic, 'POST', 'text/xml', null, null, null);
  //var response = '<?xml version="1.0" encoding="UTF-8"?> <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"> <soapenv:Body> <response xmlns="http://www.mir3.com/ws"> <success>true</success> <getNotificationReportsResponse> <notificationReport> <notificationReportUUID>0417c7a9-0003-3000-80c0-fceb55463ffe</notificationReportUUID> <title>zzz tet</title> <type>BROADCAST</type> <timeSent>2018-03-26T15:18:51.000-04:00</timeSent> <initiator> <firstName>Ilya</firstName> <lastName>Kogan</lastName> <userUUID>17ee0277-0001-3000-80c0-fceb55463ffe</userUUID> <username>ilyakogan.bcinthecloud</username> </initiator> <division>/</division> <generalStatistics> <totalResponseCount>0</totalResponseCount> <totalRecipientCount>1</totalRecipientCount> <totalContactedCount>1</totalContactedCount> <totalDevicesContacted>1</totalDevicesContacted> <totalPhoneSeconds>0</totalPhoneSeconds> </generalStatistics> <verbiage> <text locale="en_US" messageType="Default">zzz</text> </verbiage> <priority>STANDARD</priority> <status>INITIATED</status> <contactAttempts>3</contactAttempts> <leaveMessage>true</leaveMessage> <responseOptions/> </notificationReport> </getNotificationReportsResponse> </response> </soapenv:Body> </soapenv:Envelope>' 
  rbv_api.println(response)


  var value = "/*/*/response/success/text()"

  var success = getNodes(response, value) //traverse the response to see if it was a success

  if (success == 'true') //the call came back true, now pull the proper data 
  {
    //report summary
    var title = ''
    var content = ''
    var type = ''
    var status = ''
    var issued = '';
    var completed = '';
    var initiator = '';

    //report statistics
    var totalrec = '';
    var totalcontact = '';
    var totalresponded = '';

    rbv_api.print("gffff")



    //title 
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/title/text()"
    title = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(title)
    //content 
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/verbiage/text/text()"
    content = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(content)

    //type      
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/type/text()"
    type = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(type)
    //status       
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/status/text()"
    status = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(status)

    //issued      
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/timeSent/text()"
    issued = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(issued)

    //completed at      
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/timeClosed/text()"
    completed = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(completed)

    //initiator      
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/initiator/username/text()"
    initiator = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(initiator)

    //total responded      
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/generalStatistics/totalResponseCount/text()"
    totalresponded = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(totalresponded)

    //total recipeints count   
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/generalStatistics/totalRecipientCount/text()"
    totalrec = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(totalrec)

    //total contaced count

    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/generalStatistics/totalContactedCount/text()"
    totalcontact = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(totalcontact)



    buildHTML(title, content, type, status, issued, completed, initiator, totalrec, totalcontact, totalresponded);



    rbv_api.setFieldValue('message', {!id}, 'Error_Message', ' ')

}
  else
{
  var value = "/*/*/response/error/errorMessage/text()"

  var error = getNodes(response, value); //get the errror message 
  rbv_api.println(error)
  rbv_api.setFieldValue('message', {!id}, 'Error_Message', error) //save the error message
    }
  
    

}
buildPayload();
function buildHTML(title, content, type, status, issued, completed, initiator, totalrec, totalcontact, totalresponded) {


  var html = '<tr>Summary</tr><table class="aGrid"><tr><th>Title</th> <th>Content</th> <th>Type</th> <th>Status</th> <th>Initiator</th> <th>Issued:</th> <th>Completed</th></tr>' //table's headers
  html += '<tr><td>' + title + '</td><td>' + content + '</td><td>' + type + '</td><td>' + status + '</td><td>' + initiator + '</td><td>' + issued + '</td><td>' + completed + '</td></tr></table>'

  html += '<tr>Statistics</tr><table class="aGrid" ><tr><th>Total Recipients</th> <th>Total Contacted</th> <th>Total Responded</th></tr>' //table's headers
  html += '<tr><td>' + totalrec + '</td><td>' + totalcontact + '</td><td>' + totalresponded + '</td></tr></table>'

  rbv_api.println(html)

  rbv_api.setFieldValue('message', {!id}, 'Report_HTML', html) //set the uuid

      
}

function getNodes(response, value) {

  var get = rbv_api.evalXpath(response, value);
  if (get.item(0) !== null) {


    var final = get.item(0).getNodeValue();
    return final;
  }
  else { return 'N/A'; }


}



function buildPayload() //this is standard accross all payloads
{

  //recipients are the basic recipients XML syntax
  //basic is envelope wrapped around all calls

  var basic = '<?xml version="1.0" encoding="UTF-8"?>'
  basic += '<soapenv:Envelope  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"        xmlns:xsd="http://www.w3.org/2001/XMLSchema"        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body>'


  var createNotification = '<getNotificationReports xmlns="http://www.mir3.com/ws">'
  createNotification += '<apiVersion>4.3</apiVersion><authorization>'
  createNotification += '<username>' + '{!#SETTINGS.MIR_3_Username}' + '</username><password>' + '{!#SETTINGS.MIR_3_Password}' + '</password>'; //change this per account 
  createNotification += '</authorization>'
  createNotification += '<notificationReportUUID>' + '{!UUID#text}' + '</notificationReportUUID></getNotificationReports>' //firing off by title





  basic += createNotification + '</soapenv:Body></soapenv:Envelope>'



  var response = rbv_api.sendJSONRequest('https://ca.mir3.com/services/v1.2/mir3', basic, 'POST', 'text/xml', null, null, null);
  //var response = '<?xml version="1.0" encoding="UTF-8"?> <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"> <soapenv:Body> <response xmlns="http://www.mir3.com/ws"> <success>true</success> <getNotificationReportsResponse> <notificationReport> <notificationReportUUID>0417c7a9-0003-3000-80c0-fceb55463ffe</notificationReportUUID> <title>zzz tet</title> <type>BROADCAST</type> <timeSent>2018-03-26T15:18:51.000-04:00</timeSent> <initiator> <firstName>Ilya</firstName> <lastName>Kogan</lastName> <userUUID>17ee0277-0001-3000-80c0-fceb55463ffe</userUUID> <username>ilyakogan.bcinthecloud</username> </initiator> <division>/</division> <generalStatistics> <totalResponseCount>0</totalResponseCount> <totalRecipientCount>1</totalRecipientCount> <totalContactedCount>1</totalContactedCount> <totalDevicesContacted>1</totalDevicesContacted> <totalPhoneSeconds>0</totalPhoneSeconds> </generalStatistics> <verbiage> <text locale="en_US" messageType="Default">zzz</text> </verbiage> <priority>STANDARD</priority> <status>INITIATED</status> <contactAttempts>3</contactAttempts> <leaveMessage>true</leaveMessage> <responseOptions/> </notificationReport> </getNotificationReportsResponse> </response> </soapenv:Body> </soapenv:Envelope>' 
  rbv_api.println(response)


  var value = "/*/*/response/success/text()"

  var success = getNodes(response, value) //traverse the response to see if it was a success

  if (success == 'true') //the call came back true, now pull the proper data 
  {
    //report summary
    var title = ''
    var content = ''
    var type = ''
    var status = ''
    var issued = '';
    var completed = '';
    var initiator = '';

    //report statistics
    var totalrec = '';
    var totalcontact = '';
    var totalresponded = '';

    rbv_api.print("gffff")



    //title 
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/title/text()"
    title = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(title)
    //content 
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/verbiage/text/text()"
    content = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(content)

    //type      
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/type/text()"
    type = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(type)
    //status       
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/status/text()"
    status = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(status)

    //issued      
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/timeSent/text()"
    issued = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(issued)

    //completed at      
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/timeClosed/text()"
    completed = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(completed)

    //initiator      
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/initiator/username/text()"
    initiator = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(initiator)

    //total responded      
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/generalStatistics/totalResponseCount/text()"
    totalresponded = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(totalresponded)

    //total recipeints count   
    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/generalStatistics/totalRecipientCount/text()"
    totalrec = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(totalrec)

    //total contaced count

    var value = "/*/*/response/getNotificationReportsResponse/notificationReport/generalStatistics/totalContactedCount/text()"
    totalcontact = getNodes(response, value); //get the UUID if it wasnt a success
    rbv_api.println(totalcontact)



    buildHTML(title, content, type, status, issued, completed, initiator, totalrec, totalcontact, totalresponded);



    rbv_api.setFieldValue('message', {!id}, 'Error_Message', ' ')

}
  else
{
  var value = "/*/*/response/error/errorMessage/text()"

  var error = getNodes(response, value); //get the errror message 
  rbv_api.println(error)
  rbv_api.setFieldValue('message', {!id}, 'Error_Message', error) //save the error message
    }
  
    

}
buildPayload();
