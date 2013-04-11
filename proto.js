var mysql = require("mysql"),
	fs = require("fs"),
	path = require("path"),
	convertor = require("./convertor"),
	connection = mysql.createConnection(require("./config.json")),
	sql = fs.readFileSync("sql/TASK.sql", {
		encoding: "utf-8"
	}),
	output = "",
	hasOwnProperty = Object.prototype.hasOwnProperty;

connection.query(sql, function(err, rows) {
	rows.forEach(function(row) {
		output += convertor.toHash(row, function(row) {
			return "TASK_" + row["taskId"];
		});
	});

	process.stdout.write(output);

	connection.end(function(err) {
		process.exit();
	});
});