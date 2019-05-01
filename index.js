const express = require('express');
const app = express();
var mysql = require('mysql')
var bodyParser = require('body-parser')
var mysql = require('mysql2'),
    url = require('url'),
    SocksConnection = require('socksjs');

const countries = [{"name":"Afghanistan","alpha-2":"AF","country-code":"004"},{"name":"Åland Islands","alpha-2":"AX","country-code":"248"},{"name":"Albania","alpha-2":"AL","country-code":"008"},{"name":"Algeria","alpha-2":"DZ","country-code":"012"},{"name":"American Samoa","alpha-2":"AS","country-code":"016"},{"name":"Andorra","alpha-2":"AD","country-code":"020"},{"name":"Angola","alpha-2":"AO","country-code":"024"},{"name":"Anguilla","alpha-2":"AI","country-code":"660"},{"name":"Antarctica","alpha-2":"AQ","country-code":"010"},{"name":"Antigua and Barbuda","alpha-2":"AG","country-code":"028"},{"name":"Argentina","alpha-2":"AR","country-code":"032"},{"name":"Armenia","alpha-2":"AM","country-code":"051"},{"name":"Aruba","alpha-2":"AW","country-code":"533"},{"name":"Australia","alpha-2":"AU","country-code":"036"},{"name":"Austria","alpha-2":"AT","country-code":"040"},{"name":"Azerbaijan","alpha-2":"AZ","country-code":"031"},{"name":"Bahamas","alpha-2":"BS","country-code":"044"},{"name":"Bahrain","alpha-2":"BH","country-code":"048"},{"name":"Bangladesh","alpha-2":"BD","country-code":"050"},{"name":"Barbados","alpha-2":"BB","country-code":"052"},{"name":"Belarus","alpha-2":"BY","country-code":"112"},{"name":"Belgium","alpha-2":"BE","country-code":"056"},{"name":"Belize","alpha-2":"BZ","country-code":"084"},{"name":"Benin","alpha-2":"BJ","country-code":"204"},{"name":"Bermuda","alpha-2":"BM","country-code":"060"},{"name":"Bhutan","alpha-2":"BT","country-code":"064"},{"name":"Bolivia (Plurinational State of)","alpha-2":"BO","country-code":"068"},{"name":"Bonaire, Sint Eustatius and Saba","alpha-2":"BQ","country-code":"535"},{"name":"Bosnia and Herzegovina","alpha-2":"BA","country-code":"070"},{"name":"Botswana","alpha-2":"BW","country-code":"072"},{"name":"Bouvet Island","alpha-2":"BV","country-code":"074"},{"name":"Brazil","alpha-2":"BR","country-code":"076"},{"name":"British Indian Ocean Territory","alpha-2":"IO","country-code":"086"},{"name":"Brunei Darussalam","alpha-2":"BN","country-code":"096"},{"name":"Bulgaria","alpha-2":"BG","country-code":"100"},{"name":"Burkina Faso","alpha-2":"BF","country-code":"854"},{"name":"Burundi","alpha-2":"BI","country-code":"108"},{"name":"Cabo Verde","alpha-2":"CV","country-code":"132"},{"name":"Cambodia","alpha-2":"KH","country-code":"116"},{"name":"Cameroon","alpha-2":"CM","country-code":"120"},{"name":"Canada","alpha-2":"CA","country-code":"124"},{"name":"Cayman Islands","alpha-2":"KY","country-code":"136"},{"name":"Central African Republic","alpha-2":"CF","country-code":"140"},{"name":"Chad","alpha-2":"TD","country-code":"148"},{"name":"Chile","alpha-2":"CL","country-code":"152"},{"name":"China","alpha-2":"CN","country-code":"156"},{"name":"Christmas Island","alpha-2":"CX","country-code":"162"},{"name":"Cocos (Keeling) Islands","alpha-2":"CC","country-code":"166"},{"name":"Colombia","alpha-2":"CO","country-code":"170"},{"name":"Comoros","alpha-2":"KM","country-code":"174"},{"name":"Congo","alpha-2":"CG","country-code":"178"},{"name":"Congo, Democratic Republic of the","alpha-2":"CD","country-code":"180"},{"name":"Cook Islands","alpha-2":"CK","country-code":"184"},{"name":"Costa Rica","alpha-2":"CR","country-code":"188"},{"name":"Côte d'Ivoire","alpha-2":"CI","country-code":"384"},{"name":"Croatia","alpha-2":"HR","country-code":"191"},{"name":"Cuba","alpha-2":"CU","country-code":"192"},{"name":"Curaçao","alpha-2":"CW","country-code":"531"},{"name":"Cyprus","alpha-2":"CY","country-code":"196"},{"name":"Czechia","alpha-2":"CZ","country-code":"203"},{"name":"Denmark","alpha-2":"DK","country-code":"208"},{"name":"Djibouti","alpha-2":"DJ","country-code":"262"},{"name":"Dominica","alpha-2":"DM","country-code":"212"},{"name":"Dominican Republic","alpha-2":"DO","country-code":"214"},{"name":"Ecuador","alpha-2":"EC","country-code":"218"},{"name":"Egypt","alpha-2":"EG","country-code":"818"},{"name":"El Salvador","alpha-2":"SV","country-code":"222"},{"name":"Equatorial Guinea","alpha-2":"GQ","country-code":"226"},{"name":"Eritrea","alpha-2":"ER","country-code":"232"},{"name":"Estonia","alpha-2":"EE","country-code":"233"},{"name":"Eswatini","alpha-2":"SZ","country-code":"748"},{"name":"Ethiopia","alpha-2":"ET","country-code":"231"},{"name":"Falkland Islands (Malvinas)","alpha-2":"FK","country-code":"238"},{"name":"Faroe Islands","alpha-2":"FO","country-code":"234"},{"name":"Fiji","alpha-2":"FJ","country-code":"242"},{"name":"Finland","alpha-2":"FI","country-code":"246"},{"name":"France","alpha-2":"FR","country-code":"250"},{"name":"French Guiana","alpha-2":"GF","country-code":"254"},{"name":"French Polynesia","alpha-2":"PF","country-code":"258"},{"name":"French Southern Territories","alpha-2":"TF","country-code":"260"},{"name":"Gabon","alpha-2":"GA","country-code":"266"},{"name":"Gambia","alpha-2":"GM","country-code":"270"},{"name":"Georgia","alpha-2":"GE","country-code":"268"},{"name":"Germany","alpha-2":"DE","country-code":"276"},{"name":"Ghana","alpha-2":"GH","country-code":"288"},{"name":"Gibraltar","alpha-2":"GI","country-code":"292"},{"name":"Greece","alpha-2":"GR","country-code":"300"},{"name":"Greenland","alpha-2":"GL","country-code":"304"},{"name":"Grenada","alpha-2":"GD","country-code":"308"},{"name":"Guadeloupe","alpha-2":"GP","country-code":"312"},{"name":"Guam","alpha-2":"GU","country-code":"316"},{"name":"Guatemala","alpha-2":"GT","country-code":"320"},{"name":"Guernsey","alpha-2":"GG","country-code":"831"},{"name":"Guinea","alpha-2":"GN","country-code":"324"},{"name":"Guinea-Bissau","alpha-2":"GW","country-code":"624"},{"name":"Guyana","alpha-2":"GY","country-code":"328"},{"name":"Haiti","alpha-2":"HT","country-code":"332"},{"name":"Heard Island and McDonald Islands","alpha-2":"HM","country-code":"334"},{"name":"Holy See","alpha-2":"VA","country-code":"336"},{"name":"Honduras","alpha-2":"HN","country-code":"340"},{"name":"Hong Kong","alpha-2":"HK","country-code":"344"},{"name":"Hungary","alpha-2":"HU","country-code":"348"},{"name":"Iceland","alpha-2":"IS","country-code":"352"},{"name":"India","alpha-2":"IN","country-code":"356"},{"name":"Indonesia","alpha-2":"ID","country-code":"360"},{"name":"Iran (Islamic Republic of)","alpha-2":"IR","country-code":"364"},{"name":"Iraq","alpha-2":"IQ","country-code":"368"},{"name":"Ireland","alpha-2":"IE","country-code":"372"},{"name":"Isle of Man","alpha-2":"IM","country-code":"833"},{"name":"Israel","alpha-2":"IL","country-code":"376"},{"name":"Italy","alpha-2":"IT","country-code":"380"},{"name":"Jamaica","alpha-2":"JM","country-code":"388"},{"name":"Japan","alpha-2":"JP","country-code":"392"},{"name":"Jersey","alpha-2":"JE","country-code":"832"},{"name":"Jordan","alpha-2":"JO","country-code":"400"},{"name":"Kazakhstan","alpha-2":"KZ","country-code":"398"},{"name":"Kenya","alpha-2":"KE","country-code":"404"},{"name":"Kiribati","alpha-2":"KI","country-code":"296"},{"name":"Korea (Democratic People's Republic of)","alpha-2":"KP","country-code":"408"},{"name":"Korea, Republic of","alpha-2":"KR","country-code":"410"},{"name":"Kuwait","alpha-2":"KW","country-code":"414"},{"name":"Kyrgyzstan","alpha-2":"KG","country-code":"417"},{"name":"Lao People's Democratic Republic","alpha-2":"LA","country-code":"418"},{"name":"Latvia","alpha-2":"LV","country-code":"428"},{"name":"Lebanon","alpha-2":"LB","country-code":"422"},{"name":"Lesotho","alpha-2":"LS","country-code":"426"},{"name":"Liberia","alpha-2":"LR","country-code":"430"},{"name":"Libya","alpha-2":"LY","country-code":"434"},{"name":"Liechtenstein","alpha-2":"LI","country-code":"438"},{"name":"Lithuania","alpha-2":"LT","country-code":"440"},{"name":"Luxembourg","alpha-2":"LU","country-code":"442"},{"name":"Macao","alpha-2":"MO","country-code":"446"},{"name":"Madagascar","alpha-2":"MG","country-code":"450"},{"name":"Malawi","alpha-2":"MW","country-code":"454"},{"name":"Malaysia","alpha-2":"MY","country-code":"458"},{"name":"Maldives","alpha-2":"MV","country-code":"462"},{"name":"Mali","alpha-2":"ML","country-code":"466"},{"name":"Malta","alpha-2":"MT","country-code":"470"},{"name":"Marshall Islands","alpha-2":"MH","country-code":"584"},{"name":"Martinique","alpha-2":"MQ","country-code":"474"},{"name":"Mauritania","alpha-2":"MR","country-code":"478"},{"name":"Mauritius","alpha-2":"MU","country-code":"480"},{"name":"Mayotte","alpha-2":"YT","country-code":"175"},{"name":"Mexico","alpha-2":"MX","country-code":"484"},{"name":"Micronesia (Federated States of)","alpha-2":"FM","country-code":"583"},{"name":"Moldova, Republic of","alpha-2":"MD","country-code":"498"},{"name":"Monaco","alpha-2":"MC","country-code":"492"},{"name":"Mongolia","alpha-2":"MN","country-code":"496"},{"name":"Montenegro","alpha-2":"ME","country-code":"499"},{"name":"Montserrat","alpha-2":"MS","country-code":"500"},{"name":"Morocco","alpha-2":"MA","country-code":"504"},{"name":"Mozambique","alpha-2":"MZ","country-code":"508"},{"name":"Myanmar","alpha-2":"MM","country-code":"104"},{"name":"Namibia","alpha-2":"NA","country-code":"516"},{"name":"Nauru","alpha-2":"NR","country-code":"520"},{"name":"Nepal","alpha-2":"NP","country-code":"524"},{"name":"Netherlands","alpha-2":"NL","country-code":"528"},{"name":"New Caledonia","alpha-2":"NC","country-code":"540"},{"name":"New Zealand","alpha-2":"NZ","country-code":"554"},{"name":"Nicaragua","alpha-2":"NI","country-code":"558"},{"name":"Niger","alpha-2":"NE","country-code":"562"},{"name":"Nigeria","alpha-2":"NG","country-code":"566"},{"name":"Niue","alpha-2":"NU","country-code":"570"},{"name":"Norfolk Island","alpha-2":"NF","country-code":"574"},{"name":"North Macedonia","alpha-2":"MK","country-code":"807"},{"name":"Northern Mariana Islands","alpha-2":"MP","country-code":"580"},{"name":"Norway","alpha-2":"NO","country-code":"578"},{"name":"Oman","alpha-2":"OM","country-code":"512"},{"name":"Pakistan","alpha-2":"PK","country-code":"586"},{"name":"Palau","alpha-2":"PW","country-code":"585"},{"name":"Palestine, State of","alpha-2":"PS","country-code":"275"},{"name":"Panama","alpha-2":"PA","country-code":"591"},{"name":"Papua New Guinea","alpha-2":"PG","country-code":"598"},{"name":"Paraguay","alpha-2":"PY","country-code":"600"},{"name":"Peru","alpha-2":"PE","country-code":"604"},{"name":"Philippines","alpha-2":"PH","country-code":"608"},{"name":"Pitcairn","alpha-2":"PN","country-code":"612"},{"name":"Poland","alpha-2":"PL","country-code":"616"},{"name":"Portugal","alpha-2":"PT","country-code":"620"},{"name":"Puerto Rico","alpha-2":"PR","country-code":"630"},{"name":"Qatar","alpha-2":"QA","country-code":"634"},{"name":"Réunion","alpha-2":"RE","country-code":"638"},{"name":"Romania","alpha-2":"RO","country-code":"642"},{"name":"Russian Federation","alpha-2":"RU","country-code":"643"},{"name":"Rwanda","alpha-2":"RW","country-code":"646"},{"name":"Saint Barthélemy","alpha-2":"BL","country-code":"652"},{"name":"Saint Helena, Ascension and Tristan da Cunha","alpha-2":"SH","country-code":"654"},{"name":"Saint Kitts and Nevis","alpha-2":"KN","country-code":"659"},{"name":"Saint Lucia","alpha-2":"LC","country-code":"662"},{"name":"Saint Martin (French part)","alpha-2":"MF","country-code":"663"},{"name":"Saint Pierre and Miquelon","alpha-2":"PM","country-code":"666"},{"name":"Saint Vincent and the Grenadines","alpha-2":"VC","country-code":"670"},{"name":"Samoa","alpha-2":"WS","country-code":"882"},{"name":"San Marino","alpha-2":"SM","country-code":"674"},{"name":"Sao Tome and Principe","alpha-2":"ST","country-code":"678"},{"name":"Saudi Arabia","alpha-2":"SA","country-code":"682"},{"name":"Senegal","alpha-2":"SN","country-code":"686"},{"name":"Serbia","alpha-2":"RS","country-code":"688"},{"name":"Seychelles","alpha-2":"SC","country-code":"690"},{"name":"Sierra Leone","alpha-2":"SL","country-code":"694"},{"name":"Singapore","alpha-2":"SG","country-code":"702"},{"name":"Sint Maarten (Dutch part)","alpha-2":"SX","country-code":"534"},{"name":"Slovakia","alpha-2":"SK","country-code":"703"},{"name":"Slovenia","alpha-2":"SI","country-code":"705"},{"name":"Solomon Islands","alpha-2":"SB","country-code":"090"},{"name":"Somalia","alpha-2":"SO","country-code":"706"},{"name":"South Africa","alpha-2":"ZA","country-code":"710"},{"name":"South Georgia and the South Sandwich Islands","alpha-2":"GS","country-code":"239"},{"name":"South Sudan","alpha-2":"SS","country-code":"728"},{"name":"Spain","alpha-2":"ES","country-code":"724"},{"name":"Sri Lanka","alpha-2":"LK","country-code":"144"},{"name":"Sudan","alpha-2":"SD","country-code":"729"},{"name":"Suriname","alpha-2":"SR","country-code":"740"},{"name":"Svalbard and Jan Mayen","alpha-2":"SJ","country-code":"744"},{"name":"Sweden","alpha-2":"SE","country-code":"752"},{"name":"Switzerland","alpha-2":"CH","country-code":"756"},{"name":"Syrian Arab Republic","alpha-2":"SY","country-code":"760"},{"name":"Taiwan, Province of China","alpha-2":"TW","country-code":"158"},{"name":"Tajikistan","alpha-2":"TJ","country-code":"762"},{"name":"Tanzania, United Republic of","alpha-2":"TZ","country-code":"834"},{"name":"Thailand","alpha-2":"TH","country-code":"764"},{"name":"Timor-Leste","alpha-2":"TL","country-code":"626"},{"name":"Togo","alpha-2":"TG","country-code":"768"},{"name":"Tokelau","alpha-2":"TK","country-code":"772"},{"name":"Tonga","alpha-2":"TO","country-code":"776"},{"name":"Trinidad and Tobago","alpha-2":"TT","country-code":"780"},{"name":"Tunisia","alpha-2":"TN","country-code":"788"},{"name":"Turkey","alpha-2":"TR","country-code":"792"},{"name":"Turkmenistan","alpha-2":"TM","country-code":"795"},{"name":"Turks and Caicos Islands","alpha-2":"TC","country-code":"796"},{"name":"Tuvalu","alpha-2":"TV","country-code":"798"},{"name":"Uganda","alpha-2":"UG","country-code":"800"},{"name":"Ukraine","alpha-2":"UA","country-code":"804"},{"name":"United Arab Emirates","alpha-2":"AE","country-code":"784"},{"name":"United Kingdom of Great Britain and Northern Ireland","alpha-2":"GB","country-code":"826"},{"name":"United States of America","alpha-2":"US","country-code":"840"},{"name":"United States","alpha-2":"US","country-code":"840"},{"name":"United States Minor Outlying Islands","alpha-2":"UM","country-code":"581"},{"name":"Uruguay","alpha-2":"UY","country-code":"858"},{"name":"Uzbekistan","alpha-2":"UZ","country-code":"860"},{"name":"Vanuatu","alpha-2":"VU","country-code":"548"},{"name":"Venezuela (Bolivarian Republic of)","alpha-2":"VE","country-code":"862"},{"name":"Viet Nam","alpha-2":"VN","country-code":"704"},{"name":"Virgin Islands (British)","alpha-2":"VG","country-code":"092"},{"name":"Virgin Islands (U.S.)","alpha-2":"VI","country-code":"850"},{"name":"Wallis and Futuna","alpha-2":"WF","country-code":"876"},{"name":"Western Sahara","alpha-2":"EH","country-code":"732"},{"name":"Yemen","alpha-2":"YE","country-code":"887"},{"name":"Zambia","alpha-2":"ZM","country-code":"894"},{"name":"Zimbabwe","alpha-2":"ZW","country-code":"716"}]
// var iSDK = require('infusionsoft');
// var client = new iSDK('js133', '802b05033fb43899514394f4399c3bbf');

