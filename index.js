const express = require('express');
const app = express();
var mysql = require('mysql')
var bodyParser = require('body-parser')
var mysql = require('mysql2'),
    url = require('url'),
    SocksConnection = require('socksjs');

const states = [
	{
			"name": "Alabama",
			"abbreviation": "AL"
	},
	{
			"name": "Alaska",
			"abbreviation": "AK"
	},
	{
			"name": "American Samoa",
			"abbreviation": "AS"
	},
	{
			"name": "Arizona",
			"abbreviation": "AZ"
	},
	{
			"name": "Arkansas",
			"abbreviation": "AR"
	},
	{
			"name": "California",
			"abbreviation": "CA"
	},
	{
			"name": "Colorado",
			"abbreviation": "CO"
	},
	{
			"name": "Connecticut",
			"abbreviation": "CT"
	},
	{
			"name": "Delaware",
			"abbreviation": "DE"
	},
	{
			"name": "District Of Columbia",
			"abbreviation": "DC"
	},
	{
			"name": "Federated States Of Micronesia",
			"abbreviation": "FM"
	},
	{
			"name": "Florida",
			"abbreviation": "FL"
	},
	{
			"name": "Georgia",
			"abbreviation": "GA"
	},
	{
			"name": "Guam",
			"abbreviation": "GU"
	},
	{
			"name": "Hawaii",
			"abbreviation": "HI"
	},
	{
			"name": "Idaho",
			"abbreviation": "ID"
	},
	{
			"name": "Illinois",
			"abbreviation": "IL"
	},
	{
			"name": "Indiana",
			"abbreviation": "IN"
	},
	{
			"name": "Iowa",
			"abbreviation": "IA"
	},
	{
			"name": "Kansas",
			"abbreviation": "KS"
	},
	{
			"name": "Kentucky",
			"abbreviation": "KY"
	},
	{
			"name": "Louisiana",
			"abbreviation": "LA"
	},
	{
			"name": "Maine",
			"abbreviation": "ME"
	},
	{
			"name": "Marshall Islands",
			"abbreviation": "MH"
	},
	{
			"name": "Maryland",
			"abbreviation": "MD"
	},
	{
			"name": "Massachusetts",
			"abbreviation": "MA"
	},
	{
			"name": "Michigan",
			"abbreviation": "MI"
	},
	{
			"name": "Minnesota",
			"abbreviation": "MN"
	},
	{
			"name": "Mississippi",
			"abbreviation": "MS"
	},
	{
			"name": "Missouri",
			"abbreviation": "MO"
	},
	{
			"name": "Montana",
			"abbreviation": "MT"
	},
	{
			"name": "Nebraska",
			"abbreviation": "NE"
	},
	{
			"name": "Nevada",
			"abbreviation": "NV"
	},
	{
			"name": "New Hampshire",
			"abbreviation": "NH"
	},
	{
			"name": "New Jersey",
			"abbreviation": "NJ"
	},
	{
			"name": "New Mexico",
			"abbreviation": "NM"
	},
	{
			"name": "New York",
			"abbreviation": "NY"
	},
	{
			"name": "North Carolina",
			"abbreviation": "NC"
	},
	{
			"name": "North Dakota",
			"abbreviation": "ND"
	},
	{
			"name": "Northern Mariana Islands",
			"abbreviation": "MP"
	},
	{
			"name": "Ohio",
			"abbreviation": "OH"
	},
	{
			"name": "Oklahoma",
			"abbreviation": "OK"
	},
	{
			"name": "Oregon",
			"abbreviation": "OR"
	},
	{
			"name": "Palau",
			"abbreviation": "PW"
	},
	{
			"name": "Pennsylvania",
			"abbreviation": "PA"
	},
	{
			"name": "Puerto Rico",
			"abbreviation": "PR"
	},
	{
			"name": "Rhode Island",
			"abbreviation": "RI"
	},
	{
			"name": "South Carolina",
			"abbreviation": "SC"
	},
	{
			"name": "South Dakota",
			"abbreviation": "SD"
	},
	{
			"name": "Tennessee",
			"abbreviation": "TN"
	},
	{
			"name": "Texas",
			"abbreviation": "TX"
	},
	{
			"name": "Utah",
			"abbreviation": "UT"
	},
	{
			"name": "Vermont",
			"abbreviation": "VT"
	},
	{
			"name": "Virgin Islands",
			"abbreviation": "VI"
	},
	{
			"name": "Virginia",
			"abbreviation": "VA"
	},
	{
			"name": "Washington",
			"abbreviation": "WA"
	},
	{
			"name": "West Virginia",
			"abbreviation": "WV"
	},
	{
			"name": "Wisconsin",
			"abbreviation": "WI"
	},
	{
			"name": "Wyoming",
			"abbreviation": "WY"
	}
]
const countries = [{"name":"Afghanistan","two":"AF","country-code":"004"},{"name":"Åland Islands","two":"AX","country-code":"248"},{"name":"Albania","two":"AL","country-code":"008"},{"name":"Algeria","two":"DZ","country-code":"012"},{"name":"American Samoa","two":"AS","country-code":"016"},{"name":"Andorra","two":"AD","country-code":"020"},{"name":"Angola","two":"AO","country-code":"024"},{"name":"Anguilla","two":"AI","country-code":"660"},{"name":"Antarctica","two":"AQ","country-code":"010"},{"name":"Antigua and Barbuda","two":"AG","country-code":"028"},{"name":"Argentina","two":"AR","country-code":"032"},{"name":"Armenia","two":"AM","country-code":"051"},{"name":"Aruba","two":"AW","country-code":"533"},{"name":"Australia","two":"AU","country-code":"036"},{"name":"Austria","two":"AT","country-code":"040"},{"name":"Azerbaijan","two":"AZ","country-code":"031"},{"name":"Bahamas","two":"BS","country-code":"044"},{"name":"Bahrain","two":"BH","country-code":"048"},{"name":"Bangladesh","two":"BD","country-code":"050"},{"name":"Barbados","two":"BB","country-code":"052"},{"name":"Belarus","two":"BY","country-code":"112"},{"name":"Belgium","two":"BE","country-code":"056"},{"name":"Belize","two":"BZ","country-code":"084"},{"name":"Benin","two":"BJ","country-code":"204"},{"name":"Bermuda","two":"BM","country-code":"060"},{"name":"Bhutan","two":"BT","country-code":"064"},{"name":"Bolivia (Plurinational State of)","two":"BO","country-code":"068"},{"name":"Bonaire, Sint Eustatius and Saba","two":"BQ","country-code":"535"},{"name":"Bosnia and Herzegovina","two":"BA","country-code":"070"},{"name":"Botswana","two":"BW","country-code":"072"},{"name":"Bouvet Island","two":"BV","country-code":"074"},{"name":"Brazil","two":"BR","country-code":"076"},{"name":"British Indian Ocean Territory","two":"IO","country-code":"086"},{"name":"Brunei Darussalam","two":"BN","country-code":"096"},{"name":"Bulgaria","two":"BG","country-code":"100"},{"name":"Burkina Faso","two":"BF","country-code":"854"},{"name":"Burundi","two":"BI","country-code":"108"},{"name":"Cabo Verde","two":"CV","country-code":"132"},{"name":"Cambodia","two":"KH","country-code":"116"},{"name":"Cameroon","two":"CM","country-code":"120"},{"name":"Canada","two":"CA","country-code":"124"},{"name":"Cayman Islands","two":"KY","country-code":"136"},{"name":"Central African Republic","two":"CF","country-code":"140"},{"name":"Chad","two":"TD","country-code":"148"},{"name":"Chile","two":"CL","country-code":"152"},{"name":"China","two":"CN","country-code":"156"},{"name":"Christmas Island","two":"CX","country-code":"162"},{"name":"Cocos (Keeling) Islands","two":"CC","country-code":"166"},{"name":"Colombia","two":"CO","country-code":"170"},{"name":"Comoros","two":"KM","country-code":"174"},{"name":"Congo","two":"CG","country-code":"178"},{"name":"Congo, Democratic Republic of the","two":"CD","country-code":"180"},{"name":"Cook Islands","two":"CK","country-code":"184"},{"name":"Costa Rica","two":"CR","country-code":"188"},{"name":"Côte d'Ivoire","two":"CI","country-code":"384"},{"name":"Croatia","two":"HR","country-code":"191"},{"name":"Cuba","two":"CU","country-code":"192"},{"name":"Curaçao","two":"CW","country-code":"531"},{"name":"Cyprus","two":"CY","country-code":"196"},{"name":"Czechia","two":"CZ","country-code":"203"},{"name":"Denmark","two":"DK","country-code":"208"},{"name":"Djibouti","two":"DJ","country-code":"262"},{"name":"Dominica","two":"DM","country-code":"212"},{"name":"Dominican Republic (the)","two":"DO","country-code":"214"},{"name":"Ecuador","two":"EC","country-code":"218"},{"name":"Egypt","two":"EG","country-code":"818"},{"name":"El Salvador","two":"SV","country-code":"222"},{"name":"Equatorial Guinea","two":"GQ","country-code":"226"},{"name":"Eritrea","two":"ER","country-code":"232"},{"name":"Estonia","two":"EE","country-code":"233"},{"name":"Eswatini","two":"SZ","country-code":"748"},{"name":"Ethiopia","two":"ET","country-code":"231"},{"name":"Falkland Islands (Malvinas)","two":"FK","country-code":"238"},{"name":"Faroe Islands","two":"FO","country-code":"234"},{"name":"Fiji","two":"FJ","country-code":"242"},{"name":"Finland","two":"FI","country-code":"246"},{"name":"France","two":"FR","country-code":"250"},{"name":"French Guiana","two":"GF","country-code":"254"},{"name":"French Polynesia","two":"PF","country-code":"258"},{"name":"French Southern Territories","two":"TF","country-code":"260"},{"name":"Gabon","two":"GA","country-code":"266"},{"name":"Gambia","two":"GM","country-code":"270"},{"name":"Georgia","two":"GE","country-code":"268"},{"name":"Germany","two":"DE","country-code":"276"},{"name":"Ghana","two":"GH","country-code":"288"},{"name":"Gibraltar","two":"GI","country-code":"292"},{"name":"Greece","two":"GR","country-code":"300"},{"name":"Greenland","two":"GL","country-code":"304"},{"name":"Grenada","two":"GD","country-code":"308"},{"name":"Guadeloupe","two":"GP","country-code":"312"},{"name":"Guam","two":"GU","country-code":"316"},{"name":"Guatemala","two":"GT","country-code":"320"},{"name":"Guernsey","two":"GG","country-code":"831"},{"name":"Guinea","two":"GN","country-code":"324"},{"name":"Guinea-Bissau","two":"GW","country-code":"624"},{"name":"Guyana","two":"GY","country-code":"328"},{"name":"Haiti","two":"HT","country-code":"332"},{"name":"Heard Island and McDonald Islands","two":"HM","country-code":"334"},{"name":"Holy See","two":"VA","country-code":"336"},{"name":"Honduras","two":"HN","country-code":"340"},{"name":"Hong Kong","two":"HK","country-code":"344"},{"name":"Hungary","two":"HU","country-code":"348"},{"name":"Iceland","two":"IS","country-code":"352"},{"name":"India","two":"IN","country-code":"356"},{"name":"Indonesia","two":"ID","country-code":"360"},{"name":"Iran (Islamic Republic of)","two":"IR","country-code":"364"},{"name":"Iraq","two":"IQ","country-code":"368"},{"name":"Ireland","two":"IE","country-code":"372"},{"name":"Isle of Man","two":"IM","country-code":"833"},{"name":"Israel","two":"IL","country-code":"376"},{"name":"Italy","two":"IT","country-code":"380"},{"name":"Jamaica","two":"JM","country-code":"388"},{"name":"Japan","two":"JP","country-code":"392"},{"name":"Jersey","two":"JE","country-code":"832"},{"name":"Jordan","two":"JO","country-code":"400"},{"name":"Kazakhstan","two":"KZ","country-code":"398"},{"name":"Kenya","two":"KE","country-code":"404"},{"name":"Kiribati","two":"KI","country-code":"296"},{"name":"Korea (Democratic People's Republic of)","two":"KP","country-code":"408"},{"name":"Korea, Republic of","two":"KR","country-code":"410"},{"name":"Kuwait","two":"KW","country-code":"414"},{"name":"Kyrgyzstan","two":"KG","country-code":"417"},{"name":"Lao People's Democratic Republic","two":"LA","country-code":"418"},{"name":"Latvia","two":"LV","country-code":"428"},{"name":"Lebanon","two":"LB","country-code":"422"},{"name":"Lesotho","two":"LS","country-code":"426"},{"name":"Liberia","two":"LR","country-code":"430"},{"name":"Libya","two":"LY","country-code":"434"},{"name":"Liechtenstein","two":"LI","country-code":"438"},{"name":"Lithuania","two":"LT","country-code":"440"},{"name":"Luxembourg","two":"LU","country-code":"442"},{"name":"Macao","two":"MO","country-code":"446"},{"name":"Madagascar","two":"MG","country-code":"450"},{"name":"Malawi","two":"MW","country-code":"454"},{"name":"Malaysia","two":"MY","country-code":"458"},{"name":"Maldives","two":"MV","country-code":"462"},{"name":"Mali","two":"ML","country-code":"466"},{"name":"Malta","two":"MT","country-code":"470"},{"name":"Marshall Islands","two":"MH","country-code":"584"},{"name":"Martinique","two":"MQ","country-code":"474"},{"name":"Mauritania","two":"MR","country-code":"478"},{"name":"Mauritius","two":"MU","country-code":"480"},{"name":"Mayotte","two":"YT","country-code":"175"},{"name":"Mexico","two":"MX","country-code":"484"},{"name":"Micronesia (Federated States of)","two":"FM","country-code":"583"},{"name":"Moldova, Republic of","two":"MD","country-code":"498"},{"name":"Monaco","two":"MC","country-code":"492"},{"name":"Mongolia","two":"MN","country-code":"496"},{"name":"Montenegro","two":"ME","country-code":"499"},{"name":"Montserrat","two":"MS","country-code":"500"},{"name":"Morocco","two":"MA","country-code":"504"},{"name":"Mozambique","two":"MZ","country-code":"508"},{"name":"Myanmar","two":"MM","country-code":"104"},{"name":"Namibia","two":"NA","country-code":"516"},{"name":"Nauru","two":"NR","country-code":"520"},{"name":"Nepal","two":"NP","country-code":"524"},{"name":"Netherlands","two":"NL","country-code":"528"},{"name":"New Caledonia","two":"NC","country-code":"540"},{"name":"New Zealand","two":"NZ","country-code":"554"},{"name":"Nicaragua","two":"NI","country-code":"558"},{"name":"Niger","two":"NE","country-code":"562"},{"name":"Nigeria","two":"NG","country-code":"566"},{"name":"Niue","two":"NU","country-code":"570"},{"name":"Norfolk Island","two":"NF","country-code":"574"},{"name":"North Macedonia","two":"MK","country-code":"807"},{"name":"Northern Mariana Islands","two":"MP","country-code":"580"},{"name":"Norway","two":"NO","country-code":"578"},{"name":"Oman","two":"OM","country-code":"512"},{"name":"Pakistan","two":"PK","country-code":"586"},{"name":"Palau","two":"PW","country-code":"585"},{"name":"Palestine, State of","two":"PS","country-code":"275"},{"name":"Panama","two":"PA","country-code":"591"},{"name":"Papua New Guinea","two":"PG","country-code":"598"},{"name":"Paraguay","two":"PY","country-code":"600"},{"name":"Peru","two":"PE","country-code":"604"},{"name":"Philippines","two":"PH","country-code":"608"},{"name":"Pitcairn","two":"PN","country-code":"612"},{"name":"Poland","two":"PL","country-code":"616"},{"name":"Portugal","two":"PT","country-code":"620"},{"name":"Puerto Rico","two":"PR","country-code":"630"},{"name":"Qatar","two":"QA","country-code":"634"},{"name":"Réunion","two":"RE","country-code":"638"},{"name":"Romania","two":"RO","country-code":"642"},{"name":"Russian Federation","two":"RU","country-code":"643"},{"name":"Rwanda","two":"RW","country-code":"646"},{"name":"Saint Barthélemy","two":"BL","country-code":"652"},{"name":"Saint Helena, Ascension and Tristan da Cunha","two":"SH","country-code":"654"},{"name":"Saint Kitts and Nevis","two":"KN","country-code":"659"},{"name":"Saint Lucia","two":"LC","country-code":"662"},{"name":"Saint Martin (French part)","two":"MF","country-code":"663"},{"name":"Saint Pierre and Miquelon","two":"PM","country-code":"666"},{"name":"Saint Vincent and the Grenadines","two":"VC","country-code":"670"},{"name":"Samoa","two":"WS","country-code":"882"},{"name":"San Marino","two":"SM","country-code":"674"},{"name":"Sao Tome and Principe","two":"ST","country-code":"678"},{"name":"Saudi Arabia","two":"SA","country-code":"682"},{"name":"Senegal","two":"SN","country-code":"686"},{"name":"Serbia","two":"RS","country-code":"688"},{"name":"Seychelles","two":"SC","country-code":"690"},{"name":"Sierra Leone","two":"SL","country-code":"694"},{"name":"Singapore","two":"SG","country-code":"702"},{"name":"Sint Maarten (Dutch part)","two":"SX","country-code":"534"},{"name":"Slovakia","two":"SK","country-code":"703"},{"name":"Slovenia","two":"SI","country-code":"705"},{"name":"Solomon Islands","two":"SB","country-code":"090"},{"name":"Somalia","two":"SO","country-code":"706"},{"name":"South Africa","two":"ZA","country-code":"710"},{"name":"South Georgia and the South Sandwich Islands","two":"GS","country-code":"239"},{"name":"South Sudan","two":"SS","country-code":"728"},{"name":"Spain","two":"ES","country-code":"724"},{"name":"Sri Lanka","two":"LK","country-code":"144"},{"name":"Sudan","two":"SD","country-code":"729"},{"name":"Suriname","two":"SR","country-code":"740"},{"name":"Svalbard and Jan Mayen","two":"SJ","country-code":"744"},{"name":"Sweden","two":"SE","country-code":"752"},{"name":"Switzerland","two":"CH","country-code":"756"},{"name":"Syrian Arab Republic","two":"SY","country-code":"760"},{"name":"Taiwan, Province of China","two":"TW","country-code":"158"},{"name":"Tajikistan","two":"TJ","country-code":"762"},{"name":"Tanzania, United Republic of","two":"TZ","country-code":"834"},{"name":"Thailand","two":"TH","country-code":"764"},{"name":"Timor-Leste","two":"TL","country-code":"626"},{"name":"Togo","two":"TG","country-code":"768"},{"name":"Tokelau","two":"TK","country-code":"772"},{"name":"Tonga","two":"TO","country-code":"776"},{"name":"Trinidad and Tobago","two":"TT","country-code":"780"},{"name":"Tunisia","two":"TN","country-code":"788"},{"name":"Turkey","two":"TR","country-code":"792"},{"name":"Turkmenistan","two":"TM","country-code":"795"},{"name":"Turks and Caicos Islands","two":"TC","country-code":"796"},{"name":"Tuvalu","two":"TV","country-code":"798"},{"name":"Uganda","two":"UG","country-code":"800"},{"name":"Ukraine","two":"UA","country-code":"804"},{"name":"United Arab Emirates","two":"AE","country-code":"784"},{"name":"United Kingdom of Great Britain and Northern Ireland","two":"GB","country-code":"826"},{"name":"United States of America","two":"US","country-code":"840"},{"name":"United States","two":"US","country-code":"840"},{"name":"United States Minor Outlying Islands","two":"UM","country-code":"581"},{"name":"Uruguay","two":"UY","country-code":"858"},{"name":"Uzbekistan","two":"UZ","country-code":"860"},{"name":"Vanuatu","two":"VU","country-code":"548"},{"name":"Venezuela (Bolivarian Republic of)","two":"VE","country-code":"862"},{"name":"Viet Nam","two":"VN","country-code":"704"},{"name":"Virgin Islands (British)","two":"VG","country-code":"092"},{"name":"Virgin Islands (U.S.)","two":"VI","country-code":"850"},{"name":"Wallis and Futuna","two":"WF","country-code":"876"},{"name":"Western Sahara","two":"EH","country-code":"732"},{"name":"Yemen","two":"YE","country-code":"887"},{"name":"Zambia","two":"ZM","country-code":"894"},{"name":"Zimbabwe","two":"ZW","country-code":"716"}]
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
    host:'70.39.249.13',
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
	//user: 'iocdevco_eric0',
	user: 'instit51_infusionsoft_post',
	//database: 'iocdevco_iocdev',
	database: 'instit51_iocdev',
	//password: 'brick8',
	password: 'm!.KQ[4EWP_B',
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
		let shortCountry = countries.find(function(currentValue) {
			return currentValue.name == postBody['field_member_address:country'];
		})
		console.log({shortCountry})
		//do country mapping the same way
		    dbConnection.query('INSERT into `field_data_field_member_address` (entity_type, bundle, deleted, entity_id, revision_id, language, delta, field_member_address_country, field_member_address_administrative_area, field_member_address_locality, field_member_address_postal_code, field_member_address_thoroughfare) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', ['user', 'user', 0, id,id,'und', 0, shortCountry.two, postBody['field_member_address:administrative_area'], postBody['field_member_address:locality'], postBody['field_member_address:postal_code'], postBody['field_member_address:thoroughfare'] ], function (err, insertRes2) {
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

function updateAddressInfo(postBody, uid) {
	var myPromise = new Promise(function(resolve, reject){	
		console.log({postBody})
		console.log(postBody['field_member_address:country'])
		let shortCountry = countries.find(function(currentValue) {
			return currentValue.name == postBody['field_member_address:country'];
		})
		// let shortState = states.find(function(currentValue) {
		// 	return currentValue.name == postBody['field_member_address:administrative_area'];
		// })
		console.log('short country: ',shortCountry)
		// console.log('short state: ', shortState)
		
		// dbConnection.query('UPDATE `field_data_field_member_address` SET `field_member_address_thoroughfare` = ?, `field_member_address_administrative_area` = ?, `field_member_address_country` = ?, `field_member_address_postal_code` = ?, `field_member_address_locality` = ? WHERE `entity_id` = ?;' , [postBody['field_member_address:thoroughfare'], postBody['field_member_address:administrative_area'], postBody['field_member_address:country'], postBody['field_member_address:postal_code'], postBody['field_member_address:locality'], uid], function(err, updateAddressResponse) {
			dbConnection.query('UPDATE `field_data_field_member_address` SET `field_member_address_thoroughfare` = ?, `field_member_address_postal_code` = ?, `field_member_address_locality` = ?, `field_member_address_country` = ?, `field_member_address_administrative_area` = ? WHERE `entity_id` = ?;' , [postBody['field_member_address:thoroughfare'], postBody['field_member_address:postal_code'], postBody['field_member_address:locality'], shortCountry.two, postBody['field_member_address:administrative_area'], uid], function(err, updateAddressResponse) {
			if (err) reject(err);
				console.log('updateAddressResponse', updateAddressResponse)

				dbConnection.query('UPDATE `field_revision_field_member_address` SET `field_member_address_thoroughfare` = ?, `field_member_address_postal_code` = ?, `field_member_address_locality` = ?, `field_member_address_country` = ?, `field_member_address_administrative_area` = ? WHERE `entity_id` = ?;' , [postBody['field_member_address:thoroughfare'], postBody['field_member_address:postal_code'], postBody['field_member_address:locality'], shortCountry.two, postBody['field_member_address:administrative_area'], uid], function(err, updateREVISIONresponse) {
					if (err) reject(err);
						console.log('updateAddressREVISIONResponse', updateREVISIONresponse)
						resolve(updateREVISIONresponse);
				 })
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
						resolve(updatelastNameRes);
				 })
		 })

	});
	return myPromise;
}


