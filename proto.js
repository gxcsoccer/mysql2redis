var mysql = require("mysql"),
	fs = require("fs"),
	path = require("path"),
	convertor = require("./convertor"),
	connection = mysql.createConnection({
		host: 'xxxx',
		user: 'xxxx',
		password: 'xxxx',
		database: "xxxx"
	}),
	sql = fs.readFileSync("sql/TASK.sql", {
		encoding: "utf-8"
	}),
	output = "",
	hasOwnProperty = Object.prototype.hasOwnProperty;

connection.query(sql, function(err, rows) {
	rows.forEach(function(row) {
		convertor.toHash(row, function(row) {
			return "TASK_" + row["taskId"];
		});
	});

	process.stdout.write(output);

	connection.end(function(err) {
		process.exit();
	});
});
