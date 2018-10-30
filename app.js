var express = require('express');
var app = express();
var builder = require('xmlbuilder');
const admin = require('firebase-admin'); 
var serviceAccount = require('./xmltest-affa7-e92e88a0dc7b.json');
//initializing service account
  admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
//firebase database output
var newarray = []
  function CreateXML(newjson) {
//outputing JSON to console in a clean view for the developer
var i;
//Start of xml file 'array'
var array = builder.create('array')
//Documents are being pulled through firebase in this case thier are 4
 for (i = 0; i < newjson.length; i++) { 
//Firebase collection format to output to console
var type = '', value = ''
 switch (newjson[i].type){
 case 'string': type = 'string', value = newjson[i].stringvalue; break;
 case 'integer': type = 'integer', value = newjson[i].integervalue; break;
 case 'real': type = 'real', value = newjson[i].realvalue; break;
 case 'boolean': type = newjson[i].booleanvalue.toString(); break;

 default: break;
}
//XML format for console
array.e('dict')
.e('key','Key').up()
.e('string', newjson[i].name).up()
.e('key','Value').up()
.e([type]).r([value]).up()        
//making xml readable
array.end({ pretty: true });    
newarray.push(array.toString())
}
return newarray.toString()
}






// firebase utils
var json = []
var db = admin.firestore();
// gathering the data from firebase collection
db.collection('xmltest')
.get()
.then((snapshot) => {
  snapshot.forEach(doc => {
   const data = {
      'portalid': doc.data().portalid,
      'name': doc.data().name,
      'type': doc.data().type,
      'integervalue': doc.data().integervalue,
      'realvalue': doc.data().realvalue,
      'booleanvalue': doc.data().booleanvalue,
      'stringvalue': doc.data().stringvalue,
    }
  //pushing JSON to console
  json.push(data)
  })
  // function to convert json to xml
  xmloutput = CreateXML(json)
  console.log('Xmloutput' + xmloutput)

})
//catching errors when present
.catch((error) => {
console.log(JSON.stringify(error))});
//Outputting xml to browser
app.get('/', function(req, res  ) {
  res.set('Content-Type', 'text/xml');
  res.send('<array><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><real>1</real></dict><dict><key>Key</key><string>showHomeIcon</string><key>Value</key><false/></dict> <dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><string>1</string></dict><dict> <key>Key</key> <string>motionResetPeriod</string> <key>Value</key></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><real>1</real></dict><dict><key>Key</key><string>showHomeIcon</string><key>Value</key><false/></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><string>1</string></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><real>1</real></dict><dict><key>Key</key><string>showHomeIcon</string><key>Value</key><false/></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><string>1</string></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><real>1</real></dict><dict><key>Key</key><string>showHomeIcon</string><key>Value</key><false/></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><string>1</string></dict></array>');
  
  
});
//Server start on 8888
var server = app.listen(8888, function(){
var host = server.address().address;
var port = server.address().port;
 console.log("We're live on:", port);
    });
//res.set('Content-Type', 'text/xml');
//res.send('<array><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><real>1</real></dict><dict><key>Key</key><string>showHomeIcon</string><key>Value</key><false/></dict> <dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><string>1</string></dict><dict> <key>Key</key> <string>motionResetPeriod</string> <key>Value</key></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><real>1</real></dict><dict><key>Key</key><string>showHomeIcon</string><key>Value</key><false/></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><string>1</string></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><real>1</real></dict><dict><key>Key</key><string>showHomeIcon</string><key>Value</key><false/></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><string>1</string></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><real>1</real></dict><dict><key>Key</key><string>showHomeIcon</string><key>Value</key><false/></dict><dict><key>Key</key><string>motionResetPeriod</string><key>Value</key><string>1</string></dict></array>');