//update user
app.post('/update', (req, res) => {
	var postBody = req.body;
	console.log({postBody});
	
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
//renewal/lapsed
app.post('/autorenewals/:time', (req, res) => {
	console.log(req.body);
	const timeFrame = req.params.time;
	var newDate = new Date();
	console.log({timeFrame});

	// var month = newDate.getMonth();
	// var newMonth = month+2;
	
		
	var postBody = req.body;
	dbConnection.query('SELECT * FROM `users` WHERE mail = ?',[req.body.mail], function(err, result) {
		if (err) throw err
		console.log('users uid: ', result[0].uid);
		var entity = result[0].uid;
		var newDate = new Date(newEnd);
		
		console.log({newDate, isoRenewalDate});
		var isoRenewalDate;

		//yearly renewal
		if (timeFrame === 'year') {
			console.log(`get end date for entity: ${entity}`);
			dbConnection.query('SELECT `field_start_date_value2` FROM `field_data_field_start_date` where `entity_id` = ?',[ entity], function (err, currentEnd) {
				if (err) throw err;
				console.log({currentEnd: currentEnd[0].field_start_date_value2});
				var newDate = new Date(currentEnd[0].field_start_date_value2);

				var month = newDate.getMonth();
				var newMonth = month+1;

				var year = newDate.getFullYear()+1;

				var day = newDate.getDate();
				console.log({newMonth, day, year});
				var c = new Date(newMonth+'/'+day+'/'+year);
				var newEnd = c.toISOString().replace('T', ' ').replace('Z', '');
				console.log('zebra ', {newEnd});
				
				updateDate(newEnd, entity)
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
			  });
		} else {
				var newDate = new Date();
				console.log({newDate})
				var year = newDate.getFullYear();
				var month = newDate.getMonth();
				var newMonth = month+1;
				if (newMonth === 13) {
					var newYear = year+1;
					var newMonth = 12;
				} else {
					var newYear = year;
				}
		
				var day = newDate.getDate();
				var c = new Date(newMonth+'/'+day+'/'+newYear);
				var newEnd = c.toISOString()
				console.log({newEnd});
				
				isoRenewalDate = newEnd.toISOString().replace('T', ' ').replace('Z', '');
		
		updateDate(isoRenewalDate, entity)
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
				}
	})
	res.json({msg: "it works"});
	// 
});

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
		var values = [rand, postBody.mail, '$S$D26haBLqyyr4d5lvfmWMyjDH6Can/no3t1tsREuiHnXUzGbJdNnn', postBody.mail, 'filtered_html', Number((rightNow).toString().substring(0, 10)), 1, postBody.mail]
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
						var startDate = originalDate.toISOString().replace('T', ' ').replace('Z', '');
						var newEnd = c.toISOString().replace('T', ' ').replace('Z', '');
						console.log('new end', newEnd);
						console.log('new end without miliseconds', newEnd.split('.')[0])
						console.log('new end without miliseconds', startDate.split('.')[0])
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
						var newEnd = c.toISOString().replace('T', ' ').replace('Z', '');
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


