function buildPayload() {
  var payload = '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"        xmlns:xsd="http://www.w3.org/2001/XMLSchema"        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body>'
  payload += '<terminateNotifications xmlns="http://www.mir3.com/ws"><apiVersion>4.7</apiVersion><authorization>'
  payload += '<username>' + '{!#SETTINGS.MIR_3_Username}' + '</username><password>' + '{!#SETTINGS.MIR_3_Password}' + '</password></authorization>'; //change this per account 
  payload += '<notificationReportUUID>' + '{!UUID#value}' + '</notificationReportUUID></terminateNotifications></soapenv:Body></soapenv:Envelope>'
  return payload;

}

function getNodes(response, value) {

  var get = rbv_api.evalXpath(response, value);
  if (get.item(0) !== null) {


    var final = get.item(0).getNodeValue();
    return final;
  }
  else { return 'N/A'; }


}
function terminateNotification() {
  var payload = buildPayload();

  rbv_api.println(payload)



  var response = rbv_api.sendJSONRequest('https://ca.mir3.com/services/v1.2/mir3', payload, 'POST', 'text/xml', null, null, null);
  rbv_api.println(response)


  var value = "/*/*/response/success/text()"

  var success = getNodes(response, value) //traverse the response to see if it was a success

  if (success == 'false') {
    var value = "/*/*/response/error/errorMessage/text()"

    var error = getNodes(response, value); //get the errror message 
    rbv_api.println(error)
    rbv_api.setFieldValue('message', {!id}, 'Error_Message', error) //save the error message

}
  else rbv_api.setFieldValue('message', {!id}, 'Error_Message', ' ') 

 
  
  
  
}
terminateNotification();