// console.log(client);



app.use(bodyParser.json());

// var connection = mysql.createConnection({
//   host: '50.87.137.25',
//   user: 'iocdevco_eric0',
//   password: 'brick8',
//   //database: 'iocdevco_iocdev'
//   database: 'iocdevco_iocliv'
// })

// console.log(process.env.FIXIE_URL);


var remote_options = {
    host:'50.87.137.25',
    port: 3306
};



var proxy = url.parse(process.env.QUOTAGUARDSTATIC_URL),
    auth = proxy.auth,
    username = auth.split(':')[0],
    pass = auth.split(':')[1];

var sock_options = {
    host: proxy.hostname,
    port: 1080,
    user: username,
    pass: pass
};

var sockConn = new SocksConnection(remote_options, sock_options);

var dbConnection = mysql.createConnection({
    user: 'iocdevco_eric0',
    database: 'iocdevco_iocdev',
    password: 'brick8',
    stream: sockConn
});


app.get('/', (req, res) => {
	res.send('App is up and running');
})


app.use(bodyParser.urlencoded({ extended: false }))

function clearCache(id) {
	console.log('entity id passed from first query', id)
	var myPromise = new Promise(function(resolve, reject){
		console.log('inside promise');
	   // clear cache
			  dbConnection.query('SELECT * FROM `users` WHERE uid = ?', [id], function(err, result2) {
					if (err) {
						console.log('err', err)
						reject(err)
					}

					console.log('result2', result2)
			      result2.forEach(function(row) {
			      	console.log('clear cache for...', row.name);
			      	dbConnection.query('DELETE FROM `cache_entity_user` WHERE data LIKE ?',['%'+row.name+'%'], function(err, result3) {
			      			console.log('cache cleared', result3)
							if (err) throw err
							console.log('result3', result3);
							resolve(id)
		      			})
				  })
			  
				  })
		})
	return myPromise;
}
function updateStatus(id, status) {
	console.log('entity id passed from first query', id);
	var myPromise = new Promise(function(resolve, reject){
	   			dbConnection.query('UPDATE `users` SET `status` = ? WHERE `uid` = ?',[status, id], function (err, statusUpdate) {
					    if (err) {
					    	console.log('error', err)
					    	reject(err);
					    }
					    console.log(statusUpdate)
					    console.log(statusUpdate.affectedRows + " record(s) updated in users");
					    resolve(id)
					  });
		})
	return myPromise;
}
function updateDate(newEnd, id) {

	console.log('id passed from first query', id);
	var myPromise = new Promise(function(resolve, reject){
		dbConnection.query('UPDATE `field_data_field_start_date` SET `field_start_date_value2` = ? WHERE `entity_id` = ?',[newEnd, id], function (err, dateStart) {
					    if (err) {
					    	console.log('error', err)
					    	reject(err);
					    }
					    console.log(dateStart)
					    console.log(dateStart.affectedRows + " record(s) updated in field_data_field_start_date");

					    dbConnection.query('UPDATE `field_revision_field_start_date` SET `field_start_date_value2` = ? WHERE `entity_id` = ?',[newEnd, id], function (err, revisionStart) {
					    if (err) throw err;
					    console.log(revisionStart)
					    console.log(revisionStart.affectedRows + " record(s) updated in field_revision_field_start_date");
					    resolve({results: {dateStart,revisionStart}})
					  });

					  });
		})
	return myPromise;

}
function createDrupalInfusionsoftLink(drupalId, infusionsoftId) {
	console.log('drupal id passed from first query', drupalId);
	console.log('infusionsoftId id passed from first query', infusionsoftId);
	var myPromise = new Promise(function(resolve, reject){
					    dbConnection.query('INSERT into `field_data_field_infusionsoft_id` (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_infusionsoft_id_value) VALUES (?,?,?,?,?,?,?,?)', ['user', 'user', 0, drupalId,drupalId,'und', 0, infusionsoftId], function (err, insertRes2) {
					    	if (err) {
						    	console.log('error', err)
						    	reject(err);
						    }
						    console.log('insert to data results', insertRes2)
					    	resolve(insertRes2)
					  });
		return myPromise;
					  });

	
}
function updateType(userId, label) {
	var labelid = Number(label);
	console.log('labelId', labelid);
	console.log(typeof labelid)
	var myPromise = new Promise(function(resolve, reject){	
	 dbConnection.query('UPDATE `field_revision_field_member_type` SET `field_member_type_target_id` = ? WHERE `entity_id` = ?', [labelid, userId], function (err, result) {
		    if (err) {
		    	console.log('error', err)
		    	reject(err);
		    }
		    console.log('first type result', result)
		    dbConnection.query('UPDATE `field_data_field_member_type` SET `field_member_type_target_id` = ? WHERE `entity_id` = ?',[ labelid, userId], function (err, result2) {
		    if (err) throw err;
		    console.log('second type result', result2)
		    resolve({results: result2})
		  });

		});
	});
	return myPromise;

}
function updateRole(userId, role) {
	var myPromise = new Promise(function(resolve, reject){	
		dbConnection.query('INSERT into `users_roles` (uid, rid) VALUES (?,?);', [userId, role], function (err, roleResponse) {
			if (err) reject(err);
			console.log('roleResponse', roleResponse);
			resolve(roleResponse);
		});
	});
	return myPromise;
}
function insertUserInfo(id, postBody, newEnd, startDate) {
	var myPromise = new Promise(function(resolve, reject){
		console.log('start', startDate);
		    dbConnection.query('INSERT into `field_data_field_member_address` (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_member_address_country, field_member_address_administrative_area, field_member_address_locality, field_member_address_postal_code, field_member_address_thoroughfare) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', ['user', 'user', 0, id,id,'und', 0, 'US', postBody['field_member_address:administrative_area'], postBody['field_member_address:locality'], postBody['field_member_address:postal_code'], postBody['field_member_address:thoroughfare'] ], function (err, insertRes2) {
		    	if (err) {
			    	console.log('error', err)
			    	reject(err);
			    }
			    console.log('insert to data results', insertRes2)
			    //`field_revision_field_start_date`
			    
			    dbConnection.query('INSERT into `field_data_field_start_date` (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_start_date_value, field_start_date_value2) VALUES (?,?,?,?,?,?,?,?,?);', ['user', 'user', 0, id,id,'und', 0, startDate, newEnd], function (err, dateStart) {
			    	if (err) {
				    	console.log('error', err)
				    	reject(err);
			    	} else {

			    		console.log('dateStart', dateStart)
			    		console.log('firstName', postBody.field_name_first)
			    		console.log('lastName', postBody.field_name_last)
			    		console.log('member TYPE:::', postBody['field_member_type:label'])
			    		dbConnection.query('INSERT into `field_data_field_member_type` (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_member_type_target_id) VALUES (?,?,?,?,?,?,?,?)', ['user', 'user', 0, id,id,'und', 0, postBody['field_member_type:label']], function(err, memberTypeRes) {
				    			if (err) reject(err)
				    				console.log('memberTypeRes', memberTypeRes)
				    				dbConnection.query('INSERT into `field_revision_field_member_type` (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_member_type_target_id) VALUES (?,?,?,?,?,?,?,?)', ['user', 'user', 0, id,id,'und', 0, postBody['field_member_type:label']], function(err, memberTypeRes2) {
				    					if (err) reject(err)
							    			console.log('memberTypeRes2', memberTypeRes2)
							    			dbConnection.query('INSERT into `field_data_field_name_last` (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_name_last_value) VALUES (?,?,?,?,?,?,?,?); ', ['user', 'user', 0, id,id,'und', 0, postBody.field_name_last ], function (err, lastnameResponse) {
							    			if (err) reject(err);
							    			console.log('lastnameResponse', lastnameResponse);
								    			dbConnection.query('INSERT into `field_data_field_name_first` (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_name_first_value) VALUES (?,?,?,?,?,?,?,?);', ['user', 'user', 0, id,id,'und', 0, postBody.field_name_first], function (err, firstnameResponse) {
								    			if (err) reject(err);
								    			console.log('firstnameResponse', firstnameResponse);
									    			dbConnection.query('INSERT into `users_roles` (uid, rid) VALUES (?,?);', [id, postBody.roles], function (err, roleResponse) {
									    			if (err) reject(err);
									    			console.log('roleResponse', roleResponse);
													resolve(roleResponse);
												})
											})
							    		});
							    	})
				    		})
			    	}
			    })
		    	
				});
		})
		return myPromise;
}
let shortCountry = countries.find(function(currentValue) {
	return currentValue.name == 'United States';
})
console.log({shortCountry})
function updateAddressInfo(postBody, uid) {
	var myPromise = new Promise(function(resolve, reject){	
		console.log({postBody})
		console.log(postBody['field_member_address:country'])
		let shortCountry = countries.find(function(currentValue) {
			return currentValue.name == postBody['field_member_address:country'];
		})
		console.log('short name: ',shortCountry)
		
		// dbConnection.query('UPDATE `field_data_field_member_address` SET `field_member_address_thoroughfare` = ?, `field_member_address_administrative_area` = ?, `field_member_address_country` = ?, `field_member_address_postal_code` = ?, `field_member_address_locality` = ? WHERE `entity_id` = ?;' , [postBody['field_member_address:thoroughfare'], postBody['field_member_address:administrative_area'], postBody['field_member_address:country'], postBody['field_member_address:postal_code'], postBody['field_member_address:locality'], uid], function(err, updateAddressResponse) {
			dbConnection.query('UPDATE `field_data_field_member_address` SET `field_member_address_thoroughfare` = ?, `field_member_address_postal_code` = ?, `field_member_address_locality` = ? WHERE `entity_id` = ?;' , [postBody['field_member_address:thoroughfare'], postBody['field_member_address:postal_code'], postBody['field_member_address:locality'], uid], function(err, updateAddressResponse) {
			if (err) reject(err);
				console.log('updateAddressResponse', updateAddressResponse)
				resolve(updateAddressResponse);
		 })

	});
	return myPromise;
}

