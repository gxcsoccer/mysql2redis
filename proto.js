var mysql = require("mysql"),
	fs = require("fs"),
	path = require("path"),
	connection = mysql.createConnection({
		host: 'hg.wozlla.com',
		user: 'seaking',
		password: 'seaking_server',
		database: "seaking"
	}),
	sql = fs.readFileSync("sql/TASK.sql", {
		encoding: "utf-8"
	}),
	output = "",
	hasOwnProperty = Object.prototype.hasOwnProperty;

connection.query(sql, function(err, rows) {
	// TODO: be able to customize
	rows.forEach(function(row) {
		var redis_key = "TASK_" + row["taskId"],
			tpl = "*4\r\f$4\r\fHSET\r\f$" + redis_key.length + "\r\f" + redis_key + "\r\f",
			hvalue;

		for (var hkey in row) {
			if (!hasOwnProperty.call(row, hkey)) continue;
			hvalue = row[hkey] + "";
			output += tpl + "$" + hkey.length + "\r\f" + hkey + "\r\f" + "$" + hvalue.length + "\r\f" + hvalue + "\r\f";
		}
	});

	process.stdout.write(output);

	connection.end(function(err) {
		process.exit();
	});
});