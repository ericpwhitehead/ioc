const express = require('express');
const app = express();
var mysql = require('mysql')
var bodyParser = require('body-parser')
var mysql = require('mysql2'),
    url = require('url'),
    SocksConnection = require('socksjs');



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
    database: 'iocdevco_iocliv',
    password: 'brick8',
    stream: sockConn
});


app.get('/', (req, res) => {
	res.send('App is up and running');
})

app.post('/test', (req, res) => {
	res.json({message: 'got it'})
})


// dbConnection.query('SELECT * FROM users;', function(err, rows, fields) {
// 	    if (err) throw err;

// 	    console.log('Result: ', rows);
// 	    sockConn.dispose();
// 	});

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/', (req, res) => {

	console.log('content type passed', req.headers['content-type']);
	console.log('post came in: ', req.body);

	var postBody = req.body;
	console.log('type', typeof postBody);
	var len = Object.keys(postBody).length;
	console.log(len)
	console.log('postBody', postBody)

	if(len > 4){
		console.log('this is a new member')
		rand = Math.floor(Math.random()*90000) + 10000;
		console.log('this random number', rand);
		console.log('name', postBody.name);
		console.log('email', postBody.mail);
		dbConnection.query('INSERT into "users" (uid, name, pass, mail) VALUES (?,?,?,?)',[rand, postBody.name, '$S$Dyqk85Tk9TLeJ3SHRJ.6UL7yujsihBBRlzqKE6y3mKrHUP6/YNrP', postBody.mail], function(err, result) {
			console.log('result', result);
			console.log('err', err)
      			if (err) throw err

			      result.forEach(function(row) {
			      	console.log('this row', row);
			      	sockConn.dispose();
			      	res.json({message: 'new user added'})
			      });

		//(5060, 'testuser.three_5060', '$S$Dyqk85Tk9TLeJ3SHRJ.6UL7yujsihBBRlzqKE6y3mKrHUP6/YNrP', 'testuser.three@instituteofcoaching.org', '', '', 'filtered_html', 1528218222, 1528985314, 1528985314, 1, 'America/New_York', '', 0, 'testuser.three@instituteofcoaching.org', 0x613a353a7b733a31363a22636b656469746f725f64656661756c74223b733a313a2274223b733a32303a22636b656469746f725f73686f775f746f67676c65223b733a313a2274223b733a31343a22636b656469746f725f7769647468223b733a343a2231303025223b733a31333a22636b656469746f725f6c616e67223b733a323a22656e223b733a31383a22636b656469746f725f6175746f5f6c616e67223b733a313a2274223b7d);
	});
	}

	

	if (len <= 5) {
		var field_infusionsoft_id_value = postBody.field_infusionsoft_id;
		console.log('id', field_infusionsoft_id_value);
		console.log('type', typeof field_infusionsoft_id_value);
		console.log('it is a renewal or lapsed')
		
		dbConnection.query('SELECT * FROM `field_data_field_infusionsoft_id` WHERE field_infusionsoft_id_value = ?',[field_infusionsoft_id_value], function(err, result) {
      			if (err) throw err
      				console.log('result', result)
			      result.forEach(function(row) {
			      	console.log('this row ', row.entity_id);
			      	const userId = row.entity_id;
				    var dateString = postBody['field_start_date:end'];
					var newDate = new Date(dateString);
					var year = newDate.getFullYear();
					var month = newDate.getMonth()+1;
					var day = newDate.getDate();
					var newYear = year+1
					var c = new Date(month+'/'+day+'/'+newYear);
					var newEnd = c.toISOString();
					console.log(newEnd);
					var label = postBody['field_member_type:label'];


					// update member type if it is passed
					// if (label) {
					// 	dbConnection.query('UPDATE `field_revision_field_member_type` SET `field_member_type_target_id` = ? WHERE `entity_id` = ?', [label, userId], function (err, result) {
					//     if (err) throw err;
					//     console.log(result.affectedRows + " record(s) updated in field_data_field_start_date");
					//   };
					// 	dbConnection.query('UPDATE `field_data_field_member_type` SET `field_member_type_target_id` = ? WHERE `entity_id` = ?',[ labels, userId], function (err, result) {
					//     if (err) throw err;
					//     console.log(result)
					//     console.log(result.affectedRows + " record(s) updated in field_data_field_start_date");
					//   });
					// }

					// Update status
					if (postBody.status) {
						console.log('we got status: ', postBody.status)
						// if (postBody.status === 'Active') {

						// }
						dbConnection.query('UPDATE `users` SET `status` = ? WHERE `uid` = ?',[
						1, userId], function (err, result) {
					    if (err) throw err;
					    console.log(result)
					    console.log(result.affectedRows + " record(s) updated in users");
					  });
					}

					// Update date
					dbConnection.query('UPDATE `field_data_field_start_date` SET `field_start_date_value2` = ? WHERE `entity_id` = ?',[
						newEnd, userId], function (err, result) {
					    if (err) throw err;
					    console.log(result)
					    console.log(result.affectedRows + " record(s) updated in field_data_field_start_date");
					  });
					dbConnection.query('UPDATE `field_revision_field_start_date` SET `field_start_date_value2` = ? WHERE `entity_id` = ?',[
						newEnd, userId], function (err, result) {
					    if (err) throw err;
					    console.log(result)
					    console.log(result.affectedRows + " record(s) updated in field_revision_field_start_date");
					  });


				  // clear cache
				  dbConnection.query('SELECT * FROM `users` WHERE uid = ?',[userId], function(err, result2) {
  					if (err) throw err
				      result2.forEach(function(row) {
				      	console.log(row.name);
				      	dbConnection.query('DELETE FROM `cache_entity_user` WHERE data LIKE ?',['%'+row.name+'%'], function(err, result3) {
				      			console.log('cache cleared', result3)
								if (err) throw err
								console.log(result3);
			      			})
					  })
	 			  })
					sockConn.dispose();
				  	res.json({message: 'received'})
				})

		});
	} else {
		sockConn.dispose();
		res.json({message: 'got the post but did not update the database'})
	}
});



app.listen(process.env.PORT || 3001, () => console.log('listening on '+ process.env.PORT))


