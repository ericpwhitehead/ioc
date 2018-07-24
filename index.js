const express = require('express');
const app = express();
var mysql = require('mysql')
var bodyParser = require('body-parser')

app.use(bodyParser.json());

var connection = mysql.createConnection({
  host: '50.87.137.25',
  user: 'iocdevco_eric0',
  password: 'brick8',
  //database: 'iocdevco_iocdev'
  database: 'iocdevco_iocliv'
})

console.log(process.env.FIXIE_URL);


	connection.connect(function(err) {
	  if (err) throw err
	  console.log('You are now connected...')
	})

app.get('/', (req, res) => {
	res.send('App is up and running');
})

app.post('/test', (req, res) => {
	res.json({message: 'got it'})
})

app.post('/', (req, res) => {
	console.log('post came in: ', req.body);


	const postBody = req.body
	var len = Object.keys(postBody).length;
	console.log(len)

	if(postBody.hasOwnProperty('field_sex') && len > 4){
		console.log('this is a new member')
		rand = Math.floor(Math.random()*90000) + 10000;
		console.log(rand)
		connection.query('INSERT into `users` (uid, name, pass, mail) VALUES (?,?,?,?)',[rand, postBody.name, '$S$Dyqk85Tk9TLeJ3SHRJ.6UL7yujsihBBRlzqKE6y3mKrHUP6/YNrP', postBody.mail], function(err, result) {
      			if (err) throw err
			      result.forEach(function(row) {
			      	console.log(row);
			      });

		//(5060, 'testuser.three_5060', '$S$Dyqk85Tk9TLeJ3SHRJ.6UL7yujsihBBRlzqKE6y3mKrHUP6/YNrP', 'testuser.three@instituteofcoaching.org', '', '', 'filtered_html', 1528218222, 1528985314, 1528985314, 1, 'America/New_York', '', 0, 'testuser.three@instituteofcoaching.org', 0x613a353a7b733a31363a22636b656469746f725f64656661756c74223b733a313a2274223b733a32303a22636b656469746f725f73686f775f746f67676c65223b733a313a2274223b733a31343a22636b656469746f725f7769647468223b733a343a2231303025223b733a31333a22636b656469746f725f6c616e67223b733a323a22656e223b733a31383a22636b656469746f725f6175746f5f6c616e67223b733a313a2274223b7d);
	});
	}

	

	if (len <= 5 && postBody.hasOwnProperty('status')) {
		var field_infusionsoft_id_value = postBody.field_infusionsoft_id;
		console.log(field_infusionsoft_id_value)
		console.log('it is a renewal or lapsed')
		
		connection.query('SELECT * FROM `field_data_field_infusionsoft_id` WHERE field_infusionsoft_id_value = ?',[field_infusionsoft_id_value], function(err, result) {
      			if (err) throw err
			      result.forEach(function(row) {
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


					// update member type if it is passed
					if (postBody['field_member_type:label']) {
						connection.query('UPDATE `field_revision_field_member_type` SET `field_member_type_target_id` = ? WHERE `entity_id` = ?',[
						postBody['field_member_type:label'], userId], function (err, result) {
					    if (err) throw err;
					    console.log(result)
					    console.log(result.affectedRows + " record(s) updated in field_data_field_start_date");
					  });
						connection.query('UPDATE `field_data_field_member_type` SET `field_member_type_target_id` = ? WHERE `entity_id` = ?',[
						postBody['field_member_type:label'], userId], function (err, result) {
					    if (err) throw err;
					    console.log(result)
					    console.log(result.affectedRows + " record(s) updated in field_data_field_start_date");
					  });
					}

					// Update status
					if (postBody.status) {
						connection.query('UPDATE `users` SET `status` = ? WHERE `entity_id` = ?',[
						postBody.status, userId], function (err, result) {
					    if (err) throw err;
					    console.log(result)
					    console.log(result.affectedRows + " record(s) updated in field_data_field_start_date");
					  });
					}

					// Update date
					connection.query('UPDATE `field_data_field_start_date` SET `field_start_date_value2` = ? WHERE `entity_id` = ?',[
						newEnd, userId], function (err, result) {
					    if (err) throw err;
					    console.log(result)
					    console.log(result.affectedRows + " record(s) updated in field_data_field_start_date");
					  });
					connection.query('UPDATE `field_revision_field_start_date` SET `field_start_date_value2` = ? WHERE `entity_id` = ?',[
						newEnd, userId], function (err, result) {
					    if (err) throw err;
					    console.log(result)
					    console.log(result.affectedRows + " record(s) updated in field_revision_field_start_date");
					  });


				  // clear cache
				  connection.query('SELECT * FROM `users` WHERE uid = ?',[userId], function(err, result2) {
  					if (err) throw err
				      result2.forEach(function(row) {
				      	console.log(row.name);
				      	connection.query('DELETE FROM `cache_entity_user` WHERE data LIKE ?',['%'+row.name+'%'], function(err, result3) {
								if (err) throw err
								console.log(result3);
			      			})
					  })
	 			  })

				  res.json({message: 'received'})
				})

		});
	}
});

app.listen(process.env.PORT || 3001, () => console.log('listening on 3001'))