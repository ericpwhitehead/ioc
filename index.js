const express = require('express');
const app = express();
var mysql = require('mysql')
var bodyParser = require('body-parser')
var mysql = require('mysql2'),
    url = require('url'),
    SocksConnection = require('socksjs');


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

//update user
app.post('/update', (req, res) => {
	var postBody = req.body;
	console.log({postBody});
	var sample = {
		 field_name_last: 'Chabot',
		 'field_member_address:thoroughfare': '310 Main Ave',
		 field_infusionsoft_id: '97213',
		 mail: 'chabotweb@gmail.co',
		 field_name_first: 'Missy',
		 'field_member_address:locality': 'South Hampton',
		 'field_member_address:administrative_area': 'New Hampshire',
		 'field_member_address:country': 'United States',
		 'field_member_address:postal_code': '03827' }
		 dbConnection.query('SELECT * FROM `users` WHERE field_infusionsoft_id_value = ?',[postBody.field_infusionsoft_id], function(err, selectUserResult) {
			if (err) {
						console.log('error', err)
					}
					console.log({selectUserResult})
		 })
	// dbConnection.query('UPDATE `users` SET `status` = ? WHERE `uid` = ?',[status, id], function (err, statusUpdate) {
	// 	if (err) {
	// 		console.log('error', err)
	// 		reject(err);
	// 	}
	// 	console.log(statusUpdate)
	// 	console.log(statusUpdate.affectedRows + " record(s) updated in users");
	// });
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