function updateName(postBody, uid) {
	var myPromise = new Promise(function(resolve, reject){	
		console.log('inside updateName', {postBody})
		// field_name_first: 'Sue',
		//`field_data_field_name_first` 

		// 	field_name_last: 'Brennick',
		// field_data_field_name_last
		dbConnection.query('UPDATE `field_data_field_name_first` SET `field_name_first_value` = ? WHERE `entity_id` = ?;' , [postBody['field_name_first'],  uid], function(err, updateFirstNameRes) {
			if (err) reject(err);
				console.log('updateFirstNameRes', updateFirstNameRes);
				// resolve(updateFirstNameRes);

				dbConnection.query('UPDATE `field_data_field_name_last` SET `field_name_last_value` = ? WHERE `entity_id` = ?;' , [postBody['field_name_last'],  uid], function(err, updatelastNameRes) {
					if (err) reject(err);
						console.log('updatelastNameRes', updatelastNameRes);
						// resolve(updatelastNameRes);
				 })
		 })

	});
	return myPromise;
}


//update user
app.post('/update', (req, res) => {
	var postBody = req.body;
	console.log({postBody});
		let sample = {
			// field_name_first: 'Sue',
			// field_name_last: 'Brennick',
			// 'field_member_address:thoroughfare': '115 Mill Street',
			field_infusionsoft_id: '3',
			mail: 'Sue.Brennick@InstituteofCoaching.org',
			// 'field_member_address:thoroughfare': '115 Mill Street',
			// 'field_member_address:locality': 'Belmont',
			// 'field_member_address:administrative_area': 'MA',
			// 'field_member_address:country': '',
			// 'field_member_address:postal_code': '01720' 
		}
	
		 dbConnection.query('SELECT * FROM `users` WHERE mail = ?',[postBody.mail], function(err, result) {
			if (err) throw err
			
				res.json({msg: 'got it'})
						updateAddressInfo(postBody, result[0].uid)
						.then(addressResponse => {
							console.log({addressResponse})
							return updateName(postBody, result[0].uid);
						})
						.then(afterNameUpdate => {
							console.log({afterNameUpdate})
							return clearCache(result[0].uid)
						})
						.then(afterClearCache => {
							console.log({afterClearCache})
						})
						.catch((err) => {
							console.log('error', err);
						})
		 })
})

