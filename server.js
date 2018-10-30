/*eslint no-console: */
// requiring dependecies
var express = require('express');
const admin = require('firebase-admin'); 
var serviceAccount = require('./xmltest-affa7-e92e88a0dc7b.json');

// initializing service account
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

// firebase database output
function CheckValueExists(Data, Key, Value, Type) {
	var i, result;
	for(i = 0; i < Data.length; i++) {
		if (Data[i].hasOwnProperty(Key)) {
			if (Data[i][Key] == Value) {
				result = Data[i][Type];				
			}
		}
		if ((i = Data.length - 1)) {
			// reached end of loop
			break;
		}
		console.log(CheckValueExists);
	}
	return result;
}

function CreateXML(NewDefaultData, NewExceptionData)  {
	// outputing JSON to console in a clean view for the developer
	//console.log ('here:' + NewDefaultData);
	console.log('3.NewDefaultData.length = ' + NewDefaultData.length);
	console.log('3.NewExceptionData.length = ' + NewExceptionData.length);
	var i; 
	// Start of xml file 'array'
	// Documents are being pulled through firebase in this case thier are 4            
	var root, array;
	var builder = require('xmlbuilder');
	root = builder.create('plist',{ version: '1.0', encoding: 'UTF-8', standalone: true });
	array = root.ele('dict').e('key','kioskSettings').up();
	
	// var array = builder.create('array')
	for (i = 0; i < NewDefaultData.length; i++)  { 
	// Firebase collection format to output to console
		var type = '', value = '';
		switch (NewDefaultData[i].type){
		case 'string':
			var CheckName = CheckValueExists(NewExceptionData, 'name', NewDefaultData[i].name, 'stringvalue');
			if (CheckName  != 'notfound') { 
				value = CheckName;
			} else {
				value =  NewDefaultData[i].stringvalue;
			}
			type = 'string';
			break;
		case 'integer': type = 'integer', value = NewDefaultData[i].integervalue; break;
		case 'real': type = 'real', value = NewDefaultData[i].realvalue; break;
		case 'boolean': type = NewDefaultData[i].booleanvalue.toString(); break;
		default: break;    
		} // XML format for console
		array.e('array')
			.e('dict')
			.e('key','Key').up()
			.e('string', NewDefaultData[i].name).up()
			.e('key','Value').up()
			.e([type]).r([value]).up();
	}        
	// making xml readable | // console.log(xml); | // newarray.push(array) | // console.log(array) | // outputing xml to console | // console.log( array.toString()) | // array.e('bla')
	array.end({ pretty: true });    
	//console.log (root.toString());
	return root.toString();
}

// Outputting xml to browser
var app = express();
app.get('/', function(req, res  ) {
	// firebase utils
	var DefaultData = [];
	var db = admin.firestore();
	// gathering the data from firebase collection
	db.collection('xmltest')
		.get()
		.then((snapshot) => {
			snapshot.forEach(doc => {
				const DData = {
					'portalid': doc.data().portalid,
					'name': doc.data().name,
					'type': doc.data().type,
					'integervalue': doc.data().integervalue,
					'realvalue': doc.data().realvalue,
					'booleanvalue': doc.data().booleanvalue,
					'stringvalue': doc.data().stringvalue,
				};
				DefaultData.push(DData); 
			});

			var ExceptionData = [];
			db.collection('Exceptions')
				.get()
				.then((snapshot) => {
					snapshot.forEach(doc => {
						const EData = {
							'portalid': doc.data().portalid,
							'name': doc.data().name,
							'type': doc.data().type,
							'integervalue': doc.data().integervalue,
							'realvalue': doc.data().realvalue,
							'booleanvalue': doc.data().booleanvalue,
							'stringvalue': doc.data().stringvalue,
						};  
						//pushing JSON to console
						ExceptionData.push(EData);
					});
					console.log('1.ExceptionData.length = ' + ExceptionData.length);
					// function to convert json to xml
					//console.log(json)
					console.log('2.DefaultData.length = ' + DefaultData.length);
					console.log('2.ExceptionData.length = ' + ExceptionData.length);
					let xmloutput	= CreateXML(DefaultData, ExceptionData);		
					res.set('Content-Type', 'text/xml');
					res.send(xmloutput);
				})
				// catching errors when present
				.catch((error) => {
					console.log(JSON.stringify(error));
				});
		});
});
// Server start on 8888
var server = app.listen(3030, function(){
	// var host = server.address().address;
	var port = server.address().port;
	console.log('Were live on:', port);
});