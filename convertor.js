var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * 将数组转化为redis lists
 */
exports.toList = function(key, rows, valueGenerator) {
	var cmd = "",
		keyLen = Buffer.byteLength(key);

	valueGenerator = valueGenerator || function(row) {
		return row.toString();
	};

	// RPUSH key row
	(rows || []).forEach(function(row) {
		var value = valueGenerator(row);
		cmd += "*3\r\f$5\r\fRPUSH\r\f$" + keyLen + "\r\f" + key + "\r\f$" + Buffer.byteLength(value) + "\r\f" + value + "\r\f";
	});

	return cmd;
};

/**
 * 将对象转换为redis hash
 */
exports.toHash = function(row, keyGenerator) {
	keyGenerator = keyGenerator || function(row) {
		return row.toString();
	};

	var key = keyGenerator(row),
		cmd = "",
		hkey, hvalue;

	// HSET key hkey hvalue
	for(hkey in row) {
		if(hasOwnProperty.call(row, hkey)) {
			hvalue = row[hkey].toString();
			cmd += "*4\r\f$4HSET\r\f$" + Buffer.byteLength(key) + "\r\f" + key + "\r\f$" + Buffer.byteLength(hkey) + "\r\f" + hkey + "\r\f$" + Buffer.byteLength(hvalue) + "\r\f" + hvalue + "\r\f";
		}
	}

	return cmd;
};