app.post('/', (req, res) => {
	var postBody = req.body;

	var len = Object.keys(postBody).length;
	console.log(len)
	console.log('postBody', postBody);

	if(len > 6){
		console.log('this is a new member')
		rand = Math.floor(Math.random()*90000) + 10000;
		console.log('this random number', rand);
		console.log('name', postBody.name);
		console.log('email', postBody.mail);
		console.log('rand', rand)
		console.log('infusionsoft id', postBody.field_infusionsoft_id)
		var rightNow = Date.now();
		var firstName = postBody.field_infusionsoft_id;

		// password1ioc
		//var values = [rand, postBody.name, '$S$D26haBLqyyr4d5lvfmWMyjDH6Can/no3t1tsREuiHnXUzGbJdNnn', postBody.mail, 'filtered_html', rightNow, 1, postBody.mail]
		var values = [rand, postBody.mail, '$S$D26haBLqyyr4d5lvfmWMyjDH6Can/no3t1tsREuiHnXUzGbJdNnn', postBody.mail, 'filtered_html', rightNow, 1, postBody.mail]
		console.log('values', values);
		console.log('val len', values.length)




		dbConnection.query('INSERT into `users` (uid, name, pass, mail, signature_format, created, status, init) VALUES (?,?,?,?,?,?,?,?)',values, function(inserterr, insresult) {
			console.log('result', insresult);
			console.log('err', inserterr)
      			if (inserterr) throw inserterr
      			//res.json({message: insresult})
      			updateStatus(rand, 1)
					.then((resp) => {
						
						console.log('cache response', resp);

						var dateString = postBody['field_start_date:end'];
						var newDate = new Date(dateString);
						var year = newDate.getFullYear();
						var month = newDate.getMonth()+1;
						var day = newDate.getDate();
						var newYear = year+1
						var c = new Date(month+'/'+day+'/'+newYear);
						var originalDate = new Date(month+'/'+day+'/'+year)
						var startDate = originalDate.toISOString();
						var newEnd = c.toISOString();
						console.log('new end', newEnd);
						console.log('id', postBody.field_infusionsoft_id);
						return insertUserInfo(rand, postBody, newEnd, startDate)
					})
					.then((res) => {
						console.log('result before updating link', res)
						return createDrupalInfusionsoftLink(rand, postBody.field_infusionsoft_id)
					})
					.then((linkRes) => {
						console.log('link res', linkRes);
					// 	return insertUserInfo(rand, postBody);
					// }).then((insertRes) => 
						return clearCache(rand)
					})
					.then((cacheResp) => {
						console.log('last step - cache cleared: ', cacheResp);
						res.json({message: 'received'})
					})
					.catch((err) => {
						console.log('error', err);
					})
	});

	} else if (len <= 6) {
		var field_infusionsoft_id_value = postBody.field_infusionsoft_id;
		console.log('id', field_infusionsoft_id_value);
		console.log('type', typeof field_infusionsoft_id_value);
		console.log('it is a renewal or lapsed')
		
		dbConnection.query('SELECT * FROM `field_data_field_infusionsoft_id` WHERE field_infusionsoft_id_value = ?',[field_infusionsoft_id_value], function(err, result) {
      			if (err) throw err
      				console.log('result', result)
			      	var entity = result[0].entity_id;
			      	var dateString = postBody['field_start_date:end'];
			      	var status = postBody['status'];
			      	if (status == 'Lapsed') {
			      		var Dstatus = 0;
			      	} else {
			      		var Dstatus = 1;
			      	}
			      	if (dateString) {
			      		var newDate = new Date(dateString);
						var year = newDate.getFullYear();
						var month = newDate.getMonth()+1;
						var day = newDate.getDate();
						var newYear = year+1;
						var c = new Date(month+'/'+day+'/'+newYear);
						var newEnd = c.toISOString();
						console.log(newEnd);
			      	}

			      	console.log('entity', entity);

					updateStatus(entity, Dstatus)
					.then((resp) => {
						console.log('first resp', resp)
						if (postBody.roles) {
							console.log('we got roles, need to update it')
							updateRole(entity, postBody.roles)
							.then((roleResp) => {
								console.log('role update response', roleResp)
								return updateDate(newEnd, entity)
							})
						}
						return updateDate(newEnd, entity);
					})
					.then((dateResp) => {
						console.log('cache response', dateResp);
						if (postBody['field_member_type:label']) {
							console.log('we got label, need to update it')
							updateType(entity, postBody['field_member_type:label'])
							.then((typeResp) => {
								console.log('type update resp', typeResp)
								return clearCache(entity)
							})
						}
						return clearCache(entity)
					})
					.then((cacheResp) => {
						console.log('last respononse', cacheResp);
					})
					.catch((err) => {
						console.log('error', err);
					})
				  	res.json({message: 'received'})
			})
	} else {
		sockConn.dispose();
		res.json({message: 'got the post but did not update the database'})
	}
});



app.listen(process.env.PORT || 3001, () => console.log('listening on '+ process.env.PORT))


