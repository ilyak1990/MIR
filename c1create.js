function deviceSelection(device) {
  var allDevices = ['Work Phone', 'Work Email', 'Work Mobile', 'Work SMS', 'Home Phone', 'Personal Mobile', 'Personal SMS', 'Personal Email'] //available devices within MIR
  var left = []; //which devices are selected by user



  if (device.indexOf(',') > -1) //if there are multiple devices
  {
    var arr = device.split(', ')

    for (var a in arr) //for each of the devices make priority
    {
      left.push(arr[a])

    }

  }
  else {
    left.push(device)
  }


  var devPayload = '<locationOverride><overrideDefaultStatusOnly>true</overrideDefaultStatusOnly><devices>'








  for (var all in allDevices) {
    rbv_api.println(rbv_api.jsonToString(left))

    if (parseInt(left.indexOf(allDevices[all])) == -1) //filter out devices that are not selected by user
    {
      devPayload += '<override><deviceType>' + allDevices[all] + '</deviceType><priority>OFF</priority></override>';


    }
    else if (parseInt(left.indexOf(allDevices[all])) > -1) //just for logging, these devices do not matter
    {
    }
  }
  devPayload += '</devices></locationOverride>';

  return devPayload

}
function responseOption() {
  var first = '{!Response_Option_1}'
  var second = '{!Response_Option_2}'

  var resp = '<responseOptions>'
  if (first !== '') resp += '<responseOption><verbiage><text locale="en_US">' + first + '</text></verbiage></responseOption>'
  if (second !== '') resp += '<responseOption><verbiage><text locale="en_US">' + second + '</text></verbiage></responseOption>'
  resp += '</responseOptions>'
  return resp;
}


function getRecipients(objType, objID, people, teams) //get recipients with in the related record (this will be directly related people as well as teams with people within them)
{


  var identifier = []; //this will be what MIR understands as the unique identified, whether its username or UUID


  var direct = rbv_api.getRelatedIds(people, objID) //get all of the directly related people by object type

  rbv_api.println(direct.length + " " + people + " " + objID)

  for (var d in direct) {
    var email = rbv_api.getFieldValue('people', direct[d], 'email') ///if it is UUID just change this to the field where UUID is stored
    if ((email !== '') && (parseInt(identifier.indexOf(email)) == -1)) {
      identifier.push(email);//push peoples unique identifier into arr

      rbv_api.println(parseInt(identifier.indexOf(email)))
    }

    rbv_api.println(email)

  }

  var team = rbv_api.getRelatedIds(teams, objID) //get each team by object type

  for (var t in team) {
    var person = rbv_api.getRelatedIds('R50496', team[t]) //out of the box People - Team relationship
    for (var p in person) {
      var email = rbv_api.getFieldValue('people', person[p], 'email') //if it is UUID just change this to the field where UUID is stored
      if ((email !== '') && (parseInt(identifier.indexOf(email)) == -1)) {
        identifier.push(email); //push peoples unique identifier into arr    }

        rbv_api.println(parseInt(identifier.indexOf(email)))
        rbv_api.println(email)
      }

    }

    rbv_api.println(identifier.length + " ffdsfsgfgfdgdg")



  }

  if (identifier.length > 0) //once everything is looped, if there ARE people within object, loop and push.
  {
    rbv_api.println(identifier.length)
    var recipients = buildRecipients(identifier); //send all of the unique identified information to build the payload accordingly 
    buildPayload(recipients);
  }

}

function buildRecipients(identifier) //this we will build the recipient xml payload 
{
  if (identifier.length > 0) {

    var string = '<recipients>'

    for (var i in identifier) {
      string += '<recipient><username>' + identifier[i] + '</username></recipient>'
    }

    string += '</recipients>'
  }
  return string
}



function buildPayload(recipients) //this is standard accross all payloads
{
  var check = '{!Device_Types#value}' !== ''; //check if there are devices selected
  var override = ''; //initiate for later
  var respPayload = ''
  var respOp = {!Requires_Response_
}

//recipients are the basic recipients XML syntax
//basic is envelope wrapped around all calls

var basic = '<?xml version="1.0" encoding="UTF-8"?>'
basic += '<soapenv:Envelope  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"        xmlns:xsd="http://www.w3.org/2001/XMLSchema"        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body>'


var createNotification = '<addNewNotifications xmlns="http://www.mir3.com/ws">'
createNotification += '<apiVersion>4.3</apiVersion><authorization>'
createNotification += '<username>' + '{!#SETTINGS.MIR_3_Username}' + '</username><password>' + '{!#SETTINGS.MIR_3_Password}' + '</password>'; //change this per account 
createNotification += '</authorization><notificationDetail><contactAttemptCycles>' + '{!Contact_Cycle_Attempts#value}' + '</contactAttemptCycles><contactCycleDelay>' + '{!Contact_Cycle_Delay#code}' + '</contactCycleDelay>';
createNotification += '<title>' + '{!name#text}' + '</title>' //title of it must be unique
createNotification += '<description>' + '' + '</description> <verbiage>' //description if necessary
createNotification += '<text locale="en_US">' + '{!message_body#text}' + '</text>' //actual content of the message
createNotification += '</verbiage><broadcastInfo><broadcastDuration>' + '{!Broadcast#code}' + '</broadcastDuration>' //broadcast type (STANDARD OUT OF THE BOX)
createNotification += recipients //recipients payload
createNotification += '</broadcastInfo>'

//createNotification+=  '<reportRecipients><recipient><username>test.test.test</username></recipient></reportRecipients>' //testing if you can send a report to a user

//createNotification +=' <validateRecipient>false</validateRecipient>' //this asks if the person being called is correct 




if (check) override = deviceSelection('{!Device_Types#value}'); //if there are devices selected build the payload to override 
if (respOp) respPayload = responseOption(); //if response options is checked
createNotification += '<validateRecipient>false</validateRecipient>';

createNotification += override;
createNotification += respPayload;
createNotification += '</notificationDetail></addNewNotifications>'


basic += createNotification + '</soapenv:Body></soapenv:Envelope>'

rbv_api.println(basic)

//return basic

var response = rbv_api.sendJSONRequest('https://ca.mir3.com/services/v1.2/mir3', basic, 'POST', 'text/xml', null, null, null);

var value = "/*/*/response/success/text()"
var success = getNodes(response, value)

if (success == 'false') {
  var value = "/*/*/response/error/errorMessage/text()"

  var error = getNodes(response, value); //get the errror message 
  rbv_api.println(error)
  rbv_api.setFieldValue('message', {!id}, 'Error_Message', error) //save the error message
  }
  else rbv_api.setFieldValue('message', {!id}, 'Error_Message', ' ')

}

function getNodes(response, value) {

  var get = rbv_api.evalXpath(response, value);
  if (get.item(0) !== null) {


    var final = get.item(0).getNodeValue();
    return final;
  }
  else { return 'N/A'; }


}




function mainFunction() //this is where the message is being sent from (out of the box it is exercises and incidents)
{
  if ({!R270931.id
}> 0) getRecipients('incident', {!R270931.id}, 'R46855506', 'R52221') //if coming from incident give related person, and teams
    else if ({!R705606.id}> 0) getRecipients('exercise', {!R705606.id}, 'R46855509', 'R290871') //if coming from exercise related person, and teams
  }
mainFunction(); //initiate it
